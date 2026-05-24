import React from 'react';
import { Unlock, ShieldCheck, Zap, Key } from 'lucide-react';
import DecryptorTool from '../components/DecryptorTool';
import SeoHead from '../components/SeoHead';

export default function DecryptPage() {
  return (
    <>
      <SeoHead 
        title="Unlock Password-Protected PDF Bank Statements | Free & Local"
        description="Permanently remove passwords from your bank statements locally. 100% private decryption ensures your password never leaves your browser."
        canonical="https://www.bankstatementconverttool.com/unlock-pdf"
      />
      
      {/* HERO SECTION */}
      <header className="layout-standard-hero" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2rem', color: '#ffffff' }}>
            <Key size={16} /> Private Security Suite
          </div>
          <h1>Remove Passwords from <span>PDF Statements</span></h1>
          <p>Tired of entering your birthdate or account number every time you open a statement? Unlock your files locally and store them securely without a password.</p>
        </div>
      </header>

      <section className="layout-tool-container">
        <div className="container">
          <DecryptorTool />
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Safe & Secure</span>
            <h2>Why Use Our PDF Remover</h2>
            <p>Designed for professional workflows that handle thousands of password-protected documents.</p>
          </div>

          <div className="features-grid" style={{ marginTop: '4rem' }}>
            <div className="feature-card">
              <div className="feature-icon blue"><ShieldCheck size={20} /></div>
              <h3>WASM Decryption</h3>
              <p>We use high-performance local decryption to strip passwords in-flight. No data is cached or kept after you close the tab.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon amber"><Unlock size={20} /></div>
              <h3>Total Freedom</h3>
              <p>Once unlocked, your bank statements can be merged, split, or converted to CSV without any further password prompts.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon teal"><Zap size={20} /></div>
              <h3>Local First</h3>
              <p>Never send your bank passwords to a random online website. Our code runs ONLY on your machine.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
