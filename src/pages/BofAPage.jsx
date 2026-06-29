import React from 'react';
import SeoHead from '../components/SeoHead';
import ConverterTool from '../components/ConverterTool';
import { ChevronDown, Briefcase, FileSearch, ShieldAlert, CheckCircle, Zap } from 'lucide-react';

export default function BofAPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Bank of America Data Extraction Engine",
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
        title="Bank of America Statement PDF to CSV | Professional Audit Utility"
        description="A high-fidelity local browser engine optimized for Bank of America checking and savings statements. Secure, zero-retention extraction for multi-year accounting audits."
        canonical="https://bankstatementconverttool.com/bank-of-america"
        jsonLd={[
          schema,
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How do I download Bank of America statements as a PDF?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Log in to Bank of America online banking, select the checking or savings account you want, go to 'Statements & Documents' in the navigation menu, select the billing month, and download the PDF statement to your local drive."
                }
              },
              {
                "@type": "Question",
                "name": "Why do Bank of America statements split transactions across page breaks?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Bank of America statements frequently break descriptions or details across page breaks. Our parser runs horizontal and vertical space evaluation to identify and re-stitch orphaned text rows, preventing data offsets."
                }
              },
              {
                "@type": "Question",
                "name": "Does this tool support BofA commercial and corporate cards?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, we fully support all BofA Checking/Savings accounts, BofA Business checking accounts, and corporate cards, aligning different columns automatically."
                }
              },
              {
                "@type": "Question",
                "name": "Is my Bank of America financial transaction data secure?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, 100%. Our tool is built with a zero-trust model. All conversion and extraction happen locally inside your web browser's RAM; no data is ever uploaded or cached on a server."
                }
              }
            ]
          }
        ]}
      />

      {/* PREMIUM BofA HERO */}
      <header className="layout-standard-hero" style={{ background: 'linear-gradient(135deg, #012169 0%, #004a99 100%)' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2rem', color: '#ffffff' }}>
            <CheckCircle size={16} /> Audit-Ready Data Precision
          </div>
          <h1>Convert <span>Bank of America</span> to CSV</h1>
          <p>Securely extract deep historical transaction data from BofA eStatements. An offline tool designed for the rigorous requirements of professional tax preparation.</p>
        </div>
      </header>

      <section className="layout-tool-container">
        <div className="container">
          <ConverterTool />
        </div>
      </section>

      <div className="bofa-audit-container">
        <h2 className="bofa-section-title">The Auditor's Extraction Guide</h2>
        
        {/* UNIQUE DOM 1: FAQ Accordion Style */}
        <div className="faq-list" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="faq-item open">
            <div className="faq-question" style={{ cursor: 'default' }}>
              Resolving "Page Continuation" Orphans
            </div>
            <div className="faq-answer" style={{ maxHeight: 'none', opacity: 1, paddingBottom: '1.5rem' }}>
              <p>Bank of America statements frequently break a single transaction across two physical pages. Our parser <strong>re-stitches orphaned description strings</strong> by evaluating the vertical padding between text blocks, ensuring your CSV row integrity remains 100% accurate.</p>
            </div>
          </div>

          <div className="faq-item open">
            <div className="faq-question" style={{ cursor: 'default' }}>
              Merchant Category Extraction
            </div>
            <div className="faq-answer" style={{ maxHeight: 'none', opacity: 1, paddingBottom: '1.5rem' }}>
              <p>BofA statements often include a secondary line for merchant category codes. Our engine allows you to extract the raw merchant name while <strong>discarding the internal Bank of America metadata</strong>, yielding a cleaner ledger with zero manual cleanup.</p>
            </div>
          </div>

          <div className="faq-item open">
            <div className="faq-question" style={{ cursor: 'default' }}>
              Bypassing Image-Based Data Layers
            </div>
            <div className="faq-answer" style={{ maxHeight: 'none', opacity: 1, paddingBottom: '1.5rem' }}>
              <p>Modern BofA eStatements use a hybrid vector-and-image layout. By reading the <strong>underlying coordinate map</strong> of the document rather than doing simple OCR, our tool captures data points that are visually "locked" on the statement canvas.</p>
            </div>
          </div>
        </div>

        {/* UNIQUE DOM 2: Audit Checklist Card */}
        <div className="bofa-checklist-card">
          <div className="bofa-checklist-text">
            <h3>BofA Audit Preparedness</h3>
            <ul>
              <li><CheckCircle size={18} /> Resolves Multi-Year Catchup</li>
              <li><CheckCircle size={18} /> Strips All Currency Symbols</li>
              <li><CheckCircle size={18} /> 100% Browser-Local RAM Processing</li>
              <li><CheckCircle size={18} /> Algebraically Parsed Valences</li>
              <li><CheckCircle size={18} /> Zero-Trace Browser History</li>
              <li><CheckCircle size={18} /> Accurate for Corporate Ledgers</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container">
          <h2>Trust Your Forensic Accounting to Experts</h2>
          <p>Join thousands of auditors who trust our private Bank of America conversion engine.</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={() => document.getElementById('converter').scrollIntoView({ behavior: 'smooth' })}>
              Start BofA Extraction <Zap size={16} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

