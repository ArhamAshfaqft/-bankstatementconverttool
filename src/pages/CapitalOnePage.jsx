import React, { useState } from 'react';
import { ChevronDown, ArrowRight, ShieldCheck, DownloadCloud, Code } from 'lucide-react';
import SeoHead from '../components/SeoHead';
import ConverterTool from '../components/ConverterTool';

export default function CapitalOnePage() {
  const [openFaq, setOpenFaq] = useState(null);

  const scrollToConverter = () => {
    document.getElementById('converter')?.scrollIntoView({ behavior: 'smooth' });
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Convert Capital One Bank Statement to CSV",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Export Statement",
        "text": "Log into Capital One, navigate to your 360 checking or credit card account, and generate your monthly PDF statement."
      },
      {
        "@type": "HowToStep",
        "name": "Drag to Converter",
        "text": "Drop your downloaded Capital One PDF into the free converter tool."
      },
      {
        "@type": "HowToStep",
        "name": "Save as CSV",
        "text": "Download the parsed tables immediately as a clean CSV file."
      }
    ]
  };

  return (
    <div className="capitalone-page">
      <SeoHead 
        title="Capital One Statement PDF to CSV | Free Local Converter"
        description="Convert your Capital One 360 or credit card statement PDFs to CSV format. 100% private, zero-upload tool runs entirely in your web browser."
        canonical="https://bankstatementconverttool.com/capital-one"
        jsonLd={[schema]}
      />

      <header className="hero" style={{ background: '#F8FBFF' }}>
        <div className="container">
          <div className="hero-badge" style={{ color: '#D22E1E', background: '#FFEEEE', borderColor: '#FFCCCC' }}>
            <ShieldCheck size={14} />
            Optimized for Capital One 360 & Credit
          </div>
          <h1>Convert <span>Capital One</span> Statements to CSV</h1>
          <p className="hero-subtitle">
            Instantly turn your Capital One PDF statements into clean, structured CSV data ready for Excel or Xero. 100% private, browser-based extraction.
          </p>
          
          <div className="mt-4" style={{ marginTop: '2rem' }}>
            <ConverterTool />
          </div>
        </div>
      </header>

      {/* Format Explainer Section */}
      <section className="section">
         <div className="container">
          <div className="format-explainer-card" style={{ background: '#003A6F' }}>
            <div className="explainer-content">
              <h2>Capital One 360 Processing</h2>
              <p>Capital One 360 checking statements use a minimalist design that can sometimes trip up rudimentary OCR systems. Since our algorithm reads the raw internal PDF data instead of taking a picture, accuracy is perfect.</p>
              <ul>
                <li><Code size={16}/> Reads native Capital One PDF text nodes natively</li>
                <li><DownloadCloud size={16}/> Produces an Excel-friendly 'clean numbers' format (no currency symbols)</li>
                <li><ShieldCheck size={16}/> Secures your financial data entirely on your machine</li>
              </ul>
            </div>
          </div>
         </div>
      </section>

      {/* Guide Section */}
      <section className="section bg-surface-alt" id="guide">
        <div className="container">
          <div className="section-header">
            <span className="section-label" style={{ color: '#D22E1E' }}>Quick Guide</span>
            <h2>Capital One Export Process</h2>
          </div>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number" style={{ background: '#003A6F', color: 'white', borderColor: '#003A6F' }}>1</div>
              <h3>Sign In</h3>
              <p>Go to your Capital One dashboard and select the specific account.</p>
            </div>
            <div className="step-card">
              <div className="step-number" style={{ background: '#D22E1E', color: 'white', borderColor: '#D22E1E' }}>2</div>
              <h3>Statements Tab</h3>
              <p>Click "View Statements" to retrieve the official PDF document for your chosen month.</p>
            </div>
            <div className="step-card">
              <div className="step-number" style={{ background: '#003A6F', color: 'white', borderColor: '#003A6F' }}>3</div>
              <h3>Convert Locally</h3>
              <p>Drag the file into our parser. The conversion process takes milliseconds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Capital One Specific FAQ */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Capital One Converter FAQ</h2>
          </div>
          <div className="faq-list">
            {[
              {
                q: "Can I convert Capital One business accounts?",
                a: "Yes. Spark Business accounts use a slightly different table structure, but our heuristic algorithm tracks the column boundaries effectively for both personal and business accounts."
              },
              {
                q: "What if my statement has a password?",
                a: "If Capital One provides a locked PDF, you will need to unlock it or print it to a new PDF before dropping it into our tool. Our current browser engine does not bypass passwords."
              },
              {
                q: "Does this upload my Capital One data to your servers?",
                a: "No. The entire conversion script is downloaded to your browser when you visit this page. When you drop the PDF, it is processed locally using your device's memory."
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

      <section className="cta-section" style={{ background: '#003A6F' }}>
        <div className="container">
          <h2>Ready to extract your Capital One data?</h2>
          <button className="btn" onClick={scrollToConverter} style={{ color: '#003A6F', background: 'white' }}>
            Convert PDF Now <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
