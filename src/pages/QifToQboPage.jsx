import React from 'react';
import { Table, CheckCircle, Lock, ShieldCheck } from 'lucide-react';
import QifToQboTool from '../components/QifToQboTool';
import SeoHead from '../components/SeoHead';
import FaqSection from '../components/FaqSection';

export default function QifToQboPage() {
  const faqs = [
    {
      question: "Why doesn't QuickBooks import my .QIF file directly?",
      answer: "Intuit designed QuickBooks to use Web Connect (.qbo) for direct imports, locking out the older Quicken Interchange Format (.qif) to avoid reconciliation overlaps. Our converter maps legacy tags into valid .qbo bank feed values."
    },
    {
      question: "Are transaction memos and categories preserved?",
      answer: "Yes. Categories (L tags) and memos (M tags) present in your .qif file are mapped into the description fields of the QBO file, preserving critical bookkeeping detail."
    },
    {
      question: "Is my transaction history uploaded to your servers?",
      answer: "No. The entire conversion logic executes client-side inside your browser. None of your payees, account details, or transaction amounts are transmitted online."
    },
    {
      question: "Can I convert old Quicken exports for QuickBooks Online?",
      answer: "Yes. The converter is designed for legacy Quicken QIF exports that need to be reshaped into Web Connect QBO files for QuickBooks import workflows."
    },
    {
      question: "What QIF tags are supported?",
      answer: "The parser supports common transaction tags including dates, amounts, payees, memos, categories, check numbers, and transaction separators."
    }
  ];

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "QIF to QuickBooks QBO Converter",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "WebBrowser",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <SeoHead 
        title="QIF to QBO Converter - Move Quicken Files to QuickBooks"
        description="Convert legacy Quicken .QIF files into QuickBooks Web Connect .QBO files locally. Preserve payees, dates, memos, and amounts with private browser processing."
        canonical="https://bankstatementconverttool.com/qif-to-qbo-converter"
        jsonLd={[softwareSchema, faqSchema]}
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

          {/* STEP BY STEP WORKFLOW */}
          <div style={{ marginTop: '5rem', marginBottom: '5rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>How to Convert QIF to QBO in 4 Steps</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
              <div style={{ position: 'relative', background: '#ffffff', padding: '2.5rem 1.5rem 2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
                <div style={{ position: 'absolute', top: '-20px', left: '20px', width: '40px', height: '40px', borderRadius: '50%', background: '#6366f1', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 4px 10px rgba(99,102,241,0.3)' }}>1</div>
                <h3 style={{ fontSize: '1.1rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Select QIF File</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>Drag and drop your Quicken .qif statement into the dashboard zone.</p>
              </div>
              <div style={{ position: 'relative', background: '#ffffff', padding: '2.5rem 1.5rem 2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
                <div style={{ position: 'absolute', top: '-20px', left: '20px', width: '40px', height: '40px', borderRadius: '50%', background: '#6366f1', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 4px 10px rgba(99,102,241,0.3)' }}>2</div>
                <h3 style={{ fontSize: '1.1rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Verify Transactions</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>Review payee and date mapping details inside the interactive preview table.</p>
              </div>
              <div style={{ position: 'relative', background: '#ffffff', padding: '2.5rem 1.5rem 2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
                <div style={{ position: 'absolute', top: '-20px', left: '20px', width: '40px', height: '40px', borderRadius: '50%', background: '#6366f1', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 4px 10px rgba(99,102,241,0.3)' }}>3</div>
                <h3 style={{ fontSize: '1.1rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Convert & Save</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>Export the transactions to compile a QuickBooks Web Connect file offline.</p>
              </div>
              <div style={{ position: 'relative', background: '#ffffff', padding: '2.5rem 1.5rem 2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
                <div style={{ position: 'absolute', top: '-20px', left: '20px', width: '40px', height: '40px', borderRadius: '50%', background: '#6366f1', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 4px 10px rgba(99,102,241,0.3)' }}>4</div>
                <h3 style={{ fontSize: '1.1rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Import into QB</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>Open your QuickBooks account, click Bank Feeds, and select Web Connect import.</p>
              </div>
            </div>
          </div>

          {/* VERSION COMPATIBILITY */}
          <div style={{ marginTop: '5rem', marginBottom: '5rem', background: '#f8fafc', padding: '3rem 2rem', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>QuickBooks Version Compatibility</h2>
            <p style={{ textAlign: 'center', color: '#64748b', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: '1.6' }}>
              We compile Web Connect structures matching modern bank standards, compatible with the following QuickBooks variants:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
              <div style={{ background: '#ffffff', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={18} color="#6366f1" />
                <span style={{ fontWeight: '600', color: '#0f172a' }}>QuickBooks Online</span>
              </div>
              <div style={{ background: '#ffffff', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={18} color="#6366f1" />
                <span style={{ fontWeight: '600', color: '#0f172a' }}>QuickBooks Desktop Pro</span>
              </div>
              <div style={{ background: '#ffffff', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={18} color="#6366f1" />
                <span style={{ fontWeight: '600', color: '#0f172a' }}>QuickBooks Premier</span>
              </div>
              <div style={{ background: '#ffffff', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={18} color="#6366f1" />
                <span style={{ fontWeight: '600', color: '#0f172a' }}>QuickBooks Enterprise</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <div style={{ borderTop: '1px solid #e2e8f0' }}>
        <FaqSection faqs={faqs} />
      </div>
    </>
  );
}
