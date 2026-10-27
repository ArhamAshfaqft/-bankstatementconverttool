import Papa from 'papaparse';
import JSZip from 'jszip';

const csvFormulaPattern = /^[=+@\t\r]|^-(?![$€£₹]?\d)/;

/**
 * Generate a Blob for a given dataset without triggering download.
 * Used by ZIP packaging for separate-file bulk exports.
 */
export async function generateFileBlob(csvData, format, ofxOptions) {
  if (!csvData || csvData.length === 0) return null;

  if (format === 'csv') {
    const csv = Papa.unparse(csvData, { escapeFormulae: csvFormulaPattern });
    return new Blob([csv], { type: 'text/csv;charset=utf-8' });
  }

  if (format === 'excel') {
    return makeExcelBlob(csvData);
  }

  if (format === 'qbo' || format === 'ofx') {
    const ofxContent = generateOfxFile(csvData, ofxOptions);
    const mime = format === 'qbo' ? 'application/vnd.intu.qbo' : 'application/x-ofx';
    return new Blob([ofxContent], { type: `${mime};charset=utf-8` });
  }

  return null;
}

export async function downloadFile(csvData, exportName, format, ofxOptions) {
  if (!csvData || csvData.length === 0) return;

  const sanitizedName = exportName ? exportName.replace(/\.pdf$/i, '') : 'bank_statement';

  if (format === 'csv') {
    const csv = Papa.unparse(csvData, { escapeFormulae: csvFormulaPattern });
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    triggerDownload(csvContent, `${sanitizedName}.csv`);
  } 
  
  else if (format === 'excel') {
    const data = await makeExcelBlob(csvData);
    const excelUrl = URL.createObjectURL(data);
    triggerDownload(excelUrl, `${sanitizedName}.xlsx`);
    setTimeout(() => URL.revokeObjectURL(excelUrl), 60_000);
  }

  else if (format === 'qbo' || format === 'ofx') {
    const ofxContent = generateOfxFile(csvData, ofxOptions);
    const mime = format === 'qbo' ? 'application/vnd.intu.qbo' : 'application/x-ofx';
    const ofxUrl = `data:${mime};charset=utf-8,` + encodeURIComponent(ofxContent);
    triggerDownload(ofxUrl, `${sanitizedName}.${format}`);
  }
}

const xmlEscape = value => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

function excelColumn(index) {
  let result = '';
  for (let n = index + 1; n > 0; n = Math.floor((n - 1) / 26)) {
    result = String.fromCharCode(65 + ((n - 1) % 26)) + result;
  }
  return result;
}

