/**
 * Local QBO/OFX statement parser.
 * Extracts transactions client-side without server processing.
 */
export function parseQboToRows(text) {
  if (!text) return [];

  // Find all <STMTTRN> blocks
  const transactionBlocks = text.split(/<STMTTRN>/gi).slice(1);
  const rows = [];
  const headers = ['Date', 'Description', 'Amount', 'Check No.', 'Reference / FitId', 'Type', 'Memo'];

  for (let block of transactionBlocks) {
    // Remove the closing tag if it exists at the end of the block
    const cleanBlock = block.split(/<\/STMTTRN>/gi)[0];

    // Helper to extract value for a tag (can be SGML like <TAG>val or XML like <TAG>val</TAG>)
    const getTagValue = (tag) => {
      const regex = new RegExp(`<${tag}>([^<\\r\\n]+)`, 'i');
      const match = cleanBlock.match(regex);
      if (match) {
        let val = match[1].trim();
        // Remove closing tag if XML-like (e.g. </TAG>)
        const closingTag = `</${tag}>`;
        if (val.toUpperCase().endsWith(closingTag.toUpperCase())) {
          val = val.substring(0, val.length - closingTag.length).trim();
        }
        // Replace common XML entities
        val = val
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&apos;/g, "'");
        return val;
      }
      return '';
    };

    const rawDate = getTagValue('DTPOSTED') || getTagValue('DTUSER');
    const name = getTagValue('NAME');
    const amt = getTagValue('TRNAMT');
    const fitid = getTagValue('FITID');
    const trntype = getTagValue('TRNTYPE');
    const checknum = getTagValue('CHECKNUM');
    const memo = getTagValue('MEMO');

    // Skip transactions with no date/amount/name
    if (!rawDate && !amt && !name) continue;

    // Normalize date (YYYYMMDD...)
    let formattedDate = rawDate;
    if (rawDate && rawDate.length >= 8) {
      const y = rawDate.substring(0, 4);
      const m = rawDate.substring(4, 6);
      const d = rawDate.substring(6, 8);
      if (/^\d{4}$/.test(y) && /^\d{2}$/.test(m) && /^\d{2}$/.test(d)) {
        formattedDate = `${y}-${m}-${d}`;
      }
    }

    // Normalize amount
    let formattedAmt = amt;
    if (amt) {
      const parsed = parseFloat(amt.replace(/[^\d.-]/g, ''));
      if (!isNaN(parsed)) {
        formattedAmt = parsed.toFixed(2);
      }
    }

    rows.push([
      formattedDate,
      name,
      formattedAmt,
      checknum,
      fitid,
      trntype,
      memo
    ]);
  }

  if (rows.length === 0) return [];

  return [headers, ...rows];
}
