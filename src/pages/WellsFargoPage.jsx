import React, { useState } from 'react';
import { ChevronDown, ArrowRight, ShieldCheck, DownloadCloud, FileText } from 'lucide-react';
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
    "name": "How to Convert Wells Fargo Bank Statement to CSV",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Download PDF from Wells Fargo",
        "text": "Log into Wells Fargo online banking, go to Statements & Documents, and download your eStatement PDF."
      },
      {
        "@type": "HowToStep",
        "name": "Upload to Converter",
        "text": "Drag and drop your Wells Fargo PDF into our secure local converter tool."
      },
      {
        "@type": "HowToStep",
        "name": "Export CSV",
        "text": "Click download to instantly receive a CSV formatted perfectly for Excel, QuickBooks, or Xero."
      }
    ]
  };

  return (
    <div className="wells-fargo-page">
      <SeoHead 
        title="Convert Wells Fargo Statement PDF to CSV | Secure & Free"
        description="Instantly convert your Wells Fargo bank statement PDFs to CSV format. 100% private, local processing directly in your browser. Perfect for checking and savings."
        canonical="https://bankstatementconverttool.com/wells-fargo"
        jsonLd={[schema]}
      />

      <header className="hero" style={{ background: '#FFFDF9' }}>
        <div className="container">
          <div className="hero-badge" style={{ color: '#D71E28', background: '#FDE101', borderColor: '#FDE101' }}>
            <ShieldCheck size={14} />
            Optimized for Wells Fargo Checking & Savings
          </div>
          <h1>Convert <span>Wells Fargo</span> Statements to CSV</h1>
          <p className="hero-subtitle">
            Securely extract transaction data from your Wells Fargo PDFs. Our tool perfectly parses Wells Fargo's unique table layout entirely offline in your browser.
          </p>
          
          <div className="mt-4" style={{ marginTop: '2rem' }}>
            <ConverterTool />
          </div>
        </div>
      </header>

      {/* Format Explainer Section */}
      <section className="section">
         <div className="container">
          <div className="format-explainer-card" style={{ background: '#D71E28' }}>
            <div className="explainer-content">
              <h2>Wells Fargo PDF Parsing Technology</h2>
              <p>Wells Fargo statements often group checks and electronic transactions into separate tables. Manually copying this data into Excel ruins the formatting. Our smart algorithm identifies these distinct data blocks and merges them into a clean, unified CSV timeline.</p>
              <ul>
                <li><FileText size={16}/> Merges "Deposits/Additions" and "Withdrawals/Subtractions" cleanly</li>
                <li><DownloadCloud size={16}/> Standardizes dates to easily sort in Excel</li>
                <li><ShieldCheck size={16}/> Ignores the overdraft fee warning boxes and summary graphics</li>
              </ul>
            </div>
          </div>
         </div>
      </section>

      {/* Guide Section */}
      <section className="section bg-surface-alt" id="guide">
        <div className="container">
          <div className="section-header">
            <span className="section-label" style={{ color: '#D71E28' }}>Tutorial</span>
            <h2>How to Export Your Wells Fargo Statement</h2>
            <p>Need past data for taxes? Wells Fargo provides up to 7 years of statements in PDF format.</p>
          </div>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number" style={{ background: '#D71E28', color: 'white', borderColor: '#D71E28' }}>1</div>
              <h3>Log In</h3>
              <p>Sign in to wellsfargo.com and select your primary account.</p>
            </div>
            <div className="step-card">
              <div className="step-number" style={{ background: '#D71E28', color: 'white', borderColor: '#D71E28' }}>2</div>
              <h3>Get Statements</h3>
              <p>Navigate to "Statements & Documents" and choose the exact month you need.</p>
            </div>
            <div className="step-card">
              <div className="step-number" style={{ background: '#D71E28', color: 'white', borderColor: '#D71E28' }}>3</div>
              <h3>Convert Offline</h3>
              <p>Drop the downloaded PDF into our tool above to instantly generate a clean CSV.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Wells Fargo Specific FAQ */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Wells Fargo Converter FAQ</h2>
          </div>
          <div className="faq-list">
            {[
              {
                q: "Does Wells Fargo let you download CSVs directly?",
                a: "Yes, via Quicken/QuickBooks download options, but often only for recent transactions (usually 90 to 180 days). If you need an older month, you have to use the official PDF statement. Our tool unlocks that PDF data."
              },
              {
                q: "Will this work on Wells Fargo business accounts?",
                a: "Yes, Wells Fargo business checking statements follow a similar tabular structure which our engine detects and parses perfectly."
              },
              {
                q: "Is it safe to upload my Wells Fargo statement?",
                a: "Because this is a zero-upload converter, your PDF never actually leaves your computer. The conversion happens entirely locally inside your Chrome/Safari/Edge browser. We can never see your balances or account numbers."
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

      <section className="cta-section" style={{ background: '#D71E28' }}>
        <div className="container">
          <h2>Ready to extract your Wells Fargo data?</h2>
          <button className="btn" onClick={scrollToConverter} style={{ color: '#D71E28', background: 'white' }}>
            Convert PDF Now <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
