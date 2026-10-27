const headerKey = value => String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ');

export function mergeTables(tables) {
  const headers = [];
  const keys = [];
  const rows = [];

  for (const table of tables) {
    if (!Array.isArray(table) || table.length < 2) continue;
    const sourceHeaders = table[0].map((header, index) => String(header || '').trim() || `Column ${index + 1}`);
    const sourceKeys = sourceHeaders.map(headerKey);
    if (new Set(sourceKeys).size !== sourceKeys.length) {
      throw new Error('A statement has duplicate column headings. Please export these files separately.');
    }
    for (let i = 0; i < sourceKeys.length; i++) {
      if (!keys.includes(sourceKeys[i])) {
        keys.push(sourceKeys[i]);
        headers.push(sourceHeaders[i]);
        rows.forEach(row => row.push(''));
      }
    }
    for (const sourceRow of table.slice(1)) {
      const row = Array(headers.length).fill('');
      sourceKeys.forEach((key, index) => {
        row[keys.indexOf(key)] = sourceRow[index] ?? '';
      });
      rows.push(row);
    }
  }

  if (rows.length === 0) return [];
  const dateColumns = keys.map((key, index) => (/\bdate\b/.test(key) ? index : -1)).filter(index => index >= 0);
  const dateOf = row => {
    for (const index of dateColumns) {
      const value = String(row[index] || '');
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    }
    return null;
  };
  const dated = rows.map((row, index) => ({ row, index, date: dateOf(row) }));
  if (dated.every(item => item.date)) {
    dated.sort((a, b) => a.date.localeCompare(b.date) || a.index - b.index);
  }
  return [headers, ...dated.map(item => item.row)];
}
