import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// ═══════════════════════════════════════════════════════════════════════════════
// BULLETPROOF BANK STATEMENT PDF PARSER — v2.0
// ═══════════════════════════════════════════════════════════════════════════════
//
// Hardened Pipeline:
//   1.  Extract all text items with X/Y/page/fontSize metadata
//   2.  Deduplicate per-page repeating headers & footers
//   3.  ★ Isolate "Transaction Zone" (crop to date-bearing region)
//   4.  ★ Detect table sub-regions (handles split Deposit/Withdrawal tables)
//   5.  Dynamic font-size-aware Y-tolerance (★ tighter cap)
//   6.  Detect column boundaries via X-coordinate histogram (zone-filtered)
//   7.  Assemble rows per region, then merge
//   8.  ★ Statistically detect date column (not hardcoded to col 0/1)
//   9.  Identify transaction header row
//  10.  Filter noise rows (★ expanded international pattern library)
//  11.  Extract transactions with date-boundary detection
//  12.  Merge multi-line descriptions & wrapped amounts
//  13.  Strip empty ghost columns
//  14.  Auto-generate headers if not detected
//  15.  ★ Semantic debit/credit sign resolution
//  16.  Optional balance cross-validation
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Utility: File / Buffer → Uint8Array ────────────────────────────────────
export async function fileToTypedArray(file) {
  if (file instanceof Uint8Array) return file;
  if (file instanceof ArrayBuffer) return new Uint8Array(file);
  if (file && file.buffer && file.byteLength !== undefined && !(file instanceof Blob)) {
    return new Uint8Array(file.buffer, file.byteOffset, file.byteLength);
  }
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
  // DD Mon (HSBC-style without year: "15 Mar")
  /^\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?$/i,
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

  cleaned = cleaned
    .replace(/^[-+]?\s*[\$€£¥₹₱₩₫₴₽R]\s*/, (match) => {
      if (match.includes('-')) return '-';
      if (match.includes('+')) return '+';
      return '';
    })
    .replace(CURRENCY_SUFFIXES, '')
    .trim();

  cleaned = cleaned.replace(/^-\s*/, '-');
  cleaned = cleaned.replace(/^\+\s*/, '');

  if (/^\(.+\)$/.test(cleaned)) {
    cleaned = '-' + cleaned.replace(/[()]/g, '');
  }

  if (/^-?\d{1,3}(,\d{3})*(\.\d{1,2})?$/.test(cleaned)) return true;
  if (/^-?\d{1,3}(\.\d{3})*(,\d{1,2})?$/.test(cleaned)) return true;
  if (/^-?\d+\.?\d{0,2}$/.test(cleaned) && cleaned.length > 0) return true;

  return false;
}

