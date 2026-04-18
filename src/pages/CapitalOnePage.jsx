import React from 'react';
import SeoHead from '../components/SeoHead';
import ConverterTool from '../components/ConverterTool';
import { User, Briefcase, Zap, CheckCircle } from 'lucide-react';

export default function CapitalOnePage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Capital One Extract Engine",
    "applicationCategory": "BusinessApplication",
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
        title="Extract Capital One PDF Statements to CSV | Secure Parsing"
        description="Convert Capital One 360 Personal and Spark Business PDF statements into CSV format natively in your browser. Accurate extraction for Quicken and QBO."
        canonical="https://www.bankstatementconverttool.com/capital-one"
        jsonLd={[schema]}
      />

      {/* SEGMENTED USE-CASE HERO */}
      <header className="cap1-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="cap1-hero-badge">
            <CheckCircle size={16} /> Verified Format Standard
          </div>
          <h1>Convert <span>Capital One</span> PDFs to CSV</h1>
          <p>
            An offline, zero-retention extraction protocol engineered specifically <br/>
            for Capital One 360 Personal and Spark Business statements.
          </p>
        </div>
      </header>

      {/* OVERLAPPING CONVERTER TOOL */}
      <div className="cap1-overlap-zone" id="converter">
        <ConverterTool />
      </div>

      {/* DUAL-COLUMN SEGMENTED LAYOUT */}
      <section className="section section-alt">
        <div className="container">
          <div className="cap1-segmented-grid">
            
            <div className="cap1-segment">
              <div className="cap1-segment-header">
                <User size={32} />
                <h2>360 Personal Accounts</h2>
              </div>
              <p>
                Capital One 360 Checking and Savings accounts use a streamlined table layout. However, they frequently span dozens of pages with repeating header rows.
              </p>
              <p style={{ fontWeight: 'bold', color: 'var(--brand-600)', marginTop: '1rem' }}>
                Our tool automatically filters repeating header columns and paginated noise.
              </p>
            </div>

            <div className="cap1-segment">
              <div className="cap1-segment-header">
                <Briefcase size={32} />
                <h2>Spark Business Cards</h2>
              </div>
              <p>
                Spark corporate accounts group transactions into separate tables organized by the employee card number. This makes standard conversion impossible.
              </p>
              <p style={{ fontWeight: 'bold', color: 'var(--brand-600)', marginTop: '1rem' }}>
                It resolves multi-card corporate ledgers into a single, comprehensive CSV output.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* THE PIPELINE STEPPER */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Pipeline</span>
            <h2>The Local Extraction Protocol</h2>
            <p>How our zero-retention engine creates accurate spreadsheet data.</p>
          </div>
          
          <div className="steps-grid" style={{ marginTop: '4rem' }}>
            <div className="step-card">
              <div className="step-number">01</div>
              <h3>Regex Anchoring</h3>
              <p>The parser scans the left-most vector axis, dynamically searching for specific Date regex strings to determine where the transaction array begins.</p>
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <h3>Coordinate Mapping</h3>
              <p>Using the bounding-box API, the tool calculates the precise <code>y-axis</code> baseline of each date to prevent cross-column merging.</p>
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <h3>Currency Normalization</h3>
              <p>We strip trailing CR/DR markers, remove comma separators, and resolve negative sign valences to return raw algebraic float integers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Parse Your Capital One Statements?</h2>
          <p>Join thousands of users who trust our private, instant Capital One conversion engine.</p>
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