async function makeExcelBlob(data) {
  const namespace = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
  const numericColumns = new Set((data[0] || []).map((header, index) =>
    /\b(amount|balance|debit|credit|withdrawal|deposit)\b/i.test(String(header || '')) ? index : -1
  ).filter(index => index >= 0));
  const rows = data.map((row, rowIndex) => {
    const cells = row.map((value, columnIndex) => {
      const ref = `${excelColumn(columnIndex)}${rowIndex + 1}`;
      const text = String(value ?? '');
      if (rowIndex > 0 && numericColumns.has(columnIndex) && /^-?\d+(?:\.\d+)?$/.test(text)) {
        return `<c r="${ref}"><v>${text}</v></c>`;
      }
      return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${xmlEscape(text)}</t></is></c>`;
    }).join('');
    return `<row r="${rowIndex + 1}">${cells}</row>`;
  }).join('');
  const zip = new JSZip();
  zip.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>');
  zip.file('_rels/.rels', '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>');
  zip.file('xl/workbook.xml', `<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="${namespace}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Transactions" sheetId="1" r:id="rId1"/></sheets></workbook>`);
  zip.file('xl/_rels/workbook.xml.rels', '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>');
  zip.file('xl/worksheets/sheet1.xml', `<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="${namespace}"><sheetData>${rows}</sheetData></worksheet>`);
  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
}

function triggerDownload(url, filename) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const normalizedHeader = value => String(value || '').trim().toLowerCase();
const escapeOfx = value => String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/[\r\n]/g, ' ').trim();

export function requestOfxDetails() {
  const org = window.prompt('Bank or financial institution name for the OFX/QBO file:');
  if (org === null) return null;
  const fid = window.prompt('Financial institution ID (FID) supplied by your bank:');
  if (fid === null) return null;
  const bankId = window.prompt('Bank routing / institution ID:');
  if (bankId === null) return null;
  const accountId = window.prompt('Account ID (used only in the downloaded file):');
  if (accountId === null) return null;
  if (![org, fid, bankId, accountId].every(value => value.trim())) {
    throw new Error('All bank and account fields are required for OFX/QBO export.');
  }
  return { org: org.trim(), fid: fid.trim(), bankId: bankId.trim(), accountId: accountId.trim() };
}

function ofxDate(value) {
  const text = String(value || '').trim();
  let year, month, day;
  let match = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) [, year, month, day] = match;
  if (!match) {
    match = text.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
    if (match) [, month, day, year] = match;
  }
  if (!match) {
    match = text.match(/^(\d{1,2})-([A-Za-z]{3,})-(\d{2,4})$/);
    if (match) {
      day = match[1];
      month = String(['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(match[2].slice(0, 3).toLowerCase()) + 1);
      year = match[3];
    }
  }
  if (!match || Number(month) < 1 || Number(month) > 12) return null;
  if (year.length === 2) year = Number(year) > 50 ? `19${year}` : `20${year}`;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  if (date.getUTCFullYear() !== Number(year) || date.getUTCMonth() + 1 !== Number(month) || date.getUTCDate() !== Number(day)) return null;
  return `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}120000`;
}

function money(value) {
  const text = String(value ?? '').trim();
  if (!text) return null;
  const negative = /^\(.+\)$/.test(text) || /\bDR\b/i.test(text);
  const clean = text.replace(/[^\d.,-]/g, '').replace(/,/g, '');
  if (!/^-?\d+(?:\.\d+)?$/.test(clean)) return null;
  const result = Number(clean);
  return negative ? -Math.abs(result) : result;
}

function stableId(value) {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

export function generateOfxFile(dataRows, options = {}) {
  if (!Array.isArray(dataRows) || dataRows.length < 2) throw new Error('No transactions to export.');
  const { bankId, accountId, fid, org, currency = 'USD', accountType = 'CHECKING' } = options;
  if (!bankId || !accountId || !fid || !org) {
    throw new Error('Bank ID, account ID, financial institution ID, and institution name are required for OFX/QBO export.');
  }

  const headers = dataRows[0].map(normalizedHeader);
  const find = pattern => headers.findIndex(header => pattern.test(header));
  const dateIndex = find(/\bdate\b/);
  const descriptionIndex = find(/description|details|narration|merchant|payee/);
  const amountIndex = find(/^(?:transaction )?amount$|^value$/);
  const debitIndex = find(/debit|withdrawal/);
  const creditIndex = find(/credit|deposit/);
  if (dateIndex < 0 || descriptionIndex < 0 || (amountIndex < 0 && debitIndex < 0 && creditIndex < 0)) {
    throw new Error('Map columns to Date, Description, and Amount (or Debit/Credit) before exporting OFX/QBO.');
  }

  const transactions = dataRows.slice(1).map((row, index) => {
    const date = ofxDate(row[dateIndex]);
    const name = escapeOfx(row[descriptionIndex]);
    const hasSeparateAmount = (debitIndex >= 0 && String(row[debitIndex] || '').trim()) ||
      (creditIndex >= 0 && String(row[creditIndex] || '').trim());
    const amount = amountIndex >= 0
      ? money(row[amountIndex])
      : hasSeparateAmount ? (money(row[creditIndex]) || 0) - Math.abs(money(row[debitIndex]) || 0) : null;
    if (!date || !name || amount === null || !Number.isFinite(amount)) {
      throw new Error(`Row ${index + 2} has an invalid date, description, or amount. Use YYYY-MM-DD dates and review the table before export.`);
    }
    return { date, name, amount };
  });
  const occurrences = new Map();
  const transactionList = transactions.map(({ date, name, amount }) => {
    const basis = `${date}|${name}|${amount.toFixed(2)}`;
    const occurrence = (occurrences.get(basis) || 0) + 1;
    occurrences.set(basis, occurrence);
    return `<STMTTRN>\n<TRNTYPE>${amount < 0 ? 'DEBIT' : 'CREDIT'}\n<DTPOSTED>${date}\n<TRNAMT>${amount.toFixed(2)}\n<FITID>${stableId(basis)}-${occurrence}\n<NAME>${name.slice(0, 64)}\n</STMTTRN>`;
  }).join('\n');
  const dates = transactions.map(txn => txn.date).sort();
  const timestamp = ofxDate(new Date().toISOString().slice(0, 10));
  return `OFXHEADER:100\nDATA:OFXSGML\nVERSION:102\nSECURITY:NONE\nENCODING:UTF-8\nCHARSET:NONE\nCOMPRESSION:NONE\nOLDFILEUID:NONE\nNEWFILEUID:NONE\n\n<OFX>\n<SIGNONMSGSRSV1><SONRS><STATUS><CODE>0<SEVERITY>INFO</STATUS><DTSERVER>${timestamp}<LANGUAGE>ENG<FI><ORG>${escapeOfx(org)}<FID>${escapeOfx(fid)}</FI></SONRS></SIGNONMSGSRSV1>\n<BANKMSGSRSV1><STMTTRNRS><TRNUID>1<STATUS><CODE>0<SEVERITY>INFO</STATUS><STMTRS><CURDEF>${escapeOfx(currency)}<BANKACCTFROM><BANKID>${escapeOfx(bankId)}<ACCTID>${escapeOfx(accountId)}<ACCTTYPE>${escapeOfx(accountType)}</BANKACCTFROM><BANKTRANLIST><DTSTART>${dates[0]}<DTEND>${dates.at(-1)}\n${transactionList}\n</BANKTRANLIST></STMTRS></STMTTRNRS></BANKMSGSRSV1>\n</OFX>`;
}
