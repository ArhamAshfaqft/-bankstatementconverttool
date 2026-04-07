import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCTION-GRADE BANK STATEMENT PDF PARSER — Maximum Accuracy Edition
// ═══════════════════════════════════════════════════════════════════════════════
//
// Pipeline:
//   1. Extract all text items with X/Y/page/fontSize metadata
//   2. Deduplicate per-page repeating headers & footers
//   3. Detect column boundaries via X-coordinate histogram
//   4. Assemble rows using dynamic font-size-aware Y-tolerance
//   5. Identify transaction header row
//   6. Filter noise rows (massive pattern library)
//   7. Extract transactions with date-boundary detection
//   8. Merge multi-line descriptions & wrapped amounts
//   9. Strip empty ghost columns
//  10. Auto-generate headers if not detected
//  11. Optional balance cross-validation
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Utility: File / Buffer → Uint8Array ────────────────────────────────────
export async function fileToTypedArray(file) {
  // Already a typed array (from Electron/Node buffer)
  if (file instanceof Uint8Array) return file;
  if (file instanceof ArrayBuffer) return new Uint8Array(file);
  // Node Buffer (Electron IPC transfers these)
  if (file && file.buffer && file.byteLength !== undefined && !(file instanceof Blob)) {
    return new Uint8Array(file.buffer, file.byteOffset, file.byteLength);
  }
  // Standard browser File/Blob
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(new Uint8Array(reader.result));
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATE DETECTION — Comprehensive International Support
// ═══════════════════════════════════════════════════════════════════════════════
const DATE_PATTERNS = [
  // MM/DD/YYYY or MM-DD-YYYY (US standard)
  /^(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])[\/\-](\d{4}|\d{2})$/,
  // DD/MM/YYYY or DD-MM-YYYY (European)
  /^(0?[1-9]|[12]\d|3[01])[\/\-](0?[1-9]|1[0-2])[\/\-](\d{4}|\d{2})$/,
  // YYYY-MM-DD or YYYY/MM/DD (ISO / Japanese / Korean)
  /^\d{4}[\/\-](0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])$/,
  // DD.MM.YYYY (European dot-separated — Germany, Switzerland, etc.)
  /^(0?[1-9]|[12]\d|3[01])\.(0?[1-9]|1[0-2])\.(\d{4}|\d{2})$/,
  // Month DD, YYYY (e.g., "Jan 15, 2024" or "January 15, 2024")
  /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s*\d{2,4}$/i,
  // DD Month YYYY (e.g., "15 Jan 2024" or "15 January 2024")
  /^\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{2,4}$/i,
  // DD-Mon-YY or DD-Mon-YYYY (UK style: "15-Mar-26")
  /^\d{1,2}[\-](Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\-]\d{2,4}$/i,
  // Mon DD (Amex-style without year: "Mar 15" or "Mar 03")
  /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2}$/i,
  // MM/DD without year (Chase, BofA short format)
  /^(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])$/,
];

function isDate(text) {
  if (!text || text.length < 3 || text.length > 30) return false;
  const trimmed = text.trim();
  return DATE_PATTERNS.some(p => p.test(trimmed));
}

// ═══════════════════════════════════════════════════════════════════════════════
// AMOUNT DETECTION — International Currency Support
// ═══════════════════════════════════════════════════════════════════════════════
const CURRENCY_SYMBOLS = /^[\$€£¥₹₱₩₫₴₽R]?\s*/;
const CURRENCY_SUFFIXES = /\s*(EUR|GBP|USD|CAD|AUD|CHF|JPY|INR|BRL|ZAR|SEK|NOK|DKK|NZD|SGD|HKD|MXN|CR|DR)\.?$/i;

