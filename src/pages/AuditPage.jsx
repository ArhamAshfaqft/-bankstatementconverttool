import React from 'react';
import { ShieldAlert, Fingerprint, FileSearch, ShieldCheck, Activity } from 'lucide-react';
import FraudDetectorTool from '../components/FraudDetectorTool';
import SeoHead from '../components/SeoHead';

export default function AuditPage() {
  return (
    <>
      <SeoHead 
        title="Financial Forgery & Fraud Detector | Audit Bank Statements Locally"
        description="Verify the integrity of bank statements. Our local forensic tool scans for mathematical mismatches, metadata tampering, and structural anomalies without uploading data."
        canonical="https://bankstatementconverttool.com/audit-statement"
      />
      
      {/* HERO SECTION */}
      <header className="layout-standard-hero" style={{ background: 'linear-gradient(135deg, #020617 0%, #1e293b 100%)' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2rem', color: '#ffffff' }}>
            <Fingerprint size={16} /> Advanced Forensic Intelligence
          </div>
          <h1>Detect <span>Financial Forgery</span> & Tampering</h1>
          <p>Automatically audit bank statements for mathematical errors and structural anomalies. Protect your workflow from fraudulent documents with local forensic scanning.</p>
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
            <span className="section-label">Institutional Grade Audit</span>
            <h2>Forensic Integrity Checks</h2>
            <p>Designed for lenders, underwriters, and accountants who need to verify document authenticity instantly.</p>
          </div>
 
          <div className="features-grid" style={{ marginTop: '4rem' }}>
            <div className="feature-card">
              <div className="feature-icon teal"><Activity size={20} /></div>
              <h3>Math Validation</h3>
              <p>Scans every transaction to ensure the running balance is logically consistent. Flagged mismatches are the #1 indicator of manual edits.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon blue"><FileSearch size={20} /></div>
              <h3>Metadata Scrutiny</h3>
              <p>We analyze the internal "Creator" and "Producer" tags. If a statement was made in Word or Canva instead of a bank system, we flag it.</p>
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
          <h2>Trust the Data, Not the Document</h2>
          <p>Get instant clarity on document integrity without the cost of manual audit services.</p>
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
