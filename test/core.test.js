import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import JSZip from 'jszip';
import { mergeTables } from '../src/lib/tableMerge.js';
import { generateFileBlob, generateOfxFile } from '../src/lib/exportData.js';
import { auditStatement } from '../src/lib/fraudForensics.js';

const account = { org: 'Test Bank', fid: '100', bankId: '123456789', accountId: '9876' };

test('bulk merge aligns columns and sorts normalized dates', () => {
  const merged = mergeTables([
    [['Date', 'Description', 'Amount'], ['2026-03-02', 'Salary', '100.00']],
    [['Reference', 'Amount', 'Date', 'Description'], ['ABC', '-25.00', '2026-03-01', 'Shop']]
  ]);
  assert.deepEqual(merged, [
    ['Date', 'Description', 'Amount', 'Reference'],
    ['2026-03-01', 'Shop', '-25.00', 'ABC'],
    ['2026-03-02', 'Salary', '100.00', '']
  ]);
});

test('OFX export uses detected columns and stable transaction IDs', () => {
  const table = [['Reference', 'Value Date', 'Description', 'Amount'], ['ABC', '12-Mar-26', 'PAYMENT TO AMAZON', '-45.00']];
  const first = generateOfxFile(table, account);
  const second = generateOfxFile(table, account);
  assert.match(first, /<DTPOSTED>20260312120000/);
  assert.match(first, /<TRNAMT>-45\.00/);
  assert.equal(first.match(/<FITID>([^\r\n<]+)/)?.[1], second.match(/<FITID>([^\r\n<]+)/)?.[1]);
  assert.match(first, /<BANKID>123456789<ACCTID>9876/);
  assert.doesNotMatch(first, /<ACCTID>0000000000/);
});

test('OFX export rejects ambiguous rows and missing account details', () => {
  assert.throws(() => generateOfxFile([['Date', 'Description', 'Amount'], ['2026-01-01', 'Item', '10.00']]), /Bank ID/);
  assert.throws(() => generateOfxFile([['Date', 'Description', 'Amount'], ['bad date', 'Item', '10.00']], account), /Row 2/);
});

test('OFX export resolves separate debit and credit columns', () => {
  const output = generateOfxFile([
    ['Date', 'Description', 'Withdrawal', 'Deposit'],
    ['2026-03-01', 'Shop', '25.00', ''],
    ['2026-03-02', 'Salary', '', '100.00']
  ], account);
  assert.match(output, /<TRNAMT>-25\.00/);
  assert.match(output, /<TRNAMT>100\.00/);
});

test('Excel export writes a valid workbook and keeps formula-like descriptions as text', async () => {
  const blob = await generateFileBlob([['Date', 'Description', 'Amount', 'Reference'], ['2026-01-01', '=2+2', '-5.50', '00123']], 'excel');
  const zip = await JSZip.loadAsync(await blob.arrayBuffer());
  const sheet = await zip.file('xl/worksheets/sheet1.xml').async('string');
  assert.match(sheet, /<c r="B2" t="inlineStr"><is><t xml:space="preserve">=2\+2<\/t>/);
  assert.match(sheet, /<c r="C2"><v>-5\.50<\/v><\/c>/);
  assert.match(sheet, /<c r="D2" t="inlineStr"><is><t xml:space="preserve">00123<\/t>/);
});

test('CSV export neutralizes formulas but preserves negative amounts', async () => {
  const blob = await generateFileBlob([['Description', 'Amount'], ['=2+2', '-5.50']], 'csv');
  const csv = await blob.text();
  assert.match(csv, /'=2\+2/);
  assert.match(csv, /-5\.50/);
});

test('running balance audit catches mismatches after the header row', async () => {
  const bytes = new Uint8Array(fs.readFileSync(new URL('../sample_bank_statement.pdf', import.meta.url)));
  const rows = [['Date', 'Amount', 'Balance'], ['2026-01-01', '100.00', '100.00'], ['2026-01-02', '25.00', '999.00']];
  const result = await auditStatement(bytes, rows);
  assert.equal(result.mathAudit.checked, true);
  assert.equal(result.mathAudit.passed, false);
  assert.equal(result.mathAudit.failedRows.length, 1);
});
