import React from 'react';
import { Scissors, ShieldCheck, FileText, Zap } from 'lucide-react';
import SplitterTool from '../components/SplitterTool';
import SeoHead from '../components/SeoHead';

export default function SplitPage() {
  return (
    <>
      <SeoHead 
        title="Split PDF Bank Statements | Extract Pages Locally"
        description="Extract specific pages from your bank statements or financial documents. 100% private, local processing ensures total security. No uploads required."
        canonical="https://www.bankstatementconverttool.com/split"
      />
      
      <header className="layout-standard-hero" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2rem', color: '#ffffff' }}>
            <Scissors size={16} /> Precise Document Extraction
          </div>
          <h1>Extract Specific <span>Pages</span> from Your PDF</h1>
          <p>Need only the transaction pages from a 20-page document? Split your statements locally in seconds without compromising your privacy.</p>
        </div>
      </header>

      <section className="layout-tool-container">
        <div className="container">
          <SplitterTool />
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Safe & Simple</span>
            <h2>Why Use Our Splitter</h2>
            <p>Built for users who need to cherry-pick data from large financial reports.</p>
          </div>

          <div className="features-grid" style={{ marginTop: '4rem' }}>
            <div className="feature-card">
              <div className="feature-icon blue"><ShieldCheck size={20} /></div>
              <h3>100% Local Privacy</h3>
              <p>Your document is split entirely within your browser's memory. Your file NEVER touches our servers.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon amber"><FileText size={20} /></div>
              <h3>Flexible Ranges</h3>
              <p>Extract single pages, multiple specific pages (1, 4, 9), or entire ranges (5-12) with one click.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon teal"><Zap size={20} /></div>
              <h3>Zero Quality Loss</h3>
              <p>Our splitter maintains the original resolution and vector quality of your bank statement PDFs.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
