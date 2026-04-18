import Papa from 'papaparse';
import * as XLSX from 'xlsx';

/**
 * Generate a Blob for a given dataset without triggering download.
 * Used by ZIP packaging for separate-file bulk exports.
 */
export function generateFileBlob(csvData, format) {
  if (!csvData || csvData.length === 0) return null;

  if (format === 'csv') {
    const csv = Papa.unparse(csvData);
    return new Blob([csv], { type: 'text/csv;charset=utf-8' });
  }

  if (format === 'excel') {
    const worksheet = XLSX.utils.aoa_to_sheet(csvData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  if (format === 'qbo' || format === 'ofx') {
    const ofxContent = generateOfxFile(csvData);
    const mime = format === 'qbo' ? 'application/vnd.intu.qbo' : 'application/x-ofx';
    return new Blob([ofxContent], { type: `${mime};charset=utf-8` });
  }

  return null;
}

export function downloadFile(csvData, exportName, format) {
  if (!csvData || csvData.length === 0) return;

  const sanitizedName = exportName ? exportName.replace(/\.pdf$/i, '') : 'bank_statement';

  if (format === 'csv') {
    const csv = Papa.unparse(csvData);
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    triggerDownload(csvContent, `${sanitizedName}.csv`);
  } 
  
  else if (format === 'excel') {
    const worksheet = XLSX.utils.aoa_to_sheet(csvData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    // Generate buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const excelUrl = URL.createObjectURL(data);
    triggerDownload(excelUrl, `${sanitizedName}.xlsx`);
  }

  else if (format === 'qbo' || format === 'ofx') {
    const ofxContent = generateOfxFile(csvData);
    const mime = format === 'qbo' ? 'application/vnd.intu.qbo' : 'application/x-ofx';
    const ofxUrl = `data:${mime};charset=utf-8,` + encodeURIComponent(ofxContent);
    triggerDownload(ofxUrl, `${sanitizedName}.${format}`);
  }
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

// Basic OFX/QBO Generator
function generateOfxFile(dataRows) {
  // Assuming dataRows is roughly Date, Description, Amount, maybe Balance
  // This is a naive OFX wrapper - production would need more rigid column mapping
  let org = "STATEMENT_CONVERTER";
  let fid = "12345";
  let bankId = "123456789";
  let acctId = "0000000000";
  let txnList = "";

  // Skip header row if exists
  const startIndex = dataRows[0].some(cell => cell.toLowerCase().includes('date')) ? 1 : 0;

  for (let i = startIndex; i < dataRows.length; i++) {
    const row = dataRows[i];
    if (row.length < 3) continue;

    const date = formatOfxDate(row[0]);
    const desc = (row[1] || '').replace(/[&<>"']/g,'_').substring(0,32); // Escape XML
    const amt = (row[row.length - 1] || row[2] || '').replace(/[^0-9.-]/g, '');

    if (!date || !amt) continue;

    txnList += `
      <STMTTRN>
        <TRNTYPE>${parseFloat(amt) < 0 ? 'DEBIT' : 'CREDIT'}
        <DTPOSTED>${date}
        <TRNAMT>${parseFloat(amt).toFixed(2)}
        <FITID>${new Date().getTime()}${i}
        <NAME>${desc}
      </STMTTRN>`;
  }

  const timestamp = formatOfxDate(new Date().toISOString().split('T')[0]);

  return `OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
ENCODING:USASCII
CHARSET:1252
COMPRESSION:NONE
OLDFILEUID:NONE
NEWFILEUID:NONE

<OFX>
  <SIGNONMSGSRSV1>
    <SONRS>
      <STATUS>
        <CODE>0
        <SEVERITY>INFO
      </STATUS>
      <DTSERVER>${timestamp}
      <LANGUAGE>ENG
      <FI>
        <ORG>${org}
        <FID>${fid}
      </FI>
    </SONRS>
  </SIGNONMSGSRSV1>
  <BANKMSGSRSV1>
    <STMTTRNRS>
      <TRNUID>1
      <STATUS>
        <CODE>0
        <SEVERITY>INFO
      </STATUS>
      <STMTRS>
        <CURDEF>USD
        <BANKACCTFROM>
          <BANKID>${bankId}
          <ACCTID>${acctId}
          <ACCTTYPE>CHECKING
        </BANKACCTFROM>
        <BANKTRANLIST>
          <DTSTART>${timestamp}
          <DTEND>${timestamp}
          ${txnList}
        </BANKTRANLIST>
        <LEDGERBAL>
          <BALAMT>0.00
          <DTASOF>${timestamp}
        </LEDGERBAL>
        <AVAILBAL>
          <BALAMT>0.00
          <DTASOF>${timestamp}
        </AVAILBAL>
      </STMTRS>
    </STMTTRNRS>
  </BANKMSGSRSV1>
</OFX>`;
}

function formatOfxDate(dateStr) {
  // Rough date parse to YYYYMMDD120000 format
  try {
    let d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day, '120000'].join('');
  } catch (e) {
    return null;
  }
}
