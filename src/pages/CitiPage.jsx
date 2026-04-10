import React, { useState } from 'react';
import { ChevronDown, ArrowRight, ShieldCheck, CreditCard, LayoutTemplate } from 'lucide-react';
import SeoHead from '../components/SeoHead';
import ConverterTool from '../components/ConverterTool';

export default function CitiPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const scrollToConverter = () => {
    document.getElementById('converter')?.scrollIntoView({ behavior: 'smooth' });
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Convert Citibank Statement to CSV",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Download PDF from Citibank",
        "text": "Log into your Citibank account, go to the Statements tab, and download your monthly PDF."
      },
      {
        "@type": "HowToStep",
        "name": "Local Processing",
        "text": "Drag and drop the Citibank PDF into the browser converter. It runs 100% locally."
      },
      {
        "@type": "HowToStep",
        "name": "Export Data",
        "text": "Download the extracted CSV directly to your computer."
      }
    ]
  };

  return (
    <div className="citi-page">
      <SeoHead 
        title="Citibank Statement PDF to CSV Converter | 100% Free"
        description="Extract tables from Citibank statement PDFs to CSV instantly. Zero cloud uploads — absolutely private processing right in your web browser."
        canonical="https://bankstatementconverttool.com/citibank"
        jsonLd={[schema]}
      />

      <header className="hero" style={{ background: '#F4F7FB' }}>
        <div className="container">
          <div className="hero-badge" style={{ color: '#003B70', background: '#E6F0FF', borderColor: '#B3D4FF' }}>
            <ShieldCheck size={14} />
            Optimized for Citibank Credit & Checking
          </div>
          <h1>Convert <span>Citibank</span> Statements to CSV</h1>
          <p className="hero-subtitle">
            Skip the manual data entry. Our proprietary engine is designed to parse Citibank's specific multi-column layout accurately and privately.
          </p>
          
          <div className="mt-4" style={{ marginTop: '2rem' }}>
            <ConverterTool />
          </div>
        </div>
      </header>

      {/* Format Explainer Section */}
      <section className="section">
         <div className="container">
          <div className="format-explainer-card" style={{ background: '#003B70' }}>
            <div className="explainer-content">
              <h2>Handling Citibank Formatting</h2>
              <p>Citibank often uses a very dense layout, especially on credit card statements, with long merchant descriptions that wrap to a second line. Basic PDF converters smash this text together.</p>
              <ul>
                <li><LayoutTemplate size={16}/> Automatically stitches wrapped merchant descriptions back together</li>
                <li><CreditCard size={16}/> Works seamlessly with Citi Double Cash, Custom Cash, and checking statements</li>
                <li><ShieldCheck size={16}/> Bank-grade privacy: we never see your data because nothing is uploaded</li>
              </ul>
            </div>
          </div>
         </div>
      </section>

      {/* Guide Section */}
      <section className="section bg-surface-alt" id="guide">
        <div className="container">
          <div className="section-header">
            <span className="section-label" style={{ color: '#003B70' }}>Exporting Data</span>
            <h2>How to Use the Citibank Converter</h2>
          </div>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number" style={{ background: '#003B70', color: 'white', borderColor: '#003B70' }}>1</div>
              <h3>Download PDF</h3>
              <p>Save the official monthly statement from your Citibank online portal.</p>
            </div>
            <div className="step-card">
              <div className="step-number" style={{ background: '#ED1B24', color: 'white', borderColor: '#ED1B24' }}>2</div>
              <h3>Drag & Drop</h3>
              <p>Place the file in the dropzone above. Ensure it is a text-based PDF, not a scanned image.</p>
            </div>
            <div className="step-card">
              <div className="step-number" style={{ background: '#003B70', color: 'white', borderColor: '#003B70' }}>3</div>
              <h3>Download CSV</h3>
              <p>Your transactions are instantly ready to import into QuickBooks, Excel, or Google Sheets.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Citi Specific FAQ */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Citibank PDF to CSV FAQ</h2>
          </div>
          <div className="faq-list">
            {[
              {
                q: "Does this work with my Citi Costco card statement?",
                a: "Yes. Co-branded cards like the Citi Costco Anywhere Visa or the AAdvantage program use the standard Citibank eStatement layout, which our tool fully supports."
              },
              {
                q: "Why use a PDF converter instead of Citi's CSV download?",
                a: "While Citibank lets you download recent activity as a CSV, you often cannot get historical CSV files for past years. For long-term bookkeeping or catching up on old taxes, parsing the legacy PDFs is your only option."
              },
              {
                q: "What if there are multiple accounts on one PDF?",
                a: "Citibank sometimes bundles checking and savings on one document. Our parser looks for chronological date entries and groups them, skipping summary headers in between."
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

      <section className="cta-section" style={{ background: '#003B70' }}>
        <div className="container">
          <h2>Ready to extract your Citibank data?</h2>
          <button className="btn" onClick={scrollToConverter} style={{ color: '#003B70', background: 'white' }}>
            Convert PDF Now <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