function parseAmount(text) {
  if (!text) return null;

  let cleaned = text.trim()
    .replace(/[\$€£¥₹₱₩₫₴₽R]/g, '')
    .replace(CURRENCY_SUFFIXES, '')
    .trim();

  if (/^\(.+\)$/.test(cleaned)) {
    cleaned = '-' + cleaned.replace(/[()]/g, '');
  }

  cleaned = cleaned.replace(/^[\s\+]+/, '');
  if (cleaned.startsWith('-')) {
    cleaned = '-' + cleaned.substring(1).replace(/[-\s\+]+/g, '');
  }

  const firstComma = cleaned.indexOf(',');
  const firstDot = cleaned.indexOf('.');

  if (firstComma !== -1 && firstDot !== -1) {
    if (firstComma < firstDot) {
      cleaned = cleaned.replace(/,/g, '');
    } else {
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    }
  } else if (firstComma !== -1 && firstDot === -1) {
    if (cleaned.length - firstComma <= 3) {
      cleaned = cleaned.replace(',', '.');
    } else {
      cleaned = cleaned.replace(/,/g, '');
    }
  } else if (firstDot !== -1) {
    const dotCount = (cleaned.match(/\./g) || []).length;
    if (dotCount > 1) {
      cleaned = cleaned.replace(/\./g, '');
    }
  }

  if (/CR$/i.test(text.trim())) cleaned = cleaned.replace(/CR$/i, '').trim();
  if (/DR$/i.test(text.trim())) cleaned = '-' + cleaned.replace(/DR$/i, '').replace(/^-/, '').trim();

  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

// ═══════════════════════════════════════════════════════════════════════════════
// NOISE / JUNK ROW DETECTION — ★ EXPANDED International Pattern Library
// ═══════════════════════════════════════════════════════════════════════════════
const NOISE_PATTERNS = [
  // ── Page & Navigation ──
  /^page\s+\d+/i,
  /^continued\s+(on|from)/i,
  /^\d+\s+of\s+\d+/i,
  /^\(continued\)/i,

  // ── Account & Statement Info ──
  /^(statement|account)\s+(summary|period|number|ending|type|overview)/i,
  /^(opening|closing|beginning|ending|previous|new|available|current|ledger)\s+balance/i,
  /^(your\s+)?(account|statement)\s+(number|#|no)/i,
  /^(primary|joint)\s+account\s+holder/i,
  /^routing\s+(number|transit|no)/i,
  /^(swift|iban|bic|sort)\s*(code|number|no)?/i,
  /^\*{3,}\d+/,

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
  /©/,
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
  /^\*{2,}$/,
  /^-{2,}$/,
  /^={2,}$/,
  /^_{2,}$/,
  /^\.{2,}$/,

  // ── Bank-Specific Common Lines (US) ──
  /^(chase|wells\s*fargo|bank\s+of\s+america|citibank|capital\s+one|td\s+bank|us\s+bank|pnc|suntrust|truist|regions|fifth\s+third|huntington|citizens|m&t|key\s*bank|ally|discover|synchrony|usaa|navy\s+federal|charles\s+schwab)\s*/i,
  /^(checking|savings|money\s+market|certificate|cd)\s+(account|statement|summary)/i,
  /^(visa|mastercard|american\s+express|amex)\s*/i,

  // ★ ── International: India ──
  /^(cin|gstin|pan|ifsc\s*(code)?|micr\s*(code)?)\s*:/i,
  /^(branch|branch\s+code|sol\s+id)\s*:/i,
  /^(state\s+bank|hdfc|icici|axis|kotak|punjab\s+national|canara|union\s+bank|bank\s+of\s+baroda|indusind|yes\s+bank|idbi|federal\s+bank)\s*/i,
  /^(nomination\s+registered|jointly\s+operated)/i,
  /^(neft|rtgs|imps|upi)\s+(ref|reference|transaction)/i,

  // ★ ── International: UK / Europe ──
  /^(sort\s+code|faster\s+payment|direct\s+debit|standing\s+order|bacs)\s*/i,
  /^(barclays|hsbc|lloyds|natwest|santander|nationwide|halifax|rbs|tsb|monzo|revolut|starling)\s*/i,
  /^(authorised|regulated)\s+by\s+(the\s+)?(fca|financial\s+conduct)/i,
  /^financial\s+services\s+(register|compensation)/i,

  // ★ ── International: Middle East / Africa ──
  /^(vat\s+registration|trn|tax\s+registration)\s*/i,
  /^(emirates\s+nbd|adcb|fab|mashreq|enbd|al\s+rajhi|ncb|samba|riyad\s+bank|standard\s+bank|fnb|absa|nedbank|capitec)\s*/i,

  // ★ ── International: Asia Pacific ──
  /^(dbs|ocbc|uob|maybank|cimb|public\s+bank|anz|westpac|commonwealth|nab|bdo|bpi|metrobank)\s*/i,

  // ★ ── Generic International ──
  /^(thank\s+you\s+for\s+banking)/i,
  /^(this\s+is\s+a\s+computer\s+generated)/i,
  /^(no\s+signature\s+(is\s+)?required)/i,
  /^(e\s*&\s*o\s*e)/i,
  /^(errors?\s+and\s+omissions?\s+excepted)/i,
  /^(in\s+case\s+of\s+any\s+discrepancy)/i,
  /^(please\s+examine|kindly\s+verify)/i,
  /^(auto[- ]?generated|system\s+generated)/i,
  /^(currency|ccy)\s*:\s*/i,
  /^(customer\s+id|cif|client\s+id)\s*:/i,
];

function isNoiseRow(rowTexts) {
  if (!rowTexts || rowTexts.length === 0) return true;
  const joined = rowTexts.join(' ').trim();
  if (joined.length < 2) return true;
  if (/^[\s\-=_.*#@!]+$/.test(joined)) return true;
  if (NOISE_PATTERNS.some(p => p.test(joined))) return true;
  return false;
}

function isLikelyHeader(rowTexts) {
  const joined = rowTexts.join(' ').toLowerCase();

  if (!joined.includes('date') && !joined.includes('post') && !joined.includes('trans')
      && !joined.includes('value') && !joined.includes('txn')) {
    return false;
  }

  const headerTerms = ['description', 'amount', 'balance', 'debit', 'credit',
    'withdrawal', 'deposit', 'reference', 'check no', 'check number',
    'particulars', 'narration', 'details', 'remark', 'type'];
  const matchCount = headerTerms.filter(t => joined.includes(t)).length;
  if (matchCount < 1) return false;

  const nonEmptyCells = rowTexts.filter(c => c.trim());
  if (nonEmptyCells.length === 0) return false;
  const avgCellLength = nonEmptyCells.reduce((sum, c) => sum + c.trim().length, 0) / nonEmptyCells.length;
  return avgCellLength <= 25;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PER-PAGE HEADER/FOOTER DEDUPLICATION
// ═══════════════════════════════════════════════════════════════════════════════
function deduplicatePerPageRepeats(allItems, numPages) {
  if (numPages < 2) return allItems;

  const fingerprints = new Map();

  allItems.forEach(item => {
    const key = `${Math.round(item.y)}|${item.text}`;
    if (!fingerprints.has(key)) fingerprints.set(key, new Set());
    fingerprints.get(key).add(item.page);
  });

  const threshold = Math.max(2, Math.ceil(numPages * 0.6));
  const repeatingKeys = new Set();
  fingerprints.forEach((pages, key) => {
    if (pages.size >= threshold) repeatingKeys.add(key);
  });

  if (repeatingKeys.size === 0) return allItems;

  const seen = new Set();
  return allItems.filter(item => {
    const key = `${Math.round(item.y)}|${item.text}`;
    if (repeatingKeys.has(key)) {
      if (seen.has(key)) return false;
      seen.add(key);
    }
    return true;
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// ★ PHASE 1: TRANSACTION ZONE ISOLATION
// ═══════════════════════════════════════════════════════════════════════════════
// Finds the Y-range containing date-bearing text items and crops the item list
// to only include items within that zone. This prevents legal text, addresses,
// and other noise from polluting the column histogram.
// ═══════════════════════════════════════════════════════════════════════════════
function isolateTransactionZone(allItems) {
  // Find all items that look like dates
  const dateItems = allItems.filter(item => isDate(item.text));

  if (dateItems.length < 2) {
    // Not enough dates found — return everything (fall back to full scan)
    return allItems;
  }

  // Get the Y-range of date-bearing items (remember: PDF Y is bottom-up,
  // but pdf.js transform[5] gives us the baseline Y)
  const dateYs = dateItems.map(i => i.y);
  const minY = Math.min(...dateYs);
  const maxY = Math.max(...dateYs);

  // Add generous padding (2× the median font height) to capture headers
  // and amounts that sit slightly above/below the date range
  const heights = allItems.map(i => i.fontSize).filter(h => h > 0).sort((a, b) => a - b);
  const medianHeight = heights.length > 0 ? heights[Math.floor(heights.length / 2)] : 10;
  const padding = medianHeight * 4;

  // Crop items to the transaction zone
  return allItems.filter(item => {
    return item.y >= (minY - padding) && item.y <= (maxY + padding);
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// ★ PHASE 1b: DETECT TABLE SUB-REGIONS (Split Tables)
// ═══════════════════════════════════════════════════════════════════════════════
// Some banks (Wells Fargo, HSBC, many Indian banks) put Deposits and
// Withdrawals in separate tables on the same page. We detect large vertical
// gaps that indicate separate table regions.
// ═══════════════════════════════════════════════════════════════════════════════
function detectTableRegions(items, yTolerance) {
  if (items.length === 0) return [items];

  // Get unique Y positions, sorted top-to-bottom
  const uniqueYs = [...new Set(items.map(i => Math.round(i.y)))].sort((a, b) => b - a);

  if (uniqueYs.length < 3) return [items];

  // Calculate gaps between consecutive Y values
  const gaps = [];
  for (let i = 1; i < uniqueYs.length; i++) {
    gaps.push({
      gapSize: Math.abs(uniqueYs[i - 1] - uniqueYs[i]),
      splitY: (uniqueYs[i - 1] + uniqueYs[i]) / 2,
    });
  }

  // Find the median gap
  const sortedGaps = gaps.map(g => g.gapSize).sort((a, b) => a - b);
  const medianGap = sortedGaps[Math.floor(sortedGaps.length / 2)];

  // A "table break" is a gap that's >3× the median gap
  const breakThreshold = Math.max(medianGap * 3, yTolerance * 5);
  const breakPoints = gaps.filter(g => g.gapSize > breakThreshold).map(g => g.splitY);

  if (breakPoints.length === 0) return [items];

  // Split items into regions
  const regions = [];
  let remaining = [...items];

  breakPoints.sort((a, b) => b - a); // top to bottom

  for (const bp of breakPoints) {
    const above = remaining.filter(i => i.y >= bp);
    const below = remaining.filter(i => i.y < bp);
    if (above.length > 0) regions.push(above);
    remaining = below;
  }
  if (remaining.length > 0) regions.push(remaining);

  // Only return regions that have at least one date item (ignore pure noise regions)
  const validRegions = regions.filter(region =>
    region.some(item => isDate(item.text))
  );

  return validRegions.length > 0 ? validRegions : [items];
}

// ═══════════════════════════════════════════════════════════════════════════════
// ★ PHASE 5: DYNAMIC Y-TOLERANCE (Tightened, Font-Relative Cap)
// ═══════════════════════════════════════════════════════════════════════════════
function calculateYTolerance(allItems) {
  const heights = allItems
    .map(item => item.fontSize)
    .filter(h => h > 0)
    .sort((a, b) => a - b);

  if (heights.length === 0) return 3;

  const median = heights[Math.floor(heights.length / 2)];
  // ★ Use 60% of median height, but cap at 90% of median (not a flat 8pt)
  // This prevents row merging on dense credit card statements
  return Math.max(2, Math.min(median * 0.6, median * 0.9));
}

// ═══════════════════════════════════════════════════════════════════════════════
// COLUMN BOUNDARY DETECTION (now runs on zone-filtered items)
// ═══════════════════════════════════════════════════════════════════════════════
function detectColumnBoundaries(allItems, pageWidth) {
  const BUCKET_SIZE = 5;
  const histogram = {};

  allItems.forEach(item => {
    const bucket = Math.round(item.x / BUCKET_SIZE) * BUCKET_SIZE;
    histogram[bucket] = (histogram[bucket] || 0) + 1;
  });

  const threshold = Math.max(3, allItems.length * 0.03);
  const peaks = Object.entries(histogram)
    .filter(([, count]) => count >= threshold)
    .map(([x]) => parseFloat(x))
    .sort((a, b) => a - b);

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

  const sortedY = Object.keys(yBuckets).map(Number).sort((a, b) => b - a);

  return sortedY.map(y => {
    const rowItems = yBuckets[y].sort((a, b) => a.x - b.x);

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
// ★ PHASE 2: STATISTICAL DATE COLUMN DETECTION
// ═══════════════════════════════════════════════════════════════════════════════
// Instead of hardcoding "date is in column 0 or 1", we scan ALL columns
// and return the one with the highest ratio of date-like values.
// ═══════════════════════════════════════════════════════════════════════════════
function detectDateColumn(rows) {
  if (rows.length === 0) return 0;

  const maxCols = Math.max(...rows.map(r => r.length));
  const sampleSize = Math.min(rows.length, 50);
  let bestCol = 0;
  let bestRatio = 0;

  for (let col = 0; col < maxCols; col++) {
    let dateCount = 0;
    let nonEmptyCount = 0;

    for (let r = 0; r < sampleSize; r++) {
      const cell = (rows[r][col] || '').trim();
      if (!cell) continue;
      nonEmptyCount++;
      if (isDate(cell)) dateCount++;
    }

    const ratio = nonEmptyCount > 0 ? dateCount / nonEmptyCount : 0;
    if (ratio > bestRatio) {
      bestRatio = ratio;
      bestCol = col;
    }
  }

  // Only trust the detection if at least 20% of non-empty values are dates
  return bestRatio >= 0.2 ? bestCol : 0;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSACTION IDENTIFICATION & MULTI-LINE MERGING
// ═══════════════════════════════════════════════════════════════════════════════
function extractTransactions(rows, dateCol) {
  const transactions = [];
  let currentTxn = null;
  let headerRow = null;
  let headersSeen = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    if (isLikelyHeader(row)) {
      headersSeen++;
      if (headersSeen === 1) {
        headerRow = row;
      }
      continue;
    }

    if (isNoiseRow(row)) continue;

    // ★ Use the statistically detected date column
    const dateCell = (row[dateCol] || '').trim();
    const startsWithDate = isDate(dateCell);

    // Also check adjacent columns (dateCol+1) for dual-date formats
    const nextCol = dateCol + 1;
    const nextCell = row.length > nextCol ? (row[nextCol] || '').trim() : '';
    const nextIsDate = isDate(nextCell);

    const hasAmount = row.some(cell => isAmount(cell));

    if (startsWithDate || (nextIsDate && dateCell.length === 0)) {
      if (currentTxn) {
        transactions.push(currentTxn);
      }
      currentTxn = [...row];
    } else if (!currentTxn && !startsWithDate) {
      continue;
    } else if (currentTxn && !startsWithDate && !hasAmount) {
      const descCol = findDescriptionColumn(currentTxn, dateCol);
      if (descCol >= 0) {
        const continuation = row.filter(c => c.trim()).join(' ').trim();
        if (continuation) {
          currentTxn[descCol] = (currentTxn[descCol] + ' ' + continuation).trim();
        }
      }
    } else if (currentTxn && hasAmount && !startsWithDate) {
      row.forEach((cell, ci) => {
        if (isAmount(cell) && ci < currentTxn.length) {
          if (!currentTxn[ci] || !isAmount(currentTxn[ci])) {
            currentTxn[ci] = cell;
          }
        }
      });
    }
  }

  if (currentTxn) {
    transactions.push(currentTxn);
  }

  return { headerRow, transactions };
}

function findDescriptionColumn(row, dateCol) {
  let bestCol = -1;
  let bestLen = 0;
  row.forEach((cell, i) => {
    if (i === dateCol) return; // skip the date column itself
    const trimmed = (cell || '').trim();
    if (trimmed.length > bestLen && !isDate(trimmed) && !isAmount(trimmed)) {
      bestLen = trimmed.length;
      bestCol = i;
    }
  });
  // Fallback: column after the date column
  return bestCol >= 0 ? bestCol : Math.min(dateCol + 1, row.length - 1);
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHECK NUMBER DETECTION
// ═══════════════════════════════════════════════════════════════════════════════
function isCheckNumber(text) {
  if (!text) return false;
  const t = text.trim();
  return /^(#|CHK\s*|CHECK\s*)?(\d{3,6})$/i.test(t);
}

// ═══════════════════════════════════════════════════════════════════════════════
// ★ PHASE 3: SEMANTIC DEBIT/CREDIT SIGN RESOLUTION
// ═══════════════════════════════════════════════════════════════════════════════
// If the header contains separate Debit and Credit columns, auto-negate
// values in the Debit/Withdrawal column so the CSV is accounting-ready.
// ═══════════════════════════════════════════════════════════════════════════════
function resolveDebitCreditSigns(header, transactions) {
  if (!header || header.length === 0) return transactions;

  const lowerHeader = header.map(h => (h || '').toLowerCase().trim());

  // Find debit/withdrawal columns
  const debitIdx = lowerHeader.findIndex(h =>
    /^(debit|withdrawal|deductions?|charges?|paid\s*out|money\s*out)$/i.test(h)
  );

  // Find credit/deposit columns
  const creditIdx = lowerHeader.findIndex(h =>
    /^(credit|deposit|additions?|received|money\s*in|paid\s*in)$/i.test(h)
  );

  // Only apply sign resolution if we have BOTH debit and credit columns
  // (if there's only an "Amount" column, signs are already embedded)
  if (debitIdx < 0 || creditIdx < 0) return transactions;

  return transactions.map(row => {
    const newRow = [...row];

    // Negate the debit column value (make it negative if positive)
    if (newRow[debitIdx]) {
      const val = parseAmount(newRow[debitIdx]);
      if (val !== null && val > 0) {
        newRow[debitIdx] = (-val).toFixed(2);
      }
    }

    // Ensure credit column value is positive
    if (newRow[creditIdx]) {
      const val = parseAmount(newRow[creditIdx]);
      if (val !== null && val < 0) {
        newRow[creditIdx] = Math.abs(val).toFixed(2);
      }
    }

    return newRow;
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// ★ SMART DATE NORMALIZATION — Convert any format to YYYY-MM-DD
// ═══════════════════════════════════════════════════════════════════════════════
const MONTH_MAP = {
  jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3,
  apr: 4, april: 4, may: 5, jun: 6, june: 6,
  jul: 7, july: 7, aug: 8, august: 8, sep: 9, sept: 9, september: 9,
  oct: 10, october: 10, nov: 11, november: 11, dec: 12, december: 12,
};

function normalizeDate(text) {
  if (!text) return null;
  const t = text.trim();
  let day, month, year;

  // Current year fallback for formats without year
  const currentYear = new Date().getFullYear();

  // Try: YYYY-MM-DD or YYYY/MM/DD (ISO)
  let m = t.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
  if (m) { year = +m[1]; month = +m[2]; day = +m[3]; }

  // Try: DD.MM.YYYY or DD.MM.YY (European dot)
  if (!year) {
    m = t.match(/^(\d{1,2})\.(\d{1,2})\.(\d{2,4})$/);
    if (m) { day = +m[1]; month = +m[2]; year = +m[3]; }
  }

  // Try: MM/DD/YYYY or DD/MM/YYYY — ambiguous, use US-first heuristic
  if (!year) {
    m = t.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
    if (m) {
      const a = +m[1], b = +m[2];
      year = +m[3];
      // If first number > 12, it must be the day (European)
      if (a > 12) { day = a; month = b; }
      // If second number > 12, first must be month (US)
      else if (b > 12) { month = a; day = b; }
      // Ambiguous (both ≤ 12) — default to US (MM/DD)
      else { month = a; day = b; }
    }
  }

  // Try: MM/DD (no year)
  if (!year) {
    m = t.match(/^(\d{1,2})[\/\-](\d{1,2})$/);
    if (m) {
      const a = +m[1], b = +m[2];
      if (a > 12) { day = a; month = b; }
      else if (b > 12) { month = a; day = b; }
      else { month = a; day = b; }
      year = currentYear;
    }
  }

  // Try: "Month DD, YYYY" or "Month DD YYYY" or "Month DD"
  if (!year || !month) {
    m = t.match(/^([A-Za-z]+)\.?\s+(\d{1,2}),?\s*(\d{2,4})?$/);
    if (m) {
      const mo = MONTH_MAP[m[1].toLowerCase()];
      if (mo) { month = mo; day = +m[2]; year = m[3] ? +m[3] : currentYear; }
    }
  }

  // Try: "DD Month YYYY" or "DD Month"
  if (!year || !month) {
    m = t.match(/^(\d{1,2})\s+([A-Za-z]+)\.?\s*(\d{2,4})?$/);
    if (m) {
      const mo = MONTH_MAP[m[2].toLowerCase()];
      if (mo) { day = +m[1]; month = mo; year = m[3] ? +m[3] : currentYear; }
    }
  }

  // Try: "DD-Mon-YY" or "DD-Mon-YYYY"
  if (!year || !month) {
    m = t.match(/^(\d{1,2})[\-]([A-Za-z]+)[\-](\d{2,4})$/);
    if (m) {
      const mo = MONTH_MAP[m[2].toLowerCase()];
      if (mo) { day = +m[1]; month = mo; year = +m[3]; }
    }
  }

  if (!day || !month) return null;

  // Fix 2-digit year
  if (year < 100) {
    year += year > 50 ? 1900 : 2000;
  }
  if (!year) year = currentYear;

  // Validate ranges
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function detectDateColumns(header, transactions) {
  const indices = [];
  // Check header labels
  header.forEach((h, i) => {
    if (/date|posted|trans.*date|value.*date|post.*date/i.test(h)) {
      indices.push(i);
    }
  });
  if (indices.length > 0) return indices;

  // Fallback: check content
  const maxCols = Math.max(...transactions.map(r => r.length), header.length);
  const sampleSize = Math.min(transactions.length, 20);
  for (let c = 0; c < maxCols; c++) {
    let dateCount = 0;
    for (let r = 0; r < sampleSize; r++) {
      if (transactions[r] && isDate((transactions[r][c] || '').trim())) dateCount++;
    }
    if (dateCount / sampleSize > 0.5) indices.push(c);
  }
  return indices;
}

// ═══════════════════════════════════════════════════════════════════════════════
// OUTPUT FORMATTING — With Ghost Column Removal
// ═══════════════════════════════════════════════════════════════════════════════
function formatOutput(headerRow, transactions) {
  if (transactions.length === 0) return [];

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

  header = header.filter((_, i) => !emptyCols.has(i));

  const rawCleanedTxns = transactions
    .map(row => padRow(row, maxCols))
    .map(row => row.filter((_, i) => !emptyCols.has(i)))
    .filter(row => {
      const nonEmpty = row.filter(c => c.trim()).length;
      return nonEmpty >= 2;
    });

  // ★ Apply semantic debit/credit sign resolution BEFORE currency cleaning
  const signResolved = resolveDebitCreditSigns(header, rawCleanedTxns);

  // Universally clean ALL cells that look like currency values
  const finalTxns = signResolved.map(row => {
    return row.map(cell => {
      const trimmed = (cell || '').trim();
      if (/[\$€£¥₹]/.test(trimmed) || /^[(\-+]\s*[\$€£¥₹]/.test(trimmed)) {
        const val = parseAmount(trimmed);
        if (val !== null) return val.toFixed(2);
      }
      if (/^-?\d{1,3}(,\d{3})+(\.\d{1,2})?$/.test(trimmed)) {
        const val = parseAmount(trimmed);
        if (val !== null) return val.toFixed(2);
      }
      return cell;
    });
  });

  // ★ Phase 11: Normalize date columns to YYYY-MM-DD
  const dateColIndices = detectDateColumns(header, finalTxns);
  const normalizedTxns = finalTxns.map(row => {
    const newRow = [...row];
    dateColIndices.forEach(ci => {
      if (newRow[ci]) {
        const normalized = normalizeDate(newRow[ci]);
        if (normalized) newRow[ci] = normalized;
      }
    });
    return newRow;
  });

  return [header, ...normalizedTxns];
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
// MAIN EXPORT: Bulletproof Smart Extractor v2.0
// ═══════════════════════════════════════════════════════════════════════════════
export async function extractTableFromPdf(file) {
  const typedarray = await fileToTypedArray(file);
  const pdf = await pdfjsLib.getDocument(typedarray).promise;
  const numPages = pdf.numPages;

  // ── Phase 1: Collect all text items with full metadata ──
  let allItems = [];
  let pageWidth = 612;

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

  // ── ★ Phase 3: Isolate the transaction zone ──
  const zoneItems = isolateTransactionZone(allItems);

  // ── ★ Phase 4: Calculate dynamic Y-tolerance (tightened) ──
  const yTolerance = calculateYTolerance(zoneItems);

  // ── ★ Phase 5: Detect table sub-regions (split tables) ──
  const regions = detectTableRegions(zoneItems, yTolerance);

  // ── Phase 6: For each region, detect columns & assemble rows ──
  let allRows = [];
  for (const region of regions) {
    const columnBoundaries = detectColumnBoundaries(region, pageWidth);
    const regionRows = assembleRowsFromItems(region, columnBoundaries, yTolerance);
    allRows = allRows.concat(regionRows);
  }

  if (allRows.length === 0) return [];

  // ── ★ Phase 7: Statistically detect the date column ──
  const dateCol = detectDateColumn(allRows);

  // ── Phase 8: Identify transactions, filter noise, merge multi-line ──
  const { headerRow, transactions } = extractTransactions(allRows, dateCol);

  if (transactions.length === 0) {
    // ── Fallback: Robust raw extraction ──
    const fallbackRows = allRows.filter(r => !isNoiseRow(r));
    if (fallbackRows.length === 0) return allRows.slice(0, 50);

    const fallbackTxns = [];
    let current = null;
    const fbDateCol = detectDateColumn(fallbackRows);

    for (const row of fallbackRows) {
      const dateCell = (row[fbDateCol] || '').trim();
      if (isDate(dateCell)) {
        if (current) fallbackTxns.push(current);
        current = [...row];
      } else if (current) {
        const desc = findDescriptionColumn(current, fbDateCol);
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

  // ── Phase 9: Format clean output with header ──
  const result = formatOutput(headerRow, transactions);

  // ── Phase 10: Balance validation (attach warnings as metadata) ──
  if (result.length > 1) {
    const warnings = validateBalances(result[0], result.slice(1));
    if (warnings.length > 0) {
      result._balanceWarnings = warnings;
    }
  }

  return result;
}
