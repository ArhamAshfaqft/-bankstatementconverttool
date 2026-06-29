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
        title="PDF to QBO Converter - Convert Bank Statement to QuickBooks Free"
        description="Convert your PDF bank statements into QuickBooks Web Connect (.QBO) files locally. Free online converter to bypass CSV mapping errors offline in your browser."
        canonical="https://bankstatementconverttool.com/quickbooks-qbo-converter"
        jsonLd={[schema, faqSchema]}
      />
      
      <header className="layout-standard-hero" style={{ background: 'linear-gradient(135deg, #10b981 0%, #064E3B 100%)' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2rem', color: '#ffffff' }}>
            <BookOpen size={16} /> 100% Free & Local
          </div>
          <h1>Convert Bank Statement PDF to <span>QuickBooks (.QBO)</span></h1>
          <p>Easily convert bank statement PDFs to QBO Web Connect format. Process your transactions securely offline in your web browser.</p>
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

          {/* STEP BY STEP WORKFLOW */}
          <div style={{ marginTop: '5rem', marginBottom: '5rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>How to Convert PDF to QBO in 4 Steps</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
              <div style={{ position: 'relative', background: '#ffffff', padding: '2.5rem 1.5rem 2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
                <div style={{ position: 'absolute', top: '-20px', left: '20px', width: '40px', height: '40px', borderRadius: '50%', background: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 4px 10px rgba(16,185,129,0.3)' }}>1</div>
                <h3 style={{ fontSize: '1.1rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Upload Statement</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>Drag and drop your PDF bank statement into our converter zone above.</p>
              </div>
              <div style={{ position: 'relative', background: '#ffffff', padding: '2.5rem 1.5rem 2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
                <div style={{ position: 'absolute', top: '-20px', left: '20px', width: '40px', height: '40px', borderRadius: '50%', background: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 4px 10px rgba(16,185,129,0.3)' }}>2</div>
                <h3 style={{ fontSize: '1.1rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Verify & Edit</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>Inspect transactions in the preview grid. Edit cells or exclude specific rows as needed.</p>
              </div>
              <div style={{ position: 'relative', background: '#ffffff', padding: '2.5rem 1.5rem 2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
                <div style={{ position: 'absolute', top: '-20px', left: '20px', width: '40px', height: '40px', borderRadius: '50%', background: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 4px 10px rgba(16,185,129,0.3)' }}>3</div>
                <h3 style={{ fontSize: '1.1rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Export QBO</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>Select QuickBooks (.QBO) format and click Export. The file is created instantly offline.</p>
              </div>
              <div style={{ position: 'relative', background: '#ffffff', padding: '2.5rem 1.5rem 2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
                <div style={{ position: 'absolute', top: '-20px', left: '20px', width: '40px', height: '40px', borderRadius: '50%', background: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 4px 10px rgba(16,185,129,0.3)' }}>4</div>
                <h3 style={{ fontSize: '1.1rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Import into QB</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>In QuickBooks, go to Bank Feeds {"->"} Import Web Connect File and choose your new .qbo file.</p>
              </div>
            </div>
          </div>

          {/* VERSION COMPATIBILITY */}
          <div style={{ marginTop: '5rem', marginBottom: '5rem', background: '#f8fafc', padding: '3rem 2rem', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>QuickBooks Compatibility Matrix</h2>
            <p style={{ textAlign: 'center', color: '#64748b', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: '1.6' }}>
              Our generated Web Connect files use standard Intuit OFX definitions, ensuring seamless bank feed compatibility across all active QuickBooks editions.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
              <div style={{ background: '#ffffff', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={18} color="#10b981" />
                <span style={{ fontWeight: '600', color: '#0f172a' }}>QuickBooks Online</span>
              </div>
              <div style={{ background: '#ffffff', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={18} color="#10b981" />
                <span style={{ fontWeight: '600', color: '#0f172a' }}>QuickBooks Desktop Pro</span>
              </div>
              <div style={{ background: '#ffffff', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={18} color="#10b981" />
                <span style={{ fontWeight: '600', color: '#0f172a' }}>QuickBooks Premier</span>
              </div>
              <div style={{ background: '#ffffff', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={18} color="#10b981" />
                <span style={{ fontWeight: '600', color: '#0f172a' }}>QuickBooks Enterprise</span>
              </div>
              <div style={{ background: '#ffffff', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={18} color="#10b981" />
                <span style={{ fontWeight: '600', color: '#0f172a' }}>QuickBooks Mac Edition</span>
              </div>
              <div style={{ background: '#ffffff', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={18} color="#10b981" />
                <span style={{ fontWeight: '600', color: '#0f172a' }}>QuickBooks Self-Employed</span>
              </div>
            </div>
          </div>

          {/* COMPARISON TABLE */}
          <div style={{ marginTop: '5rem', marginBottom: '5rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>How QBO Compares to Other Methods</h2>
            <p style={{ textAlign: 'center', color: '#64748b', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: '1.6' }}>
              Why accounting professionals convert PDF bank statements directly to .QBO instead of CSV sheets.
            </p>
            
            <div className="table-container" style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
              <table style={{ margin: 0, width: '100%' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ padding: '1.25rem' }}>Feature / Benefit</th>
                    <th style={{ padding: '1.25rem', textAlign: 'center', color: '#10b981' }}>Direct QBO Import</th>
                    <th style={{ padding: '1.25rem', textAlign: 'center' }}>Manual CSV Mapping</th>
                    <th style={{ padding: '1.25rem', textAlign: 'center' }}>Manual Data Entry</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '1.25rem', fontWeight: '600' }}>Import Speed</td>
                    <td style={{ padding: '1.25rem', textAlign: 'center', color: '#10b981', fontWeight: 'bold' }}>Instant (&lt; 2s)</td>
                    <td style={{ padding: '1.25rem', textAlign: 'center' }}>Slow (needs mapping)</td>
                    <td style={{ padding: '1.25rem', textAlign: 'center' }}>Very Slow (hours)</td>
                  </tr>
                  <tr style={{ background: '#fcfdfe' }}>
                    <td style={{ padding: '1.25rem', fontWeight: '600' }}>Reconciliation Accuracy</td>
                    <td style={{ padding: '1.25rem', textAlign: 'center', color: '#10b981', fontWeight: 'bold' }}>100% (Strict Schema)</td>
                    <td style={{ padding: '1.25rem', textAlign: 'center' }}>Risk of reversed signs</td>
                    <td style={{ padding: '1.25rem', textAlign: 'center' }}>High human error risk</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '1.25rem', fontWeight: '600' }}>Direct Bank Feed Match</td>
                    <td style={{ padding: '1.25rem', textAlign: 'center', color: '#10b981', fontWeight: 'bold' }}>Yes (Recognized as Bank)</td>
                    <td style={{ padding: '1.25rem', textAlign: 'center' }}>No (Treated as Upload)</td>
                    <td style={{ padding: '1.25rem', textAlign: 'center' }}>No</td>
                  </tr>
                  <tr style={{ background: '#fcfdfe' }}>
                    <td style={{ padding: '1.25rem', fontWeight: '600' }}>Duplicate Detection</td>
                    <td style={{ padding: '1.25rem', textAlign: 'center', color: '#10b981', fontWeight: 'bold' }}>Automatic (using FITID)</td>
                    <td style={{ padding: '1.25rem', textAlign: 'center' }}>Manual review needed</td>
                    <td style={{ padding: '1.25rem', textAlign: 'center' }}>None</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="section" style={{ borderTop: '1px solid #e2e8f0' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2.5rem' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>How do I download bank statements into QuickBooks?</h4>
              <p style={{ color: '#475569', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>Log in to your online banking portal, go to statement documents or activity history, and choose the download option for Web Connect (.QBO). If your bank only provides PDFs, you can use our local PDF to QBO converter to prepare the file for direct import.</p>
            </div>
            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>Can I open or edit a .QBO file directly in Excel?</h4>
              <p style={{ color: '#475569', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>No, Excel cannot natively parse the SGML structure of QuickBooks QBO Web Connect files. To open QBO transaction data in Excel, use our dedicated QBO to CSV converter to translate the logs back into clean spreadsheets.</p>
            </div>
            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>Is my QuickBooks statement data uploaded to online databases?</h4>
              <p style={{ color: '#475569', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>No, all conversion and parsing execute locally inside your browser's memory using HTML5 and JavaScript. Your financial files never touch any external servers, satisfying strict client privacy requirements.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
