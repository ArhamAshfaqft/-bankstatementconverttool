import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

// Replicate ALL detection functions from the new pdfParser.js
const DATE_PATTERNS = [
  /^(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])[\/\-](\d{4}|\d{2})$/,
  /^(0?[1-9]|[12]\d|3[01])[\/\-](0?[1-9]|1[0-2])[\/\-](\d{4}|\d{2})$/,
  /^\d{4}[\/\-](0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])$/,
  /^(0?[1-9]|[12]\d|3[01])\.(0?[1-9]|1[0-2])\.(\d{4}|\d{2})$/,
  /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s*\d{2,4}$/i,
  /^\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{2,4}$/i,
  /^\d{1,2}[\-](Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\-]\d{2,4}$/i,
  /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2}$/i,
  /^(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])$/,
];
function isDate(text) {
  if (!text || text.length < 3 || text.length > 30) return false;
  return DATE_PATTERNS.some(p => p.test(text.trim()));
}
const CURRENCY_SYMBOLS = /^[\$€£¥₹₱₩₫₴₽R]?\s*/;
const CURRENCY_SUFFIXES = /\s*(EUR|GBP|USD|CAD|AUD|CHF|JPY|INR|BRL|ZAR|SEK|NOK|DKK|NZD|SGD|HKD|MXN|CR|DR)\.?$/i;
function isAmount(text) {
  if (!text) return false;
  let cleaned = text.trim();
  if (cleaned.length === 0 || cleaned.length > 25) return false;
  cleaned = cleaned.replace(CURRENCY_SYMBOLS, '').replace(CURRENCY_SUFFIXES, '').trim();
  cleaned = cleaned.replace(/^-\s*/, '-').replace(/^\+\s*/, '');
  if (/^\(.+\)$/.test(cleaned)) cleaned = '-' + cleaned.replace(/[()]/g, '');
  if (/^-?\d{1,3}(,\d{3})*(\.\d{1,2})?$/.test(cleaned)) return true;
  if (/^-?\d{1,3}(\.\d{3})*(,\d{1,2})?$/.test(cleaned)) return true;
  if (/^-?\d+\.?\d{0,2}$/.test(cleaned) && cleaned.length > 0) return true;
  return false;
}
function parseAmount(text) {
  if (!text) return null;
  let cleaned = text.trim().replace(CURRENCY_SYMBOLS, '').replace(CURRENCY_SUFFIXES, '').trim();
  cleaned = cleaned.replace(/^-\s*/, '-').replace(/^\+\s*/, '');
  if (/^\(.+\)$/.test(cleaned)) cleaned = '-' + cleaned.replace(/[()]/g, '');
  if (/^\d{1,3}(\.\d{3})+(,\d{1,2})?$/.test(cleaned.replace(/^-/, ''))) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else { cleaned = cleaned.replace(/,/g, ''); }
  if (/CR$/i.test(text.trim())) cleaned = cleaned.replace(/CR$/i, '').trim();
  if (/DR$/i.test(text.trim())) cleaned = '-' + cleaned.replace(/DR$/i, '').replace(/^-/, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}
const NOISE_PATTERNS = [
  /^page\s+\d+/i, /^continued\s+(on|from)/i, /^\d+\s+of\s+\d+/i, /^\(continued\)/i,
  /^(statement|account)\s+(summary|period|number|ending|type|overview)/i,
  /^(opening|closing|beginning|ending|previous|new|available|current|ledger)\s+balance/i,
  /^(your\s+)?(account|statement)\s+(number|#|no)/i, /^(primary|joint)\s+account\s+holder/i,
  /^routing\s+(number|transit|no)/i, /^(swift|iban|bic|sort)\s*(code|number|no)?/i, /^\*{3,}\d+/,
  /^(total|subtotal|summary|period|account|activity)\s*(deposits?|withdrawals?|debits?|credits?|checks?|additions?|subtractions?|other|fees?|charges?|payments?|purchases?|interest)?/i,
  /^(deposits?|additions?|withdrawals?|subtractions?|other\s+debits?|checks?\s*(paid|written)?|electronic\s+withdrawals?|fees?\s*(charged)?|service\s+charges?|interest\s+(paid|earned|charged))\s*/i,
  /^(daily|average)\s+(balance|ledger)/i, /^(minimum|maximum)\s+balance/i,
  /^(annual\s+percentage|apy|apr)\s*(yield|rate)?/i, /^interest\s+(earned|paid|charged|rate|this\s+period)/i,
  /^(overdraft|nsf)\s+(fee|protection|limit)/i, /^number\s+of\s+(days|items|deposits?|withdrawals?|debits?|credits?)/i,
  /^(description|reference|check|memo|details|particulars|narration)\s*$/i,
  /^(balance|amount|debit|credit|withdrawal|deposit|charges?)\s*$/i,
  /^member\s+fdic/i, /^equal\s+housing/i, /©/, /customer\s*service/i, /www\./i, /https?:\/\//i,
  /call\s+us\s+at/i, /^(dear|to)\s+(valued\s+)?customer/i, /^(this\s+)?(statement|page)\s+(is|was|has\s+been)/i,
  /^(please|for)\s+(review|contact|call|visit|refer)/i, /^(important|notice|attention|reminder|note)\s*:/i,
  /regulatory|compliance|disclosure/i, /terms\s+and\s+conditions/i, /privacy\s+(policy|notice)/i,
  /^(tax\s+id|tin|ein)\s*/i,
  /^\*{2,}$/, /^-{2,}$/, /^={2,}$/, /^_{2,}$/, /^\.{2,}$/,
  /^(chase|wells\s*fargo|bank\s+of\s+america|citibank|capital\s+one|td\s+bank|us\s+bank|pnc|suntrust|truist|regions|fifth\s+third|huntington|citizens|m&t|key\s*bank|ally|discover|synchrony|usaa|navy\s+federal|charles\s+schwab)\s*/i,
  /^(checking|savings|money\s+market|certificate|cd)\s+(account|statement|summary)/i,
  /^(visa|mastercard|american\s+express|amex)\s*/i,
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
  if (!joined.includes('date') && !joined.includes('post') && !joined.includes('trans')) return false;
  const headerTerms = ['description', 'amount', 'balance', 'debit', 'credit', 'withdrawal', 'deposit', 'reference', 'check no', 'check number', 'particulars', 'narration', 'details'];
  const matchCount = headerTerms.filter(t => joined.includes(t)).length;
  if (matchCount < 1) return false;
  const nonEmptyCells = rowTexts.filter(c => c.trim());
  if (nonEmptyCells.length === 0) return false;
  const avgCellLength = nonEmptyCells.reduce((sum, c) => sum + c.trim().length, 0) / nonEmptyCells.length;
  return avgCellLength <= 20;
}
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
  fingerprints.forEach((pages, key) => { if (pages.size >= threshold) repeatingKeys.add(key); });
  if (repeatingKeys.size === 0) return allItems;
  const seen = new Set();
  return allItems.filter(item => {
    const key = `${Math.round(item.y)}|${item.text}`;
    if (repeatingKeys.has(key)) { if (seen.has(key)) return false; seen.add(key); }
    return true;
  });
}
function calculateYTolerance(allItems) {
  const heights = allItems.map(item => item.fontSize).filter(h => h > 0).sort((a, b) => a - b);
  if (heights.length === 0) return 3;
  const median = heights[Math.floor(heights.length / 2)];
  return Math.max(2, Math.min(median * 0.6, 8));
}
function detectColumnBoundaries(allItems) {
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
    if (mergedPeaks.length === 0 || p - mergedPeaks[mergedPeaks.length - 1] > 15) mergedPeaks.push(p);
  });
  return mergedPeaks;
}
function assembleRowsFromItems(items, columnBoundaries, yTolerance) {
  const yBuckets = {};
  items.forEach(item => {
    if (!item.text) return;
    let foundBucket = null;
    for (const key in yBuckets) {
      if (Math.abs(parseFloat(key) - item.y) <= yTolerance) { foundBucket = key; break; }
    }
    if (foundBucket) yBuckets[foundBucket].push(item);
    else yBuckets[item.y] = [item];
  });
  const sortedY = Object.keys(yBuckets).map(Number).sort((a, b) => b - a);
  return sortedY.map(y => {
    const rowItems = yBuckets[y].sort((a, b) => a.x - b.x);
    if (columnBoundaries.length > 0) {
      const cells = new Array(columnBoundaries.length).fill('');
      rowItems.forEach(item => {
        let bestCol = 0, bestDist = Infinity;
        columnBoundaries.forEach((cx, ci) => { const dist = Math.abs(item.x - cx); if (dist < bestDist) { bestDist = dist; bestCol = ci; } });
        cells[bestCol] = cells[bestCol] ? cells[bestCol] + ' ' + item.text : item.text;
      });
      return cells;
    }
    return rowItems.map(i => i.text);
  });
}
function findDescriptionColumn(row) {
  let bestCol = -1, bestLen = 0;
  row.forEach((cell, i) => {
    const trimmed = (cell || '').trim();
    if (trimmed.length > bestLen && !isDate(trimmed) && !isAmount(trimmed)) { bestLen = trimmed.length; bestCol = i; }
  });
  return bestCol >= 0 ? bestCol : Math.min(1, row.length - 1);
}
function padRow(row, targetLen) {
  const padded = [...row];
  while (padded.length < targetLen) padded.push('');
  return padded.slice(0, targetLen).map(c => (c || '').trim());
}

