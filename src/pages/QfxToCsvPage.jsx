import React from 'react';
import { Table, CheckCircle, Lock, ShieldCheck } from 'lucide-react';
import QfxToCsvTool from '../components/QfxToCsvTool';
import SeoHead from '../components/SeoHead';
import FaqSection from '../components/FaqSection';

export default function QfxToCsvPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Quicken QFX to CSV Converter",
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
      question: "How do I open a .QFX file in Excel?",
      answer: "Excel cannot natively parse the structured SGML tags of a .qfx (Quicken Web Connect) file. By uploading your file to our local converter, we parse the transactions and compile them into a clean tabular structure. You can then download it as a standard CSV or Excel (.xlsx) file that opens instantly."
    },
    {
      question: "Is my financial data secure when converting QFX files?",
      answer: "Yes, 100%. Our tool runs entirely in your local browser's execution memory using HTML5 APIs. No files are uploaded to any external server, ensuring complete data privacy and security for your financial statements."
    },
    {
      question: "Does this tool support both .QFX and .OFX files?",
      answer: "Yes. Quicken Web Connect (.qfx) is a proprietary extension of the Open Financial Exchange (.ofx) format. Since they share the same underlying XML/SGML tag schema, our converter parses both formats seamlessly."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I open a .QFX file in Excel?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Excel cannot natively parse the structured SGML tags of a .qfx (Quicken Web Connect) file. By uploading your file to our local converter, we parse the transactions and compile them into a clean tabular structure. You can then download it as a standard CSV or Excel (.xlsx) file that opens instantly."
        }
      },
      {
        "@type": "Question",
        "name": "Is my financial data secure when converting QFX files?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, 100%. Our tool runs entirely in your local browser's execution memory using HTML5 APIs. No files are uploaded to any external server, ensuring complete data privacy and security for your financial statements."
        }
      },
      {
        "@type": "Question",
        "name": "Does this tool support both .QFX and .OFX files?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Quicken Web Connect (.qfx) is a proprietary extension of the Open Financial Exchange (.ofx) format. Since they share the same underlying XML/SGML tag schema, our converter parses both formats seamlessly."
        }
      }
    ]
  };

  return (
    <>
      <SeoHead 
        title="Convert Quicken (QFX) to CSV or Excel - Free & Local"
        description="Easily convert your Quicken Web Connect (.QFX) files and OFX statements back into standard CSV or Excel files. 100% private, no cloud uploads."
        canonical="https://www.bankstatementconverttool.com/qfx-to-csv-converter"
        jsonLd={[softwareSchema, faqSchema]}
      />
      
      <header className="layout-standard-hero" style={{ background: 'linear-gradient(135deg, #e11d48 0%, #9f1239 100%)' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2rem', color: '#ffffff' }}>
            <Table size={16} /> 100% Client-Side
          </div>
          <h1>Convert Quicken (.QFX) to <span>CSV & Excel</span></h1>
          <p>Easily convert Quicken Web Connect (.QFX) or OFX statements back into readable spreadsheet formats locally in your web browser.</p>
        </div>
      </header>

      <section className="layout-tool-container">
        <div className="container">
          <QfxToCsvTool /> 
        </div>
      </section>

      {/* WHY THIS CONVERTER */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '700px', margin: '0 auto' }}>
            <span className="section-label">Read Quicken Statements Anywhere</span>
            <h2>Why Convert QFX to CSV?</h2>
            <p>Quicken Web Connect files are structured for software imports and cannot be opened directly in Excel. Our tool translates the SGML data into clean tables.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <CheckCircle size={32} color="#e11d48" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Excel & Sheets Friendly</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>Convert raw tag-based QFX transaction data into clear headers (Date, Description, Amount, Check No.) ready for auditing and reconciliation.</p>
            </div>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <ShieldCheck size={32} color="#e11d48" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Local Browser Security</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>QFX files contain highly confidential transaction IDs, bank details, and amounts. Our client-side conversion ensures your files never touch an external server.</p>
            </div>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <Lock size={32} color="#e11d48" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Edit Before Downloading</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>View and modify details or discard duplicate headers and opening/closing balances in a live preview grid before triggering your CSV export.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <FaqSection faqs={faqs} />
    </>
  );
}
