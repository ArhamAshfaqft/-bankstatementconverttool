import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Zap, FileText, Layers, ArrowRight, Scissors, GitMerge } from 'lucide-react';
import MergerTool from '../components/MergerTool';
import SeoHead from '../components/SeoHead';

export default function MergePage() {
  return (
    <>
      <SeoHead 
        title="Merge Bank Statement PDFs — Free, Private & Instant | StatementToCSV"
        description="Combine multiple bank statement PDFs into one file for tax season. 100% local browser processing — your financial data never leaves your device."
        canonical="https://www.bankstatementconverttool.com/merge"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Bank Statement PDF Merger",
            "url": "https://www.bankstatementconverttool.com/merge",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "All",
            "description": "Merge multiple bank statement PDFs into one document. Split multi-month statements into individual files. 100% private, local browser processing.",
            "offers": { "@type": "Offer", "price": "0" }
          }
        ]}
      />

      {/* HERO */}
      <header className="hero">
        <div className="container">
          <div className="hero-content-stacked">
            <div className="hero-badge">
              <Lock size={14} />
              Privacy First: Processing occurs 100% locally in your session
            </div>
            <h1>
              Merge & Split Bank Statement <span>PDFs</span> Instantly
            </h1>
            <p className="hero-subtitle">
              The professional choice for compiling annual records. <br/>
              Combine or split multi-month statements with zero server exposure.
            </p>
          </div>

          <div className="hero-converter-fullwidth" id="converter">
            <MergerTool />
          </div>
        </div>
      </header>

      {/* Trust Bar */}
      <div className="trust-bar-full">
        <div className="container trust-bar">
          <div className="trust-item"><ShieldCheck size={16} /> No data uploaded</div>
          <div className="trust-item"><Zap size={16} /> Instant local processing</div>
          <div className="trust-item"><Layers size={16} /> Unlimited pages support</div>
          <div className="trust-item"><Lock size={16} /> Private & Account-free</div>
        </div>
      </div>

      {/* USE CASES */}
      <section className="section section-alt" id="use-cases">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Solutions</span>
            <h2>Why Professionals Use Our Merger</h2>
            <p>Built for the complex workflows of accountants and financial analysts.</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number"><FileText size={18} /></div>
              <h3>Tax Consolidation</h3>
              <p>Hand one clean master file to your CPA instead of a folder of individual monthly downloads. Perfect for annual reviews.</p>
            </div>
            <div className="step-card">
              <div className="step-number"><Scissors size={18} /></div>
              <h3>Loan Document Prep</h3>
              <p>Many lenders require a single file for multi-month history. Merge them instantly without exposing sensitive account data.</p>
            </div>
            <div className="step-card">
              <div className="step-number"><GitMerge size={18} /></div>
              <h3>Audit Compliance</h3>
              <p>Compile quarterly or annual bank records into one master document for internal audits or legal discovery requests.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="section" id="faq">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Audit & Security</span>
            <h2>Merger Technical Specs</h2>
            <p>Our commitment to 100% privacy when dealing with sensitive document operations.</p>
          </div>

          <div className="faq-list">
            <div className="faq-item open">
              <div className="faq-question" style={{ cursor: 'default' }}>
                How is local merging safer than cloud tools?
              </div>
              <div className="faq-answer" style={{ maxHeight: 'none', opacity: 1, paddingBottom: '1.5rem' }}>
                <p>Standard cloud PDF tools upload your financial documents to a remote server. This risks exposing your account numbers, routing numbers, and balances to data breaches. Our tool processes files entirely in your browser's memory using `pdf-lib`. Your documents never touch a server.</p>
              </div>
            </div>
            <div className="faq-item open">
              <div className="faq-question" style={{ cursor: 'default' }}>
                Can I merge statements from different banks?
              </div>
              <div className="faq-answer" style={{ maxHeight: 'none', opacity: 1, paddingBottom: '1.5rem' }}>
                <p>Yes. The merger handles all PDF standard formats. However, if you plan to convert the merged PDF into a CSV file afterward, we recommend keeping banks separated as our parser is optimized for single-bank consistency.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CROSS-SELL */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Convert to CSV?</h2>
          <p>After merging your statements, use our main tool to extract all transactions into a clean spreadsheet.</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <Link to="/" className="btn btn-primary">
              Go to PDF → CSV Converter <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

