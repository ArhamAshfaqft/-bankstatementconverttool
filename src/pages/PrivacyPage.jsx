import React from 'react';
import SeoHead from '../components/SeoHead';

export default function PrivacyPage() {
  const lastUpdated = "October 27, 2026";
  const domain = "bankstatementconverttool.com";

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
            The converter does not require an account or payment. Your selected files and extracted transactions are processed in your browser.
          </p>
          <ul style={{ lineHeight: '1.7', marginTop: '1rem', paddingLeft: '1.5rem', color: 'var(--slate-700)' }}>
            <li><strong>Website requests:</strong> Our hosting provider may receive ordinary request data such as your IP address and browser information when you visit the site.</li>
            <li><strong>Files:</strong> The PDF, CSV, and image files you select are not uploaded by the converter.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--brand-600)' }}>3. Third-Party Resources</h2>
          <p style={{ lineHeight: '1.7', color: 'var(--slate-700)' }}>
            The site loads web fonts from Google Fonts. The receipt scanner may download OCR language data. These requests do not contain your selected files.
          </p>
          <ul style={{ lineHeight: '1.7', marginTop: '1rem', paddingLeft: '1.5rem', color: 'var(--slate-700)' }}>
            <li><strong>Google Fonts:</strong> Supplies the site's font files.</li>
            <li><strong>OCR language files:</strong> Help the receipt scanner recognize text locally.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--brand-600)' }}>4. Cookies</h2>
          <p style={{ lineHeight: '1.7', color: 'var(--slate-700)' }}>
            The converter does not use account session cookies. Third-party resources or the hosting provider may process ordinary connection data when you load the site.
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
