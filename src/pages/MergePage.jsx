import React from 'react';
import { GitMerge, ShieldCheck, Zap, Layers } from 'lucide-react';
import MergerTool from '../components/MergerTool';
import SeoHead from '../components/SeoHead';

export default function MergePage() {
  return (
    <>
      <SeoHead 
        title="Merge Bank Statement PDFs | Combine Multiple Files Locally"
        description="Easily merge multiple PDF bank statements into a single document. 100% private, local processing ensures your sensitive financial data never leaves your computer."
        canonical="https://www.bankstatementconverttool.com/merge"
      />
      
      {/* HERO SECTION */}
      <header className="layout-standard-hero" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2rem', color: '#ffffff' }}>
            <GitMerge size={16} /> Batch Processing Suite
          </div>
          <h1>Combine Multiple <span>Statements</span> into One</h1>
          <p>Stop juggling individual monthly PDFs. Merge an entire year of bank statements into a single file for easier auditing and management.</p>
        </div>
      </header>

      {/* TOOL SECTION */}
      <section className="layout-tool-container">
        <div className="container">
          <MergerTool />
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Safe & Simple</span>
            <h2>Why Use Our Merger</h2>
            <p>Designed for accountants who need to process heavy volumes of client data securely.</p>
          </div>

          <div className="features-grid" style={{ marginTop: '4rem' }}>
            <div className="feature-card">
              <div className="feature-icon blue"><ShieldCheck size={20} /></div>
              <h3>0% Server Upload</h3>
              <p>Unlike cloud mergers, your PDFs stay in your browser. We never see your balances, account numbers, or personal info.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon amber"><Layers size={20} /></div>
              <h3>Order Control</h3>
              <p>Easily drag and drop your files into chronological order before merging to ensure a perfectly seamless output.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon teal"><Zap size={20} /></div>
              <h3>Instant Result</h3>
              <p>Powered by local WASM processing, our merger handles even high-resolution 100+ page statements in seconds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to convert your merged file?</h2>
          <p>Once your statements are combined, use our flagship converter to get a clean CSV in one go.</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={() => window.location.href='/'}>
              Back to CSV Converter
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