// ═══════════════════════════════════════════════════════════════════════════════

async function run() {
  console.log("Reading test PDF...");
  const dataBuffer = fs.readFileSync('sample_wf_statement.pdf');
  const data = new Uint8Array(dataBuffer);
  const pdf = await pdfjsLib.getDocument(data).promise;
  const numPages = pdf.numPages;
  console.log(`\n📄 Pages: ${numPages}`);

  let allItems = [];
  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
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
  console.log(`📦 Total text items: ${allItems.length}`);

  allItems = deduplicatePerPageRepeats(allItems, numPages);
  console.log(`🔄 After dedup: ${allItems.length} items`);

  const yTol = calculateYTolerance(allItems);
  console.log(`📐 Dynamic Y-tolerance: ${yTol.toFixed(1)}pt`);

  const bounds = detectColumnBoundaries(allItems);
  console.log(`📊 Column boundaries: [${bounds.join(', ')}]`);

  const rawRows = assembleRowsFromItems(allItems, bounds, yTol);
  console.log(`📋 Raw rows assembled: ${rawRows.length}`);

  // Extract transactions
  const transactions = [];
  let currentTxn = null;
  let headerRow = null;
  let headersSeen = 0;

  for (const row of rawRows) {
    if (isLikelyHeader(row)) {
      headersSeen++;
      if (headersSeen === 1) headerRow = row;
      continue;
    }
    if (isNoiseRow(row)) continue;
    const firstCell = (row[0] || '').trim();
    const hasDate = isDate(firstCell);
    const hasAmt = row.some(cell => isAmount(cell));
    if (hasDate) {
      if (currentTxn) transactions.push(currentTxn);
      currentTxn = [...row];
    } else if (!currentTxn && !hasDate) {
      continue;
    } else if (currentTxn && !hasDate && !hasAmt) {
      const descCol = findDescriptionColumn(currentTxn);
      const cont = row.filter(c => c.trim()).join(' ').trim();
      if (cont && descCol >= 0) currentTxn[descCol] = (currentTxn[descCol] + ' ' + cont).trim();
    } else if (currentTxn && hasAmt && !hasDate) {
      row.forEach((cell, ci) => {
        if (isAmount(cell) && ci < currentTxn.length && (!currentTxn[ci] || !isAmount(currentTxn[ci])))
          currentTxn[ci] = cell;
      });
    }
  }
  if (currentTxn) transactions.push(currentTxn);

  console.log(`\n✅ HEADER: ${headerRow ? JSON.stringify(headerRow) : 'AUTO-GENERATED'}`);
  console.log(`✅ TRANSACTIONS: ${transactions.length}`);
  console.log(`──────────────────────────────────────`);
  transactions.forEach((t, i) => {
    // Strip empty cols for display
    const clean = t.filter(c => c.trim());
    console.log(`  ${i + 1}. ${clean.join(' | ')}`);
  });

  // Test international amounts
  console.log(`\n🌍 INTERNATIONAL AMOUNT TESTS:`);
  const testAmounts = [
    '$1,234.56', '-$89.00', '(500.00)', '€1.234,56', '£999.99',
    '¥10000', '₹5,000.00', '100.50 EUR', '200 CR', '300.00 DR',
    '1.234.567,89', '$0.01', '-0.50', '+250.00'
  ];
  testAmounts.forEach(a => {
    console.log(`  ${a.padEnd(20)} → isAmount=${isAmount(a)}, parsed=${parseAmount(a)}`);
  });

  // Test international dates
  console.log(`\n🗓️ INTERNATIONAL DATE TESTS:`);
  const testDates = [
    '03/15/2026', '15/03/2026', '2026-03-15', '15.03.2026',
    'Mar 15, 2026', '15 Mar 2026', '15-Mar-26', 'Mar 15',
    '03/15', 'January 1, 2026'
  ];
  testDates.forEach(d => {
    console.log(`  ${d.padEnd(25)} → isDate=${isDate(d)}`);
  });
}

run();
