import React from 'react';
import SeoHead from '../components/SeoHead';
import ConverterTool from '../components/ConverterTool';
import { ArrowRight, ShieldCheck, Zap, History, FileCheck } from 'lucide-react';

export default function ChasePage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Chase Statement Extraction Engine",
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
        title="Convert Chase Bank Statement PDF to CSV | Professional Precision"
        description="A robust local browser engine optimized for Chase Personal and Business statements. High-fidelity extraction that cleans messy merchant strings for QuickBooks."
        canonical="https://www.bankstatementconverttool.com/chase"
        jsonLd={[schema]}
      />

      {/* PREMIUM CHASE HERO */}
      <header className="chase-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="chase-hero-badge">
            <ShieldCheck size={16} /> Verified Chase Logic Engine
          </div>
          <h1>Extract <span>Chase Statements</span> to CSV</h1>
          <p>
            Process Chase Personal and Spark Business eStatements into clean data streams. <br/>
            A secure, zero-upload tool for professional accountants and bookkeepers.
          </p>
        </div>
      </header>

      {/* OVERLAPPING CONVERTER TOOL */}
      <div className="chase-overlap-zone" id="converter">
        <ConverterTool />
      </div>

      <div className="chase-content-container">
        <h2 className="chase-section-title">The Merchant Clarity Tunnel</h2>
        
        {/* UNIQUE DOM 1: Comparison Tunnel */}
        <div className="chase-tunnel">
          <div className="chase-tunnel-row">
            <div>
              <div className="chase-tunnel-label">Raw Chase Description</div>
              <div className="chase-raw-side">AMZN MKTP US*MK8TB21V0 AMZN.COM/BILL</div>
            </div>
            <div className="chase-arrow-side">
              <ArrowRight size={24} />
            </div>
            <div>
              <div className="chase-tunnel-label">Clean Accountant View</div>
              <div className="chase-clean-side">Amazon Marketplace</div>
            </div>
          </div>

          <div className="chase-tunnel-row">
            <div>
              <div className="chase-tunnel-label">Raw Chase Description</div>
              <div className="chase-raw-side">STARBUCKS STORE 01234 SEATTLE WA</div>
            </div>
            <div className="chase-arrow-side">
              <ArrowRight size={24} />
            </div>
            <div>
              <div className="chase-tunnel-label">Clean Accountant View</div>
              <div className="chase-clean-side">Starbucks</div>
            </div>
          </div>
        </div>

        {/* UNIQUE DOM 2: Expertise Grid */}
        <div className="chase-expertise-grid">
          <div className="chase-expert-card">
            <h3><Zap size={24} /> Row-Level Heuristics</h3>
            <p>
              Chase statements often condense the merchant description and the internal bank transaction code into a single visual block. Our engine uses row-level heuristics to isolate the merchant name and purge the transaction metadata automatically.
            </p>
          </div>

          <div className="chase-expert-card">
            <h3><History size={24} /> Dual-Date Resolution</h3>
            <p>
              Chase PDFs display both a <strong>Transaction Date</strong> and a <strong>Posting Date</strong>. For accurate tax-year reconciliation, it is critical to use the Transaction Date. Our parser targets the correct vector coordinate for Transaction Dates.
            </p>
          </div>

          <div className="chase-expert-card">
            <h3><FileCheck size={24} /> Business Account Ledgering</h3>
            <p>
              Chase Business and Commercial accounts use a wider table format with additional columns for internal tracking. We have mapped the specific coordinate grids for Chase Business checking to ensure column integrity every time.
            </p>
          </div>

          <div className="chase-expert-card">
            <h3><ShieldCheck size={24} /> 100% Local Privacy</h3>
            <p>
              As a professional handling sensitive financial documents, you cannot risk cloud-based OCR services. This tool downloads the entire extraction logic to your browser's RAM. Your Chase PDFs are processed locally on your machine.
            </p>
          </div>
        </div>

      </div>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Parse Your Chase Statements?</h2>
          <p>Join thousands of bookkeepers who have ditched manual data entry for Chase accounts.</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={() => document.getElementById('converter').scrollIntoView({ behavior: 'smooth' })}>
              Start Fast Extraction <Zap size={16} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

