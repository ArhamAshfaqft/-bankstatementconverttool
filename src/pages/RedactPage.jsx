import React from 'react';
import { Shield, Lock, EyeOff, FileLock } from 'lucide-react';
import RedactorTool from '../components/RedactorTool';
import SeoHead from '../components/SeoHead';

export default function RedactPage() {
  return (
    <>
      <SeoHead 
        title="Anonymize PDF Bank Statements | Redact PII Locally"
        description="Securely strip metadata and anonymize your financial PDFs. 100% private, local processing ensures sensitive info stays off the cloud."
        canonical="https://bankstatementconverttool.com/redact"
      />
      
      {/* HERO SECTION */}
      <header className="layout-standard-hero" style={{ background: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2rem', color: '#ffffff' }}>
            <FileLock size={16} /> Privacy-First Forensic Anonymization
          </div>
          <h1>Anonymize Your <span>Bank Statements</span></h1>
          <p>Need to share a statement but want to hide your PII? Our anonymizer strips hidden metadata and tracking data locally in your browser.</p>
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
            <h2>Why Anonymize Your Statements</h2>
            <p>Perfect for providing proof of funds while maintaining your personal privacy.</p>
          </div>

          <div className="features-grid" style={{ marginTop: '4rem' }}>
            <div className="feature-card">
              <div className="feature-icon red"><Lock size={20} /></div>
              <h3>Metadata Stripping</h3>
              <p>Standard PDF viewers often save hidden edit history. Our tool flattens and recreates the file to permanently erase it.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon gray"><EyeOff size={20} /></div>
              <h3>0% Cloud Exposure</h3>
              <p>Your financial data is processed entirely in RAM. No temporary files are stored, and nothing is uploaded.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon amber"><Shield size={20} /></div>
              <h3>Compliance Ready</h3>
              <p>Ideal for SEC, GDPR, and HIPAA compliant workflows where sensitive data must be handled with extreme care.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
