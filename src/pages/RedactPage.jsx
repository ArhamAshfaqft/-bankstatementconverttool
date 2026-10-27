import React from 'react';
import { Shield, Lock, EyeOff, FileLock } from 'lucide-react';
import RedactorTool from '../components/RedactorTool';
import SeoHead from '../components/SeoHead';

export default function RedactPage() {
  return (
    <>
      <SeoHead 
        title="Create a Local Copy of a PDF | StatementToCSV"
        description="Recreate a PDF copy locally in your browser. This does not hide visible text or guarantee removal of embedded information."
        canonical="https://bankstatementconverttool.com/redact"
        noindex
      />
      
      {/* HERO SECTION */}
      <header className="layout-standard-hero" style={{ background: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2rem', color: '#ffffff' }}>
            <FileLock size={16} /> Local PDF Copy
          </div>
          <h1>Create a Local <span>PDF Copy</span></h1>
          <p>This tool recreates a PDF from its pages in your browser. It does not remove visible names, account numbers, or other sensitive content.</p>
        </div>
      </header>

      <section className="layout-tool-container">
        <div className="container">
          <RedactorTool />
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Safe & Secure</span>
            <h2>Know what a copied PDF contains</h2>
            <p>Inspect the result before sharing it. Use a dedicated redaction tool if you need to permanently remove visible information.</p>
          </div>

          <div className="features-grid" style={{ marginTop: '4rem' }}>
            <div className="feature-card">
              <div className="feature-icon red"><Lock size={20} /></div>
              <h3>New document copy</h3>
              <p>Pages are copied into a newly saved PDF. Embedded page content may still contain sensitive information.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon gray"><EyeOff size={20} /></div>
              <h3>0% Cloud Exposure</h3>
              <p>Your financial data is processed entirely in RAM. No temporary files are stored, and nothing is uploaded.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon amber"><Shield size={20} /></div>
              <h3>Not a redaction tool</h3>
              <p>Do not use this feature as proof that personal details or all metadata have been removed.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
