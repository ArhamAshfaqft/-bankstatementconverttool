import React from 'react';
import SeoHead from '../components/SeoHead';
import ConverterTool from '../components/ConverterTool';
import { Database, ShieldOff, Zap } from 'lucide-react';

export default function CapitalOnePage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Capital One PDF Export Alternative",
    "description": "A direct comparison matrix and local utility for converting Capital One 360 and Spark Business PDFs to raw data."
  };

  return (
    <div className="cap1-matrix-layout">
      <SeoHead 
        title="Extract Capital One PDFs | Top CSV Tool Alternative"
        description="Bypass the manual typing. See why our parsing matrix is the fastest way to extract Capital One Spark and 360 statements into CSVs."
        canonical="https://bankstatementconverttool.com/capital-one"
        jsonLd={[schema]}
      />

      <div className="cap1-heading-band">
        <div className="container center-text">
          <h1>Capital One Data <span>Extraction Matrix</span></h1>
          <p>The smartest way to bridge the gap between Capital One PDFs and QuickBooks.</p>
        </div>
      </div>

      <div className="container cap1-core-grid">
        
        <div className="cap1-interactive-zone">
          <div className="cap1-zone-label">Local Parsing Engine</div>
          <ConverterTool />
        </div>

        <div className="cap1-table-zone">
          <table className="cap1-matrix-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>CapOne Portal</th>
                <th className="highlight">Our Local Utility</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Max Historical Export</td>
                <td>Current records only</td>
                <td className="highlight">Up to 7 Years via PDF</td>
              </tr>
              <tr>
                <td>Cross-Account Linking</td>
                <td>Requires separate files</td>
                <td className="highlight">Auto-Splits inside PDF</td>
              </tr>
              <tr>
                <td>Privacy Posture</td>
                <td>Bank Server</td>
                <td className="highlight">100% Offline Device Memory</td>
              </tr>
              <tr>
                <td>Data Cleaning</td>
                <td>Raw export</td>
                <td className="highlight">Strips commas & $ symbols</td>
              </tr>
            </tbody>
          </table>

          <div className="cap1-tech-specs">
            <h3>Engine Specifications</h3>
            <div className="spec-row">
              <Zap size={20}/>
              <div>
                <strong>Vector Search</strong>
                <p>Pinpoints the transaction grid perfectly.</p>
              </div>
            </div>
            <div className="spec-row">
              <ShieldOff size={20}/>
              <div>
                <strong>Zero Trace Architecture</strong>
                <p>No cache, no logs, no server uploads.</p>
              </div>
            </div>
            <div className="spec-row">
              <Database size={20}/>
              <div>
                <strong>Spark Business Support</strong>
                <p>Handles commercial multi-card ledgers.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
