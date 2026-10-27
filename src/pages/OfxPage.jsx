import React from 'react';
import { FileCode, CheckCircle, Lock, ShieldCheck } from 'lucide-react';
import ConverterTool from '../components/ConverterTool';
import SeoHead from '../components/SeoHead';

export default function OfxPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PDF to OFX Statement Converter",
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
        "name": "What is an OFX file?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Open Financial Exchange (.ofx) is an open standard XML/SGML format used by banks and financial software (like Quicken, Xero, and MS Money) to exchange transaction data securely."
        }
      },
      {
        "@type": "Question",
        "name": "Are my statements safe during local OFX parsing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, 100%. Our tool executes entirely within your browser window using client-side JavaScript. No PDF bank statements or transaction rows are uploaded to external databases."
        }
      },
      {
        "@type": "Question",
        "name": "Which accounting programs support OFX import?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Support depends on the software version and the financial institution. Confirm that your intended application accepts OFX imports and the bank/account identifiers in the file."
        }
      }
    ]
  };

  return (
    <>
      <SeoHead 
        title="PDF to OFX Converter | Bank Statement Transactions"
        description="Extract transactions from a text-based PDF and export OFX locally. Review rows and supply bank/account identifiers; import compatibility varies by software."
        canonical="https://bankstatementconverttool.com/ofx-converter"
        jsonLd={[softwareSchema, faqSchema]}
      />
      
      {/* HERO SECTION */}
      <header className="layout-standard-hero" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0c4a6e 100%)' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2rem', color: '#ffffff' }}>
            <FileCode size={16} /> Local OFX Export
          </div>
          <h1>Convert Bank Statements to <span>OFX</span></h1>
          <p>Extract transactions from a text-based PDF, review the table, then create an OFX file with your bank and account identifiers. Import support depends on your finance software.</p>
        </div>
      </header>

      <section className="layout-tool-container">
        <div className="container">
          <ConverterTool /> 
        </div>
      </section>

      {/* WHY OFX IS BETTER */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '700px', margin: '0 auto' }}>
            <span className="section-label">Before you export</span>
            <h2>Check the Rows and the Destination</h2>
            <p>OFX stores transaction fields in a structured file. It cannot correct a misread PDF row, and an importer may reject unsupported institution details.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <CheckCircle size={32} color="#0284c7" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Auto-Mapped Columns</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>OFX records dates, descriptions, and amounts as named fields. Check those values in the preview before exporting.</p>
            </div>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <ShieldCheck size={32} color="#0284c7" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Zero-Upload Privacy</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>Like all our tools, the OFX generation happens 100% locally in your browser. Your sensitive financial data is never intercepted or uploaded to a cloud server.</p>
            </div>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <Lock size={32} color="#0284c7" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Bank Details Required</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>The export asks for institution and account identifiers. Use the correct details, and confirm your target software accepts the file.</p>
            </div>
          </div>

          {/* STEP BY STEP WORKFLOW */}
          <div style={{ marginTop: '5rem', marginBottom: '5rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>How to Convert PDF to OFX in 4 Steps</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
              <div style={{ position: 'relative', background: '#ffffff', padding: '2.5rem 1.5rem 2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
                <div style={{ position: 'absolute', top: '-20px', left: '20px', width: '40px', height: '40px', borderRadius: '50%', background: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 4px 10px rgba(2,132,199,0.3)' }}>1</div>
                <h3 style={{ fontSize: '1.1rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Select PDF</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>Drag and drop your bank statement PDF into the browser zone above.</p>
              </div>
              <div style={{ position: 'relative', background: '#ffffff', padding: '2.5rem 1.5rem 2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
                <div style={{ position: 'absolute', top: '-20px', left: '20px', width: '40px', height: '40px', borderRadius: '50%', background: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 4px 10px rgba(2,132,199,0.3)' }}>2</div>
                <h3 style={{ fontSize: '1.1rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Verify Ledger</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>Review the extracted transactions in the preview table. Exclude duplicate headers.</p>
              </div>
              <div style={{ position: 'relative', background: '#ffffff', padding: '2.5rem 1.5rem 2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
                <div style={{ position: 'absolute', top: '-20px', left: '20px', width: '40px', height: '40px', borderRadius: '50%', background: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 4px 10px rgba(2,132,199,0.3)' }}>3</div>
                <h3 style={{ fontSize: '1.1rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Convert & Export</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>Choose OFX, provide the requested bank and account details, and download the file.</p>
              </div>
              <div style={{ position: 'relative', background: '#ffffff', padding: '2.5rem 1.5rem 2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
                <div style={{ position: 'absolute', top: '-20px', left: '20px', width: '40px', height: '40px', borderRadius: '50%', background: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 4px 10px rgba(2,132,199,0.3)' }}>4</div>
                <h3 style={{ fontSize: '1.1rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Software Import</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>Try the file in your supported finance software and compare imported rows with the source PDF.</p>
              </div>
            </div>
          </div>

          {/* COMPATIBILITY SUMMARY */}
          <div style={{ marginTop: '5rem', marginBottom: '5rem', background: '#f8fafc', padding: '3rem 2rem', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Ledger & Accounting Compatibility</h2>
            <p style={{ textAlign: 'center', color: '#64748b', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: '1.6' }}>
              Check the import requirements of the software you use before choosing OFX:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
              <div style={{ background: '#ffffff', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={18} color="#0284c7" />
                <span style={{ fontWeight: '600', color: '#0f172a' }}>Check Xero import rules</span>
              </div>
              <div style={{ background: '#ffffff', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={18} color="#0284c7" />
                <span style={{ fontWeight: '600', color: '#0f172a' }}>Check Quicken version</span>
              </div>
              <div style={{ background: '#ffffff', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={18} color="#0284c7" />
                <span style={{ fontWeight: '600', color: '#0f172a' }}>Check Microsoft Money format</span>
              </div>
              <div style={{ background: '#ffffff', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={18} color="#0284c7" />
                <span style={{ fontWeight: '600', color: '#0f172a' }}>Check Sage import rules</span>
              </div>
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
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>What is an OFX file?</h4>
              <p style={{ color: '#475569', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>Open Financial Exchange (.ofx) is an open standard XML/SGML format used by banks and financial software (like Quicken, Xero, and MS Money) to exchange transaction data securely.</p>
            </div>
            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>Are my statements safe during local OFX parsing?</h4>
              <p style={{ color: '#475569', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>Yes, 100%. Our tool executes entirely within your browser window using client-side JavaScript. No PDF bank statements or transaction rows are uploaded to external databases.</p>
            </div>
            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>Which accounting programs support OFX import?</h4>
              <p style={{ color: '#475569', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>Support varies by software version and institution. Check your importer’s current requirements before relying on a generated OFX file.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
