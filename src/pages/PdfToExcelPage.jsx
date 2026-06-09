import React from 'react';
import SeoHead from '../components/SeoHead';
import ConverterTool from '../components/ConverterTool';
import { ShieldCheck, HelpCircle, ArrowRight, Zap, CheckCircle, FileSpreadsheet, Eye } from 'lucide-react';
import FaqSection from '../components/FaqSection';

export default function PdfToExcelPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PDF to Excel Bank Statement Converter",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "WebBrowser",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  const faqs = [
    {
      question: "How do I convert a bank statement PDF to Excel?",
      answer: "Simply drag and drop your PDF bank statement into the converter dropzone above. Once the transaction list is extracted and displayed in the preview grid, choose 'Excel (.xlsx)' from the download options dropdown and download the clean Excel spreadsheet."
    },
    {
      question: "Are scanned bank statement PDFs supported?",
      answer: "Yes. If your bank statement is a scanned image or photo, you can use our built-in Receipt OCR Scanner tool. It uses local optical character recognition to extract texts and lists them in a table format that can be downloaded as an Excel sheet."
    },
    {
      question: "Is my financial ledger data safe?",
      answer: "Yes. None of your bank statements are sent to our servers. All PDF processing, parsing, and Excel file generation are executed using client-side JavaScript inside your web browser. This offline-first approach ensures bank statement privacy."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I convert a bank statement PDF to Excel?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Simply drag and drop your PDF bank statement into the converter dropzone above. Once the transaction list is extracted and displayed in the preview grid, choose 'Excel (.xlsx)' from the download options dropdown and download the clean Excel spreadsheet."
        }
      },
      {
        "@type": "Question",
        "name": "Are scanned bank statement PDFs supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. If your bank statement is a scanned image or photo, you can use our built-in Receipt OCR Scanner tool. It uses local optical character recognition to extract texts and lists them in a table format that can be downloaded as an Excel sheet."
        }
      },
      {
        "@type": "Question",
        "name": "Is my financial ledger data safe?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. None of your bank statements are sent to our servers. All PDF processing, parsing, and Excel file generation are executed using client-side JavaScript inside your web browser. This offline-first approach ensures bank statement privacy."
        }
      }
    ]
  };

  return (
    <>
      <SeoHead 
        title="Convert PDF Bank Statement to Excel Online | Free & Local"
        description="Convert your PDF bank statements directly into clean Excel (.xlsx) spreadsheets instantly. 100% browser-based with zero data uploads."
        canonical="https://www.bankstatementconverttool.com/pdf-to-excel-converter"
        jsonLd={[softwareSchema, faqSchema]}
      />

      {/* PREMIUM EXCEL HERO */}
      <header className="layout-standard-hero" style={{ background: 'linear-gradient(135deg, #0e6233 0%, #107c41 100%)' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2rem', color: '#ffffff' }}>
            <FileSpreadsheet size={16} /> Native Excel (.xlsx) Export Support
          </div>
          <h1>Convert Bank Statements to <span>Excel</span></h1>
          <p>Extract transactions from bank statement PDFs directly into fully formatted Excel spreadsheets. Local processing ensures your financial data stays confidential.</p>
        </div>
      </header>

      <section className="layout-tool-container">
        <div className="container">
          <ConverterTool />
        </div>
      </section>

      <div className="chase-content-container">
        <h2 className="chase-section-title">Why Convert PDF Bank Statements to Excel?</h2>

        {/* COMPARISON AND VALUE PROPOSITION */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
          <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#0e6233', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={20} /> Preserves Column Formatting
            </h3>
            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
              CSV files strip all styling, fonts, and column widths, and Excel often corrupts leading zeros or date formats when opening them. Exporting directly to native `.xlsx` preserves number formatting, preventing text truncating or scientific notation errors on account numbers.
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#0e6233', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={20} /> Multi-Sheet Workbooks
            </h3>
            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
              With our Pro plan, you can merge multiple PDF statements at once. Instead of downloading multiple individual files, you can export a single Excel workbook containing separate sheets for checking, savings, and credit card accounts.
            </p>
          </div>
        </div>

        {/* FAQ ACCORDION */}
        <div style={{ margin: '0 -2rem' }}>
          <FaqSection faqs={faqs} />
        </div>
      </div>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Convert Your PDF Statements to Excel?</h2>
          <p>Extract transactions from any bank statement into a clean Excel file instantly. Free, secure, and private.</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={() => document.getElementById('converter').scrollIntoView({ behavior: 'smooth' })}>
              Start Excel Conversion <Zap size={16} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
