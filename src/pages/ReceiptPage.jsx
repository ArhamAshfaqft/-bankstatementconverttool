import React from 'react';
import { Camera, ShieldCheck, Zap, EyeOff } from 'lucide-react';
import ReceiptScannerTool from '../components/ReceiptScannerTool';
import SeoHead from '../components/SeoHead';

export default function ReceiptPage() {
  return (
    <>
      <SeoHead 
        title="Receipt & Invoice OCR Scanner | Extract Data Locally"
        description="Scan receipts and invoices directly in your browser. Our local OCR technology ensures your financial photos never touch our servers."
        canonical="https://www.bankstatementconverttool.com/receipt-scanner"
      />
      
      {/* HERO SECTION */}
      <header className="layout-standard-hero" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2rem', color: '#ffffff' }}>
            <Camera size={16} /> Intelligent OCR Processing
          </div>
          <h1>Scan Receipts and <span>Extract Data</span></h1>
          <p>Turn photos of receipts into structured financial data. Perfect for business owners and accountants who need to digitize physical records instantly.</p>
        </div>
      </header>

      <section className="layout-tool-container">
        <div className="container">
          <ReceiptScannerTool />
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Safe & Private</span>
            <h2>Why Use Our OCR Scanner</h2>
            <p>We process images in your browser RAM, not on a cloud server.</p>
          </div>

          <div className="features-grid" style={{ marginTop: '4rem' }}>
            <div className="feature-card">
              <div className="feature-icon purple"><ShieldCheck size={20} /></div>
              <h3>0% Data Upload</h3>
              <p>Unlike other scanner apps, your receipt photos are never uploaded. OCR happens 100% on your device.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon amber"><Zap size={20} /></div>
              <h3>Instant Recognition</h3>
              <p>Detect amounts, dates, and vendors from standard paper receipts in seconds using local Tesseract technology.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon gray"><EyeOff size={20} /></div>
              <h3>Totally Anonymous</h3>
              <p>No account required to scan. Move your receipt data directly to CSV without creating a digital trail.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
