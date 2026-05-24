import React from 'react';
import { Zap, ShieldCheck, Lock, TrendingUp, ArrowRight } from 'lucide-react';
import VisualizerTool from '../components/VisualizerTool';
import SeoHead from '../components/SeoHead';

export default function VisualizerPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Local Bank Statement Visualizer",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "WebBrowser",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <SeoHead 
        title="Interactive Bank Statement Visualizer | Private Spending Insights"
        description="Visualize your bank statements instantly without uploading data. Our local engine categorizes spending and generates beautiful financial dashboards in your browser."
        canonical="https://www.bankstatementconverttool.com/visualizer"
        jsonLd={[schema]}
      />

      <header className="layout-standard-hero" style={{ background: 'linear-gradient(135deg, #10b981 0%, #064E3B 100%)' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2rem', color: '#ffffff' }}>
            <TrendingUp size={16} /> Instant Wealth Intelligence
          </div>
          <h1>Visualize Your <span>Financial Health</span></h1>
          <p>Drop any bank statement PDF to generate an instant, interactive dashboard of your income and expenses. 100% private — we never see your data.</p>
        </div>
      </header>

      <section className="layout-tool-container">
        <div className="container">
          <VisualizerTool />
        </div>
      </section>

      {/* WHY USE THE VISUALIZER */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">High-Level Insights</span>
            <h2>Make Sense of the Numbers</h2>
            <p>Don't just look at a list of transactions. Understand exactly where your money is going.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon teal"><TrendingUp size={20} /></div>
              <h3>Automatic Categorization</h3>
              <p>Our smart engine groups your spending into categories like Shopping, Food, Transport, and Bills automatically.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon amber"><ShieldCheck size={20} /></div>
              <h3>Privacy Guaranteed</h3>
              <p>Generic budgeting apps want your bank logins. Our tool only needs a PDF and processes everything locally. No logins, no cloud, no risk.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon blue"><Lock size={20} /></div>
              <h3>Work Offline</h3>
              <p>Because the logic is 100% client-side, the visualizer works even if you're offline once the page is loaded.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to visualize your spending?</h2>
          <p>Start for free. No account or bank connection required.</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Analyze Statement Now <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
