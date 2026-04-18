import React, { useState } from 'react';
import { ShieldCheck, Lock, Zap, Globe, FileText, MonitorSmartphone, Eye, ChevronDown, ArrowRight, FileSpreadsheet, BookOpen, CreditCard, Camera, Shield, Scissors, GitMerge, CheckCircle, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
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
      q: "Can I export to QuickBooks (.QBO) format?",
      a: "Yes! Our Pro plan includes native QuickBooks Web Connect (.QBO) file generation. This means you can import transactions directly into QuickBooks without the hassle of CSV column mapping errors."
    },
    {
      q: "What if my PDF is a scanned image or receipt?",
      a: "We have a dedicated Receipt & Invoice OCR Scanner tool that uses local Optical Character Recognition to extract text from photos and scanned documents. It runs entirely in your browser — no cloud processing."
    },
    {
      q: "Is this tool really free?",
      a: "The core PDF to CSV converter is 100% free with no hidden limits. Pro features like bulk processing, QBO exports, and advanced tools are available with a Pro license."
    }
  ];

  const suiteTools = [
    { icon: <FileSpreadsheet size={22} />, title: 'PDF to CSV / Excel', desc: 'Extract bank transactions with 100% accuracy', link: '/', color: '#0d9488' },
    { icon: <BookOpen size={22} />, title: 'PDF to QuickBooks', desc: 'Native .QBO export — no mapping errors', link: '/quickbooks-qbo-converter', color: '#059669' },
    { icon: <FileText size={22} />, title: 'PDF to OFX / QFX', desc: 'Ideal for Quicken and Xero imports', link: '/ofx-converter', color: '#0284c7' },
    { icon: <Zap size={22} />, title: 'Statement Visualizer', desc: 'Interactive spending analytics dashboard', link: '/visualizer', color: '#10b981' },
    { icon: <CreditCard size={22} />, title: 'Credit Card Parser', desc: 'Handles Visa, Mastercard & Amex statements', link: '/credit-card-parser', color: '#0891b2' },
    { icon: <Camera size={22} />, title: 'Receipt OCR Scanner', desc: 'Extract data from photos & scanned invoices', link: '/receipt-scanner', color: '#7c3aed' },
    { icon: <Shield size={22} />, title: 'Financial Anonymizer', desc: 'Black out account numbers & SSNs locally', link: '/redact', color: '#dc2626' },
    { icon: <GitMerge size={22} />, title: 'Merge PDFs', desc: 'Combine multiple statements into one', link: '/merge', color: '#2563eb' },
    { icon: <Scissors size={22} />, title: 'Split PDF', desc: 'Extract specific pages from large files', link: '/split', color: '#d97706' },
  ];

  return (
    <>
      <SeoHead 
        title="Stop Manually Copying Bank Statements — Convert PDF to CSV in Seconds"
        description="The accounting automation suite that converts bank statements, credit cards, and receipts to CSV, Excel, and QuickBooks. 100% private — your files never leave your browser."
        canonical="https://www.bankstatementconverttool.com/"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Bank Statement PDF to CSV Converter",
            "url": "https://www.bankstatementconverttool.com/",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "All",
            "description": "A privacy-first accounting automation suite to convert bank statement PDFs into CSV, Excel, and QuickBooks formats without uploading to servers.",
            "offers": {
              "@type": "Offer",
              "price": "0"
            }
          }
        ]}
      />

      {/* ===== HERO — PAIN-FIRST MESSAGING ===== */}
      <header className="hero">
        <div className="container">
          
          <div className="hero-content-stacked">
            <div className="hero-badge">
              <Lock size={14} />
              100% Private — Your files never leave your browser
            </div>
            
            <h1>
              Stop Manually Copying <span>Bank Statements</span>
            </h1>
            
            <p className="hero-subtitle">
              Extract transactions from any bank statement PDF in seconds — not hours. <br/>
              Built for accountants who process 100+ statements monthly.
            </p>

            {/* Pain-point pills */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: '#10b981', fontWeight: '600' }}>
                <CheckCircle size={15} /> CSV, Excel & QuickBooks
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: '#10b981', fontWeight: '600' }}>
                <CheckCircle size={15} /> Works with 1,000+ banks
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: '#10b981', fontWeight: '600' }}>
                <CheckCircle size={15} /> No signup required
              </span>
            </div>
          </div>

          <div className="hero-converter-fullwidth" id="converter">
            <ConverterTool />
          </div>

          <div className="hero-trust-metrics" style={{ marginTop: '3rem' }}>
            <div className="avatars">
              <div className="avatar" style={{ background: '#E0E7FF', color: '#3730A3' }}>AS</div>
              <div className="avatar" style={{ background: '#F0FDF4', color: '#166534' }}>BK</div>
              <div className="avatar" style={{ background: '#FFF7ED', color: '#9A3412' }}>TR</div>
              <span className="trust-text">Trusted by <strong>Accounting & Bookkeeping Professionals</strong></span>
            </div>
          </div>
          
        </div>
      </header>


      {/* ===== SOCIAL PROOF BAR ===== */}
      <div className="trust-bar-full">
        <div className="container trust-bar">
          <div className="trust-item"><Clock size={16} /> Saves 10+ hours/month</div>
          <div className="trust-item"><ShieldCheck size={16} /> Zero data uploaded — ever</div>
          <div className="trust-item"><Zap size={16} /> Instant extraction</div>
          <div className="trust-item"><Users size={16} /> Built for accountants</div>
        </div>
      </div>


      {/* ===== PAIN → SOLUTION SECTION ===== */}
      <section className="section" id="why">
        <div className="container">
          <div className="section-header">
            <span className="section-label">The Problem</span>
            <h2>Accountants Waste 10+ Hours Every Month on Manual Data Entry</h2>
            <p>Copying transactions from PDF bank statements into spreadsheets is tedious, error-prone, and completely unnecessary.</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number" style={{ background: '#fef2f2', color: '#dc2626' }}>✕</div>
              <h3>The Old Way</h3>
              <p>Open PDF. Squint at columns. Copy-paste each transaction. Fix formatting errors. Repeat for every client, every month.</p>
            </div>
            <div className="step-card" style={{ borderColor: '#10b981' }}>
              <div className="step-number" style={{ background: '#ecfdf5', color: '#059669' }}>✓</div>
              <h3>With StatementToCSV</h3>
              <p>Drop your PDF. Get a clean, verified table in seconds. Download as CSV, Excel, or native QuickBooks — done.</p>
            </div>
            <div className="step-card">
              <div className="step-number">🔒</div>
              <h3>100% Private</h3>
              <p>Unlike every competitor, your sensitive financial data never touches a server. Processing happens entirely in your browser's memory.</p>
            </div>
          </div>
        </div>
      </section>


      {/* ===== THE COMPLETE SUITE ===== */}
      <section className="section section-alt" id="suite">
        <div className="container">
          <div className="section-header">
            <span className="section-label">7 Tools, Zero Uploads</span>
            <h2>The Complete Financial Document Suite</h2>
            <p>Everything an accountant needs to process, convert, and protect financial documents — all running locally in your browser.</p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '1.25rem', 
            maxWidth: '1000px', 
            margin: '0 auto' 
          }}>
            {suiteTools.map((tool, i) => (
              <Link 
                to={tool.link} 
                key={i} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '1rem', 
                  padding: '1.25rem 1.5rem', 
                  background: '#ffffff', 
                  borderRadius: '14px', 
                  border: '1px solid #e2e8f0', 
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 3px rgb(0 0 0 / 0.06)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = tool.color; e.currentTarget.style.boxShadow = `0 4px 12px ${tool.color}20`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = '0 1px 3px rgb(0 0 0 / 0.06)'; }}
              >
                <div style={{ 
                  width: '44px', height: '44px', borderRadius: '12px', 
                  background: `${tool.color}12`, color: tool.color, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                }}>
                  {tool.icon}
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0f172a', marginBottom: '0.2rem' }}>{tool.title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.4' }}>{tool.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* ===== HOW IT WORKS ===== */}
      <section className="section" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Simple Process</span>
            <h2>Three Steps. Five Seconds. Done.</h2>
            <p>Our intelligent parsing engine handles the heavy lifting directly in your browser.</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3>Drop Your Statement</h3>
              <p>Drag your bank statement PDF into the converter. We support all major US and international banks.</p>
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <h3>Instant Parsing</h3>
              <p>Our local engine identifies transaction tables, dates, and amounts — without uploading a single byte of your data.</p>
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <h3>Export & Go</h3>
              <p>Review the extracted data, edit any cells if needed, then download as CSV, Excel, or directly to QuickBooks.</p>
            </div>
          </div>
        </div>
      </section>


      {/* ===== FEATURES ===== */}
      <section className="section section-alt" id="features">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Why Professionals Choose Us</span>
            <h2>Enterprise-Grade Privacy. Zero Compromise.</h2>
            <p>Built for firms that handle sensitive client financials daily.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon teal"><Lock size={20} /></div>
              <h3>Zero-Upload Architecture</h3>
              <p>Unlike competitors, your files are never sent to a server. Processing happens 100% on your local machine — provably.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon amber"><Zap size={20} /></div>
              <h3>Sub-Second Extraction</h3>
              <p>No queues, no waiting for cloud processing. Your results appear instantly because we use your browser's own computing power.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon blue"><Globe size={20} /></div>
              <h3>1,000+ Banks Supported</h3>
              <p>Deep compatibility with Chase, BofA, Wells Fargo, Citi, Capital One, HSBC, Barclays, TD Bank, and thousands more.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon emerald"><ShieldCheck size={20} /></div>
              <h3>Smart Table Detection</h3>
              <p>Handles complex multi-line descriptions, inconsistent column alignments, and merged cells that break other converters.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon teal"><Eye size={20} /></div>
              <h3>Edit Before Export</h3>
              <p>Verify every transaction in a live preview grid. Rename columns, exclude rows, and correct data before you download.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon amber"><MonitorSmartphone size={20} /></div>
              <h3>Works Everywhere</h3>
              <p>Chrome, Edge, Firefox, Safari — on desktop, tablet, or mobile. No software to install, ever.</p>
            </div>
          </div>
        </div>
      </section>


      {/* ===== COMPARISON (FREE VS PRO) ===== */}
      <section className="section" id="pro">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Flexible Plans</span>
            <h2>Start Free. Scale When You're Ready.</h2>
            <p>From one-off conversions to firm-wide bulk processing.</p>
          </div>

          <div className="pricing-grid">
            <div className="pricing-card free">
              <h3>Basic</h3>
              <p className="price">$0</p>
              <p className="desc">Perfect for individuals and one-off personal tasks.</p>
              <ul className="pricing-features">
                <li><ShieldCheck size={16} /> <span><strong>Unlimited</strong> single-file conversions</span></li>
                <li><ShieldCheck size={16} /> PDF to CSV Conversion</li>
                <li><ShieldCheck size={16} /> 100% Local Privacy</li>
                <li className="missing"><span className="cross">×</span> No QuickBooks export</li>
                <li className="missing"><span className="cross">×</span> No Bulk processing</li>
              </ul>
              <button className="btn btn-outline" style={{width: '100%'}} onClick={scrollToConverter}>Start Free</button>
            </div>

            <div className="pricing-card pro active">
              <div className="most-popular">Most Popular</div>
              <h3>Pro Accountant</h3>
              <p className="price">$19 <span>/ month</span></p>
              <p className="desc">For bookkeepers and accounting professionals.</p>
              <ul className="pricing-features">
                <li><ShieldCheck size={16} /> <span><strong>Everything in Basic</strong></span></li>
                <li><ShieldCheck size={16} /> <span><strong>Bulk Multi-file</strong> processing</span></li>
                <li><ShieldCheck size={16} /> <span><strong>QuickBooks (.QBO)</strong> export</span></li>
                <li><ShieldCheck size={16} /> <span><strong>Excel (.xlsx)</strong> export</span></li>
                <li><ShieldCheck size={16} /> <span><strong>Merged annual reports</strong></span></li>
                <li><ShieldCheck size={16} /> <span>Priority email support</span></li>
              </ul>
              <Link to="/pricing" className="btn btn-primary" style={{width: '100%'}}>Upgrade to Pro</Link>
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
            <Link to="/chase" className="bank-name">Chase</Link>
            <Link to="/bank-of-america" className="bank-name">Bank of America</Link>
            <Link to="/wells-fargo" className="bank-name">Wells Fargo</Link>
            <Link to="/citibank" className="bank-name">Citi</Link>
            <Link to="/capital-one" className="bank-name">Capital One</Link>
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
          <h2>Stop Wasting Hours on Manual Data Entry</h2>
          <p>Join thousands of accountants and bookkeepers who trust our private, instant financial document suite.</p>
          <div className="hero-ctas" style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={scrollToConverter}>
              Convert Your Statement Free <ArrowRight size={16} />
            </button>
            <Link to="/pricing" className="btn btn-outline" style={{ background: 'white' }}>
              View Pro Suite
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
