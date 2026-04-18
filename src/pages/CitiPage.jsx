import React from 'react';
import SeoHead from '../components/SeoHead';
import ConverterTool from '../components/ConverterTool';
import { Database, Binary, Cpu } from 'lucide-react';

export default function CitiPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Citibank PDF Data Extraction Protocol",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "WebBrowser",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <SeoHead 
        title="Extract Citibank PDF Statements to CSV | High-Fidelity App"
        description="A robust local browser engine designed to parse Citibank checking and credit card PDFs. Handles multi-line descriptions and layout indentations reliably."
        canonical="https://www.bankstatementconverttool.com/citibank"
        jsonLd={[schema]}
      />

      {/* DATA INTELLIGENCE HERO */}
      <header className="citi-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="citi-hero-badge">
            <Cpu size={16} /> Enterprise-Grade Parsing Engine
          </div>
          <h1>Map <span>Citibank Data</span> to CSV</h1>
          <p>
            Process complex Citibank checking and credit card layouts into raw data streams. <br/>
            A secure, zero-upload tool for accountants and data scientists.
          </p>
        </div>
      </header>

      {/* OVERLAPPING CONVERTER TOOL */}
      <div className="citi-overlap-zone" id="converter">
        <ConverterTool />
      </div>

      <div className="citi-content-wrapper">
        <h2 className="citi-section-title">The Citibank Ledger Protocol</h2>
        
        {/* UNIQUE DOM 1: FAQ Style Sync */}
        <div className="faq-list" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="faq-item open">
            <div className="faq-question" style={{ cursor: 'default' }}>
              Indentation Architecture in Citi Credit Cards
            </div>
            <div className="faq-answer" style={{ maxHeight: 'none', opacity: 1, paddingBottom: '1.5rem' }}>
              <p>Citibank credit card PDFs frequently utilize heavy indentation. Our extraction algorithm reads the native PDF vector text layer, aligning deeply indented text back to its corresponding chronological row automatically.</p>
            </div>
          </div>

          <div className="faq-item open">
            <div className="faq-question" style={{ cursor: 'default' }}>
              Multi-Line Data Wrap Resolution
            </div>
            <div className="faq-answer" style={{ maxHeight: 'none', opacity: 1, paddingBottom: '1.5rem' }}>
              <p>Citibank descriptions frequently wrap onto multiple lines. Our logic engine evaluates spacing and dynamically concatenates these strings back into a single cell, preventing row-shifting errors.</p>
            </div>
          </div>

          <div className="faq-item open">
            <div className="faq-question" style={{ cursor: 'default' }}>
              Client-Side Autonomous Processing
            </div>
            <div className="faq-answer" style={{ maxHeight: 'none', opacity: 1, paddingBottom: '1.5rem' }}>
              <p>To maintain strict compliance, this tool does not utilize a backend server. Your Citibank PDFs are evaluated entirely using your local device memory, guaranteeing zero exposure to external databases.</p>
            </div>
          </div>
        </div>

        <h2 className="citi-section-title">Data Output Dictionary</h2>

        {/* UNIQUE DOM 2: HTML Data Table */}
        <section className="citi-table-container">
          <table className="citi-data-table">
            <thead>
              <tr>
                <th>Citibank PDF Column</th>
                <th>Extraction Methodology</th>
                <th>CSV Output Standard</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="col-bold">Trans. Date</td>
                <td>Regex anchored to left margin. MM/DD/YYYY format.</td>
                <td className="col-highlight">Date</td>
              </tr>
              <tr>
                <td className="col-bold">Description</td>
                <td>Multi-line concatenation applied. No bullet points.</td>
                <td className="col-highlight">Description</td>
              </tr>
              <tr>
                <td className="col-bold">Amount</td>
                <td>Algebraic signs (+/-). Stripped currency symbols.</td>
                <td className="col-highlight">Amount (Float)</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Extract Your Citibank Data?</h2>
          <p>The standard-bearer for local Citi statement parsing for professional finance teams.</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={() => document.getElementById('converter').scrollIntoView({ behavior: 'smooth' })}>
              Begin Citi Parsing <Binary size={16} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
