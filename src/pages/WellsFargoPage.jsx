import React, { useState } from 'react';
import SeoHead from '../components/SeoHead';
import ConverterTool from '../components/ConverterTool';
import { ShieldCheck, ChevronDown, CheckCircle2, SplitSquareHorizontal, Layers, Lock, FileLineChart } from 'lucide-react';

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
    <div className="wf-page-wrapper">
      <SeoHead 
        title="Wells Fargo Bank Statement PDF to CSV | Free & Secure"
        description="Extract transaction data from your Wells Fargo PDFs instantly. Our local parser merges Additions and Subtractions tables into one clean spreadsheet."
        canonical="https://bankstatementconverttool.com/wells-fargo"
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
            Drop your eStatement PDF below to instantly merge dispersed Additions and Subtractions tables into a single chronological spreadsheet.
          </p>
        </div>
      </header>

      {/* OVERLAPPING CONVERTER TOOL */}
      <div className="wf-overlap-zone">
        <ConverterTool />
      </div>

      {/* APPLE-STYLE BENTO BOX FEATURES (UNIQUE DOM) */}
      <section className="bg-surface">
        <div className="wf-bento-grid">
          
          <div className="wf-bento-card wf-bento-large">
            <div className="wf-bento-icon icon-red">
              <SplitSquareHorizontal size={24} />
            </div>
            <h3>The Additions & Subtractions Dilemma</h3>
            <p>
              Unlike most financial institutions, Wells Fargo does not provide a single chronological ledger in their checking account PDFs. Instead, they separate your activity into multiple distinct tables: <strong>Deposits/Additions</strong> and <strong>Withdrawals/Subtractions</strong>. 
            </p>
            <p style={{ marginTop: '1rem' }}>
              Attempting to copy and paste these separate tables directly into Excel typically results in garbled data and merged columns (e.g., the date and description combining into one cell). Our extraction heuristic parses the native text-layer coordinates within the document, extracts the raw vectors, and merges them back into a single, functional timeline automatically.
            </p>
          </div>

          <div className="wf-bento-card">
            <div className="wf-bento-icon icon-gold">
              <Layers size={24} />
            </div>
            <h3>Check Image & Layout Parsing</h3>
            <p>Wells Fargo statements often include multi-page headers and check image scans at the footer. Generic converters fail here. Our engine halts parsing accurately before hitting non-tabular noise.</p>
          </div>

          <div className="wf-bento-card">
            <div className="wf-bento-icon icon-dark">
              <Lock size={24} />
            </div>
            <h3>Zero-Retention Security</h3>
            <p>Bookkeepers absolutely cannot upload client financials to random servers. The conversion script runs entirely within your browser's local memory to ensure absolute zero-retention privacy.</p>
          </div>

        </div>
      </section>

      {/* ASYMMETRIC CONTENT BLOCK */}
      <section className="bg-surface-alt">
        <div className="wf-asymmetric-section">
          <div className="wf-asymmetric-visual">
            <FileLineChart size={80} color="#D71E28" style={{ margin: '0 auto 1.5rem', opacity: 0.8 }}/>
            <h4 style={{ fontSize: '1.25rem', color: '#111827', marginBottom: '0.5rem' }}>QuickBooks & Xero Ready</h4>
            <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>Raw integers. No dollar signs. No comma separators.</p>
          </div>
          
          <div className="wf-asymmetric-content">
            <h2>Accounting Software Standardization</h2>
            <p>
              Importing unformatted data into QuickBooks Online (QBO) or Quicken often triggers validation errors, forcing accountants to manually clean the CSV file using tedious Find & Replace functions.
            </p>
            <p style={{ fontWeight: 'bold', color: '#111827' }}>
              Our tool automatically normalizes negative/positive valences and purges all visual currency styling during extraction. It returns raw float decimals (e.g., 5000.00) that import cleanly on the first try.
            </p>
          </div>
        </div>
      </section>

      {/* FLOATING FAQ ACCORDION */}
      <section className="bg-surface" style={{ paddingBottom: '4rem' }}>
        <div className="wf-faq-container">
          <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '3rem', color: '#111827', fontWeight: '800' }}>Extraction FAQ</h2>
          
          {[
            {
              q: "Will this handle Wells Fargo business accounts?",
              a: "Yes. Wells Fargo business checking statements follow a similar tabular structure to personal accounts, which our engine detects and parses accurately."
            },
            {
              q: "Does Wells Fargo let you download CSVs directly?",
              a: "Yes, via the 'Account Activity' tool. However, it is heavily restricted to recent transactions. If you are doing catch-up bookkeeping for a prior tax year, pulling from legacy PDFs is required."
            },
            {
              q: "What if there are check scans on the PDF?",
              a: "Our parser detects the end of the transaction ledger and halts. It completely ignores the check image layers at the bottom of the statement, keeping your CSV clean."
            }
          ].map((faq, i) => (
            <div key={i} className={`wf-faq-card ${openFaq === i ? 'open' : ''}`}>
              <button className="wf-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {faq.q}
                <ChevronDown size={20} style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: '#9CA3AF' }} />
              </button>
              <div className="wf-faq-a">
                {faq.a}
              </div>
            </div>
          ))}
          
        </div>
      </section>

    </div>
  );
}
