import React from 'react';
import { Check, X, ArrowRight, Zap, Target, Shield, FileSpreadsheet } from 'lucide-react';
import SeoHead from '../components/SeoHead';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const FREEMIUS_PUBLIC_KEY = 'pk_8a38b2c52c5b60c84897c29c5cc86';
const FREEMIUS_PRODUCT_ID = '27752';

const PLANS = {
  PRO: '45873',
  FIRM: '45874'
};

export default function PricingPage() {
  const { user, checkProStatus } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async (planId) => {
    if (!user) {
      alert("Please log in or create an account first so we can link your Pro status correctly.");
      navigate('/login?redirect=/pricing');
      return;
    }

    if (!window.FS) {
      alert("Billing system still loading. Please try again in a second.");
      return;
    }

    // --- SANDBOX TOKEN LOGIC (FOR REAL TEST PAYMENTS ON LOCALHOST) ---
    let sandboxParams = {};
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (isLocal && window.CryptoJS) {
      const secretKey = 'sk_c2o!ETrps:rCMnHy3^;C#OZKTDv?9';
      const timestamp = Math.floor(Date.now() / 1000);
      const dataToHash = `${timestamp}${FREEMIUS_PRODUCT_ID}${secretKey}${FREEMIUS_PUBLIC_KEY}checkout`;
      
      const hashHex = window.CryptoJS.MD5(dataToHash).toString();
      
      sandboxParams = {
        token: hashHex,
        ctx: timestamp 
      };
      console.log("🛠️ Sandbox Parameters Prepared with CryptoJS (ctx assigned)");
    }
    // -----------------------------------------------------------------

    const handler = new window.FS.Checkout({
      product_id: FREEMIUS_PRODUCT_ID,
      public_key: FREEMIUS_PUBLIC_KEY,
      plan_id: planId,
      sandbox: isLocal ? sandboxParams : undefined,
      is_sandbox: isLocal
    });

    handler.open({
      name: 'Bank Statement Converter Suite',
      user_email: user?.email || '',
      // Executed immediately after a successful payment
      purchaseCompleted: (response) => {
        console.log("💰 Payment completed!", response);
      },
      // Executed when the user closes the dashboard after purchase
      success: async (response) => {
        console.log("✅ Checkout success:", response);
        if (user) {
          try {
            const { supabase } = await import('../lib/supabase');
            
            // Safety Fallbacks: SDK versions vary in property naming
            const licenseId = response.purchase?.license_id?.toString() || 
                             response.license?.id?.toString() || 
                             response.license?.key || 
                             '';
            
            const freemiusId = response.user?.id?.toString() || '';
            
            const { error } = await supabase
              .from('profiles')
              .update({
                freemius_license_key: licenseId,
                freemius_id: freemiusId,
                subscription_tier: 'pro'
              })
              .eq('id', user.id);
            
            if (error) throw error;
            console.log("🚀 Database synced with Pro status.");
            await checkProStatus();
          } catch (err) {
            console.error("❌ Failed to update profile after payment:", err);
          }
        }
        navigate('/success');
      }
    });
  };

  return (
    <>
      <SeoHead 
        title="Pricing | Bank Statement Converter"
        description="Choose the right plan. Process single bank statements for free, or upgrade to Pro for bulk multi-file merging and Excel/QuickBooks exports."
      />
      
      <div className="pricing-page">
        <section className="pricing-hero">
          <div className="container">
            <h1>Simple pricing, designed to scale.</h1>
            <p className="hero-subtitle">Stop wasting hours on manual data entry. Start parsing bank statements instantly.</p>
          </div>
        </section>

        <section className="pricing-grid-section">
          <div className="container">
            <div className="pricing-grid">
              
              {/* Free Tier */}
              <div className="pricing-card">
                <div className="card-header">
                  <h3>Basic</h3>
                  <div className="price">
                    <span className="amount">$0</span>
                    <span className="period">/ month</span>
                  </div>
                  <p>Perfect for occasional personal use.</p>
                </div>
                <div className="card-body">
                  <ul className="feature-list">
                    <li><Check size={16} className="text-success" /> <span><strong>Unlimited</strong> single-file conversions</span></li>
                    <li><Check size={16} className="text-success" /> <span>Export to CSV</span></li>
                    <li><Check size={16} className="text-success" /> <span>Local Zero-Upload processing</span></li>
                    <li><Check size={16} className="text-success" /> <span>Manual Edit UI</span></li>
                    <li className="disabled"><X size={16} /> <span>Export to Excel (.xlsx)</span></li>
                    <li className="disabled"><X size={16} /> <span>Export to QuickBooks (.qbo)</span></li>
                    <li className="disabled"><X size={16} /> <span>Bulk Multi-file processing</span></li>
                  </ul>
                  <Link to="/" className="btn btn-outline" style={{width: '100%', justifyContent: 'center'}}>
                    Start Free
                  </Link>
                </div>
              </div>

              {/* Pro Tier */}
              <div className="pricing-card popular">
                <div className="popular-badge">Most Popular</div>
                <div className="card-header">
                  <h3>Pro Accountant</h3>
                  <div className="price">
                    <span className="amount">$19</span>
                    <span className="period">/ month</span>
                  </div>
                  <p>For bookkeepers and accounting professionals.</p>
                </div>
                <div className="card-body">
                   <ul className="feature-list">
                    <li><Check size={16} className="text-success" /> <span><strong>Unlimited</strong> statements</span></li>
                    <li><Check size={16} className="text-success" /> <span>Export to Excel (.xlsx)</span></li>
                    <li><Check size={16} className="text-success" /> <span>Export to QuickBooks (.qbo)</span></li>
                    <li><Check size={16} className="text-success" /> <span><strong>Bulk Multi-file processing</strong></span></li>
                    <li><Check size={16} className="text-success" /> <span><strong>Merged annual reports</strong> (12mo → 1 file)</span></li>
                    <li><Check size={16} className="text-success" /> <span>Auto-date formatting (YYYY-MM-DD)</span></li>
                  </ul>
                   <button 
                    className="btn btn-primary" 
                    style={{width: '100%', justifyContent: 'center'}}
                    onClick={() => {
                      handleCheckout(PLANS.PRO);
                    }}
                  >
                    Upgrade to Pro
                  </button>
                </div>
              </div>

              {/* Enterprise */}
              <div className="pricing-card" style={{ opacity: 0.85 }}>
                <div className="card-header">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Firm</h3>
                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', background: '#e2e8f0', borderRadius: '4px', fontWeight: '700' }}>COMING SOON</span>
                  </div>
                  <div className="price">
                    <span className="amount">$49</span>
                    <span className="period">/ month</span>
                  </div>
                  <p>For high-volume tax & accounting agencies.</p>
                </div>
                <div className="card-body">
                  <ul className="feature-list">
                    <li><Check size={16} className="text-success" /> <span><strong>Everything in Pro</strong></span></li>
                    <li><Check size={16} className="text-success" /> <span>Unlimited team members</span></li>
                    <li><Check size={16} className="text-success" /> <span>API Access (Coming soon)</span></li>
                    <li><Check size={16} className="text-success" /> <span>Custom statement templates</span></li>
                    <li><Check size={16} className="text-success" /> <span>White-glove onboarding</span></li>
                  </ul>
                   <button 
                    className="btn btn-outline" 
                    style={{width: '100%', justifyContent: 'center', cursor: 'not-allowed', opacity: 0.6}}
                    disabled
                  >
                    Coming Soon
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section className="faq-section">
          <div className="container">
            <h2 className="text-center" style={{marginBottom: '3rem'}}>Frequently Asked Questions</h2>
            <div className="faq-grid">
              <div className="faq-item">
                <h4>Is it really 100% private?</h4>
                <p>Yes. Unlike cloud competitors, our tool processes the PDF directly inside your web browser. No financial data ever leaves your computer or touches our servers.</p>
              </div>
              <div className="faq-item">
                <h4>What happens if my statement format isn't supported?</h4>
                <p>Our V2 engine handles 99% of global bank formats dynamically. If a column is misidentified, you can fix it instantly using our Manual Edit UI before exporting.</p>
              </div>
              <div className="faq-item">
                <h4>Can I cancel anytime?</h4>
                <p>Absolutely. There are no long-term contracts. You can cancel your subscription with one click from your account dashboard.</p>
              </div>
              <div className="faq-item">
                <h4>How does Bulk Processing work?</h4>
                <p>On the Pro plan, you can drag 12 monthly statements into the tool at once. We will parse all 12, merge them chronologically, and output a single, clean Excel file for the whole year.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .pricing-page {
          padding-bottom: 5rem;
        }
        .pricing-hero {
          text-align: center;
          padding: 4rem 1rem 2rem;
        }
        .pricing-hero h1 {
          font-size: 3rem;
          font-weight: 800;
          color: var(--text-heading);
          margin-bottom: 1rem;
          letter-spacing: -0.03em;
        }
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1100px;
          margin: 0 auto;
          align-items: stretch;
        }
        .pricing-card {
          background: white;
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          position: relative;
          box-shadow: var(--shadow-md);
        }
        .pricing-card.popular {
          border: 2px solid var(--brand-500);
          transform: translateY(-8px);
          box-shadow: var(--shadow-xl);
        }
        .popular-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--brand-500);
          color: white;
          padding: 0.25rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .card-header {
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .card-header h3 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
          color: var(--text-heading);
        }
        .price {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
          margin-bottom: 0.5rem;
        }
        .price .amount {
          font-size: 3rem;
          font-weight: 800;
          color: var(--text-heading);
          letter-spacing: -0.03em;
        }
        .price .period {
          color: var(--text-muted);
          font-weight: 500;
        }
        .card-header p {
          color: var(--text-muted);
          font-size: 0.9rem;
          line-height: 1.5;
        }
        .card-body {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .feature-list {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem 0;
          flex: 1;
        }
        .feature-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 0.85rem;
          font-size: 0.9375rem;
          color: var(--text-body);
          line-height: 1.4;
        }
        .feature-list li svg {
          margin-top: 0.2rem;
        }
        .text-success {
          color: var(--brand-500);
          flex-shrink: 0;
        }
        .feature-list li.disabled {
          color: var(--text-muted);
          opacity: 0.7;
        }
        .faq-section {
          max-width: 900px;
          margin: 5rem auto 0;
          padding: 0 1rem;
        }
        .faq-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
        }
        .faq-item h4 {
          font-size: 1.1rem;
          margin-bottom: 0.75rem;
          color: var(--text-heading);
        }
        .faq-item p {
          color: var(--text-body);
          font-size: 0.95rem;
          line-height: 1.6;
        }
        @media(max-width: 768px) {
          .pricing-card.popular {
            transform: none;
          }
          .faq-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
