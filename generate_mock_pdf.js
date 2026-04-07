import fs from 'fs';
import PDFDocument from 'pdfkit';

const doc = new PDFDocument({ margin: 50 });
doc.pipe(fs.createWriteStream('sample_bank_statement.pdf'));

// ─── Page Header / Bank Info (should be filtered as noise) ───
doc.fontSize(22).font('Helvetica-Bold').text('Chase', 50, 50);
doc.fontSize(10).font('Helvetica').text('JPMorgan Chase Bank, N.A.', 50, 78);
doc.fontSize(10).text('Member FDIC', 50, 92);
doc.fontSize(12).font('Helvetica-Bold').text('CHECKING ACCOUNT STATEMENT', 300, 55);
doc.fontSize(10).font('Helvetica').text('Account Number: ****4231', 300, 75);
doc.fontSize(10).text('Statement Period: March 1 - March 31, 2026', 300, 89);

// ─── Account Summary Block (should be filtered) ───
let y = 130;
doc.font('Helvetica-Bold').fontSize(11).text('Account Summary', 50, y);
y += 18;
doc.font('Helvetica').fontSize(9);
doc.text('Beginning Balance', 50, y); doc.text('$5,000.00', 480, y);
y += 14;
doc.text('Deposits and Additions', 50, y); doc.text('$3,250.00', 480, y);
y += 14;
doc.text('Withdrawals and Other Debits', 50, y); doc.text('-$1,231.89', 480, y);
y += 14;
doc.text('Ending Balance', 50, y); doc.text('$7,018.11', 480, y);

// Divider
y += 25;
doc.moveTo(50, y).lineTo(550, y).stroke();
y += 15;

// ─── Transaction Table Header (should be detected as column header) ───
doc.font('Helvetica-Bold').fontSize(9);
doc.text('Date', 50, y);
doc.text('Description', 140, y);
doc.text('Amount', 400, y);
doc.text('Balance', 490, y);
y += 12;
doc.moveTo(50, y).lineTo(550, y).stroke();
y += 10;

// ─── Actual Transactions ───
doc.font('Helvetica').fontSize(9);

const txns = [
  { date: '03/01/2026', desc: 'Starting Balance', amt: '', bal: '$5,000.00' },
  { date: '03/05/2026', desc: 'Direct Deposit - PayrollCorp', amt: '$3,250.00', bal: '$8,250.00' },
  { date: '03/08/2026', desc: 'TARGET T-1456', amt: '-$125.50', bal: '$8,124.50' },
  // Multi-line description test
  { date: '03/10/2026', desc: 'AMAZON.COM*MK4TS83B0', amt: '-$45.99', bal: '$8,078.51' },
  { date: null,        desc: '  AMZN MKTP US', amt: '', bal: '' },  // continuation line
  { date: '03/12/2026', desc: 'STARBUCKS STORE 01234', amt: '-$6.40', bal: '$8,072.11' },
  { date: '03/15/2026', desc: 'ONLINE BILL PAY -', amt: '-$89.00', bal: '$7,983.11' },
  { date: null,        desc: '  EDISON ELECTRIC COMPANY', amt: '', bal: '' }, // continuation
  { date: '03/18/2026', desc: 'ATM WITHDRAWAL', amt: '-$200.00', bal: '$7,783.11' },
  { date: '03/20/2026', desc: 'TRANSFER TO SAV 9821', amt: '-$500.00', bal: '$7,283.11' },
  { date: '03/22/2026', desc: 'CHECK #1245', amt: '-$250.00', bal: '$7,033.11' },
  { date: '03/25/2026', desc: 'SPOTIFY USA', amt: '-$10.99', bal: '$7,022.12' },
  { date: '03/28/2026', desc: 'COSTCO WHSE #0431', amt: '-$88.01', bal: '$6,934.11' },
  { date: '03/31/2026', desc: 'VENMO PAYMENT', amt: '$84.00', bal: '$7,018.11' },
];

txns.forEach(t => {
  if (t.date) {
    doc.text(t.date, 50, y);
  }
  doc.text(t.desc, 140, y);
  if (t.amt) doc.text(t.amt, 400, y);
  if (t.bal) doc.text(t.bal, 490, y);
  y += 16;
});

// ─── Footer Noise (should be filtered) ───
y += 30;
doc.font('Helvetica-Bold').fontSize(9);
doc.text('Total Deposits and Additions', 140, y);
doc.text('$3,334.00', 400, y);
y += 14;
doc.text('Total Withdrawals', 140, y);
doc.text('-$1,315.89', 400, y);
y += 30;

doc.font('Helvetica').fontSize(7);
doc.text('Page 1 of 1', 270, y);
y += 12;
doc.text('© 2026 JPMorgan Chase & Co.', 50, y);
doc.text('Equal Housing Lender', 300, y);
doc.text('www.chase.com | Customer Service: 1-800-935-9935', 50, y + 10);

doc.end();
console.log("✅ Realistic mock Chase statement generated: sample_bank_statement.pdf");
