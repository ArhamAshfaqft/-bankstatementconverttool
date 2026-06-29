import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '../components/SeoHead';
import { Search, Clock, ArrowRight, BookOpen, Shield, ShieldAlert, Cpu } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';

export default function BlogIndexPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Security', 'Tutorial', 'QuickBooks'];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <SeoHead 
        title="Accounting & Security Blog - StatementToCSV"
        description="Expert guides, tutorials, and security audits on converting bank statements, managing transaction formats, and preserving financial data privacy."
        canonical="https://bankstatementconverttool.com/blog"
      />

      <header className="layout-standard-hero" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2rem', color: '#ffffff' }}>
            <Cpu size={16} /> Auditor-Grade Content Hub
          </div>
          <h1>The Accounting <span>Security Blog</span></h1>
          <p>Guides on secure data extraction, bookkeeping automation, and keeping sensitive financials local.</p>
        </div>
      </header>

      <section className="section" style={{ minHeight: '60vh', background: '#F8FAFC' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* SEARCH & FILTER CONTROLS */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            gap: '1.5rem',
            marginBottom: '3rem',
            background: 'white',
            padding: '1.5rem',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: '100px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    border: '1px solid',
                    borderColor: activeCategory === cat ? 'var(--brand-500)' : '#E2E8F0',
                    background: activeCategory === cat ? 'var(--brand-50)' : 'white',
                    color: activeCategory === cat ? 'var(--brand-700)' : '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 1rem 0.6rem 2.75rem',
                  borderRadius: '100px',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.9rem',
                  outline: 'none',
                  color: '#0F172A',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
                }}
              />
            </div>
          </div>

          {/* ARTICLES LISTING */}
          {filteredPosts.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
              {filteredPosts.map(post => (
                <article
                  key={post.slug}
                  style={{
                    background: 'white',
                    border: '1px solid #E2E8F0',
                    borderRadius: '24px',
                    padding: '2.5rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.01)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.03)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.01)'; }}
                >
                  {post.featuredImage && (
                    <div style={{ margin: '-2.5rem -2.5rem 0 -2.5rem', height: '280px', background: '#F1F5F9', overflow: 'hidden' }}>
                      <img src={post.featuredImage} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: '700', 
                      background: 'var(--brand-50)', 
                      color: 'var(--brand-700)', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '100px' 
                    }}>
                      {post.category}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={14} /> {post.readTime}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#64748B' }}>•</span>
                    <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{post.date}</span>
                  </div>

                  <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0, color: '#0F172A', lineHeight: '1.3' }}>
                    <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {post.title}
                    </Link>
                  </h2>

                  <p style={{ color: '#475569', fontSize: '1.05rem', margin: 0, lineHeight: '1.6' }}>
                    {post.description}
                  </p>

                  <div style={{ marginTop: '0.5rem' }}>
                    <Link to={`/blog/${post.slug}`} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
                      Read Full Article <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 0', background: 'white', border: '1px solid #E2E8F0', borderRadius: '24px' }}>
              <Shield size={40} style={{ color: '#94A3B8', marginBottom: '1rem' }} />
              <h3 style={{ color: '#0F172A', marginBottom: '0.5rem' }}>No articles found</h3>
              <p style={{ color: '#64748B' }}>Try refining your search terms or selecting a different category filter.</p>
            </div>
          )}

        </div>
      </section>
    </>
  );
}
