import React from 'react';
import SeoHead from '../components/SeoHead';

export default function PrivacyPage() {
  const lastUpdated = "April 18, 2026";
  const domain = "www.bankstatementconverttool.com";

  return (
    <>
      <SeoHead 
        title="Privacy Policy | StatementToCSV"
        description="Learn how we protect your financial data with 100% local browser processing."
        canonical={`https://${domain}/privacy`}
      />
      
      <div className="container" style={{ maxWidth: '800px', padding: '80px 20px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--slate-500)', marginBottom: '3rem' }}>Last Updated: {lastUpdated}</p>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--brand-600)' }}>1. Our "Zero-Upload" Commitment</h2>
          <p style={{ lineHeight: '1.7', color: 'var(--slate-700)' }}>
            StatementToCSV was built on a "Privacy-by-Design" architecture. Unlike traditional converters that upload your sensitive bank statements to a remote server, our tool processes all files <strong>entirely within your local browser's memory</strong>.
          </p>
          <ul style={{ lineHeight: '1.7', marginTop: '1rem', paddingLeft: '1.5rem', color: 'var(--slate-700)' }}>
            <li>Your PDF files never leave your device.</li>
            <li>No transaction data is ever sent to our servers.</li>
            <li>No financial information is ever stored in a database.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--brand-600)' }}>2. Information We Collect</h2>
          <p style={{ lineHeight: '1.7', color: 'var(--slate-700)' }}>
            We only collect information necessary to manage your account and billing:
          </p>
          <ul style={{ lineHeight: '1.7', marginTop: '1rem', paddingLeft: '1.5rem', color: 'var(--slate-700)' }}>
            <li><strong>Authentication:</strong> Email address for account creation and login via Supabase Auth.</li>
            <li><strong>Billing:</strong> Payment details and subscription status managed securely by Freemius. We do not store credit card numbers on our infrastructure.</li>
            <li><strong>Usage Data:</strong> Anonymous analytics (e.g., page views) to help us improve the website performance.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--brand-600)' }}>3. Third-Party Services</h2>
          <p style={{ lineHeight: '1.7', color: 'var(--slate-700)' }}>
            We use a limited number of trusted partners to operate our service:
          </p>
          <ul style={{ lineHeight: '1.7', marginTop: '1rem', paddingLeft: '1.5rem', color: 'var(--slate-700)' }}>
            <li><strong>Supabase:</strong> Provides our secure database for user authentication.</li>
            <li><strong>Freemius:</strong> Handles our checkout process and license management.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--brand-600)' }}>4. Cookies</h2>
          <p style={{ lineHeight: '1.7', color: 'var(--slate-700)' }}>
            We use essential cookies to keep you logged in and manage your session. You can disable cookies in your browser, but some features of the app may stop working.
          </p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--brand-600)' }}>5. Contact Us</h2>
          <p style={{ lineHeight: '1.7', color: 'var(--slate-700)' }}>
            If you have any questions about this Privacy Policy, please contact us at: <br/> 
            <strong>hello@bankstatementconverttool.com</strong>
          </p>
        </section>
      </div>
    </>
  );
}
