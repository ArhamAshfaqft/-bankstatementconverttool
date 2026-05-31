import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, Lock, MonitorSmartphone, ShieldCheck, ArrowRight, FileText, FileSpreadsheet } from 'lucide-react';
import ConverterTool from '../components/ConverterTool';
import SeoHead from '../components/SeoHead';

export default function QboPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "QuickBooks QBO Statement Converter",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "WebBrowser",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I download bank statements into QuickBooks?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Log in to your online banking portal, go to statement documents or activity history, and choose the download option for Web Connect (.QBO). If your bank only provides PDFs, you can use our local PDF to QBO converter to prepare the file for direct import."
        }
      },
      {
        "@type": "Question",
        "name": "Can I open or edit a .QBO file directly in Excel?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, Excel cannot natively parse the SGML structure of QuickBooks QBO Web Connect files. To open QBO transaction data in Excel, use our dedicated QBO to CSV converter to translate the logs back into clean spreadsheets."
        }
      },
      {
        "@type": "Question",
        "name": "Is my QuickBooks statement data uploaded to online databases?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, all conversion and parsing execute locally inside your browser's memory using HTML5 and JavaScript. Your financial files never touch any external servers, satisfying strict client privacy requirements."
        }
      }
    ]
  };

  return (
    <>
      <SeoHead 
        title="Convert Bank Statement PDF to QuickBooks (QBO) - 100% Free & Local"
        description="Easily convert your PDF bank statements into QuickBooks Web Connect (.QBO) files offline in your browser. Bypass annoying CSV mapping errors permanently."
        canonical="https://www.bankstatementconverttool.com/quickbooks-qbo-converter"
        jsonLd={[schema, faqSchema]}
      />
      
      <header className="layout-standard-hero" style={{ background: 'linear-gradient(135deg, #10b981 0%, #064E3B 100%)' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2rem', color: '#ffffff' }}>
            <BookOpen size={16} /> Accountant Favorite
          </div>
          <h1>Convert Bank Statements to <span>QuickBooks (.QBO)</span></h1>
          <p>Stop wasting hours mapping raw CSV files. Automatically convert your PDF bank statements directly into native QuickBooks Web Connect files.</p>
        </div>
      </header>

      <section className="layout-tool-container">
        <div className="container">
          
          {/* INTENT CROSS-ROUTING BANNERS */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '1.25rem', 
            marginBottom: '2.5rem',
            maxWidth: '780px',
            margin: '0 auto 2.5rem'
          }}>
            <Link to="/qbo-to-csv-converter" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              padding: '1.25rem', 
              background: '#ffffff', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0', 
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(16,185,129,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)'; }}
            >
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '10px', 
                background: '#ecfdf5', color: '#10b981', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
              }}>
                <FileText size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a', marginBottom: '0.15rem' }}>Convert QBO to CSV instead</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Translate a .qbo file back to spreadsheets</div>
              </div>
              <ArrowRight size={16} style={{ marginLeft: 'auto', color: '#10b981' }} />
            </Link>

            <Link to="/csv-to-qbo-converter" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              padding: '1.25rem', 
              background: '#ffffff', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0', 
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(16,185,129,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)'; }}
            >
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '10px', 
                background: '#ecfdf5', color: '#10b981', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
              }}>
                <FileSpreadsheet size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a', marginBottom: '0.15rem' }}>Convert CSV to QBO instead</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Map spreadsheet rows directly into QBO</div>
              </div>
              <ArrowRight size={16} style={{ marginLeft: 'auto', color: '#10b981' }} />
            </Link>
          </div>

          <ConverterTool /> 
        </div>
      </section>

      {/* WHY QBO IS BETTER */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '700px', margin: '0 auto' }}>
            <span className="section-label">Why using QBO is superior</span>
            <h2>Bypass QuickBooks Import Errors</h2>
            <p>Importing raw CSVs into QuickBooks often results in reversed signs, missed dates, and broken column mapping. Native .QBO files work instantly.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <CheckCircle size={32} color="#10b981" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Auto-Mapped Columns</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>QBO files have strict structures, meaning QuickBooks inherently knows which data is the date, description, and amount. No manual mapping required.</p>
            </div>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <ShieldCheck size={32} color="#10b981" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Zero-Upload Privacy</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>Like all our tools, the QBO generation happens 100% locally in your browser. Your clients' sensitive financial data is never intercepted or uploaded.</p>
            </div>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <Lock size={32} color="#10b981" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Bank Agnostic</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>We generate a universal Intuit QBO wrap around your statement data, meaning you can import transactions from small community credit unions just like major banks.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
