import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SeoHead from '../components/SeoHead';
import ConverterTool from '../components/ConverterTool';
import { ChevronRight, Calendar, User, Clock, ArrowLeft, ShieldAlert, CheckCircle, FileSpreadsheet, Lock } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="container" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <h2>Post Not Found</h2>
        <p>The article you are looking for does not exist or has been relocated.</p>
        <Link to="/blog" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Back to Blog
        </Link>
      </div>
    );
  }

  // Article structured JSON-LD Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "datePublished": "2026-05-26",
    "dateModified": "2026-05-26",
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "StatementToCSV",
      "logo": {
        "@type": "ImageObject",
        "url": "https://bankstatementconverttool.com/assets/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://bankstatementconverttool.com/blog/${post.slug}`
    }
  };

  const renderBlock = (block, idx) => {
    switch (block.type) {
      case 'h2':
        return <h2 key={idx} style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0F172A', marginTop: '2.5rem', marginBottom: '1.25rem', lineHeight: '1.3' }}>{block.text}</h2>;
      case 'h3':
        return <h3 key={idx} style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0F172A', marginTop: '2rem', marginBottom: '1rem' }}>{block.text}</h3>;
      case 'p':
        return <p key={idx} style={{ color: '#334155', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1.5rem', margin: '0 0 1.5rem' }}>{block.text}</p>;
      case 'list-items':
        return (
          <ul key={idx} style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {block.items.map((item, i) => (
              <li key={i} style={{ color: '#334155', fontSize: '1.05rem', lineHeight: '1.6' }}>{item}</li>
            ))}
          </ul>
        );
      case 'list-ordered':
        return (
          <ol key={idx} style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {block.items.map((item, i) => (
              <li key={i} style={{ color: '#334155', fontSize: '1.05rem', lineHeight: '1.6' }}>{item}</li>
            ))}
          </ol>
        );
      case 'warning':
        return (
          <div key={idx} style={{ display: 'flex', gap: '1rem', background: '#FEF2F2', borderLeft: '4px solid #EF4444', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <ShieldAlert size={24} style={{ color: '#EF4444', flexShrink: 0 }} />
            <p style={{ margin: 0, color: '#991B1B', fontSize: '0.95rem', fontWeight: '500', lineHeight: '1.6' }}>{block.text}</p>
          </div>
        );
      case 'table':
        return (
          <div key={idx} className="citi-table-container" style={{ margin: '2rem 0', overflowX: 'auto' }}>
            <table className="citi-data-table">
              <thead>
                <tr>
                  {block.headers.map((h, i) => <th key={i}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className={j === 0 ? 'col-bold' : ''}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <SeoHead 
        title={post.metaTitle || post.title}
        description={post.description}
        canonical={`https://bankstatementconverttool.com/blog/${post.slug}`}
        jsonLd={[articleSchema]}
      />

      <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '3rem 0 6rem' }}>
        <div className="container">
          
          {/* BREADCRUMB */}
          <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748B', marginBottom: '2.5rem' }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <Link to="/blog" style={{ color: 'inherit', textDecoration: 'none' }}>Blog</Link>
            <ChevronRight size={14} />
            <span style={{ color: '#0F172A', fontWeight: '500', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {post.title}
            </span>
          </nav>

          {/* TWO COLUMN GRID */}
          <div className="blog-layout-grid">
            
            {/* MAIN CONTENT COLUMN */}
            <main className="blog-post-content">
              
              {/* META INFO */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'center', fontSize: '0.85rem', color: '#64748B', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ fontWeight: '700', background: 'var(--brand-50)', color: 'var(--brand-700)', padding: '0.25rem 0.75rem', borderRadius: '100px' }}>
                  {post.category}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={14} /> {post.date}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <User size={14} /> By {post.author}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={14} /> {post.readTime}
                </span>
              </div>

              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#0F172A', lineHeight: '1.25', margin: '0 0 2rem' }}>
                {post.title}
              </h1>

              {post.featuredImage && (
                <div style={{ marginBottom: '2.5rem', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0', background: '#F1F5F9' }}>
                  <img src={post.featuredImage} alt={post.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
              )}

              {/* ARTICLE BODY */}
              <div className="article-body">
                {post.content.map((block, idx) => renderBlock(block, idx))}
              </div>

            </main>

            {/* STICKY CONVERTER SIDEBAR */}
            <aside className="blog-sidebar">
              
              <div style={{ 
                background: 'white', 
                border: '1px solid #E2E8F0', 
                borderRadius: '24px', 
                padding: '2rem', 
                boxShadow: '0 10px 15px rgba(0,0,0,0.03)' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#107c41', fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                  <Lock size={16} /> 100% Offline Converter
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', margin: '0 0 0.5rem', lineHeight: '1.3' }}>
                  Convert to Excel Instantly
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: '1.5', margin: '0 0 1.5rem' }}>
                  Drop your PDF bank statement below to extract your transaction tables locally in your browser.
                </p>
                
                {/* Embed ConverterTool */}
                <div className="sidebar-converter-embed">
                  <ConverterTool />
                </div>
              </div>

              <div style={{ 
                background: 'linear-gradient(135deg, #0e6233 0%, #107c41 100%)', 
                color: 'white', 
                padding: '2rem', 
                borderRadius: '24px', 
                boxShadow: '0 10px 15px rgba(16,124,65,0.1)' 
              }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', margin: '0 0 0.5rem' }}>
                  Why Use Local Parser?
                </h4>
                <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem', opacity: 0.9 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={14} style={{ color: '#A7F3D0', flexShrink: 0 }} /> Your data never leaves your computer
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={14} style={{ color: '#A7F3D0', flexShrink: 0 }} /> Secure for accounting compliance
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={14} style={{ color: '#A7F3D0', flexShrink: 0 }} /> Instantly clean row alignment
                  </li>
                </ul>
              </div>

            </aside>

          </div>

        </div>
      </div>
    </>
  );
}
