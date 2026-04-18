import React from 'react';
import { EyeOff, ShieldCheck, Lock, FileSearch } from 'lucide-react';
import RedactorTool from '../components/RedactorTool';
import SeoHead from '../components/SeoHead';

export default function RedactPage() {
  return (
    <>
      <SeoHead 
        title="Free Offline Financial PDF Redactor | Anonymize Bank Statements"
        description="Automatically black out sensitive PII like Account Numbers, Routing Numbers, and SSNs from financial PDFs. 100% local, zero upload processing."
        canonical="https://www.bankstatementconverttool.com/redact"
      />
      
      {/* HERO SECTION */}
      <section className="bank-hero" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)', color: 'white', padding: '6rem 0 8rem', textAlign: 'center', position: 'relative' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2rem', color: '#ffffff' }}>
            <EyeOff size={16} /> Privacy-First Redaction
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', letterSpacing: '-1px', marginBottom: '1.5rem', color: '#ffffff' }}>
            Anonymize Financial Documents
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: '0.9', maxWidth: '750px', margin: '0 auto', color: 'rgba(255,255,255,0.95)' }}>
            Automatically detect and permanently black-out Account Numbers, Routing Details, and SSNs before sharing bank statements. 
          </p>
        </div>
      </section>

      {/* TOOL OVERLAP */}
      <section style={{ marginTop: '-5rem', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <RedactorTool /> 
        </div>
      </section>

      {/* WHY REDACT IS IMPORTANT */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '700px', margin: '0 auto' }}>
            <span className="section-label">Safe Outsourcing</span>
            <h2>Why Accountants Use Our Redactor</h2>
            <p>If you outsource bookkeeping or share documents externally, sending raw bank statements is a massive liability. Our redactor removes the risk.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <FileSearch size={32} color="#0f172a" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Auto-Detection</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>We scan the text layer of your PDF for strings matching standard Social Security Numbers and 9 to 16-digit routing/account combinations.</p>
            </div>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <ShieldCheck size={32} color="#0f172a" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Permanent Erasure</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>Unlike generic PDF editors where text is just hidden behind a layer, our engine permanently rewrites the PDF byte stream. Hidden data cannot be copy-pasted.</p>
            </div>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <Lock size={32} color="#0f172a" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Zero Upload Guarantee</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>The irony of uploading highly sensitive documents to a cloud service to "protect" them. Our redactor processes the bytes entirely on your device's CPU.</p>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
