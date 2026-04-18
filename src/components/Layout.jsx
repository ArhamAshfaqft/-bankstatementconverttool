import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  FileSpreadsheet, ChevronDown, FileText, FileUp, Scissors, 
  GitMerge, Table, BookOpen, Building2, CreditCard, Landmark,
  Shield, Zap, Users, ArrowRight, X, Menu, Camera, User, LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const { user, isPro, signOut } = useAuth();
  const location = useLocation();
  const [activeMega, setActiveMega] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMega = (name) => {
    setActiveMega(prev => prev === name ? null : name);
  };

  const closeMega = () => setActiveMega(null);

  return (
    <div className="page-wrapper" onClick={() => { closeMega(); setMobileOpen(false); }}>
      {/* ===== NAVIGATION ===== */}
      <nav className="nav" role="navigation" aria-label="Main navigation">
        <div className="container nav-inner">
          <Link to="/" className="nav-logo" onClick={closeMega}>
            <div className="nav-logo-icon">
              <FileSpreadsheet size={18} />
            </div>
            StatementToCSV
          </Link>

          {/* Mobile hamburger */}
          <button className="nav-mobile-toggle" onClick={(e) => { e.stopPropagation(); setMobileOpen(!mobileOpen); }}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <ul className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`}>
            {/* ─── TOOLS MEGA MENU ─── */}
            <li className={`nav-mega-parent ${activeMega === 'tools' ? 'open' : ''}`}>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleMega('tools'); }}
                className="nav-mega-trigger"
              >
                Tools <ChevronDown size={14} className={`chevron ${activeMega === 'tools' ? 'rotated' : ''}`} />
              </a>
              <div className="mega-menu" style={{ minWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
                <div className="mega-menu-inner">
                  
                  {/* Column 1: Converters */}
                  <div className="mega-col" style={{ flex: '1.2' }}>
                    <h5 className="mega-col-title">Converters</h5>
                    <Link to="/" className="mega-item" onClick={closeMega}>
                      <div className="mega-item-icon converter"><Table size={16} /></div>
                      <div>
                        <span className="mega-item-title">PDF to CSV</span>
                        <span className="mega-item-desc">Extract transactions with 100% accuracy</span>
                      </div>
                    </Link>
                    <Link to="/quickbooks-qbo-converter" className="mega-item" onClick={closeMega}>
                      <div className="mega-item-icon converter"><BookOpen size={16} /></div>
                      <div>
                        <span className="mega-item-title">PDF to QuickBooks</span>
                        <span className="mega-item-desc">Direct .qbo import for bookkeepers</span>
                      </div>
                    </Link>
                    <Link to="/credit-card-parser" className="mega-item" onClick={closeMega}>
                      <div className="mega-item-icon converter"><CreditCard size={16} /></div>
                      <div>
                        <span className="mega-item-title">Credit Card Parser</span>
                        <span className="mega-item-desc">Optimized for corporate expense cards</span>
                      </div>
                    </Link>
                    <Link to="/receipt-scanner" className="mega-item" onClick={closeMega}>
                      <div className="mega-item-icon converter"><Camera size={16} /></div>
                      <div>
                        <span className="mega-item-title">Receipt Scanner (OCR)</span>
                        <span className="mega-item-desc">Extract data from photos & scans</span>
                      </div>
                    </Link>
                  </div>

                  {/* Column 2: Document Tools */}
                  <div className="mega-col">
                    <h5 className="mega-col-title">Document Tools</h5>
                    <Link to="/merge" className="mega-item" onClick={closeMega}>
                      <div className="mega-item-icon document"><GitMerge size={16} /></div>
                      <div>
                        <span className="mega-item-title">Merge PDFs</span>
                        <span className="mega-item-desc">Combine multiple files</span>
                      </div>
                    </Link>
                    <Link to="/split" className="mega-item" onClick={closeMega}>
                      <div className="mega-item-icon document"><Scissors size={16} /></div>
                      <div>
                        <span className="mega-item-title">Split PDF</span>
                        <span className="mega-item-desc">Extract specific pages</span>
                      </div>
                    </Link>
                    <Link to="/redact" className="mega-item" onClick={closeMega}>
                      <div className="mega-item-icon document"><Shield size={16} /></div>
                      <div>
                        <span className="mega-item-title">Anonymize PDF</span>
                        <span className="mega-item-desc">Black out PII locally</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </li>

            {/* ─── SOLUTIONS MEGA MENU ─── */}
            <li className={`nav-mega-parent ${activeMega === 'solutions' ? 'open' : ''}`}>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleMega('solutions'); }}
                className="nav-mega-trigger"
              >
                Solutions <ChevronDown size={14} className={`chevron ${activeMega === 'solutions' ? 'rotated' : ''}`} />
              </a>
              <div className="mega-menu" style={{ minWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
                <div className="mega-menu-inner">
                  <div className="mega-col">
                    <h5 className="mega-col-title">Use Cases</h5>
                    <Link to="/merge" className="mega-item" onClick={closeMega}>
                      <div className="mega-item-icon role"><Users size={16} /></div>
                      <div>
                        <span className="mega-item-title">Accountants & Bookkeepers</span>
                        <span className="mega-item-desc">Bulk processing for client tax prep</span>
                      </div>
                    </Link>
                    <Link to="/" className="mega-item" onClick={closeMega}>
                      <div className="mega-item-icon role"><Building2 size={16} /></div>
                      <div>
                        <span className="mega-item-title">Business Owners</span>
                        <span className="mega-item-desc">Manage overhead and internal audits</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </li>

            <li><Link to="/pricing" onClick={closeMega} className="nav-link-standard">Pricing</Link></li>
          </ul>

          <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                  <User size={16} />
                  <span>{user.email}</span>
                  {isPro && (
                    <span style={{ background: 'var(--brand-100)', color: 'var(--brand-700)', padding: '0.15rem 0.5rem', borderRadius: '100px', fontWeight: 'bold', fontSize: '0.7rem' }}>
                      PRO
                    </span>
                  )}
                </div>
                <button onClick={signOut} className="btn btn-outline btn-sm hide-mobile" style={{ padding: '0.4rem 0.75rem' }}>
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm hide-mobile" onClick={closeMega}>Log In</Link>
                <Link to="/pricing" className="btn btn-primary btn-sm" onClick={closeMega}>
                  Upgrade to Pro
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ===== MAIN CONTENT ===== */}
      <main>
        <Outlet />
      </main>

      {/* ===== FOOTER Redesign ===== */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <Link to="/" className="nav-logo" style={{ marginBottom: '1.5rem' }}>
                <div className="nav-logo-icon">
                  <FileSpreadsheet size={18} />
                </div>
                StatementToCSV
              </Link>
              <p className="footer-tagline">
                The enterprise standard for local-first bank statement parsing. 
                Your files stay in your browser—where they belong.
              </p>
            </div>
            
            <div className="footer-links-grid">
              <div className="footer-col">
                <h6>Product</h6>
                <Link to="/">PDF to CSV Converter</Link>
                <Link to="/pricing">Pricing Plans</Link>
                <Link to="/merge">Merge Tool</Link>
                <Link to="/split">Split Tool</Link>
              </div>
              <div className="footer-col">
                <h6>Supported Banks</h6>
                <Link to="/chase">Chase</Link>
                <Link to="/bank-of-america">Bank of America</Link>
                <Link to="/wells-fargo">Wells Fargo</Link>
                <Link to="/citibank">Citibank</Link>
              </div>
              <div className="footer-col">
                <h6>Company</h6>
                <Link to="/pricing">About Us</Link>
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/terms">Terms of Service</Link>
                <a href="mailto:hello@bankstatementconverttool.com">Contact Support</a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="footer-copyright">
              © 2026 StatementToCSV. Built with privacy as the first principle.
            </div>
            <div className="footer-social">
              {/* Optional social icons */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
