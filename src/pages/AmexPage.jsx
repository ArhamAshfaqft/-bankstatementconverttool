import React from 'react';
import SeoHead from '../components/SeoHead';
import ConverterTool from '../components/ConverterTool';
import { ShieldCheck, HelpCircle, ArrowRight, Zap, CheckCircle, CreditCard } from 'lucide-react';

export default function AmexPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "American Express Statement PDF to CSV Converter",
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
        "name": "How do I download my American Express statements as a PDF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Log in to American Express Online Services, select your credit card or charge card account, click on 'Statements & Activity', select the billing period you want to export, and click the 'Download' icon, choosing the PDF format."
        }
      },
      {
        "@type": "Question",
        "name": "Does this tool support AMEX Business & Corporate Card statements?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. American Express business and corporate statements often include multiple cards under a single account (e.g. employee cards). Our parser automatically identifies individual card sections, aggregates the transactions, and lists the cardholder name or employee card associations in the output rows."
        }
      },
      {
        "@type": "Question",
        "name": "Is my credit card data safe?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, absolutely. To maintain complete security, this tool runs entirely on your local machine using client-side JavaScript. None of your credit card details, account balances, or merchant transactions are ever uploaded to any web server."
        }
      }
    ]
  };

  return (
    <>
      <SeoHead 
        title="Convert American Express Statement PDF to CSV | Local & Secure"
        description="A specialized local parser built to extract transactions from American Express personal & business statements. Clean merchant names and separate employee card rows."
        canonical="https://www.bankstatementconverttool.com/american-express"
        jsonLd={[softwareSchema, faqSchema]}
      />

      {/* PREMIUM AMEX HERO */}
      <header className="layout-standard-hero" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2rem', color: '#ffffff' }}>
            <ShieldCheck size={16} /> Premium AMEX Statement Parsing Logic
          </div>
          <h1>Convert <span>AMEX Statements</span> to CSV</h1>
          <p>Extract transactions from American Express Platinum, Gold, Blue Cash, and Business cards. Safe, offline, and instant.</p>
        </div>
      </header>

      <section className="layout-tool-container">
        <div className="container">
          <ConverterTool />
        </div>
      </section>

      <div className="chase-content-container">
        <h2 className="chase-section-title">Parsing American Express Statements Locally</h2>

        {/* AMEX FAQ / ACCORDION SECTION */}
        <div className="faq-list" style={{ maxWidth: '900px', margin: '0 auto 5rem' }}>
          <div className="faq-item open">
            <div className="faq-question" style={{ cursor: 'default', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <HelpCircle size={18} className="text-primary" /> How do I download my American Express statements as a PDF?
            </div>
            <div className="faq-answer" style={{ maxHeight: 'none', opacity: 1, paddingBottom: '1.5rem' }}>
              <p style={{ margin: 0 }}>Log in to American Express Online Services, select your credit card account, click on "Statements & Activity", navigate to the statement history, select the statement cycle, and download the PDF statement to your local computer.</p>
            </div>
          </div>

          <div className="faq-item open">
            <div className="faq-question" style={{ cursor: 'default', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <HelpCircle size={18} className="text-primary" /> Handling AMEX Corporate & Employee Cards
            </div>
            <div className="faq-answer" style={{ maxHeight: 'none', opacity: 1, paddingBottom: '1.5rem' }}>
              <p style={{ margin: 0 }}>AMEX business statements aggregate transactions from all employee cards. Our parser reads the employee section headers and compiles all transactions into a single list, appending an optional column identifying the card owner or card ending digits. This speeds up expense tracking and reconciliation.</p>
            </div>
          </div>

          <div className="faq-item open">
            <div className="faq-question" style={{ cursor: 'default', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <HelpCircle size={18} className="text-primary" /> Zero Server Exposure
            </div>
            <div className="faq-answer" style={{ maxHeight: 'none', opacity: 1, paddingBottom: '1.5rem' }}>
              <p style={{ margin: 0 }}>AMEX statements contain sensitive company and cardholder information. Our parser does not use a backend web server or database. It operates in your web browser using HTML5/JS APIs, so your files and transactions never leave your machine.</p>
            </div>
          </div>
        </div>

        {/* COMPREHENSIVE DATA DICTIONARY */}
        <h2 className="chase-section-title">AMEX Extraction Schema Mapping</h2>
        <section className="citi-table-container" style={{ marginBottom: '5rem' }}>
          <table className="citi-data-table">
            <thead>
              <tr>
                <th>AMEX Original PDF Column</th>
                <th>Extraction Methodology</th>
                <th>Standard CSV Output</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="col-bold">Date / Trans. Date</td>
                <td>Regex parsing mapped to MM/DD calendar coordinates.</td>
                <td className="col-highlight">Date (YYYY-MM-DD)</td>
              </tr>
              <tr>
                <td className="col-bold">Description / Merchant Details</td>
                <td>Strips transaction ID codes, terminal numbers, and card numbers.</td>
                <td className="col-highlight">Description</td>
              </tr>
              <tr>
                <td className="col-bold">Amount</td>
                <td>Extracts charges (+) and payments/credits (-) into a signed float.</td>
                <td className="col-highlight">Amount</td>
              </tr>
              <tr>
                <td className="col-bold">Card Member (Optional)</td>
                <td>Identifies which employee card performed the purchase.</td>
                <td className="col-highlight">Cardholder Name / Card Endings</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* AMEX HIGHLIGHT CARDS */}
        <div className="chase-expertise-grid">
          <div className="chase-expert-card" style={{ borderLeft: '4px solid #0072C6' }}>
            <h3><Zap size={24} style={{ color: '#0072C6' }} /> Multi-Currency Support</h3>
            <p>
              AMEX credit card statements often include foreign transactions listed with both the transaction currency and the billed USD amount. The parser isolates the billed USD value for clean accounting.
            </p>
          </div>

          <div className="chase-expert-card" style={{ borderLeft: '4px solid #d97706' }}>
            <h3><CreditCard size={24} style={{ color: '#d97706' }} /> Year-Wrap Resolution</h3>
            <p>
              AMEX statements display dates as "MM/DD". The parser reads the billing cycle start/end dates from the summary block to automatically resolve the correct calendar year.
            </p>
          </div>
        </div>

      </div>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Convert Your AMEX Statements?</h2>
          <p>Extract transactions from American Express personal & business statements locally in seconds.</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={() => document.getElementById('converter').scrollIntoView({ behavior: 'smooth' })}>
              Start AMEX Conversion <Zap size={16} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
