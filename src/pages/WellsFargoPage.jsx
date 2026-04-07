import React, { useState } from 'react';
import { ChevronDown, ArrowRight, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import SeoHead from '../components/SeoHead';
import ConverterTool from '../components/ConverterTool';

export default function WellsFargoPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const scrollToConverter = () => {
    document.getElementById('converter')?.scrollIntoView({ behavior: 'smooth' });
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Export Wells Fargo Statements to CSV",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Identify the Problem",
        "text": "Wells Fargo does not permit historical CSV exports for past statements."
      },
      {
        "@type": "HowToStep",
        "name": "Use Browser Tool",
        "text": "Insert your Wells Fargo PDF into our local converter. It bypasses the need for an export button by reading the document directly."
      },
      {
        "@type": "HowToStep",
        "name": "Download File",
        "text": "Save the output as a CSV file to your local computer."
      }
    ]
  };

  return (
    <div className="wf-page">
      <SeoHead 
        title="Wells Fargo PDF to CSV — Convert Statements Instantly"
        description="Easily convert your Wells Fargo PDF statements into CSV or Excel format. Our local browser extraction bypasses PDF locks. 100% free and private."
        canonical="https://bankstatementpdftocsv.com/wells-fargo-pdf-to-csv"
        jsonLd={[schema]}
      />

      <header className="hero wf-hero" style={{ background: '#FFFDF5' }}>
        <div className="container">
          <div className="hero-badge wf-badge" style={{ color: '#731317', background: '#FEE2E2', borderColor: '#FCA5A5' }}>
            <ShieldCheck size={14} />
            Built for Wells Fargo PDF Formats
          </div>
          <h1 style={{ color: '#731317' }}><span>Wells Fargo</span> PDF to CSV Converter</h1>
          <p className="hero-subtitle">
            Need your Wells Fargo transaction history in Excel? Stop re-typing. Drop your PDF below for instant, private table extraction.
          </p>
        </div>
      </header>

      {/* Problem / Solution Section */}
      <section className="section">
        <div className="container">
          <div className="problem-solution-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
            
            {/* The Problem */}
            <div className="problem-panel" style={{ padding: '2.5rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <AlertTriangle size={24} color="#E31837" />
                <h2 style={{ fontSize: '1.5rem', color: '#111827', margin: 0 }}>The Problem</h2>
              </div>
              <p style={{ color: '#4B5563', lineHeight: '1.7' }}>
                Wells Fargo's online portal is notoriously frustrating when it comes to exporting historical data. While you can download a CSV of very recent activity, <strong>you cannot get a CSV of past statements</strong>. You are forced to download them as locked PDFs. If you are doing your taxes or catching up on bookkeeping, copying and pasting from these PDFs causes massive formatting errors.
              </p>
            </div>

            {/* The Solution */}
            <div className="solution-panel" style={{ padding: '2.5rem', background: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <CheckCircle2 size={24} color="#0D9488" />
                <h2 style={{ fontSize: '1.5rem', color: '#111827', margin: 0 }}>Our Solution</h2>
              </div>
              <p style={{ color: '#4B5563', lineHeight: '1.7' }}>
                Our tool acts as a bridge. By understanding the specific visual layout of a Wells Fargo document—specifically their two-column date format and combined description lines—our algorithm extracts the data locally. It outputs a perfectly clean CSV ready for QuickBooks, Xero, or Excel, without ever sending your data to the cloud.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Tool Section */}
      <section className="section bg-surface-alt">
        <div className="container">
          <div className="section-header">
            <h2>Convert Your Wells Fargo PDF Now</h2>
            <p>Your document is processed in your browser. No internet connection required once the page loads.</p>
          </div>
          <ConverterTool />
        </div>
      </section>

      {/* WF Specific FAQ */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Wells Fargo Extraction FAQ</h2>
          </div>
          <div className="faq-list">
            {[
              {
                q: "Do Wells Fargo statements have a special format?",
                a: "Yes. Wells Fargo uses a slightly unconventional font embedding in their PDFs and often spans transaction descriptions across multiple lines, which breaks standard copy-pasting. Our parser handles this natively."
              },
              {
                q: "Can I convert Wells Fargo mortgage statements?",
                a: "While primarily optimized for checking and savings accounts, the tool will attempt to extract the payment breakdown tables located within Wells Fargo mortgage PDFs."
              },
              {
                q: "Will this handle Wells Fargo combined statements?",
                a: "Combined statements (e.g., checking and savings in one PDF) will be parsed, but the tool will output all parsed tables as one continuous list. You may need to insert a gap manually in Excel."
              }
            ].map((faq, i) => (
              <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}
                  <ChevronDown size={18} className="faq-chevron" />
                </button>
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section" style={{ background: '#FFC82E', color: '#111827' }}>
        <div className="container">
          <h2 style={{ color: '#111827' }}>Stop retyping your bank history.</h2>
          <button className="btn" onClick={scrollToConverter} style={{ color: '#111827', background: 'white' }}>
            Convert to CSV Free <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
