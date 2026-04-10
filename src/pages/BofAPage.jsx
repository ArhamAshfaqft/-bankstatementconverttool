import React from 'react';
import SeoHead from '../components/SeoHead';
import ConverterTool from '../components/ConverterTool';
import { ChevronDown, Briefcase, FileSearch, ShieldAlert, CheckCircle } from 'lucide-react';

export default function BofAPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Bank of America Data Extraction Engine",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "WebBrowser",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="bofa-page-wrapper" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      <SeoHead 
        title="Bank of America Statement PDF to CSV | Professional Audit Utility"
        description="A high-fidelity local browser engine optimized for Bank of America checking and savings statements. Secure, zero-retention extraction for multi-year accounting audits."
        canonical="https://bankstatementconverttool.com/bank-of-america"
        jsonLd={[schema]}
      />

      {/* PREMIUM BofA HERO */}
      <header className="bofa-hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="bofa-hero-badge">
            <CheckCircle size={16} /> Audit-Ready Data Precision
          </div>
          <h1>Convert <span>Bank of America</span> to CSV</h1>
          <p>
            Securely extract deep historical transaction data from BofA eStatements. An offline tool designed for the rigorous requirements of professional tax preparation.
          </p>
        </div>
      </header>

      {/* OVERLAPPING CONVERTER TOOL */}
      <div className="bofa-overlap-zone">
        <ConverterTool />
      </div>

      <div className="bofa-audit-container">
        <h2 className="bofa-section-title">The Auditor's Extraction Guide</h2>
        
        {/* UNIQUE DOM 1: Details/Summary Accordion */}
        <div className="bofa-audit-flow">
          <details className="bofa-audit-item" open>
            <summary>
              <FileSearch size={22} />
              Resolving "Page Continuation" Orphans
              <ChevronDown size={20} className="ml-auto" />
            </summary>
            <div className="bofa-audit-content">
              Bank of America statements frequently break a single transaction across two physical pages if it occurs right at the margin. Generic converters see this as a "noise" row and often miscalculate the ending balance. Our parser <strong>re-stitches orphaned description strings</strong> by evaluating the vertical padding between text blocks, ensuring your CSV row integrity remains 100% accurate for multi-page documents.
            </div>
          </details>

          <details className="bofa-audit-item">
            <summary>
              <Briefcase size={22} />
              Merchant Category Extraction
              <ChevronDown size={20} className="ml-auto" />
            </summary>
            <div className="bofa-audit-content">
              BofA statements often include a secondary line for "Merchant Category" or "MCC" codes underneath the retailer name. While useful for humans, these codes can clutter a clean QuickBooks import. Our engine allows you to extract the raw merchant name while <strong>discarding the internal Bank of America metadata</strong>, yielding a cleaner ledger with zero manual cleanup required.
            </div>
          </details>

          <details className="bofa-audit-item">
            <summary>
              <ShieldAlert size={22} />
              Bypassing Image-Based Data Layers
              <ChevronDown size={20} className="ml-auto" />
            </summary>
            <div className="bofa-audit-content">
              Modern BofA eStatements use a hybrid vector-and-image layout. Attempting to "Export to Excel" using standard PDF readers often misses the image-anchored amounts entirely. By reading the <strong>underlying coordinate map</strong> of the document rather than doing simple OCR, our tool captures data points that are visually "locked" on the statement canvas.
            </div>
          </details>
        </div>

        {/* UNIQUE DOM 2: Audit Checklist Card */}
        <div className="bofa-checklist-card">
          <div className="bofa-checklist-text">
            <h3>BofA Audit Preparedness</h3>
            <ul>
              <li><CheckCircle size={18} /> Resolves Multi-Year Catchup</li>
              <li><CheckCircle size={18} /> Strips All Currency Symbols</li>
              <li><CheckCircle size={18} /> 100% Browser-Local RAM Processing</li>
              <li><CheckCircle size={18} /> Algebraically Parsed Valences</li>
              <li><CheckCircle size={18} /> Zero-Trace Browser History</li>
              <li><CheckCircle size={18} /> Accurate for Corporate Ledgers</li>
            </ul>
          </div>
        </div>

      </div>
      <div style={{ height: '4rem' }}></div>
    </div>
  );
}