function isAmount(text) {
  if (!text) return false;
  let cleaned = text.trim();
  if (cleaned.length === 0 || cleaned.length > 25) return false;

  // Strip currency symbols (prefix & suffix)
  // Handle -$ and +$ combined prefixes first
  cleaned = cleaned
    .replace(/^[-+]?\s*[\$€£¥₹₱₩₫₴₽R]\s*/, (match) => match.startsWith('-') ? '-' : '')
    .replace(CURRENCY_SUFFIXES, '')
    .trim();
  
  // Handle negative indicators
  cleaned = cleaned.replace(/^-\s*/, '-');       // "- 100" → "-100"
  cleaned = cleaned.replace(/^\+\s*/, '');        // "+ 100" → "100"
  
  // Handle accounting notation: (1,234.56) → -1234.56
  if (/^\(.+\)$/.test(cleaned)) {
    cleaned = '-' + cleaned.replace(/[()]/g, '');
  }

  // Strip thousands separators
  // US/UK format: 1,234.56 or 1,234
  if (/^-?\d{1,3}(,\d{3})*(\.\d{1,2})?$/.test(cleaned)) return true;
  // European format: 1.234,56 or 1.234
  if (/^-?\d{1,3}(\.\d{3})*(,\d{1,2})?$/.test(cleaned)) return true;
  // Plain number: 1234.56 or 1234
  if (/^-?\d+\.?\d{0,2}$/.test(cleaned) && cleaned.length > 0) return true;

  return false;
}

