import React from 'react';
import { FileCode, CheckCircle, Lock, ShieldCheck } from 'lucide-react';
import ConverterTool from '../components/ConverterTool';
import SeoHead from '../components/SeoHead';

export default function OfxPage() {
  return (
    <>
      <SeoHead 
        title="Convert Bank Statement PDF to OFX / QFX - 100% Free & Local"
        description="Easily convert your PDF bank statements into OFX or QFX format offline in your browser. Perfect for Quicken, Xero, MS Money, and legacy accounting software."
        canonical="https://www.bankstatementconverttool.com/ofx-converter"
      />
      
      {/* HERO SECTION */}
      <section className="bank-hero" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0c4a6e 100%)', color: 'white', padding: '6rem 0 8rem', textAlign: 'center', position: 'relative' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2rem', color: '#ffffff' }}>
            <FileCode size={16} /> Quicken & Xero Compatible
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', letterSpacing: '-1px', marginBottom: '1.5rem', color: '#ffffff' }}>
            Convert Bank Statements to <span style={{ color: '#bae6fd' }}>OFX / QFX</span>
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: '0.9', maxWidth: '750px', margin: '0 auto', color: 'rgba(255,255,255,0.95)' }}>
            Stop wasting hours mapping raw CSV files. Automatically convert your PDF bank statements directly into native OFX or QFX files for immediate import into your favorite financial software.
          </p>
        </div>
      </section>

      {/* CONVERTER TOOL OVERLAP */}
      <section style={{ marginTop: '-5rem', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <ConverterTool /> 
        </div>
      </section>

      {/* WHY OFX IS BETTER */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '700px', margin: '0 auto' }}>
            <span className="section-label">Why using OFX is superior</span>
            <h2>Bypass Software Import Errors</h2>
            <p>Importing raw CSVs into strict software like Quicken often results in reversed signs, missed dates, and broken column mapping. Native OFX files work instantly.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <CheckCircle size={32} color="#0284c7" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Auto-Mapped Columns</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>OFX files have strict XML structures, meaning your software inherently knows which data is the date, description, and amount. No manual mapping required.</p>
            </div>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <ShieldCheck size={32} color="#0284c7" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Zero-Upload Privacy</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>Like all our tools, the OFX generation happens 100% locally in your browser. Your sensitive financial data is never intercepted or uploaded to a cloud server.</p>
            </div>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <Lock size={32} color="#0284c7" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Bank Agnostic</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>We generate a universal OFX wrap around your statement data, meaning you can import transactions from small community credit unions just like major banks.</p>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
