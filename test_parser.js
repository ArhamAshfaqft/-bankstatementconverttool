import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

/**
 * HARDENED TEST RUNNER v2.1
 * 
 * Replaces the old runner with the exact refined logic from the production parser.
 */

const DATE_PATTERNS = [
  /^(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])[\/\-](\d{4}|\d{2})$/,
  /^(0?[1-9]|[12]\d|3[01])[\/\-](0?[1-9]|1[0-2])[\/\-](\d{4}|\d{2})$/,
  /^\d{4}[\/\-](0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])$/,
  /^(0?[1-9]|[12]\d|3[01])\.(0?[1-9]|1[0-2])\.(\d{4}|\d{2})$/,
  /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s*\d{2,4}$/i,
  /^\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{2,4}$/i,
  /^\d{1,2}[\-](Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\-]\d{2,4}$/i,
  /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2}$/i,
  /^\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?$/i, // DD Mon
  /^(0?[1-9]|1[0-2])[\/\-](0?[12]\d|3[01])$/,
];

function isDate(text) {
  if (!text || text.length < 3 || text.length > 30) return false;
  return DATE_PATTERNS.some(p => p.test(text.trim()));
}

const CURRENCY_SUFFIXES = /\s*(EUR|GBP|USD|CAD|AUD|CHF|JPY|INR|BRL|ZAR|SEK|NOK|DKK|NZD|SGD|HKD|MXN|CR|DR)\.?$/i;

function isAmount(text) {
  if (!text) return false;
  let cleaned = text.trim()
    .replace(/^[-+]?\s*[\$€£¥₹₱₩₫₴₽R]\s*/, (match) => {
      if (match.includes('-')) return '-';
      if (match.includes('+')) return '+';
      return '';
    })
    .replace(CURRENCY_SUFFIXES, '')
    .trim();

  cleaned = cleaned.replace(/^-\s*/, '-').replace(/^\+\s*/, '');
  if (/^\(.+\)$/.test(cleaned)) cleaned = '-' + cleaned.replace(/[()]/g, '');

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

  if (/^\(.+\)$/.test(cleaned)) cleaned = '-' + cleaned.replace(/[()]/g, '');
  cleaned = cleaned.replace(/^[\s\+]+/, '');
  if (cleaned.startsWith('-')) cleaned = '-' + cleaned.substring(1).replace(/[-\s\+]+/g, '');

  const firstComma = cleaned.indexOf(',');
  const firstDot = cleaned.indexOf('.');

  if (firstComma !== -1 && firstDot !== -1) {
    if (firstComma < firstDot) cleaned = cleaned.replace(/,/g, '');
    else cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (firstComma !== -1 && firstDot === -1) {
    if (cleaned.length - firstComma <= 3) cleaned = cleaned.replace(',', '.');
    else cleaned = cleaned.replace(/,/g, '');
  } else if (firstDot !== -1) {
    const dotCount = (cleaned.match(/\./g) || []).length;
    if (dotCount > 1) cleaned = cleaned.replace(/\./g, '');
  }
  
  if (/CR$/i.test(text.trim())) cleaned = cleaned.replace(/CR$/i, '').trim();
  if (/DR$/i.test(text.trim())) cleaned = '-' + cleaned.replace(/DR$/i, '').replace(/^-/, '').trim();
  
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function isLikelyHeader(rowTexts) {
  const joined = rowTexts.join(' ').toLowerCase();
  const dateMatch = joined.includes('date') || joined.includes('txn') || joined.includes('valuta');
  const detailsMatch = joined.includes('desc') || joined.includes('narration') || joined.includes('particulars');
  const amountMatch = joined.includes('amt') || joined.includes('amount') || joined.includes('withdrawal') || joined.includes('debit') || joined.includes('credit');
  return dateMatch && (detailsMatch || amountMatch);
}

function resolveDebitCreditSigns(header, transactions) {
  const lowerHeader = header.map(h => h.toLowerCase());
  const debitIdx = lowerHeader.findIndex(h => h.includes('withdrawal') || h.includes('debit'));
  const creditIdx = lowerHeader.findIndex(h => h.includes('deposit') || h.includes('credit'));
  if (debitIdx < 0 || creditIdx < 0) return transactions;
  return transactions.map(row => {
    const nr = [...row];
    if (nr[debitIdx]) { const v = parseAmount(nr[debitIdx]); if (v > 0) nr[debitIdx] = (-v).toFixed(2); }
    return nr;
  });
}

// --- TEST RUNNER ENGINE ---

async function testFile(filename) {
  console.log(`\n🔍 TESTING: ${filename}`);
  const data = new Uint8Array(fs.readFileSync(filename));
  const pdf = await pdfjsLib.getDocument(data).promise;
  
  let allItems = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const text = await page.getTextContent();
    text.items.forEach(i => {
      allItems.push({ text: i.str, x: i.transform[4], y: i.transform[5], fontSize: i.transform[0] });
    });
  }

  // Zone Isolation
  const dateItems = allItems.filter(item => isDate(item.text));
  let zone = allItems;
  if (dateItems.length >= 2) {
    const ys = dateItems.map(i => i.y);
    zone = allItems.filter(item => item.y >= (Math.min(...ys) - 40) && item.y <= (Math.max(...ys) + 40));
  }

  const buckets = {};
  zone.forEach(i => {
    let bucket = Object.keys(buckets).find(y => Math.abs(y - i.y) < 5);
    if (bucket) buckets[bucket].push(i); else buckets[i.y] = [i];
  });
  const sortedY = Object.keys(buckets).sort((a,b) => b-a);
  
  let allRows = [];
  sortedY.forEach(y => {
    const row = buckets[y].sort((a,b) => a.x - b.x);
    const cols = [50, 100, 120, 200, 350, 450, 500];
    const cells = new Array(cols.length).fill('');
    row.forEach(item => {
      let best = 0, dist = Infinity;
      cols.forEach((cx, ci) => { if (Math.abs(item.x - cx) < dist) { dist = Math.abs(item.x - cx); best = ci; } });
      cells[best] = (cells[best] + ' ' + item.text).trim();
    });
    allRows.push(cells);
  });

  const dateCol = (() => {
    const maxCols = Math.max(...allRows.map(r => r.length));
    let bestCol = 0, bestRatio = 0;
    for (let c = 0; c < maxCols; c++) {
      let dates = 0, total = 0;
      allRows.forEach(r => { if (r[c]) { total++; if (isDate(r[c])) dates++; } });
      if (total > 0 && (dates/total) > bestRatio) { bestRatio = dates/total; bestCol = c; }
    }
    return bestCol;
  })();

  const header = allRows.find(r => isLikelyHeader(r)) || ['Date', 'Desc', 'Amount'];
  const txns = allRows.filter(r => isDate(r[dateCol]));
  const final = resolveDebitCreditSigns(header, txns);

  console.log(`✅ Header Detected: [${header.filter(c=>c).join(' | ')}]`);
  console.log(`✅ Date Column Index: ${dateCol}`);
  console.log(`✅ Transactions Extracted: ${final.length}`);
  final.forEach((t, i) => console.log(`   ${i+1}. ${t.filter(c=>c).join(' | ')}`));
}

async function runSuite() {
  const files = [
    'sample_wf_statement.pdf',
    'sample_barclays_uk.pdf',
    'sample_hdfc_india.pdf',
    'sample_hsbc_split.pdf',
    'sample_amex_dense.pdf'
  ];
  for (const f of files) if (fs.existsSync(f)) await testFile(f);
}

runSuite().catch(console.error);
