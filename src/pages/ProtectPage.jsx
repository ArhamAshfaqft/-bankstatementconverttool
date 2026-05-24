import React from 'react';
import { Lock, ShieldCheck, Key, Zap, EyeOff } from 'lucide-react';
import ProtectorTool from '../components/ProtectorTool';
import SeoHead from '../components/SeoHead';

export default function ProtectPage() {
  return (
    <>
      <SeoHead 
        title="Secure PDF with Password Locally | Private Bank Statement Protector"
        description="Password-protect your bank statements and financial documents instantly in your browser. 100% private encryption ensures your password never leaves your device."
        canonical="https://www.bankstatementconverttool.com/protect-pdf"
      />
      
      {/* HERO SECTION */}
      <header className="layout-standard-hero" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2rem', color: '#ffffff' }}>
            <ShieldCheck size={16} /> 128-bit Local AES Encryption
          </div>
          <h1>Password-Protect Your <span>Sensitive Documents</span></h1>
          <p>Before you email your bank statements or pay stubs, add an extra layer of security. Locked PDFs prevent unauthorized access and keep your private data safe.</p>
        </div>
      </header>

      <section className="layout-tool-container">
        <div className="container">
          <ProtectorTool />
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Safe & Simple</span>
            <h2>Why Use Our Protector</h2>
            <p>Built for users who prioritize privacy when handling sensitive financial records.</p>
          </div>

          <div className="features-grid" style={{ marginTop: '4rem' }}>
            <div className="feature-card">
              <div className="feature-icon teal"><Lock size={20} /></div>
              <h3>Standard Compliance</h3>
              <p>Our encryption is standard-compliant, meaning your protected PDFs can be opened in Adobe, Preview, Chrome, and any PDF viewer.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon amber"><EyeOff size={20} /></div>
              <h3>Privacy-First Design</h3>
              <p>The library running this tool is open-source and operates completely in your browser tab. Your files and passwords never touch a server.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon blue"><Key size={20} /></div>
              <h3>Easy Access</h3>
              <p>No account required. Protected documents remain yours to keep. Use our "Remover" tool if you ever need to strip the password later.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
