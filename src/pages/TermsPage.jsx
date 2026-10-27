import React from 'react';
import SeoHead from '../components/SeoHead';

export default function TermsPage() {
  const lastUpdated = "October 27, 2026";
  const domain = "bankstatementconverttool.com";

  return (
    <>
      <SeoHead 
        title="Terms of Service | StatementToCSV"
        description="Review our terms of use for the Bank Statement PDF to CSV converter."
        canonical={`https://${domain}/terms`}
      />
      
      <div className="container" style={{ maxWidth: '800px', padding: '80px 20px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Terms of Service</h1>
        <p style={{ color: 'var(--slate-500)', marginBottom: '3rem' }}>Last Updated: {lastUpdated}</p>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--brand-600)' }}>1. Acceptance of Terms</h2>
          <p style={{ lineHeight: '1.7', color: 'var(--slate-700)' }}>
            By accessing and using StatementToCSV ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.
          </p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--brand-600)' }}>2. Description of Service</h2>
          <p style={{ lineHeight: '1.7', color: 'var(--slate-700)' }}>
            StatementToCSV provides browser-based tools for converting bank statement PDFs to CSV, Excel, and QBO formats, as well as PDF redaction and merging tools. 
          </p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--brand-600)' }}>3. Financial Data & Security</h2>
          <p style={{ lineHeight: '1.7', color: 'var(--slate-700)' }}>
            <strong>Local Processing:</strong> PDF parsing and data extraction are performed locally on your device. We do not transmit or store the files you select or the extracted financial transaction data.
          </p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--brand-600)' }}>4. Free Access</h2>
          <p style={{ lineHeight: '1.7', color: 'var(--slate-700)' }}>
            The tools on this website are available without creating an account or purchasing a subscription.
          </p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--brand-600)' }}>5. Limitation of Liability</h2>
          <p style={{ lineHeight: '1.7', color: 'var(--slate-700)' }}>
            The Service is provided "as is" without warranties of any kind. We are not liable for any financial errors, data loss, or damages resulting from the use of the extracted data. It is your responsibility to verify the accuracy of the converted files before using them in accounting software.
          </p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--brand-600)' }}>6. Modifications</h2>
          <p style={{ lineHeight: '1.7', color: 'var(--slate-700)' }}>
            We reserve the right to modify these terms at any time. Continued use of the service after such changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--brand-600)' }}>7. Contact</h2>
          <p style={{ lineHeight: '1.7', color: 'var(--slate-700)' }}>
            For questions regarding these terms, contact us at: <strong>hello@bankstatementconverttool.com</strong>
          </p>
        </section>
      </div>
    </>
  );
}
