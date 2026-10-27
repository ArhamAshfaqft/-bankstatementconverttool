import React from 'react';
import { ShieldAlert, Fingerprint, FileSearch, ShieldCheck, Activity } from 'lucide-react';
import FraudDetectorTool from '../components/FraudDetectorTool';
import SeoHead from '../components/SeoHead';

export default function AuditPage() {
  return (
    <>
      <SeoHead 
        title="Bank Statement Consistency Checker | Local PDF Audit"
        description="Check extractable transaction balance math and PDF metadata locally. Review flagged rows against the original; this tool does not verify authenticity."
        canonical="https://bankstatementconverttool.com/audit-statement"
      />
      
      {/* HERO SECTION */}
      <header className="layout-standard-hero" style={{ background: 'linear-gradient(135deg, #020617 0%, #1e293b 100%)' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2rem', color: '#ffffff' }}>
            <Fingerprint size={16} /> Local Statement Checks
          </div>
          <h1>Check Statement <span>Consistency</span></h1>
          <p>Review detectable running-balance mismatches and PDF metadata clues locally. Flagged items need human review and do not prove fraud.</p>
        </div>
      </header>
 
      <section className="layout-tool-container">
        <div className="container">
          <FraudDetectorTool />
        </div>
      </section>
 
      {/* VALUE PROPS */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Practical Review</span>
            <h2>What the Checks Can Show</h2>
            <p>Use the results to decide which rows deserve closer inspection against the source statement or bank records.</p>
          </div>
 
          <div className="features-grid" style={{ marginTop: '4rem' }}>
            <div className="feature-card">
              <div className="feature-icon teal"><Activity size={20} /></div>
              <h3>Math Validation</h3>
              <p>Checks running-balance arithmetic when the relevant columns can be extracted. A mismatch may also come from parsing or statement conventions.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon blue"><FileSearch size={20} /></div>
              <h3>Metadata Scrutiny</h3>
              <p>Creator and Producer tags can provide context, but they cannot establish whether a document is genuine or altered.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon emerald"><ShieldCheck size={20} /></div>
              <h3>Zero-Upload Audit</h3>
              <p>Your sensitive audit reports never leave your device. Forensic analysis happens entirely in your browser's local memory.</p>
            </div>
          </div>
        </div>
      </section>
 
      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container">
          <h2>Review the Original Statement</h2>
          <p>Compare any flagged row with the PDF and bank records before drawing a conclusion.</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={() => window.location.href='/'}>
              Back to Converter
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
