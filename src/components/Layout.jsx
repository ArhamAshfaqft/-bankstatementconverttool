import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FileSpreadsheet, ChevronDown } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const scrollToConverter = () => {
    document.getElementById('converter')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="page-wrapper">
      {/* ===== NAVIGATION ===== */}
      <nav className="nav" role="navigation" aria-label="Main navigation">
        <div className="container nav-inner">
          <Link to="/" className="nav-logo">
            <div className="nav-logo-icon">
              <FileSpreadsheet size={18} />
            </div>
            StatementToCSV
          </Link>
          <ul className="nav-links">
            <li className="nav-dropdown">
              <a href="#converter">Tools <ChevronDown size={14} /></a>
              <div className="nav-dropdown-content">
                <a href={`${location.pathname}?format=csv#converter`}>PDF to CSV Converter</a>
                <a href={`${location.pathname}?format=excel#converter`}>PDF to Excel Converter</a>
                <a href={`${location.pathname}?format=qbo#converter`}>PDF to QuickBooks (QBO)</a>
              </div>
            </li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#supported-banks">Supported Banks</a></li>
            <li><a href="#trust">Why Trust Us</a></li>
            <li><a href="#pro" style={{ color: 'var(--brand-500)', fontWeight: 'bold' }}>Pro Desktop</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
          <button className="nav-cta btn-ghost" onClick={scrollToConverter}>
            Convert PDF
          </button>
        </div>
      </nav>

      {/* ===== MAIN CONTENT INJECTED HERE ===== */}
      <main>
        <Outlet />
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-columns" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', width: '100%', marginBottom: '2rem' }}>
            <div className="footer-col" style={{ flex: '1 1 300px' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#111827' }}><FileSpreadsheet size={16} style={{ display: 'inline', marginRight: '0.5rem', position: 'relative', top: '2px' }}/>StatementToCSV</h3>
              <p style={{ color: '#4B5563', fontSize: '0.9rem', lineHeight: '1.6' }}>The world's most private and accurate bank statement parsing engine. 100% local browser processing.</p>
            </div>
            
            <div className="footer-col" style={{ flex: '1 1 200px' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#111827' }}>Tools</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li><Link to="/?format=csv#converter" style={{ color: '#4B5563', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Bank Statement PDF to CSV</Link></li>
                <li><Link to="/bank-of-america?format=csv#converter" style={{ color: '#4B5563', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>BofA Statement to CSV</Link></li>
                <li><Link to="/chase?format=csv#converter" style={{ color: '#4B5563', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Chase Statement to CSV</Link></li>
                <li><Link to="/wells-fargo?format=csv#converter" style={{ color: '#4B5563', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Wells Fargo Statement to CSV</Link></li>
                <li><Link to="/citibank?format=csv#converter" style={{ color: '#4B5563', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Citibank Statement to CSV</Link></li>
                <li><Link to="/capital-one?format=csv#converter" style={{ color: '#4B5563', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Capital One Statement to CSV</Link></li>
              </ul>
            </div>

            <div className="footer-col" style={{ flex: '1 1 200px' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#111827' }}>Legal</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li><a href="/privacy" style={{ color: '#4B5563', textDecoration: 'none', fontSize: '0.9rem' }}>Privacy Policy</a></li>
                <li><a href="/terms" style={{ color: '#4B5563', textDecoration: 'none', fontSize: '0.9rem' }}>Terms of Service</a></li>
                <li><a href="mailto:support@statementtocsv.com" style={{ color: '#4B5563', textDecoration: 'none', fontSize: '0.9rem' }}>Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div style={{ paddingTop: '1.5rem', borderTop: '1px solid #E5E7EB', width: '100%', textAlign: 'center' }}>
             <p className="footer-copy" style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>© 2026 StatementToCSV. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
