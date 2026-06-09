import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export default function FaqSection({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section style={{ padding: '4rem 0', background: '#F8FAFC' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', background: 'var(--brand-100)', color: 'var(--brand-700)', borderRadius: '12px', marginBottom: '1rem' }}>
            <HelpCircle size={24} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0F172A', marginBottom: '1rem' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: '#64748B', fontSize: '1.1rem' }}>
            Everything you need to know about the conversion process and data security.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                style={{ 
                  background: 'white', 
                  borderRadius: '16px', 
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.5rem',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: '#0F172A',
                    fontSize: '1.1rem',
                    fontWeight: '600'
                  }}
                >
                  <span style={{ paddingRight: '2rem' }}>{faq.question}</span>
                  {isOpen ? <ChevronUp size={20} style={{ color: 'var(--brand-500)', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: '#94A3B8', flexShrink: 0 }} />}
                </button>
                
                {isOpen && (
                  <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', color: '#475569', lineHeight: '1.6', fontSize: '1rem' }}>
                    <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9' }}>
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
