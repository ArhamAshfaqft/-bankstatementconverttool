import React from 'react';
import { Camera, Cpu, ShieldCheck, Zap } from 'lucide-react';
import ReceiptScannerTool from '../components/ReceiptScannerTool';
import SeoHead from '../components/SeoHead';

export default function ReceiptPage() {
  return (
    <>
      <SeoHead 
        title="Free Receipt & Invoice OCR Scanner | Image to CSV Offline"
        description="Extract data from scanned receipts and invoices using local OCR. Convert photos of receipts to structured CSV files instantly — 100% offline, zero upload."
        canonical="https://www.bankstatementconverttool.com/receipt-scanner"
      />
      
      {/* HERO SECTION */}
      <section className="bank-hero" style={{ background: 'linear-gradient(135deg, #0f766e 0%, #134e4a 100%)', color: 'white', padding: '6rem 0 8rem', textAlign: 'center', position: 'relative' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2rem', color: '#ffffff' }}>
            <Camera size={16} /> AI-Powered Local OCR
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', letterSpacing: '-1px', marginBottom: '1.5rem', color: '#ffffff' }}>
            Scan Receipts & Invoices to CSV
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: '0.9', maxWidth: '750px', margin: '0 auto', color: 'rgba(255,255,255,0.95)' }}>
            Snap a photo of any receipt, invoice, or scanned document. Our local OCR engine reads the pixels and extracts structured data — Date, Vendor, and Total — instantly.
          </p>
        </div>
      </section>

      {/* TOOL OVERLAP */}
      <section style={{ marginTop: '-5rem', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <ReceiptScannerTool />
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '700px', margin: '0 auto' }}>
            <span className="section-label">Shoebox Accounting, Solved</span>
            <h2>Why Businesses Need Receipt OCR</h2>
            <p>Stop manually typing receipt data into spreadsheets. Our engine uses industry-standard Optical Character Recognition to convert pixels into structured data.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <Cpu size={32} color="#0f766e" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Browser-Native OCR</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>Powered by Tesseract.js, the same technology used by Google Docs. The OCR model runs entirely within your browser's WebWorker thread — no cloud dependency at all.</p>
            </div>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <ShieldCheck size={32} color="#0f766e" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Zero Upload Privacy</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>Receipts contain sensitive vendor accounts, card numbers, and purchase histories. Unlike cloud OCR services, your images never leave your device's memory.</p>
            </div>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <Zap size={32} color="#0f766e" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Smart Extraction</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>After recognizing the raw text, our extraction algorithm targets the key fields accountants need: Date, Vendor Name, Item Descriptions, and the Total Amount — ready for QuickBooks import.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
