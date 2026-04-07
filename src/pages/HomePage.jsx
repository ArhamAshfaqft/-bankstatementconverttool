import React, { useState } from 'react';
import { ShieldCheck, Lock, Zap, Globe, MonitorSmartphone, Eye, ChevronDown, ArrowRight, FileSpreadsheet } from 'lucide-react';
import ConverterTool from '../components/ConverterTool';
import SeoHead from '../components/SeoHead';

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState(null);

  const scrollToConverter = () => {
    document.getElementById('converter')?.scrollIntoView({ behavior: 'smooth' });
  };

  const faqs = [
    {
      q: "How do I convert a bank statement PDF to CSV?",
      a: "Simply drag and drop your PDF bank statement into our converter above. The tool automatically detects tables, extracts transaction data (dates, descriptions, amounts, balances), and lets you download a clean CSV file. No account or upload required."
    },
    {
      q: "Is it safe to convert my bank statement online?",
      a: "Absolutely. Unlike other converters that upload your file to their servers, our tool processes your PDF 100% locally inside your web browser using JavaScript. Your file is never sent anywhere. No data leaves your computer — ever."
    },
    {
      q: "Which banks are supported?",
      a: "Our converter works with PDF statements from all major banks including Chase, Bank of America, Wells Fargo, Citi, Capital One, HSBC, Barclays, and thousands more. Any text-based PDF bank statement can be converted."
    },
    {
      q: "Can I convert a bank statement PDF to Excel?",
      a: "Yes! Download the CSV file and open it directly in Microsoft Excel, Google Sheets, or any spreadsheet application. CSV is universally compatible with all spreadsheet software including QuickBooks, Xero, and Wave."
    },
    {
      q: "What if my PDF is a scanned image?",
      a: "Our tool works with text-based PDFs (the kind you download directly from your bank's website). Scanned image PDFs require OCR processing, which we are actively working on adding in a future update."
    },
    {
      q: "Is this tool really free?",
      a: "Yes, it's 100% free with no hidden limits. There are no accounts to create, no page limits, and no watermarks. Convert as many statements as you need."
    }
  ];

  return (
    <>
      <SeoHead 
        title="Extract Bank Statement PDF to CSV Free Offline – BankStatementConvertTool"
        description="Convert your bank statement PDFs to CSV perfectly. The only 100% private, local browser-based PDF to CSV converter. No uploads, no account required."
        canonical="https://bankstatementconverttool.com/"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "BankStatementConvertTool",
            "url": "https://bankstatementconverttool.com/",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "All",
            "description": "A privacy-first tool to convert bank statement PDFs into CSV format without uploading to servers.",
            "offers": {
              "@type": "Offer",
              "price": "0"
            }
          }
        ]}
      />
      {/* ===== HERO ===== */}
      <header className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Lock size={14} />
              100% Local Processing — Your Data Never Leaves Your Browser
            </div>

            <h1>
              Convert Bank Statement <span>PDF to CSV</span> in Seconds
            </h1>

            <p className="hero-subtitle">
              Free online converter — no uploads, 100% private. <br/>
              <strong>Upgrade to desktop for bulk processing & scalable performance.</strong>
            </p>

            <div className="hero-ctas">
              <button className="btn btn-primary" onClick={scrollToConverter}>
                Convert for Free <ArrowRight size={16} />
              </button>
              <a href="#pro" className="btn btn-outline" style={{ background: 'white' }}>
                Get Desktop Pro
              </a>
            </div>

            <div className="hero-trust-metrics">
              <div className="avatars">
                <div className="avatar">JD</div>
                <div className="avatar">SM</div>
                <div className="avatar">AK</div>
                <span className="trust-text">Trusted by <strong>10,000+</strong> accountants & bookkeepers</span>
              </div>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="before-after-mockup">
              <div className="mockup-header">Instant Transformation</div>
              <div className="mockup-body">
                <div className="mock-pdf">
                  <span className="mock-label">BEFORE (Messy PDF)</span>
                  <div className="mock-line title"></div>
                  <div className="mock-line text short"></div>
                  <div className="mock-table">
                    <div className="mock-row"></div>
                    <div className="mock-row"></div>
                    <div className="mock-row"></div>
                  </div>
                </div>
                <ArrowRight className="mock-arrow" size={24} />
                <div className="mock-csv">
                  <span className="mock-label">AFTER (Clean CSV)</span>
                  <div className="mock-grid">
                    <div className="mock-cell head">Date</div><div className="mock-cell head">Desc</div><div className="mock-cell head">Amt</div>
                    <div className="mock-cell">03/01</div><div className="mock-cell">Deposit</div><div className="mock-cell">$500</div>
                    <div className="mock-cell">03/05</div><div className="mock-cell">Target</div><div className="mock-cell">-$50</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Trust Bar */}
      <div className="trust-bar-full">
        <div className="container trust-bar">
          <div className="trust-item"><ShieldCheck size={16} /> No data uploaded</div>
          <div className="trust-item"><Zap size={16} /> Instant conversion</div>
          <div className="trust-item"><Globe size={16} /> Works with 1000+ banks</div>
          <div className="trust-item"><Lock size={16} /> 100% free, no account</div>
        </div>
      </div>

      <div className="converter-wrapper" style={{ padding: '0 1rem' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <ConverterTool />
        </div>
      </div>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section section-alt" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-label">How It Works</span>
            <h2>Convert Your Statement in 3 Simple Steps</h2>
            <p>No software to install, no accounts to create. Just fast, private conversion.</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Upload Your PDF</h3>
              <p>Drag and drop your bank statement PDF or click to browse. Supports Chase, BofA, Wells Fargo, and thousands more.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Review the Data</h3>
              <p>Our algorithm automatically parses tables from your PDF and displays a live preview of extracted transactions.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Download CSV</h3>
              <p>Click download to save your clean CSV file. Open it in Excel, Google Sheets, or import into QuickBooks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="section" id="features">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Why Choose Us</span>
            <h2>Built for Privacy, Speed & Accuracy</h2>
            <p>The only bank statement converter that never touches your data.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon teal"><Lock size={20} /></div>
              <h3>100% Browser-Based</h3>
              <p>Your PDF is processed entirely in your browser using JavaScript. Zero server uploads, zero data exposure.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon amber"><Zap size={20} /></div>
              <h3>Instant Results</h3>
              <p>No waiting for cloud processing. Tables are extracted in milliseconds, directly on your device.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon blue"><Globe size={20} /></div>
              <h3>1000+ Banks Supported</h3>
              <p>Works with any text-based PDF bank statement — Chase, Bank of America, Wells Fargo, Citi, HSBC, and more.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon emerald"><FileSpreadsheet size={20} /></div>
              <h3>Excel & QuickBooks Ready</h3>
              <p>Download CSV files that open perfectly in Excel, Google Sheets, QuickBooks, Xero, and Wave.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon teal"><Eye size={20} /></div>
              <h3>Live Data Preview</h3>
              <p>Review your extracted data before downloading. Verify rows and columns are correctly parsed.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon amber"><MonitorSmartphone size={20} /></div>
              <h3>Works on Any Device</h3>
              <p>Desktop, tablet, or phone. No software to install — just open your browser and convert.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COMPARISON (FREE VS PRO) ===== */}
      <section className="section section-alt" id="pro">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Pricing & Plans</span>
            <h2>Which version is right for you?</h2>
            <p>Use the web tool for quick, one-off conversions. Upgrade to Pro for heavy workloads.</p>
          </div>

          <div className="pricing-grid">
            <div className="pricing-card free">
              <h3>Free Web Tool</h3>
              <p className="price">Free</p>
              <p className="desc">Perfect for individuals and single statements.</p>
              <ul className="pricing-features">
                <li><ShieldCheck size={16} /> Convert PDF to CSV & Excel</li>
                <li><ShieldCheck size={16} /> 100% Local Processing</li>
                <li><ShieldCheck size={16} /> All Major Banks Supported</li>
                <li className="missing"><span className="cross">×</span> 1 File at a time</li>
                <li className="missing"><span className="cross">×</span> Manual downloads</li>
              </ul>
              <button className="btn btn-outline" onClick={scrollToConverter}>Use Free Converter</button>
            </div>

            <div className="pricing-card pro">
              <div className="most-popular">For Professionals</div>
              <h3>Desktop Pro</h3>
              <p className="price">One-Time Fee</p>
              <p className="desc">For accountants & bookkeepers handling volume.</p>
              <ul className="pricing-features">
                <li><ShieldCheck size={16} /> <strong>Everything in Free</strong></li>
                <li><ShieldCheck size={16} /> <strong>Bulk Conversion</strong> (100s of files at once)</li>
                <li><ShieldCheck size={16} /> Faster Offline Engine</li>
                <li><ShieldCheck size={16} /> Unlimited Data Sizes</li>
                <li><ShieldCheck size={16} /> Priority Support</li>
              </ul>
              <button className="btn">Get Desktop Version</button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SUPPORTED BANKS ===== */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Compatibility</span>
            <h2>Works With Every Major Bank</h2>
            <p>Our algorithm handles the unique table formats from all major financial institutions.</p>
          </div>
          <div className="banks-logos">
            <span className="bank-name">Chase</span>
            <span className="bank-name">Bank of America</span>
            <span className="bank-name">Wells Fargo</span>
            <span className="bank-name">Citi</span>
            <span className="bank-name">Capital One</span>
            <span className="bank-name">HSBC</span>
            <span className="bank-name">Barclays</span>
            <span className="bank-name">TD Bank</span>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="section" id="faq">
        <div className="container">
          <div className="section-header">
            <span className="section-label">FAQ</span>
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about converting bank statement PDFs.</p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}
                  <ChevronDown size={18} className="faq-chevron" />
                </button>
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Convert Your Bank Statement?</h2>
          <p>Join thousands of users who trust our private, instant PDF to CSV converter.</p>
          <div className="hero-ctas" style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={scrollToConverter}>
              Convert for Free <ArrowRight size={16} />
            </button>
            <a href="#pro" className="btn btn-outline" style={{ background: 'white' }}>
              Get Desktop App
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
