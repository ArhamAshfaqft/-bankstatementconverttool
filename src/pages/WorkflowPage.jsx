import React from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '../components/SeoHead';
import ConverterTool from '../components/ConverterTool';
import FraudDetectorTool from '../components/FraudDetectorTool';
import { workflowPages } from '../data/workflowPages';

function ContentBlock({ block }) {
  if (block.type === 'h2') return <h2>{block.text}</h2>;
  if (block.type === 'p') return <p>{block.text}</p>;
  if (block.type === 'warning') return <aside className="workflow-warning">{block.text}</aside>;
  if (block.type === 'list-ordered') return <ol>{block.items.map(item => <li key={item}>{item}</li>)}</ol>;
  if (block.type === 'list-items') return <ul>{block.items.map(item => <li key={item}>{item}</li>)}</ul>;
  if (block.type === 'table') return <div className="workflow-table-wrap"><table><thead><tr>{block.headers.map(header => <th key={header}>{header}</th>)}</tr></thead><tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>;
  if (block.type === 'link') return <p>{block.href.startsWith('/') ? <Link to={block.href}>{block.text}</Link> : <a href={block.href} target="_blank" rel="noopener noreferrer">{block.text}</a>}</p>;
  return null;
}

export default function WorkflowPage({ page }) {
  const canonical = `https://bankstatementconverttool.com/${page.slug}`;
  const related = workflowPages.filter(item => item.slug !== page.slug);
  return <>
    <SeoHead title={page.metaTitle} description={page.description} canonical={canonical} image={`https://bankstatementconverttool.com${page.image}`} />
    <header className="workflow-hero">
      <div className="container workflow-hero-grid">
        <div>
          <Link to="/" className="workflow-breadcrumb">Home</Link>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
          <a className="btn btn-primary" href="#workflow-tool">{page.tool === 'template' ? 'Download the CSV template' : 'Use the free tool'}</a>
        </div>
        <img src={page.image} alt={page.imageAlt} width="1600" height="900" />
      </div>
    </header>
    <section className="section" id="workflow-tool">
      <div className="container workflow-tool">
        {page.tool === 'converter' && <ConverterTool />}
        {page.tool === 'audit' && <FraudDetectorTool />}
        {page.tool === 'template' && <div className="workflow-template-card">
          <h2>Download the sample CSV</h2>
          <p>Two fictional transactions show the expected column layout. Replace them before using the file for your own records.</p>
          <a className="btn btn-primary" href="/assets/bank-statement-csv-template.csv" download>Download CSV template</a>
        </div>}
      </div>
    </section>
    <section className="section section-alt"><div className="container workflow-body">
      {page.content.map((block, index) => <ContentBlock block={block} key={index} />)}
    </div></section>
    <section className="section"><div className="container workflow-related">
      <h2>More bank statement help</h2>
      <div>{related.map(item => <Link key={item.slug} to={`/${item.slug}`}>{item.title}</Link>)}</div>
    </div></section>
  </>;
}
