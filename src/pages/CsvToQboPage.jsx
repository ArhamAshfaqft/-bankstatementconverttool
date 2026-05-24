import React from 'react';
import { Table, CheckCircle, Lock, ShieldCheck } from 'lucide-react';
import CsvToQboTool from '../components/CsvToQboTool';
import SeoHead from '../components/SeoHead';

export default function CsvToQboPage() {
  return (
    <>
      <SeoHead 
        title="Convert CSV to QuickBooks (QBO) - Free & Local"
        description="Convert transaction spreadsheets (.CSV) into importable QuickBooks Web Connect (.QBO) files offline in your web browser. Completely secure and private."
        canonical="https://www.bankstatementconverttool.com/csv-to-qbo-converter"
      />
      
      <header className="layout-standard-hero" style={{ background: 'linear-gradient(135deg, #059669 0%, #064e3b 100%)' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2rem', color: '#ffffff' }}>
            <Table size={16} /> 100% Offline
          </div>
          <h1>Convert CSV Spreadsheets to <span>QuickBooks (.QBO)</span></h1>
          <p>Easily translate custom bank transaction exports or personal spreadsheets into QuickBooks Web Connect files for seamless reconciliation.</p>
        </div>
      </header>

      <section className="layout-tool-container">
        <div className="container">
          <CsvToQboTool /> 
        </div>
      </section>

      {/* BENENFITS */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '700px', margin: '0 auto' }}>
            <span className="section-label">Automate Transaction Mapping</span>
            <h2>Why Convert CSV to QBO?</h2>
            <p>Direct CSV imports in QuickBooks often fail because columns are misaligned or date formats mismatch. QBO files import cleanly with zero manual intervention.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <CheckCircle size={32} color="#059669" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Visual Column Mapping</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>Identify your spreadsheet headers visually. Set which column represents the date, payee name, and amount values, and we do the rest.</p>
            </div>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <ShieldCheck size={32} color="#059669" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Guaranteed Browser Privacy</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>Your CSV transactions stay safe in your browser memory. We do not upload any data, preserving total financial privacy.</p>
            </div>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <Lock size={32} color="#059669" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Auto-Matched Columns</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>Skip reversed amount signs, broken date schemas, and mapping prompts inside QuickBooks. The QBO format is instantly recognized.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="section">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2.5rem' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>Does QuickBooks support direct CSV imports?</h4>
              <p style={{ color: '#475569', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>Yes, but direct CSV imports in QuickBooks frequently cause formatting headaches (such as inverted debit/credit columns or unrecognized date structures). Converting your CSV into a Web Connect (.qbo) format bypasses these mapping issues completely.</p>
            </div>
            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>Which QuickBooks versions support Web Connect (.QBO) import?</h4>
              <p style={{ color: '#475569', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>All standard editions including QuickBooks Online, QuickBooks Desktop Pro, Premier, Enterprise, and QuickBooks Mac. Any version that supports standard bank feeds will import `.qbo` files.</p>
            </div>
            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>Are my bank details safe with offline conversion?</h4>
              <p style={{ color: '#475569', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>Yes, absolutely. Because the code runs client-side inside your own browser window, your account sheets, numbers, payees, and financial histories are never processed on our servers.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
