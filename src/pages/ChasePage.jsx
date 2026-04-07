import React, { useState } from 'react';
import { ChevronDown, ArrowRight, ShieldCheck, DownloadCloud, FileText } from 'lucide-react';
import SeoHead from '../components/SeoHead';
import ConverterTool from '../components/ConverterTool';

export default function ChasePage() {
  const [openFaq, setOpenFaq] = useState(null);

  const scrollToConverter = () => {
    document.getElementById('converter')?.scrollIntoView({ behavior: 'smooth' });
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Convert Chase Bank Statement to CSV",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Download PDF from Chase",
        "text": "Log into your Chase account, navigate to 'Statements & Documents' and download your PDF statement."
      },
      {
        "@type": "HowToStep",
        "name": "Upload to Converter",
        "text": "Drag and drop your Chase PDF into our secure local converter tool."
      },
      {
        "@type": "HowToStep",
        "name": "Download CSV",
        "text": "Click download to instantly receive a CSV formatted for Excel or QuickBooks."
      }
    ]
  };

  return (
    <div className="chase-page">
      <SeoHead 
        title="Convert Chase Bank Statement PDF to CSV | Free & Secure"
        description="Instantly convert your Chase bank statement PDFs accurately to CSV format. 100% private, local processing directly in your browser. No data leaves your machine."
        canonical="https://bankstatementconverttool.com/chase"
        jsonLd={[schema]}
      />

      <header className="hero chase-hero">
        <div className="container">
          <div className="hero-badge chase-badge">
            <ShieldCheck size={14} />
            Optimized for Chase Personal & Business Accounts
          </div>
          <h1>Convert <span>Chase Bank Statement</span> PDF to CSV</h1>
          <p className="hero-subtitle">
            Securely extract transaction data from your Chase statements. Our tool understands Chase's layout perfectly and runs completely offline in your browser for absolute privacy.
          </p>
        </div>
      </header>

      {/* Guide First Section */}
      <section className="section chase-guide-section" id="guide">
        <div className="container">
          <div className="section-header">
            <span className="section-label" style={{ color: '#003087' }}>Step-by-Step Guide</span>
            <h2>How to Download Your Chase Statement PDF</h2>
            <p>Before converting, make sure you have the official PDF document from Chase.</p>
          </div>
          
          <div class="steps-grid">
            <div className="step-card">
              <div className="step-number" style={{ background: '#003087', color: 'white', borderColor: '#003087' }}>1</div>
              <h3>Log Into Chase</h3>
              <p>Sign in to your online banking portal at Chase.com.</p>
            </div>
            <div className="step-card">
              <div className="step-number" style={{ background: '#003087', color: 'white', borderColor: '#003087' }}>2</div>
              <h3>Find Statements</h3>
              <p>Click on 'Statements & Documents' under the account you want to export.</p>
            </div>
            <div className="step-card">
              <div className="step-number" style={{ background: '#003087', color: 'white', borderColor: '#003087' }}>3</div>
              <h3>Save PDF</h3>
              <p>Click the download icon next to the statement date to save the PDF to your device.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Section */}
      <section className="section bg-surface-alt">
        <div className="container">
          <ConverterTool />
        </div>
      </section>

      {/* Format Explainer Section */}
      <section className="section">
         <div className="container">
          <div className="format-explainer-card">
            <div className="explainer-content">
              <h2>Understanding Your Chase PDF Format</h2>
              <p>Chase bank statements usually contain a "Transaction Date" and "Posting Date". They also condense the description and amount together depending on whether it's a Business or Personal checking account. Our tool uses smart heuristics to parse these rows perfectly without shifting your debits and credits.</p>
              <ul>
                <li><FileText size={16}/> Automatically aligns multi-line Chase descriptions</li>
                <li><DownloadCloud size={16}/> Prepares columns for easy accounting software import</li>
                <li><ShieldCheck size={16}/> Completely ignores non-transaction summary tables</li>
              </ul>
            </div>
          </div>
         </div>
      </section>

      {/* Chase Specific FAQ */}
      <section className="section bg-surface-alt">
        <div className="container">
          <div className="section-header">
            <h2>Chase Converter FAQ</h2>
          </div>
          <div className="faq-list">
            {[
              {
                q: "Does Chase provide CSV exports natively?",
                a: "Chase allows downloading a CSV of recent activity, but they do NOT provide a way to download past monthly statements directly as CSV. If you only have older PDF statements, you must use a converter."
              },
              {
                q: "Will this work with Chase Business account statements?",
                a: "Yes. Chase Business statements have a slightly different tabular structure compared to personal checking accounts. Our algorithm detects this layout dynamically and parses it correctly."
              },
              {
                q: "How far back can I get Chase statements?",
                a: "Chase typically provides access to up to 7 years of statements through their online portal. You can download any of those historical PDFs and run them through our tool immediately."
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

      <section className="cta-section" style={{ background: '#003087' }}>
        <div className="container">
          <h2>Ready to extract your Chase statement?</h2>
          <button className="btn" onClick={scrollToConverter} style={{ color: '#003087' }}>
            Convert Chase PDF Now <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
