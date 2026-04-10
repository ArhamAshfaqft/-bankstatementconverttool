import React from 'react';
import SeoHead from '../components/SeoHead';
import ConverterTool from '../components/ConverterTool';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function WellsFargoPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Wells Fargo Statement to CSV Converter",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "WebBrowser",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="wf-split-layout">
      <SeoHead 
        title="Wells Fargo Bank Statement PDF to CSV | Instant Converter"
        description="A specialized, browser-based CSV converter built exclusively to handle Wells Fargo's unique statement layouts. 100% free and locally processed."
        canonical="https://bankstatementconverttool.com/wells-fargo"
        jsonLd={[schema]}
      />

      <div className="wf-container">
        {/* Left Side: The Interactive Tool */}
        <aside className="wf-tool-panel">
          <div className="wf-header-branding">
            <span className="wf-tag">V 2.1 Engine</span>
            <h1>Extract <span>Wells Fargo</span> Data</h1>
            <p>Upload your PDF eStatement to generate Excel-ready data blocks.</p>
          </div>
          
          <div className="wf-converter-wrap" id="converter">
            <ConverterTool />
          </div>
          
          <div className="wf-privacy-seal">
            <ShieldCheck size={24} color="#D71E28" />
            <div>
              <strong>Client-Side Processing</strong>
              <p>Your PDFs never touch an external server.</p>
            </div>
          </div>
        </aside>

        {/* Right Side: Editorial Context */}
        <main className="wf-context-panel">
          <section className="wf-article-section">
            <h2 className="wf-heading">Why Wells Fargo PDFs are Difficult to Parse</h2>
            <p className="wf-body">
              Unlike standard statements that use a single chronological ledger, Wells Fargo separates checking activity into <strong>Deposits/Additions</strong> and <strong>Withdrawals/Subtractions</strong> tables.
            </p>
            <p className="wf-body">
              If you try to copy and paste this into Excel, the dates and amounts will shatter. Our extraction script targets the exact coordinate space of Wells Fargo's tables to rebuild a single chronological feed automatically.
            </p>
          </section>

          <section className="wf-checklist">
            <h3>Our Processing Pipeline Ensures:</h3>
            <ul>
              <li><CheckCircle2 size={18}/> <strong>Overdraft Warnings Ignored:</strong> Wells Fargo inserts text boxes warning about overdrafts. We strip these automatically.</li>
              <li><CheckCircle2 size={18}/> <strong>Date Normalization:</strong> Dates are converted strictly to standard numeric values for QuickBooks importing.</li>
              <li><CheckCircle2 size={18}/> <strong>Check Image By-pass:</strong> If your PDF includes check scans at the bottom, our parser halts cleanly and ignores the image layers.</li>
            </ul>
          </section>

          <div className="wf-help-box">
            <h4>How to get your legacy PDFs</h4>
            <ol>
              <li>Login via wellsfargo.com from a Desktop computer.</li>
              <li>Hover over your checking account and click "Statements".</li>
              <li>You can scroll back up to 7 years. Download the red PDF icon.</li>
              <li>Do not open the file in another viewer before converting.</li>
            </ol>
          </div>
        </main>
      </div>
    </div>
  );
}
