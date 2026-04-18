import React from 'react';
import SeoHead from '../components/SeoHead';
import SplitterTool from '../components/SplitterTool';
import { ShieldCheck, Zap, Lock, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SplitPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Local PDF Splitter for Financial Documents",
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
        title="Split PDF Statements | High-Security Client-Side Extractor"
        description="Split consolidated bank statements and tax PDFs into individual files completely locally. Your financial documents never leave your browser."
        canonical="https://www.bankstatementconverttool.com/split"
        jsonLd={[schema]}
      />

      <header className="hero">
        <div className="container">
          <div className="hero-content-stacked">
            <div className="hero-badge" style={{ borderColor: 'var(--brand-200)', background: 'var(--brand-50)', color: 'var(--brand-600)' }}>
              <Lock size={14} /> 100% Client-Side Processing
            </div>
            
            <h1>
              Extract Pages from <span>Financial PDFs</span>
            </h1>
            
            <p className="hero-subtitle">
              Got a massive 150-page year-end document? Safely extract exactly the statements you need without uploading the master file to an external server.
            </p>
          </div>

          {/* OVERLAPPING TOOL */}
          <div className="hero-converter-fullwidth" id="splitter-tool">
            <SplitterTool />
          </div>
        </div>
      </header>

      {/* PAIN/SOLUTION INFO */}
      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">Enterprise Standard</span>
            <h2>Why Accountants Prefer Local Splitting</h2>
            <p>Don't risk uploading consolidated client files just to isolate three pages.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon teal"><Lock size={20} /></div>
              <h3>Zero-Upload Engine</h3>
              <p>Unlike generic cloud tools, this extractor utilizes your device's RAM via JavaScript to cut and split files. It works even if you disconnect from Wi-Fi.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon amber"><Zap size={20} /></div>
              <h3>Instantaneous</h3>
              <p>No waiting in queues or dealing with file size upload limits. Large 50MB tax documents are processed in milliseconds.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon blue"><Database size={20} /></div>
              <h3>Vector Preservation</h3>
              <p>We do not rasterize your documents. Text remains searchable and metadata is preserved so it can be passed into our <Link to="/">PDF to CSV Converter</Link>.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section" style={{ background: 'var(--slate-50)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <h2>Ready to extract your pages?</h2>
          <p>No account required to use the local splitter.</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Start Splitting <Zap size={16} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
