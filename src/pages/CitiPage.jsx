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
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      <SeoHead 
        title="Extract Citibank PDF Statements to CSV | High-Fidelity App"
        description="A robust local browser engine designed to parse Citibank checking and credit card PDFs. Handles multi-line descriptions and layout indentations reliably."
        canonical="https://bankstatementconverttool.com/citibank"
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
            Process complex Citibank checking and credit card layouts into raw data streams. A secure, zero-upload tool for accountants and data scientists.
          </p>
        </div>
      </header>

      {/* OVERLAPPING CONVERTER TOOL */}
      <div className="citi-overlap-zone">
        <ConverterTool />
      </div>

      <div className="citi-content-wrapper">
        <h2 className="citi-section-title">The Citibank Ledger Protocol</h2>
        
        {/* UNIQUE DOM 1: HTML Definition List (<dl>) */}
        <section className="citi-ledger">
          <dl>
            <dt>
              <Binary size={24} /> 
              Indentation Architecture in Citi Credit Cards
            </dt>
            <dd>
              Unlike traditional bank statements, Citibank credit card PDFs (such as the Costco Anywhere Visa or Double Cash card) frequently utilize heavy indentation. The <strong>Transaction Date</strong> and the merchant description are often on entirely different vertical (`x`) axes, which causes generic optical character recognition (OCR) to fail or merge columns inappropriately. Our extraction algorithm reads the native PDF vector text layer, aligning deeply indented text back to its corresponding chronological row.
            </dd>

            <dt>
              <Database size={24} />
              Multi-Line Data Wrap Resolution
            </dt>
            <dd>
              Citibank descriptions frequently run long and wrap onto a second or third line (e.g., long Amazon marketplace strings or International wire details). Our logic engine evaluates spacing and dynamically concatenates multi-line text strings back into a single <code>Description</code> cell, preventing row-shifting errors when importing into your ledger.
            </dd>

            <dt>
              <Cpu size={24} />
              Client-Side Autonomous Processing
            </dt>
            <dd>
              To maintain strict compliance with financial data handling policies, this tool does not utilize a backend data server. The processing logic is downloaded directly to your Chrome, Safari, or Edge browser. Your Citibank PDFs are evaluated entirely using your local device memory, guaranteeing zero exposure to external cloud databases.
            </dd>
          </dl>
        </section>

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
                <td>Identified via regex anchored to the left margin. Standardized to MM/DD/YYYY format.</td>
                <td className="col-highlight">Date</td>
              </tr>
              <tr>
                <td className="col-bold">Post Date</td>
                <td>Evaluated but intentionally omitted from final export to prevent duplicate ledger entries in QuickBooks.</td>
                <td>(Omitted)</td>
              </tr>
              <tr>
                <td className="col-bold">Description</td>
                <td>Multi-line concatenation applied. Extraneous spacing and bullet points stripped.</td>
                <td className="col-highlight">Description</td>
              </tr>
              <tr>
                <td className="col-bold">Amount</td>
                <td>Currency symbols ($, €) and thousands-separators stripped. Valences (Credits/Debits) mapped to algebraic signs (+/-).</td>
                <td className="col-highlight">Amount (Float)</td>
              </tr>
            </tbody>
          </table>
        </section>

      </div>
    </div>
  );
}
