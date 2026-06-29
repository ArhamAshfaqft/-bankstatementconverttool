import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, SearchX } from 'lucide-react';
import SeoHead from '../components/SeoHead';

export default function NotFoundPage() {
  return (
    <>
      <SeoHead
        title="Page Not Found | StatementToCSV"
        description="This page does not exist. Return to the private bank statement conversion tools."
        noindex
      />
      <section className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '720px', textAlign: 'center' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            background: '#f1f5f9',
            color: '#0f766e',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem'
          }}>
            <SearchX size={34} />
          </div>
          <h1 style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)', marginBottom: '1rem' }}>Page not found</h1>
          <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            The URL may have moved, or it may not be a public tool page. Start with the converter suite or choose a specific format from the navigation.
          </p>
          <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex' }}>
            Open the converter <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
