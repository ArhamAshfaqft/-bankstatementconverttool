import React from 'react';
import SeoHead from '../components/SeoHead';
import ConverterTool from '../components/ConverterTool';
import { User, Briefcase, Search, LocateFixed, Cpu, CheckCircle } from 'lucide-react';

export default function CapitalOnePage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Capital One Extract Engine",
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
        title="Extract Capital One PDF Statements to CSV | Secure Parsing"
        description="Convert Capital One 360 Personal and Spark Business PDF statements into CSV format natively in your browser. Accurate extraction for Quicken and QBO."
        canonical="https://bankstatementconverttool.com/capital-one"
        jsonLd={[schema]}
      />

      {/* SEGMENTED USE-CASE HERO */}
      <header className="cap1-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="cap1-hero-badge">
            <CheckCircle size={16} /> Verified Format Standard
          </div>
          <h1>Convert <span>Capital One</span> PDFs to CSV</h1>
          <p>
            An offline, zero-retention extraction protocol engineered specifically for the complexities of Capital One 360 Personal and Spark Business statements.
          </p>
        </div>
      </header>

      {/* OVERLAPPING CONVERTER TOOL */}
      <div className="cap1-overlap-zone">
        <ConverterTool />
      </div>

      {/* DUAL-COLUMN SEGMENTED LAYOUT (UNIQUE DOM) */}
      <section>
        <div className="cap1-segmented-grid">
          
          <div className="cap1-segment">
            <div className="cap1-segment-header">
              <User size={32} />
              <h2>360 Personal Accounts</h2>
            </div>
            <p>
              Capital One 360 Checking and Savings accounts use a streamlined table layout. However, they frequently span dozens of pages with repeating header rows.
            </p>
            <p>
              When a user attempts to manually convert these files, the page-breaks introduce blank spaces and "Date / Description / Amount" header text deep inside the resulting CSV.
            </p>
            <p style={{ fontWeight: 'bold', color: '#002147' }}>
              Our tool automatically filters repeating header columns and paginated noise, ensuring a continuous, unbroken data stream ready for standard ledger import.
            </p>
          </div>

          <div className="cap1-segment">
            <div className="cap1-segment-header">
              <Briefcase size={32} />
              <h2>Spark Business Cards</h2>
            </div>
            <p>
              Capital One Spark corporate accounts present a massive challenge for standard data extraction. Rather than a single master ledger, Spark PDFs group transactions into separate tables organized by the specific employee card number that made the purchase.
            </p>
            <p>
              Our algorithmic parser was designed to ignore these arbitrary card-holder segmentations. It identifies the chronological data arrays across the entire document and maps them into exactly one unified array.
            </p>
            <p style={{ fontWeight: 'bold', color: '#002147' }}>
              It resolves multi-card corporate ledgers into a single, comprehensive CSV output.
            </p>
          </div>

        </div>
      </section>

      {/* THE PIPELINE STEPPER (UNIQUE DOM: ORDERED LIST) */}
      <section className="cap1-pipeline-container">
        <h2 className="cap1-pipeline-title">The Local Extraction Pipeline</h2>
        <p className="cap1-pipeline-subtitle">How our zero-retention engine creates accurate spreadsheet data.</p>
        
        <ol className="cap1-stepper">
          <li>
            <div className="cap1-step-number">1</div>
            <h3>Regex Anchor Targeting</h3>
            <p>The parser scans the left-most vector axis of the Capital One PDF layout, dynamically searching for specific Date regex strings to determine where the transaction array begins and where the legal disclosures end.</p>
          </li>
          <li>
            <div className="cap1-step-number">2</div>
            <h3>Coordinate Row Mapping</h3>
            <p>Using the bounding-box API native to modern browsers, the tool calculates the precise <code>y-axis</code> baseline of each date and groups corresponding textual elements horizontally, preventing cross-column merging.</p>
          </li>
          <li>
            <div className="cap1-step-number">3</div>
            <h3>Currency Standardization</h3>
            <p>All extracted numerical values pass through a strict sanitization protocol. We strip trailing CR/DR markers, remove comma separators, and resolve negative sign valences to return raw algebraic float integers.</p>
          </li>
          <li>
            <div className="cap1-step-number">4</div>
            <h3>Offline Compilation</h3>
            <p>The resulting array is compiled using the PapaParse library directly within your local device memory, presenting a fully structured CSV file without ever establishing a connection to an external database.</p>
          </li>
        </ol>
      </section>

      <div style={{ height: '4rem' }}></div>
    </div>
  );
}
