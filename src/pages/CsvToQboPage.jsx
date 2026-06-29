import React from 'react';
import { Table, CheckCircle, Lock, ShieldCheck } from 'lucide-react';
import CsvToQboTool from '../components/CsvToQboTool';
import SeoHead from '../components/SeoHead';
import FaqSection from '../components/FaqSection';

export default function CsvToQboPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CSV to QuickBooks QBO Converter",
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
      question: "Does QuickBooks support direct CSV imports?",
      answer: "Yes, but direct CSV imports in QuickBooks frequently cause formatting headaches (such as inverted debit/credit columns or unrecognized date structures). Converting your CSV into a Web Connect (.qbo) format bypasses these mapping issues completely."
    },
    {
      question: "Which QuickBooks versions support Web Connect (.QBO) import?",
      answer: "All active desktop and cloud platforms, including QuickBooks Online, Desktop Pro/Premier, and Enterprise editions. As long as bank feeds are supported, .qbo imports will work."
    },
    {
      question: "How does the column mapper work in this tool?",
      answer: "Once you drop your CSV statement, you can select which column represents the date, description, and amount. Our local Javascript converter maps these columns into the standard QBO tags automatically."
    },
    {
      question: "Are my bank details safe with offline conversion?",
      answer: "Yes, absolutely. Because the code runs client-side inside your own browser window, your account sheets, numbers, payees, and financial histories are never processed on our servers."
    },
    {
      question: "What CSV columns do I need?",
      answer: "At minimum you need a date column, a description or payee column, and an amount column. Optional columns such as check number, memo, or separate debit and credit fields can be mapped when available."
    },
    {
      question: "Can I fix reversed debits and credits?",
      answer: "Yes. Review the preview before export. If your source spreadsheet uses separate debit and credit columns or reversed signs, map the fields carefully before downloading the QBO file."
    },
    {
      question: "Will QuickBooks treat this like a bank feed file?",
      answer: "The exported file is built as a Web Connect QBO file, which is designed for QuickBooks bank feed imports rather than a generic spreadsheet upload."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <SeoHead 
        title="CSV to QBO Converter - Import Spreadsheets into QuickBooks"
        description="Convert CSV transaction spreadsheets into QuickBooks Web Connect (.QBO) files locally. Map columns, preview rows, and download a private bank feed file."
        canonical="https://bankstatementconverttool.com/csv-to-qbo-converter"
        jsonLd={[softwareSchema, faqSchema]}
      />
      
      <header className="layout-standard-hero" style={{ background: 'linear-gradient(135deg, #059669 0%, #064e3b 100%)' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2rem', color: '#ffffff' }}>
            <Table size={16} /> 100% Offline
          </div>
          <h1>Convert CSV Spreadsheets to <span>QuickBooks (.QBO)</span></h1>
          <p>Easily translate custom bank transaction exports or personal spreadsheets into QuickBooks Web Connect files for seamless reconciliation.</p>
        </div>
      </header>

      <section className="layout-tool-container">
        <div className="container">
          <CsvToQboTool /> 
        </div>
      </section>

      {/* BENENFITS */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '700px', margin: '0 auto' }}>
            <span className="section-label">Automate Transaction Mapping</span>
            <h2>Why Convert CSV to QBO?</h2>
            <p>Direct CSV imports in QuickBooks often fail because columns are misaligned or date formats mismatch. QBO files import cleanly with zero manual intervention.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <CheckCircle size={32} color="#059669" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Visual Column Mapping</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>Identify your spreadsheet headers visually. Set which column represents the date, payee name, and amount values, and we do the rest.</p>
            </div>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <ShieldCheck size={32} color="#059669" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Guaranteed Browser Privacy</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>Your CSV transactions stay safe in your browser memory. We do not upload any data, preserving total financial privacy.</p>
            </div>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <Lock size={32} color="#059669" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Auto-Matched Columns</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>Skip reversed amount signs, broken date schemas, and mapping prompts inside QuickBooks. The QBO format is instantly recognized.</p>
            </div>
          </div>

          {/* STEP BY STEP WORKFLOW */}
          <div style={{ marginTop: '5rem', marginBottom: '5rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>How to Convert CSV to QBO in 4 Steps</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
              <div style={{ position: 'relative', background: '#ffffff', padding: '2.5rem 1.5rem 2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
                <div style={{ position: 'absolute', top: '-20px', left: '20px', width: '40px', height: '40px', borderRadius: '50%', background: '#059669', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 4px 10px rgba(5,150,105,0.3)' }}>1</div>
                <h3 style={{ fontSize: '1.1rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Upload CSV</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>Drag and drop your spreadsheet (.csv) or browse files above.</p>
              </div>
              <div style={{ position: 'relative', background: '#ffffff', padding: '2.5rem 1.5rem 2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
                <div style={{ position: 'absolute', top: '-20px', left: '20px', width: '40px', height: '40px', borderRadius: '50%', background: '#059669', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 4px 10px rgba(5,150,105,0.3)' }}>2</div>
                <h3 style={{ fontSize: '1.1rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Map Columns</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>Select Date, Payee, and Amount column mapping dropdowns.</p>
              </div>
              <div style={{ position: 'relative', background: '#ffffff', padding: '2.5rem 1.5rem 2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
                <div style={{ position: 'absolute', top: '-20px', left: '20px', width: '40px', height: '40px', borderRadius: '50%', background: '#059669', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 4px 10px rgba(5,150,105,0.3)' }}>3</div>
                <h3 style={{ fontSize: '1.1rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Generate QBO</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>Click download. Our parser compiles transaction data into a valid .qbo file.</p>
              </div>
              <div style={{ position: 'relative', background: '#ffffff', padding: '2.5rem 1.5rem 2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
                <div style={{ position: 'absolute', top: '-20px', left: '20px', width: '40px', height: '40px', borderRadius: '50%', background: '#059669', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 4px 10px rgba(5,150,105,0.3)' }}>4</div>
                <h3 style={{ fontSize: '1.1rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Done</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>Import the file into QuickBooks via the Web Connect bank feeds module.</p>
              </div>
            </div>
          </div>

          {/* VERSION COMPATIBILITY */}
          <div style={{ marginTop: '5rem', marginBottom: '5rem', background: '#f8fafc', padding: '3rem 2rem', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>QuickBooks Version Compatibility</h2>
            <p style={{ textAlign: 'center', color: '#64748b', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: '1.6' }}>
              We compile Web Connect structures matching modern bank standards, compatible with the following QuickBooks variants:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
              <div style={{ background: '#ffffff', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={18} color="#059669" />
                <span style={{ fontWeight: '600', color: '#0f172a' }}>QuickBooks Online</span>
              </div>
              <div style={{ background: '#ffffff', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={18} color="#059669" />
                <span style={{ fontWeight: '600', color: '#0f172a' }}>QuickBooks Desktop Pro</span>
              </div>
              <div style={{ background: '#ffffff', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={18} color="#059669" />
                <span style={{ fontWeight: '600', color: '#0f172a' }}>QuickBooks Premier</span>
              </div>
              <div style={{ background: '#ffffff', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={18} color="#059669" />
                <span style={{ fontWeight: '600', color: '#0f172a' }}>QuickBooks Enterprise</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <div style={{ borderTop: '1px solid #e2e8f0' }}>
        <FaqSection faqs={faqs} />
      </div>
    </>
  );
}
