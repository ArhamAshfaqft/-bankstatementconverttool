import React from 'react';
import SeoHead from '../components/SeoHead';
import ConverterTool from '../components/ConverterTool';
import { FileDown, RefreshCcw, Lock } from 'lucide-react';

export default function CitiPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "The Ultimate Guide to Exporting Citibank Statements to CSV",
    "author": {
      "@type": "Organization",
      "name": "StatementToCSV Data Labs"
    }
  };

  return (
    <article className="citi-editorial-layout">
      <SeoHead 
        title="Citibank Statement to CSV | Free Data Parsing Engine"
        description="Read our comprehensive guide and use our integrated local tool to parse dense Citibank credit card and checking PDFs into functional spreadsheets."
        canonical="https://bankstatementconverttool.com/citibank"
        jsonLd={[schema]}
      />

      <header className="ce-hero">
        <div className="container">
          <h1 className="ce-title">The Citibank Statement Extraction Protocol</h1>
          <p className="ce-lead">
            Citibank produces some of the most data-dense PDFs in the financial industry. Here is exactly how professionals parse them into spreadsheets without compromising client privacy.
          </p>
          <div className="ce-meta">
            <span>By Data Engineering Team</span> • <span>Updated April 2026</span>
          </div>
        </div>
      </header>

      <div className="container ce-content-body">
        
        <div className="ce-prose">
          <h2>The Problem with Citibank's Native Export</h2>
          <p>
            While Citibank does offer a CSV download button in their online portal, it suffers from a major limitation: <strong>historical access</strong>. If you are an accountant doing catch-up bookkeeping for a client, you often cannot download raw CSVs from 3 years ago. You are stuck with locked PDF eStatements.
          </p>

          <h2>The Solution: Local Browser Extraction</h2>
          <p>
            Using cloud-based OCR to convert banking documents is a massive security risk. Instead, we built the <strong>Zero-Upload PDF Parsing Engine</strong> below. It downloads the extraction logic to your browser and processes the Citibank file using your computer's RAM.
          </p>
        </div>

        {/* Embedded Tool within the editorial flow */}
        <section className="ce-tool-injection">
          <div className="ce-tool-header">
            <h3><Lock size={18}/> Secure Local Execution Environment</h3>
            <p>Drop your Citibank PDF below. It will NOT be uploaded to any server.</p>
          </div>
          <ConverterTool />
        </section>

        <div className="ce-prose">
          <h2>Why Citibank's Layout Breaks Other Converters</h2>
          <p>
            Citibank credit card statements (like the Costco Anywhere Visa or Double Cash) use a specific indentation tracking system. The transaction date, post date, and merchant string are often misaligned on the PDF canvas.
          </p>
          
          <div className="ce-infographic">
            <div className="ce-info-box">
              <FileDown size={28} style={{ color: '#003B70' }}/>
              <h4>Wrapped Descriptions</h4>
              <p>Long merchant names span two lines. We concatenate them automatically.</p>
            </div>
            <div className="ce-info-box">
              <RefreshCcw size={28} style={{ color: '#003B70' }}/>
              <h4>Cross-Account Linking</h4>
              <p>We intelligently split "Checking" vs "Savings" tables from a single document.</p>
            </div>
          </div>

          <h2>Step-by-Step Accounting Import</h2>
          <p>Once you retrieve the CSV from our engine above, open it in Excel. You will notice that we have stripped the `$` signs and removed comma separators. This is an intentional feature — it means the data is immediately recognizable as numeric integers by programs like Xero, Intuit QuickBooks, and Sage.</p>
        </div>
      </div>
    </article>
  );
}
