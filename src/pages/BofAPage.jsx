import React, { useState } from 'react';
import { ChevronDown, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import SeoHead from '../components/SeoHead';
import ConverterTool from '../components/ConverterTool';

export default function BofAPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const scrollToConverter = () => {
    document.getElementById('converter')?.scrollIntoView({ behavior: 'smooth' });
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Convert Bank of America Statement PDF",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Prepare PDF",
        "text": "Download your Bank of America eStatement."
      },
      {
        "@type": "HowToStep",
        "name": "Parse Tables",
        "text": "Upload the PDF into our local converter. It scans completely offline."
      },
      {
        "@type": "HowToStep",
        "name": "Export Data",
        "text": "Download the newly formatted CSV file for your accounting needs."
      }
    ]
  };

  return (
    <div className="bofa-page">
      <SeoHead 
        title="Bank of America Statement PDF to CSV | Convert Offline"
        description="Convert your Bank of America statements to CSV instantly. Zero cloud uploads — 100% private, local processing inside your browser. No registration required."
        canonical="https://bankstatementconverttool.com/bank-of-america"
        jsonLd={[schema]}
      />

      <header className="hero bofa-hero">
        <div className="container">
          <div className="hero-badge bofa-badge" style={{ color: '#E31837', background: '#FEF2F2', borderColor: '#FECACA' }}>
            <Lock size={14} />
            100% Secure & Private BofA Statement Parsing
          </div>
          <h1><span>Bank of America</span> Statement to CSV Converter</h1>
          <p className="hero-subtitle">
            Skip the manual data entry. Drop your Bank of America PDF below and let our browser-based algorithm extract your transaction history securely in seconds.
          </p>
          
          <div className="mt-4" style={{ marginTop: '2rem' }}>
            <ConverterTool />
          </div>
        </div>
      </header>

      {/* Comparison Table Section */}
      <section className="section bg-surface-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label" style={{ color: '#E31837' }}>Comparison</span>
            <h2>BofA Online Export vs. Our Converter</h2>
            <p>Why do you need a converter when Bank of America offers online downloads?</p>
          </div>
          
          <div className="comparison-table-wrapper" style={{ maxWidth: '800px', margin: '0 auto', background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ background: '#012169', color: 'white', padding: '1rem', textAlign: 'left' }}>Feature</th>
                  <th style={{ background: '#F3F4F6', color: '#111827', padding: '1rem', textAlign: 'center' }}>BofA Natively</th>
                  <th style={{ background: '#FEF2F2', color: '#E31837', padding: '1rem', textAlign: 'center' }}>Our Converter</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #E5E7EB' }}>Current Month Transactions</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #E5E7EB', textAlign: 'center' }}>✅ Yes</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #E5E7EB', textAlign: 'center' }}>✅ Yes</td>
                </tr>
                <tr>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #E5E7EB' }}>Old Statement CSVs (1+ years)</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #E5E7EB', textAlign: 'center' }}>❌ No (PDF Only)</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #E5E7EB', textAlign: 'center' }}>✅ Yes</td>
                </tr>
                <tr>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #E5E7EB' }}>Combine Multiple Months</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #E5E7EB', textAlign: 'center' }}>❌ No</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #E5E7EB', textAlign: 'center' }}>✅ Yes</td>
                </tr>
                <tr>
                  <td style={{ padding: '1rem' }}>Zero Upload Privacy</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>✅ Yes</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>✅ Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Guide Section */}
      <section className="section" id="guide">
        <div className="container">
          <div className="section-header">
            <h2>How to Export Your Bank of America Statement</h2>
          </div>
          <div className="bofa-guide-content" style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.8' }}>
            <p>If you need historical data for tax or accounting purposes, BofA restricts CSV downloads to recent months. For earlier periods, you are stuck with PDF eStatements. Here is how you convert them:</p>
            <ol style={{ paddingLeft: '2rem', marginTop: '1rem' }}>
              <li>Log in to Bank of America online banking.</li>
              <li>Navigate to your desired account and click the <strong>Statements & Documents</strong> tab.</li>
              <li>Select the specific month/year and click the red PDF icon to download it.</li>
              <li>Once downloaded, do not open it in a viewer. Drag the file directly into the converter box at the top of this page.</li>
              <li>In less than a second, you will have a CSV file ready for Excel.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* BofA Specific FAQ */}
      <section className="section bg-surface-alt">
        <div className="container">
          <div className="section-header">
            <h2>Bank of America Converter FAQ</h2>
          </div>
          <div className="faq-list">
            {[
              {
                q: "Can I convert BofA Merrill Lynch investment statements?",
                a: "Yes! Our parser detects the different table structures used by Merrill Lynch accounts alongside standard BofA checking accounts."
              },
              {
                q: "Does this work with BofA savings account statements?",
                a: "Absolutely. Savings accounts generally have a simpler table format than checking accounts, which our tool handles flawlessly."
              },
              {
                q: "How do I remove the summary data at the top of the BofA PDF?",
                a: "You don't need to manually remove anything. Our algorithm automatically skips the Account Summary box and only extracts the actual transaction list."
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

      <section className="cta-section" style={{ background: '#E31837' }}>
        <div className="container">
          <h2>Extract your BofA transactions instantly.</h2>
          <button className="btn" onClick={scrollToConverter} style={{ color: '#E31837' }}>
            Try it now for free <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
