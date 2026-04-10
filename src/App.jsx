import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { FileSpreadsheet, LayoutGrid, HelpCircle } from 'lucide-react';
import BulkConverter from './components/BulkConverter';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ChasePage from './pages/ChasePage';
import BofAPage from './pages/BofAPage';
import WellsFargoPage from './pages/WellsFargoPage';
import CitiPage from './pages/CitiPage';
import CapitalOnePage from './pages/CapitalOnePage';
import './desktop.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Robust Environment Detection
  const isDesktop = (typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('electron')) || !!window.electronAPI;

  if (isDesktop) {
    return (
      <div className="desktop-app">
        <aside className="ds-sidebar">
          <div className="ds-sidebar-logo">
            <FileSpreadsheet size={20} style={{ color: 'var(--ds-accent)' }} />
            <span>StatementParser Pro</span>
          </div>
          
          <nav className="ds-nav">
            <button className={`ds-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <LayoutGrid size={18} /> Converter
            </button>
            <button className={`ds-nav-item ${activeTab === 'help' ? 'active' : ''}`} onClick={() => setActiveTab('help')}>
              <HelpCircle size={18} /> Help
            </button>
          </nav>

          <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.7rem', color: '#64748b' }}>
             v1.0.4
          </div>
        </aside>

        <main className="ds-workspace">
          <div className="ds-content" style={{ position: 'relative' }}>
            {activeTab === 'dashboard' && <BulkConverter />}
            {activeTab === 'help' && (
              <div className="ds-empty-state">
                <h2 style={{ marginBottom: '0.5rem' }}>Help & Documentation</h2>
                <p>Drop PDF bank statements into the converter or use the file/folder buttons to import. Supports Chase, Bank of America, Wells Fargo, Citi, and thousands more.</p>
              </div>
            )}
          </div>

          <footer className="ds-statusbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '7px', height: '7px', background: '#4ade80', borderRadius: '50%' }}></div>
              Ready
            </div>
            <div style={{ marginLeft: 'auto' }}>v1.0.4</div>
          </footer>
        </main>
      </div>
    );
  }

  // Web Environment - Route Rendering
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="chase" element={<ChasePage />} />
        <Route path="bank-of-america" element={<BofAPage />} />
        <Route path="wells-fargo" element={<WellsFargoPage />} />
        <Route path="citibank" element={<CitiPage />} />
        <Route path="capital-one" element={<CapitalOnePage />} />
        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
  );
}
