import React from 'react';
import SeoHead from '../components/SeoHead';
import ConverterTool from '../components/ConverterTool';
import { ShieldCheck, HelpCircle, ArrowRight, Zap, CheckCircle, FileText } from 'lucide-react';

export default function PncPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PNC Bank Statement PDF to CSV Converter",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "WebBrowser",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I download my PNC bank statements as a PDF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Log in to PNC Online Banking, select the account you want to extract, go to the 'Online Statements' or 'Documents' tab, choose the desired month, and download the PDF statement to your computer."
        }
      },
      {
        "@type": "Question",
        "name": "Does this tool support PNC Virtual Wallet statements?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. PNC Virtual Wallet statements divide transactions into three distinct sub-ledgers (Spend, Reserve, and Growth). Our parser automatically detects these boundaries and compiles them into a single, clean chronologically ordered CSV or Excel spreadsheet."
        }
      },
      {
        "@type": "Question",
        "name": "Is my financial transaction data secure?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, 100%. Our tool operates entirely client-side using JavaScript in your browser. Your private PNC PDFs are processed in local RAM and are never uploaded to any remote server or stored in a database."
        }
      }
    ]
  };

  return (
    <>
      <SeoHead 
        title="Convert PNC Bank Statement PDF to CSV | Free & Local"
        description="A specialized local browser parser built to extract transactions from PNC Personal & Virtual Wallet statements. Fast, secure, and preserves ledger integrity."
        canonical="https://bankstatementconverttool.com/pnc"
        jsonLd={[softwareSchema, faqSchema]}
      />

      {/* PREMIUM PNC HERO */}
      <header className="layout-standard-hero" style={{ background: 'linear-gradient(135deg, #0c2340 0%, #1a3c6b 100%)' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2rem', color: '#ffffff' }}>
            <ShieldCheck size={16} /> Optimized for PNC Wallet Layouts
          </div>
          <h1>Convert <span>PNC Statements</span> to CSV</h1>
          <p>Extract transaction tables from PNC checking, savings, and Virtual Wallet accounts. 100% browser-based with zero cloud storage risk.</p>
        </div>
      </header>

      <section className="layout-tool-container">
        <div className="container">
          <ConverterTool />
        </div>
      </section>

      <div className="chase-content-container">
        <h2 className="chase-section-title">Parsing PNC Statements Locally</h2>

        {/* PNC VIRTUAL WALLET RESOLUTION ACCORDION */}
        <div className="faq-list" style={{ maxWidth: '900px', margin: '0 auto 5rem' }}>
          <div className="faq-item open">
            <div className="faq-question" style={{ cursor: 'default', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <HelpCircle size={18} className="text-primary" /> How do I download my PNC bank statements as a PDF?
            </div>
            <div className="faq-answer" style={{ maxHeight: 'none', opacity: 1, paddingBottom: '1.5rem' }}>
              <p style={{ margin: 0 }}>Log in to PNC Online Banking, select your account, navigate to the "Online Statements" or "Documents" page, and select the PDF statement you want to download. Save it locally to prepare for parsing.</p>
            </div>
          </div>

          <div className="faq-item open">
            <div className="faq-question" style={{ cursor: 'default', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <HelpCircle size={18} className="text-primary" /> Handling PNC Virtual Wallet (Spend, Reserve, Growth)
            </div>
            <div className="faq-answer" style={{ maxHeight: 'none', opacity: 1, paddingBottom: '1.5rem' }}>
              <p style={{ margin: 0 }}>Unlike standard bank ledgers, PNC Virtual Wallet statements contain up to three separate accounts inside a single document. Our parser is calibrated to distinguish these boundaries, letting you extract the Spend, Reserve, or Growth transaction logs into clean, separated tables without overlapping headers.</p>
            </div>
          </div>

          <div className="faq-item open">
            <div className="faq-question" style={{ cursor: 'default', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <HelpCircle size={18} className="text-primary" /> Client-Side Privacy Shield
            </div>
            <div className="faq-answer" style={{ maxHeight: 'none', opacity: 1, paddingBottom: '1.5rem' }}>
              <p style={{ margin: 0 }}>Financial reports and bank ledgers contain sensitive accounting information. Our software executes all conversion processes inside your computer's RAM, ensuring your PNC document is never transmitted online or cached on remote servers.</p>
            </div>
          </div>
        </div>

        {/* COMPREHENSIVE DATA DICTIONARY */}
        <h2 className="chase-section-title">PNC Extraction Schema Mapping</h2>
        <section className="citi-table-container" style={{ marginBottom: '5rem' }}>
          <table className="citi-data-table">
            <thead>
              <tr>
                <th>PNC Original Column</th>
                <th>Extraction Methodology</th>
                <th>Standard CSV Output</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="col-bold">Date / Post Date</td>
                <td>Regex parsing mapped to MM/DD calendar coordinates.</td>
                <td className="col-highlight">Date (YYYY-MM-DD)</td>
              </tr>
              <tr>
                <td className="col-bold">Transaction Description</td>
                <td>Cleans transaction numbers, terminal IDs, and bank codes.</td>
                <td className="col-highlight">Description</td>
              </tr>
              <tr>
                <td className="col-bold">Amount</td>
                <td>Separates deposits (+) and withdrawals (-) into a signed float.</td>
                <td className="col-highlight">Amount</td>
              </tr>
              <tr>
                <td className="col-bold">Balance</td>
                <td>Extracts the running balance coordinate for reconciliation.</td>
                <td className="col-highlight">Balance</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* PNC HIGHLIGHT CARDS */}
        <div className="chase-expertise-grid">
          <div className="chase-expert-card" style={{ borderLeft: '4px solid #f05a28' }}>
            <h3><Zap size={24} style={{ color: '#f05a28' }} /> Dual-Column Alignments</h3>
            <p>
              PNC checking statements often display debits and credits in separate visual columns. The parser aligns these dual vectors back into a single transaction flow with correct positive/negative values.
            </p>
          </div>

          <div className="chase-expert-card" style={{ borderLeft: '4px solid #0c2340' }}>
            <h3><FileText size={24} style={{ color: '#0c2340' }} /> Year-Wrap Resolution</h3>
            <p>
              PNC bank statements list transaction dates as "MM/DD" without the calendar year. Our engine detects the statement cycle period and automatically appends the correct calendar year (e.g. "12/28" becomes "2025-12-28").
            </p>
          </div>
        </div>

      </div>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Convert Your PNC Statements?</h2>
          <p>Instantly extract transactions from PNC PDFs without compromise. Free, offline, and secure.</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={() => document.getElementById('converter').scrollIntoView({ behavior: 'smooth' })}>
              Start PNC Conversion <Zap size={16} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