function parseAmount(text) {
  if (!text) return null;
  
  // 1. Pre-clean: strip all currency symbols and identifiers everywhere
  let cleaned = text.trim()
    .replace(/[\$€£¥₹₱₩₫₴₽R]/g, '')
    .replace(CURRENCY_SUFFIXES, '')
    .trim();
  
  // 2. Handle accounting negative notation: (1,234.56) -> -1,234.56
  if (/^\(.+\)$/.test(cleaned)) {
    cleaned = '-' + cleaned.replace(/[()]/g, '');
  }

  // 3. Normalize signs (handle cases like " - 100" or "+ 100")
  cleaned = cleaned.replace(/^[\s\+]+/, ''); // Remove leading plus/space
  if (cleaned.startsWith('-')) {
    cleaned = '-' + cleaned.substring(1).replace(/[-\s\+]+/g, '');
  }

  // 4. Detect format: US/UK (1,234.56) vs European (1.234,56)
  // If there's a comma AND a dot, and the comma comes first, it's US
  // If there's a dot AND a comma, and the dot comes first, it's European
  const firstComma = cleaned.indexOf(',');
  const lastComma = cleaned.lastIndexOf(',');
  const firstDot = cleaned.indexOf('.');
  const lastDot = cleaned.lastIndexOf('.');

  if (firstComma !== -1 && firstDot !== -1) {
    if (firstComma < firstDot) {
      // US Format: 1,234.56 -> strip commas
      cleaned = cleaned.replace(/,/g, '');
    } else {
      // European Format: 1.234,56 -> strip dots, swap comma to dot
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    }
  } else if (firstComma !== -1 && firstDot === -1) {
    // Only commas: could be 1,234 (US) or 1234,56 (Euro)
    // If comma is 3 digits from end, it's likely European decimal
    if (cleaned.length - firstComma <= 3) {
      cleaned = cleaned.replace(',', '.');
    } else {
      cleaned = cleaned.replace(/,/g, '');
    }
  } else if (firstDot !== -1) {
    // Only dots: could be 1.234 (Euro thousands) or 1234.56 (US decimal)
    // If multiple dots, or one dot that isn't a decimal... 
    const dotCount = (cleaned.match(/\./g) || []).length;
    if (dotCount > 1) {
      cleaned = cleaned.replace(/\./g, '');
    }
    // Single dot at end is decimal, else could be thousands. Let standard parse try.
  }

  // 5. CR/DR suffix (credit/debit indicators)
  if (/CR$/i.test(text.trim())) cleaned = cleaned.replace(/CR$/i, '').trim();
  if (/DR$/i.test(text.trim())) cleaned = '-' + cleaned.replace(/DR$/i, '').replace(/^-/, '').trim();

  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

// ═══════════════════════════════════════════════════════════════════════════════
// NOISE / JUNK ROW DETECTION — Comprehensive Pattern Library
// ═══════════════════════════════════════════════════════════════════════════════
const NOISE_PATTERNS = [
  // ── Page & Navigation ──
  /^page\s+\d+/i,
  /^continued\s+(on|from)/i,
  /^\d+\s+of\s+\d+/i,                            // "1 of 5", "Page 1 of 5"
  /^\(continued\)/i,

  // ── Account & Statement Info ──
  /^(statement|account)\s+(summary|period|number|ending|type|overview)/i,
  /^(opening|closing|beginning|ending|previous|new|available|current|ledger)\s+balance/i,
  /^(your\s+)?(account|statement)\s+(number|#|no)/i,
  /^(primary|joint)\s+account\s+holder/i,
  /^routing\s+(number|transit|no)/i,
  /^(swift|iban|bic|sort)\s*(code|number|no)?/i,
  /^\*{3,}\d+/,                                  // Masked card/account: ****1234

  // ── Summary & Totals ──
  /^(total|subtotal|summary|period|account|activity)\s*(deposits?|withdrawals?|debits?|credits?|checks?|additions?|subtractions?|other|fees?|charges?|payments?|purchases?|interest)?/i,
  /^(deposits?|additions?|withdrawals?|subtractions?|other\s+debits?|checks?\s*(paid|written)?|electronic\s+withdrawals?|fees?\s*(charged)?|service\s+charges?|interest\s+(paid|earned|charged))\s*/i,
  /^(daily|average)\s+(balance|ledger)/i,
  /^(minimum|maximum)\s+balance/i,
  /^(annual\s+percentage|apy|apr)\s*(yield|rate)?/i,
  /^interest\s+(earned|paid|charged|rate|this\s+period)/i,
  /^(overdraft|nsf)\s+(fee|protection|limit)/i,
  /^number\s+of\s+(days|items|deposits?|withdrawals?|debits?|credits?)/i,

  // ── Column Headers (catch repeating headers on multi-page) ──
  /^(description|reference|check|memo|details|particulars|narration)\s*$/i,
  /^(balance|amount|debit|credit|withdrawal|deposit|charges?)\s*$/i,

  // ── Footer & Legal ──
  /^member\s+fdic/i,
  /^equal\s+housing/i,
  /©/,                                           // Copyright lines
  /customer\s*service/i,
  /www\./i,
  /https?:\/\//i,
  /call\s+us\s+at/i,
  /^(dear|to)\s+(valued\s+)?customer/i,
  /^(this\s+)?(statement|page)\s+(is|was|has\s+been)/i,
  /^(please|for)\s+(review|contact|call|visit|refer)/i,
  /^(important|notice|attention|reminder|note)\s*:/i,
  /regulatory|compliance|disclosure/i,
  /terms\s+and\s+conditions/i,
  /privacy\s+(policy|notice)/i,
  /^(tax\s+id|tin|ein)\s*/i,

  // ── Decorative ──
  /^\*{2,}$/,                                    // Decorative asterisks
  /^-{2,}$/,                                     // Decorative dashes
  /^={2,}$/,                                     // Decorative equals
  /^_{2,}$/,                                     // Decorative underscores
  /^\.{2,}$/,                                    // Decorative dots

  // ── Bank-Specific Common Lines ──
  /^(chase|wells\s*fargo|bank\s+of\s+america|citibank|capital\s+one|td\s+bank|us\s+bank|pnc|suntrust|truist|regions|fifth\s+third|huntington|citizens|m&t|key\s*bank|ally|discover|synchrony|usaa|navy\s+federal|charles\s+schwab)\s*/i,
  /^(checking|savings|money\s+market|certificate|cd)\s+(account|statement|summary)/i,
  /^(visa|mastercard|american\s+express|amex)\s*/i,
];

function isNoiseRow(rowTexts) {
  if (!rowTexts || rowTexts.length === 0) return true;
  const joined = rowTexts.join(' ').trim();
  if (joined.length < 2) return true;
  // Only punctuation/symbols
  if (/^[\s\-=_.*#@!]+$/.test(joined)) return true;
  if (NOISE_PATTERNS.some(p => p.test(joined))) return true;
  return false;
}

function isLikelyHeader(rowTexts) {
  const joined = rowTexts.join(' ').toLowerCase();
  
  // A transaction table header MUST mention 'date' or a synonym
  if (!joined.includes('date') && !joined.includes('post') && !joined.includes('trans')) {
    return false;
  }
  
  const headerTerms = ['description', 'amount', 'balance', 'debit', 'credit', 'withdrawal', 'deposit', 'reference', 'check no', 'check number', 'particulars', 'narration', 'details'];
  const matchCount = headerTerms.filter(t => joined.includes(t)).length;
  if (matchCount < 1) return false;
  
  // Extra guard: actual header cells are short labels, not sentences
  const nonEmptyCells = rowTexts.filter(c => c.trim());
  if (nonEmptyCells.length === 0) return false;
  const avgCellLength = nonEmptyCells.reduce((sum, c) => sum + c.trim().length, 0) / nonEmptyCells.length;
  return avgCellLength <= 20;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PER-PAGE HEADER/FOOTER DEDUPLICATION
// ═══════════════════════════════════════════════════════════════════════════════
function deduplicatePerPageRepeats(allItems, numPages) {
  if (numPages < 2) return allItems;

  // Build a fingerprint for each Y-position + text combo per page
  const fingerprints = new Map(); // "y|text" → Set of page numbers

  allItems.forEach(item => {
    // Round Y to nearest integer for comparison across pages
    const key = `${Math.round(item.y)}|${item.text}`;
    if (!fingerprints.has(key)) fingerprints.set(key, new Set());
    fingerprints.get(key).add(item.page);
  });

  // Items appearing on 60%+ of pages at the same Y position = repeating header/footer
  const threshold = Math.max(2, Math.ceil(numPages * 0.6));
  const repeatingKeys = new Set();
  fingerprints.forEach((pages, key) => {
    if (pages.size >= threshold) repeatingKeys.add(key);
  });

  if (repeatingKeys.size === 0) return allItems;

  // Keep only the first occurrence of repeating items
  const seen = new Set();
  return allItems.filter(item => {
    const key = `${Math.round(item.y)}|${item.text}`;
    if (repeatingKeys.has(key)) {
      if (seen.has(key)) return false; // duplicate — remove
      seen.add(key);
    }
    return true;
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// DYNAMIC Y-TOLERANCE (Font-Size Aware)
// ═══════════════════════════════════════════════════════════════════════════════
function calculateYTolerance(allItems) {
  // Collect all font heights
  const heights = allItems
    .map(item => item.fontSize)
    .filter(h => h > 0)
    .sort((a, b) => a - b);

  if (heights.length === 0) return 3; // fallback

  // Use median font height
  const median = heights[Math.floor(heights.length / 2)];
  // Y-tolerance = ~60% of median font height (items on same baseline)
  return Math.max(2, Math.min(median * 0.6, 8));
}

// ═══════════════════════════════════════════════════════════════════════════════
// COLUMN BOUNDARY DETECTION
// ═══════════════════════════════════════════════════════════════════════════════
function detectColumnBoundaries(allItems, pageWidth) {
  const BUCKET_SIZE = 5;
  const histogram = {};

  allItems.forEach(item => {
    const bucket = Math.round(item.x / BUCKET_SIZE) * BUCKET_SIZE;
    histogram[bucket] = (histogram[bucket] || 0) + 1;
  });

  // Adaptive threshold: use higher threshold for PDFs with many items
  const threshold = Math.max(3, allItems.length * 0.03);
  const peaks = Object.entries(histogram)
    .filter(([, count]) => count >= threshold)
    .map(([x]) => parseFloat(x))
    .sort((a, b) => a - b);

  // Merge peaks that are very close together (within 15pt)
  const mergedPeaks = [];
  peaks.forEach(p => {
    if (mergedPeaks.length === 0 || p - mergedPeaks[mergedPeaks.length - 1] > 15) {
      mergedPeaks.push(p);
    }
  });

  return mergedPeaks;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SMART ROW ASSEMBLY (with dynamic Y-tolerance)
// ═══════════════════════════════════════════════════════════════════════════════
function assembleRowsFromItems(items, columnBoundaries, yTolerance) {
  const yBuckets = {};

  items.forEach(item => {
    const text = item.text;
    if (!text) return;
    const y = item.y;

    let foundBucket = null;
    for (const key in yBuckets) {
      if (Math.abs(parseFloat(key) - y) <= yTolerance) {
        foundBucket = key;
        break;
      }
    }

    if (foundBucket) {
      yBuckets[foundBucket].push(item);
    } else {
      yBuckets[y] = [item];
    }
  });

  // Sort rows top-to-bottom
  const sortedY = Object.keys(yBuckets).map(Number).sort((a, b) => b - a);

  return sortedY.map(y => {
    const rowItems = yBuckets[y].sort((a, b) => a.x - b.x);

    // Assign each item to the nearest column boundary
    if (columnBoundaries.length > 0) {
      const cells = new Array(columnBoundaries.length).fill('');
      rowItems.forEach(item => {
        let bestCol = 0;
        let bestDist = Infinity;
        columnBoundaries.forEach((cx, ci) => {
          const dist = Math.abs(item.x - cx);
          if (dist < bestDist) {
            bestDist = dist;
            bestCol = ci;
          }
        });
        cells[bestCol] = cells[bestCol]
          ? cells[bestCol] + ' ' + item.text
          : item.text;
      });
      return cells;
    }

    return rowItems.map(i => i.text);
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSACTION IDENTIFICATION & MULTI-LINE MERGING
// ═══════════════════════════════════════════════════════════════════════════════
function extractTransactions(rows) {
  const transactions = [];
  let currentTxn = null;
  let headerRow = null;
  let headersSeen = 0; // Track duplicate headers on multi-page

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    // Detect and capture header row BEFORE noise filtering
    if (isLikelyHeader(row)) {
      headersSeen++;
      if (headersSeen === 1) {
        headerRow = row; // Keep only the first header
      }
      continue; // Always skip header rows (including duplicates on subsequent pages)
    }

    // Skip empty / noise rows
    if (isNoiseRow(row)) continue;

    // Check if first cell starts with a date (= new transaction)
    const firstCell = (row[0] || '').trim();
    const startsWithDate = isDate(firstCell);

    // Also check second cell for date (some banks: Post Date | Trans Date)
    const secondCell = row.length > 1 ? (row[1] || '').trim() : '';
    const secondIsDate = isDate(secondCell);

    // Does this row have at least one amount?
    const hasAmount = row.some(cell => isAmount(cell));

    if (startsWithDate || (secondIsDate && firstCell.length === 0)) {
      // This is a new transaction row
      if (currentTxn) {
        transactions.push(currentTxn);
      }
      currentTxn = [...row];
    } else if (!currentTxn && !startsWithDate) {
      // No transaction started yet — it's a pre-transaction summary row. Skip.
      continue;
    } else if (currentTxn && !startsWithDate && !hasAmount) {
      // Continuation/description line — merge into description column
      const descCol = findDescriptionColumn(currentTxn);
      if (descCol >= 0) {
        const continuation = row.filter(c => c.trim()).join(' ').trim();
        if (continuation) {
          currentTxn[descCol] = (currentTxn[descCol] + ' ' + continuation).trim();
        }
      }
    } else if (currentTxn && hasAmount && !startsWithDate) {
      // Row has amounts but no date — could be amount that wrapped to next line
      // Merge amounts into current transaction
      row.forEach((cell, ci) => {
        if (isAmount(cell) && ci < currentTxn.length) {
          if (!currentTxn[ci] || !isAmount(currentTxn[ci])) {
            currentTxn[ci] = cell;
          }
        }
      });
    }
  }

  // Push the last transaction
  if (currentTxn) {
    transactions.push(currentTxn);
  }

  return { headerRow, transactions };
}

function findDescriptionColumn(row) {
  // Description is typically the longest non-date, non-amount cell
  let bestCol = -1;
  let bestLen = 0;
  row.forEach((cell, i) => {
    const trimmed = (cell || '').trim();
    if (trimmed.length > bestLen && !isDate(trimmed) && !isAmount(trimmed)) {
      bestLen = trimmed.length;
      bestCol = i;
    }
  });
  // Fallback to column 1 if nothing found
  return bestCol >= 0 ? bestCol : Math.min(1, row.length - 1);
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHECK NUMBER DETECTION
// ═══════════════════════════════════════════════════════════════════════════════
function isCheckNumber(text) {
  if (!text) return false;
  const t = text.trim();
  // Check numbers are typically 3-6 digit numbers, optionally prefixed with # or "CHK"
  return /^(#|CHK\s*|CHECK\s*)?(\d{3,6})$/i.test(t);
}

// ═══════════════════════════════════════════════════════════════════════════════
// OUTPUT FORMATTING — With Ghost Column Removal
// ═══════════════════════════════════════════════════════════════════════════════
function formatOutput(headerRow, transactions) {
  if (transactions.length === 0) return [];

  // Determine maximum column count
  const maxCols = Math.max(
    headerRow ? headerRow.length : 0,
    ...transactions.map(t => t.length)
  );

  // Identify completely empty columns
  const emptyCols = new Set();
  for (let c = 0; c < maxCols; c++) {
    let hasData = false;
    if (headerRow && headerRow[c] && headerRow[c].trim()) hasData = true;
    if (!hasData) {
      for (const t of transactions) {
        if (t[c] && t[c].trim()) { hasData = true; break; }
      }
    }
    if (!hasData) emptyCols.add(c);
  }

  // Build clean header
  let header;
  if (headerRow && headerRow.filter(c => c.trim()).length >= 1) {
    header = padRow(headerRow, maxCols);
  } else {
    header = generateDefaultHeader(transactions, maxCols);
  }

  // Remove empty columns from header
  header = header.filter((_, i) => !emptyCols.has(i));

  // Clean up each transaction row and remove empty columns
  const rawCleanedTxns = transactions
    .map(row => padRow(row, maxCols))
    .map(row => row.filter((_, i) => !emptyCols.has(i)))
    .filter(row => {
      const nonEmpty = row.filter(c => c.trim()).length;
      return nonEmpty >= 2;
    });

  // Identify currency columns to standardize them (remove $ and commas)
  const currencyColIndices = new Set();
  header.forEach((h, i) => {
    if (/amount|debit|credit|balance/i.test(h)) {
      currencyColIndices.add(i);
    }
  });

  const finalTxns = rawCleanedTxns.map(row => {
    return row.map((cell, i) => {
      if (currencyColIndices.has(i)) {
        const val = parseAmount(cell);
        // Standardize to 2 decimal places, NO symbols, NO thousands separators
        return val !== null ? val.toFixed(2) : cell;
      }
      return cell;
    });
  });

  return [header, ...finalTxns];
}

function padRow(row, targetLen) {
  const padded = [...row];
  while (padded.length < targetLen) padded.push('');
  return padded.slice(0, targetLen).map(c => (c || '').trim());
}

function generateDefaultHeader(transactions, maxCols) {
  const header = new Array(maxCols).fill('');

  const dateCol = [];
  const amountCols = [];
  const textCols = [];
  const checkCols = [];

  for (let col = 0; col < maxCols; col++) {
    let dates = 0, amounts = 0, texts = 0, checks = 0;
    const sampleSize = Math.min(transactions.length, 30);
    for (let r = 0; r < sampleSize; r++) {
      const cell = (transactions[r][col] || '').trim();
      if (!cell) continue;
      if (isDate(cell)) dates++;
      else if (isCheckNumber(cell)) checks++;
      else if (isAmount(cell)) amounts++;
      else texts++;
    }
    if (dates > sampleSize * 0.3) dateCol.push(col);
    else if (checks > sampleSize * 0.2) checkCols.push(col);
    else if (amounts > sampleSize * 0.25) amountCols.push(col);
    else if (texts > sampleSize * 0.25) textCols.push(col);
  }

  // Assign names
  dateCol.forEach((c, i) => {
    header[c] = i === 0 ? 'Date' : 'Post Date';
  });
  textCols.forEach((c, i) => {
    header[c] = i === 0 ? 'Description' : `Details ${i + 1}`;
  });
  checkCols.forEach(c => {
    header[c] = 'Check No.';
  });
  if (amountCols.length === 1) {
    header[amountCols[0]] = 'Amount';
  } else if (amountCols.length === 2) {
    header[amountCols[0]] = 'Debit';
    header[amountCols[1]] = 'Credit';
  } else if (amountCols.length >= 3) {
    header[amountCols[0]] = 'Debit';
    header[amountCols[1]] = 'Credit';
    header[amountCols[2]] = 'Balance';
  }

  // Fill remaining unnamed
  header.forEach((h, i) => {
    if (!h) header[i] = `Column ${i + 1}`;
  });

  return header;
}

// ═══════════════════════════════════════════════════════════════════════════════
// BALANCE CROSS-VALIDATION (advisory, does not block export)
// ═══════════════════════════════════════════════════════════════════════════════
function validateBalances(header, transactions) {
  const warnings = [];
  
  // Find balance and amount columns
  const balIdx = header.findIndex(h => /balance/i.test(h));
  const amtIdx = header.findIndex(h => /^(amount|debit)$/i.test(h));
  const creditIdx = header.findIndex(h => /^credit$/i.test(h));
  
  if (balIdx < 0 || (amtIdx < 0 && creditIdx < 0)) return warnings;

  for (let i = 1; i < transactions.length; i++) {
    const prevBal = parseAmount(transactions[i - 1][balIdx]);
    const currBal = parseAmount(transactions[i][balIdx]);
    
    if (prevBal === null || currBal === null) continue;

    let txnAmount = 0;
    if (amtIdx >= 0) txnAmount += (parseAmount(transactions[i][amtIdx]) || 0);
    if (creditIdx >= 0) txnAmount += (parseAmount(transactions[i][creditIdx]) || 0);

    const expected = Math.round((prevBal + txnAmount) * 100) / 100;
    const actual = Math.round(currBal * 100) / 100;

    if (expected !== actual && txnAmount !== 0) {
      warnings.push({
        row: i + 1,
        expected,
        actual,
        diff: Math.round((actual - expected) * 100) / 100,
      });
    }
  }

  return warnings;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT: Production-Grade Smart Extractor
// ═══════════════════════════════════════════════════════════════════════════════
export async function extractTableFromPdf(file) {
  const typedarray = await fileToTypedArray(file);
  const pdf = await pdfjsLib.getDocument(typedarray).promise;
  const numPages = pdf.numPages;

  // ── Phase 1: Collect all text items with full metadata ──
  let allItems = [];
  let pageWidth = 612; // default US Letter

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1 });
    pageWidth = viewport.width;
    const textContent = await page.getTextContent();

    textContent.items.forEach(item => {
      const text = item.str.trim();
      if (!text) return;
      allItems.push({
        text,
        x: Math.round(item.transform[4] * 10) / 10,
        y: Math.round(item.transform[5] * 10) / 10,
        fontSize: Math.abs(item.transform[3]) || Math.abs(item.transform[0]) || 10,
        page: pageNum,
      });
    });
  }

  if (allItems.length === 0) return [];

  // ── Phase 2: Deduplicate per-page repeating headers/footers ──
  allItems = deduplicatePerPageRepeats(allItems, numPages);

  // ── Phase 3: Calculate dynamic Y-tolerance ──
  const yTolerance = calculateYTolerance(allItems);

  // ── Phase 4: Detect column structure ──
  const columnBoundaries = detectColumnBoundaries(allItems, pageWidth);

  // ── Phase 5: Assemble raw rows using column boundaries ──
  const rawRows = assembleRowsFromItems(allItems, columnBoundaries, yTolerance);

  if (rawRows.length === 0) return [];

  // ── Phase 6: Identify transactions, filter noise, merge multi-line ──
  const { headerRow, transactions } = extractTransactions(rawRows);

  if (transactions.length === 0) {
    // ── Fallback: Robust raw extraction ──
    // Strip noise, attempt basic date-line grouping
    const fallbackRows = rawRows.filter(r => !isNoiseRow(r));
    if (fallbackRows.length === 0) return rawRows.slice(0, 50); // last resort
    
    // Try to at least group by date lines
    const fallbackTxns = [];
    let current = null;
    for (const row of fallbackRows) {
      const first = (row[0] || '').trim();
      if (isDate(first)) {
        if (current) fallbackTxns.push(current);
        current = [...row];
      } else if (current) {
        // Merge as continuation
        const desc = findDescriptionColumn(current);
        const cont = row.filter(c => c.trim()).join(' ').trim();
        if (cont && desc >= 0) {
          current[desc] = (current[desc] + ' ' + cont).trim();
        }
      }
    }
    if (current) fallbackTxns.push(current);
    
    if (fallbackTxns.length > 0) {
      const maxC = Math.max(...fallbackTxns.map(t => t.length));
      const fbHeader = generateDefaultHeader(fallbackTxns, maxC);
      return [fbHeader, ...fallbackTxns.map(r => padRow(r, maxC))];
    }
    
    return fallbackRows;
  }

  // ── Phase 7: Format clean output with header ──
  const result = formatOutput(headerRow, transactions);
  
  // ── Phase 8: Balance validation (attach warnings as metadata) ──
  if (result.length > 1) {
    const warnings = validateBalances(result[0], result.slice(1));
    if (warnings.length > 0) {
      result._balanceWarnings = warnings;
    }
  }

  return result;
}
