import React, { useState } from 'react';
import SeoHead from '../components/SeoHead';
import ConverterTool from '../components/ConverterTool';
import { ShieldCheck, ChevronDown, CheckCircle2, SplitSquareHorizontal, Layers, Lock, FileLineChart, ArrowRight } from 'lucide-react';

export default function WellsFargoPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Wells Fargo PDF Export Engine",
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
        title="Wells Fargo Bank Statement PDF to CSV | Free & Secure"
        description="Extract transaction data from your Wells Fargo PDFs instantly. Our local parser merges Additions and Subtractions tables into one clean spreadsheet."
        canonical="https://www.bankstatementconverttool.com/wells-fargo"
        jsonLd={[schema]}
      />

      {/* PREMIUM DARK HERO */}
      <header className="wf-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="wf-hero-badge">
            <ShieldCheck size={16} /> Secure Local Environment
          </div>
          <h1>Convert <span>Wells Fargo</span> to CSV</h1>
          <p>
            Drop your eStatement PDF below to instantly merge dispersed Additions and Subtractions tables <br/>
            into a single chronological spreadsheet without any server processing.
          </p>
        </div>
      </header>

      {/* OVERLAPPING CONVERTER TOOL */}
      <div className="wf-overlap-zone" id="converter">
        <ConverterTool />
      </div>

      {/* APPLE-STYLE BENTO BOX FEATURES */}
      <section className="section section-alt">
        <div className="container">
          <div className="wf-bento-grid">
            
            <div className="wf-bento-card wf-bento-large">
              <div className="wf-bento-icon icon-red">
                <SplitSquareHorizontal size={24} />
              </div>
              <h3>The Additions & Subtractions Dilemma</h3>
              <p>
                Unlike most financial institutions, Wells Fargo does not provide a single chronological ledger. Instead, they separate your activity into distinct tables: <strong>Deposits/Additions</strong> and <strong>Withdrawals/Subtractions</strong>. 
              </p>
              <p style={{ marginTop: '1rem' }}>
                Our extraction heuristic parses the native text-layer coordinates, extracts the raw vectors, and merges them back into a single, functional timeline automatically.
              </p>
            </div>

            <div className="wf-bento-card">
              <div className="wf-bento-icon icon-gold">
                <Layers size={24} />
              </div>
              <h3>Check Image Parsing</h3>
              <p>Wells Fargo statements often include multi-page headers and check image scans. Our engine detects the end of the transaction ledger and halts precisely.</p>
            </div>

            <div className="wf-bento-card">
              <div className="wf-bento-icon icon-dark">
                <Lock size={24} />
              </div>
              <h3>Zero-Retention Security</h3>
              <p>Bookkeepers absolutely cannot upload client financials to random servers. The conversion script runs entirely within your browser's local memory.</p>
            </div>

          </div>
        </div>
      </section>

      {/* ASYMMETRIC CONTENT BLOCK */}
      <section className="section bg-white">
        <div className="container">
          <div className="wf-asymmetric-section">
            <div className="wf-asymmetric-visual">
              <FileLineChart size={80} color="#D71E28" style={{ margin: '0 auto 1.5rem', opacity: 0.8 }}/>
              <h4 style={{ fontSize: '1.25rem', color: '#111827', marginBottom: '0.5rem' }}>Full Ledger Reconciliation</h4>
              <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>Raw integers. No dollar signs. No comma separators.</p>
            </div>
            
            <div className="wf-asymmetric-content">
              <h2>Accounting Software Alignment</h2>
              <p>
                Importing unformatted data into QuickBooks often triggers validation errors. We provide normalized negative/positive valences and purges all visual currency styling during extraction.
              </p>
              <p style={{ fontWeight: 'bold', color: '#111827', marginTop: '1rem' }}>
                Returns raw float decimals (e.g., 5000.00) that import cleanly on the first try.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Specs</span>
            <h2>Extraction FAQ</h2>
            <p>Everything you need to know about Wells Fargo PDF parsing.</p>
          </div>

          <div className="faq-list">
            {[
              {
                q: "Will this handle Wells Fargo business accounts?",
                a: "Yes. Wells Fargo business checking statements follow a similar tabular structure to personal accounts, which our engine detects and parses accurately."
              },
              {
                q: "Does Wells Fargo let you download CSVs directly?",
                a: "Yes, via the 'Account Activity' tool. However, it is heavily restricted to recent transactions. Legacy PDFs are required for tax year reconciliation."
              },
              {
                q: "What if there are check scans on the PDF?",
                a: "Our parser detects the end of the transaction ledger and halts. It completely ignores the check image layers at the bottom of the statement, keeping your CSV clean."
              }
            ].map((faq, i) => (
              <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}
                  <ChevronDown size={18} className="faq-chevron" />
                </button>
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Parse Your Wells Fargo Statements?</h2>
          <p>The private, browser-based alternative for professional accountants handling Wells Fargo accounts.</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={() => document.getElementById('converter').scrollIntoView({ behavior: 'smooth' })}>
              Start Fast Extraction <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

