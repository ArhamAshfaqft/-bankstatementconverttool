import React from 'react';
import { Table, CheckCircle, Lock, ShieldCheck } from 'lucide-react';
import QboToCsvTool from '../components/QboToCsvTool';
import SeoHead from '../components/SeoHead';
import FaqSection from '../components/FaqSection';

export default function QboToCsvPage() {
  const faqs = [
    {
      question: "How do I open a .QBO file in Excel?",
      answer: "Excel cannot natively parse the structured SGML tags of a .qbo (QuickBooks Web Connect) file. By uploading your file to our local converter, we parse the transactions and compile them into a clean tabular structure. You can then download it as a standard CSV or Excel (.xlsx) file that opens instantly."
    },
    {
      question: "Is my financial data secure when converting QBO files?",
      answer: "Yes, 100%. Our tool runs entirely in your local browser's execution memory using HTML5 APIs. No files are uploaded to any external server, ensuring complete data privacy and security for your financial statements."
    },
    {
      question: "Does this tool support both .QBO and .OFX files?",
      answer: "Yes. QuickBooks Web Connect (.qbo) is a proprietary extension of the Open Financial Exchange (.ofx) format. Since they share the same underlying XML/SGML tag schema, our converter parses both formats seamlessly."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I open a .QBO file in Excel?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Excel cannot natively parse the structured SGML tags of a .qbo (QuickBooks Web Connect) file. By uploading your file to our local converter, we parse the transactions and compile them into a clean tabular structure. You can then download it as a standard CSV or Excel (.xlsx) file that opens instantly."
        }
      },
      {
        "@type": "Question",
        "name": "Is my financial data secure when converting QBO files?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, 100%. Our tool runs entirely in your local browser's execution memory using HTML5 APIs. No files are uploaded to any external server, ensuring complete data privacy and security for your financial statements."
        }
      },
      {
        "@type": "Question",
        "name": "Does this tool support both .QBO and .OFX files?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. QuickBooks Web Connect (.qbo) is a proprietary extension of the Open Financial Exchange (.ofx) format. Since they share the same underlying XML/SGML tag schema, our converter parses both formats seamlessly."
        }
      }
    ]
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "QuickBooks QBO to CSV Converter",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "WebBrowser",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <SeoHead 
        title="Convert QuickBooks (QBO) to CSV or Excel - Free & Local"
        description="Easily convert your QuickBooks Web Connect (.QBO) files and OFX statements back into standard CSV or Excel files. 100% private, no cloud uploads."
        canonical="https://www.bankstatementconverttool.com/qbo-to-csv-converter"
        jsonLd={[softwareSchema, faqSchema]}
      />
      
      <header className="layout-standard-hero" style={{ background: 'linear-gradient(135deg, #0d9488 0%, #115e59 100%)' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2rem', color: '#ffffff' }}>
            <Table size={16} /> 100% Client-Side
          </div>
          <h1>Convert QuickBooks (.QBO) to <span>CSV & Excel</span></h1>
          <p>Easily convert QuickBooks Web Connect (.QBO) or OFX statements back into readable spreadsheet formats locally in your web browser.</p>
        </div>
      </header>

      <section className="layout-tool-container">
        <div className="container">
          <QboToCsvTool /> 
        </div>
      </section>

      {/* WHY THIS CONVERTER */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '700px', margin: '0 auto' }}>
            <span className="section-label">Read QuickBooks Statements Anywhere</span>
            <h2>Why Convert QBO to CSV?</h2>
            <p>QuickBooks Web Connect files are structured for software imports and cannot be opened directly in Excel. Our tool translates the SGML data into clean tables.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <CheckCircle size={32} color="#0d9488" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Excel & Sheets Friendly</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>Convert raw tag-based QBO transaction data into clear headers (Date, Description, Amount, Check No.) ready for auditing and reconciliation.</p>
            </div>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <ShieldCheck size={32} color="#0d9488" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Local Browser Security</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>QBO files contain highly confidential transaction IDs, bank details, and amounts. Our client-side conversion ensures your files never touch a external server.</p>
            </div>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <Lock size={32} color="#0d9488" style={{ marginBottom: '1rem' }} />
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
