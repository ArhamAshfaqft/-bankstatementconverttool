import React from 'react';
import SeoHead from '../components/SeoHead';
import ConverterTool from '../components/ConverterTool';
import { ShieldCheck, HelpCircle, ArrowRight, Zap, CheckCircle, FileText } from 'lucide-react';

export default function TdPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "TD Bank Statement PDF to CSV Converter",
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
        "name": "How do I download my TD Bank statements as a PDF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Log in to TD Bank Online Banking, click on your checking or savings account, select 'Statements & Documents' from the menu, pick the statement period you need, and download the PDF file."
        }
      },
      {
        "@type": "Question",
        "name": "Does this tool support TD Bank Business Checking statements?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. TD Bank Business checking statements contain several distinct transaction tables including checks paid, general deposits, and electronic payments. Our parser identifies all transaction blocks and merges them into a clean, chronological CSV or Excel table."
        }
      },
      {
        "@type": "Question",
        "name": "Is my TD statement data uploaded to the cloud?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. All extraction and conversion processes are performed locally in your web browser. Your TD Bank PDF statements are read inside local memory (RAM) and are never sent to a backend server."
        }
      }
    ]
  };

  return (
    <>
      <SeoHead 
        title="Convert TD Bank Statement PDF to CSV | Free & Local"
        description="Extract transactions from TD Bank Personal & Business PDF statements locally. Secure browser-based converter with zero data uploads."
        canonical="https://bankstatementconverttool.com/td-bank"
        jsonLd={[softwareSchema, faqSchema]}
      />

      {/* PREMIUM TD BANK HERO */}
      <header className="layout-standard-hero" style={{ background: 'linear-gradient(135deg, #005a00 0%, #008a00 100%)' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2rem', color: '#ffffff' }}>
            <ShieldCheck size={16} /> Verified TD Bank Parser Logic
          </div>
          <h1>Convert <span>TD Bank Statements</span> to CSV</h1>
          <p>Instantly extract transactions from TD Personal and Commercial bank statements. Fast, secure, and processes entirely inside your browser.</p>
        </div>
      </header>

      <section className="layout-tool-container">
        <div className="container">
          <ConverterTool />
        </div>
      </section>

      <div className="chase-content-container">
        <h2 className="chase-section-title">Parsing TD Bank PDF Statements Locally</h2>

        {/* TD BANK FAQ / ACCORDION SECTION */}
        <div className="faq-list" style={{ maxWidth: '900px', margin: '0 auto 5rem' }}>
          <div className="faq-item open">
            <div className="faq-question" style={{ cursor: 'default', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <HelpCircle size={18} className="text-primary" /> How do I download my TD Bank statements as a PDF?
            </div>
            <div className="faq-answer" style={{ maxHeight: 'none', opacity: 1, paddingBottom: '1.5rem' }}>
              <p style={{ margin: 0 }}>Log in to TD Bank Online Banking, select your checking or savings account, navigate to the "Statements & Documents" page, select the statement date, and download the PDF file to your local computer.</p>
            </div>
          </div>

          <div className="faq-item open">
            <div className="faq-question" style={{ cursor: 'default', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <HelpCircle size={18} className="text-primary" /> TD Bank Multi-Page Table Stitching
            </div>
            <div className="faq-answer" style={{ maxHeight: 'none', opacity: 1, paddingBottom: '1.5rem' }}>
              <p style={{ margin: 0 }}>TD Bank statements often split transaction tables across multiple pages. Standard converters frequently miss transactions or output duplicate header lines. Our local engine uses coordinate analysis to stitch pages together, generating one seamless ledger table.</p>
            </div>
          </div>

          <div className="faq-item open">
            <div className="faq-question" style={{ cursor: 'default', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <HelpCircle size={18} className="text-primary" /> TD Business Checking Accounts
            </div>
            <div className="faq-answer" style={{ maxHeight: 'none', opacity: 1, paddingBottom: '1.5rem' }}>
              <p style={{ margin: 0 }}>TD Bank Business checking statements list deposits, checks paid, and withdrawals in separate sections. Our parser automatically identifies each section's header and aggregates them chronologically, ready for import into QuickBooks or Xero.</p>
            </div>
          </div>
        </div>

        {/* COMPREHENSIVE DATA DICTIONARY */}
        <h2 className="chase-section-title">TD Bank Extraction Schema Mapping</h2>
        <section className="citi-table-container" style={{ marginBottom: '5rem' }}>
          <table className="citi-data-table">
            <thead>
              <tr>
                <th>TD Original PDF Column</th>
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
                <td className="col-bold">Description / Merchant Description</td>
                <td>Cleans transaction numbers, terminal IDs, and bank codes.</td>
                <td className="col-highlight">Description</td>
              </tr>
              <tr>
                <td className="col-bold">Amount</td>
                <td>Extracts deposits (+) and checks/withdrawals (-) into a signed float.</td>
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

        {/* TD BANK HIGHLIGHT CARDS */}
        <div className="chase-expertise-grid">
          <div className="chase-expert-card" style={{ borderLeft: '4px solid #008a00' }}>
            <h3><Zap size={24} style={{ color: '#008a00' }} /> Year-Wrap Resolution</h3>
            <p>
              TD Bank statements list dates as "MM/DD" without the year. The tool reads the statement period header and automatically appends the correct year to all parsed transactions.
            </p>
          </div>

          <div className="chase-expert-card" style={{ borderLeft: '4px solid #1a1a1a' }}>
            <h3><FileText size={24} style={{ color: '#1a1a1a' }} /> Merchant Description Cleaning</h3>
            <p>
              TD Bank descriptions often contain redundant bank codes, transaction ID numbers, and state suffixes. Our engine cleans these messy strings to return clean merchant names.
            </p>
          </div>
        </div>

      </div>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Convert Your TD Bank Statements?</h2>
          <p>Extract transactions from TD Bank statements instantly and securely inside your browser.</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={() => document.getElementById('converter').scrollIntoView({ behavior: 'smooth' })}>
              Start TD Bank Conversion <Zap size={16} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
