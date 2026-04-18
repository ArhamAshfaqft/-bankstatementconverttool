import React from 'react';
import { CreditCard, Compass, Briefcase, FileSearch } from 'lucide-react';
import ConverterTool from '../components/ConverterTool';
import SeoHead from '../components/SeoHead';

export default function CreditCardPage() {
  return (
    <>
      <SeoHead 
        title="Convert Credit Card Statement PDF to CSV | Parse Visa, Mastercard, Amex"
        description="A specialized local parser built to extract transactions from Credit Card statements. Easily export to CSV or Excel for business expense tracking."
        canonical="https://www.bankstatementconverttool.com/credit-card-parser"
      />
      
      {/* HERO SECTION */}
      <section className="bank-hero" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', padding: '6rem 0 8rem', textAlign: 'center', position: 'relative' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2rem', color: '#ffffff' }}>
            <CreditCard size={16} /> Credit Card Parsing Engine
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', letterSpacing: '-1px', marginBottom: '1.5rem', color: '#ffffff' }}>
            Convert Credit Card Statements to CSV
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: '0.9', maxWidth: '750px', margin: '0 auto', color: 'rgba(255,255,255,0.95)' }}>
            Corporate credit cards have notoriously complex tables. Our specialized engine identifies Merchant Categories, foreign transaction fees, and standardizes debits perfectly.
          </p>
        </div>
      </section>

      {/* CONVERTER TOOL OVERLAP */}
      <section style={{ marginTop: '-5rem', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <ConverterTool /> 
        </div>
      </section>

      {/* WHY CREDIT CARDS ARE DIFFERENT */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '700px', margin: '0 auto' }}>
            <span className="section-label">Credit Card Complexity</span>
            <h2>Why Standard Parsers Fail on Credit Cards</h2>
            <p>Checking accounts are simple chronologies. Credit card statements feature payment reversals, fee groupings, and dual-line merchant descriptions.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <FileSearch size={32} color="#0f766e" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Dual-Line Descriptions</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>Many issuers format the Merchant Name on one line and the City/State on another. Our engine safely merges these orphaned strings into a single clean column.</p>
            </div>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <Compass size={32} color="#0f766e" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Polarity Correction</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>On credit cards, payments are credits (usually positive) and purchases are debits. We ensure these signs are mapped correctly so your accounting software doesn't register expenses as income.</p>
            </div>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <Briefcase size={32} color="#0f766e" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Corporate Spend Ready</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>Whether it's an Amex Platinum or a Chase Ink Business, our fallback algorithms are designed specifically to handle high-volume corporate expense grouping.</p>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
