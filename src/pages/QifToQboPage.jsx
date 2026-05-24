import React from 'react';
import { Table, CheckCircle, Lock, ShieldCheck } from 'lucide-react';
import QifToQboTool from '../components/QifToQboTool';
import SeoHead from '../components/SeoHead';

export default function QifToQboPage() {
  return (
    <>
      <SeoHead 
        title="Convert QIF to QuickBooks (QBO) - Free & Local"
        description="Convert Quicken Interchange Format (.QIF) statements into importable QuickBooks Web Connect (.QBO) files offline in your web browser. Privacy guaranteed."
        canonical="https://www.bankstatementconverttool.com/qif-to-qbo-converter"
      />
      
      <header className="layout-standard-hero" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #312e81 100%)' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2rem', color: '#ffffff' }}>
            <Table size={16} /> 100% Client-Side
          </div>
          <h1>Convert Quicken (.QIF) to <span>QuickBooks (.QBO)</span></h1>
          <p>Instantly translate old or custom Quicken (.QIF) files into standard QuickBooks Web Connect (.QBO) format locally inside your web browser.</p>
        </div>
      </header>

      <section className="layout-tool-container">
        <div className="container">
          <QifToQboTool /> 
        </div>
      </section>

      {/* WHY THIS CONVERTER */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '700px', margin: '0 auto' }}>
            <span className="section-label">Bridge Legacy Quicken Formats</span>
            <h2>Why Convert QIF to QBO?</h2>
            <p>QuickBooks does not natively accept `.qif` statement files. Converting your legacy Quicken logs to `.qbo` is the fastest way to migrate histories.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <CheckCircle size={32} color="#6366f1" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Migrate Software Easily</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>If you are switching from Quicken to QuickBooks or exporting bank logs in QIF, our tool bridges the format gap instantly.</p>
            </div>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <ShieldCheck size={32} color="#6366f1" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>100% Offline Integrity</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>QIF statements hold extensive payees and balance codes. By converting locally in JavaScript, your sensitive transaction records stay safe.</p>
            </div>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <Lock size={32} color="#6366f1" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Accurate Tag Mapping</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>Our parser decodes QIF symbols (`D` for dates, `T` for amounts, `P` for payees) and maps them cleanly into the correct QuickBooks SGML fields.</p>
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
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>Why doesn't QuickBooks import my .QIF file?</h4>
              <p style={{ color: '#475569', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>Intuit designed QuickBooks to utilize Web Connect (.qbo) for direct imports, locking out the older Quicken Interchange Format (.qif) to avoid reconciliation overlaps. Our tool lets you easily bypass this block.</p>
            </div>
            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>Are transaction categories and memos preserved?</h4>
              <p style={{ color: '#475569', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>Yes. Any categories (`L` tags) or memos (`M` tags) present in your `.qif` file are cleanly combined into the transaction details description, ensuring no tracking information is lost.</p>
            </div>
            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>How long does the QIF parsing process take?</h4>
              <p style={{ color: '#475569', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>Conversion is instantaneous. Because parsing is computed locally using browser power rather than queueing on a cloud database, even files with thousands of lines process in milliseconds.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
