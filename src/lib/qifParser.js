/**
 * Local QIF statement parser.
 * Extracts transactions client-side from Quicken Interchange Format (.qif) files.
 */
export function parseQifToRows(text) {
  if (!text) return [];

  const lines = text.split(/\r?\n/);
  const transactions = [];
  let currentTxn = {};
  const headers = ['Date', 'Description', 'Amount', 'Check No.', 'Category', 'Memo', 'Cleared'];

  // Helper to normalize QIF dates (handles MM/DD/YY, MM/DD'YY, DD/MM/YYYY etc.)
  const normalizeQifDate = (dateStr) => {
    if (!dateStr) return '';
    let cleaned = dateStr.trim().replace(/'/g, '/'); // replace apostrophe (e.g. D03/15'26)
    
    // Split by separator
    const parts = cleaned.split(/[\/\-\.]/);
    if (parts.length < 2) return dateStr;

    let month = parseInt(parts[0], 10);
    let day = parseInt(parts[1], 10);
    let year = parts[2] ? parseInt(parts[2], 10) : new Date().getFullYear();

    // Heuristics to resolve ambiguity
    if (month > 12 && day <= 12) {
      // European format DD/MM/YY
      const temp = month;
      month = day;
      day = temp;
    }

    if (year < 100) {
      year += year > 50 ? 1900 : 2000;
    }

    if (isNaN(month) || isNaN(day) || isNaN(year)) return dateStr;
    if (month < 1 || month > 12 || day < 1 || day > 31) return dateStr;

    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    if (line === '^') {
      // End of transaction block -> save if it has content
      if (Object.keys(currentTxn).length > 0) {
        transactions.push(currentTxn);
        currentTxn = {};
      }
      continue;
    }

    // Header lines start with '!' (like !Type:Bank)
    if (line.startsWith('!')) {
      continue;
    }

    const code = line[0];
    const value = line.substring(1).trim();

    switch (code) {
      case 'D':
        currentTxn.date = normalizeQifDate(value);
        break;
      case 'T':
        // Normalize amount
        const parsedAmt = parseFloat(value.replace(/,/g, ''));
        currentTxn.amount = !isNaN(parsedAmt) ? parsedAmt.toFixed(2) : value;
        break;
      case 'P':
        currentTxn.desc = value;
        break;
      case 'N':
        currentTxn.checknum = value;
        break;
      case 'M':
        currentTxn.memo = value;
        break;
      case 'L':
        currentTxn.category = value;
        break;
      case 'C':
        currentTxn.cleared = value;
        break;
      default:
        // Ignore other codes like S, A, etc.
        break;
    }
  }

  // Push final transaction if file doesn't end with '^'
  if (Object.keys(currentTxn).length > 0) {
    transactions.push(currentTxn);
  }

  if (transactions.length === 0) return [];

  const rows = transactions.map(t => [
    t.date || '',
    t.desc || '',
    t.amount || '',
    t.checknum || '',
    t.category || '',
    t.memo || '',
    t.cleared || ''
  ]);

  return [headers, ...rows];
}
