import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, Scissors, X, Shield, ArrowRight, Loader2, Download } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { useAuth } from '../contexts/AuthContext';
import UpsellModal from './UpsellModal';

export default function SplitterTool() {
  const [files, setFiles] = useState([]);
  const [pageRange, setPageRange] = useState('');
  const [isSplitting, setIsSplitting] = useState(false);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [stats, setStats] = useState({ success: 0, failed: 0 });
  const fileInputRef = useRef(null);

  // Custom Gate Implementation
  const { isPro: realIsPro } = useAuth();
  const [devPro] = useState(sessionStorage.getItem('devPro') === 'true');
  const isPro = realIsPro || devPro;
  const [upsellFeature, setUpsellFeature] = useState(null);

  const onDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer ? e.dataTransfer.files : e.target.files)
      .filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    
    if (droppedFiles.length === 0) {
      setError("Please upload valid PDF files.");
      return;
    }
    
    // Bulk Auth Gate
    if (droppedFiles.length > 1 && !isPro) {
      setUpsellFeature('Bulk PDF Splitting');
      return;
    }

    setFiles(droppedFiles);
    setError(null);
    setSuccess(false);
    setProcessedUrl(null);
    setProcessedCount(0);
  };

  const parsePageRange = (range, totalPages) => {
    const pages = new Set();
    const parts = range.split(',').map(p => p.trim());
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(n => parseInt(n));
        if (isNaN(start) || isNaN(end)) return null;
        for (let i = Math.max(1, start); i <= Math.min(totalPages, end); i++) {
          pages.add(i - 1); // 0-indexed
        }
      } else {
        const page = parseInt(part);
        if (isNaN(page)) return null;
        if (page >= 1 && page <= totalPages) {
          pages.add(page - 1);
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (files.length === 0 || !pageRange) {
      setError("Please select file(s) and enter page numbers.");
      return;
    }

    setIsSplitting(true);
    setError(null);
    setProcessedCount(0);
    let sCount = 0;
    let fCount = 0;

    try {
      if (files.length === 1) {
        const arrayBuffer = await files[0].arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const totalPages = pdf.getPageCount();
        
        const targetPages = parsePageRange(pageRange, totalPages);
        if (!targetPages || targetPages.length === 0) {
          throw new Error("Invalid page range, or pages don't exist in PDF.");
        }

        const splitPdf = await PDFDocument.create();
        const copiedPages = await splitPdf.copyPages(pdf, targetPages);
        copiedPages.forEach((page) => splitPdf.addPage(page));

        const splitPdfBytes = await splitPdf.save();
        const blob = new Blob([splitPdfBytes], { type: 'application/pdf' });
        setProcessedUrl(URL.createObjectURL(blob));
        sCount = 1;
      } else {
        // Bulk Mode
        const zip = new JSZip();
        for (let i = 0; i < files.length; i++) {
           const file = files[i];
           try {
              const arrayBuffer = await file.arrayBuffer();
              const pdf = await PDFDocument.load(arrayBuffer);
              const totalPages = pdf.getPageCount();
              
              const targetPages = parsePageRange(pageRange, totalPages);
              if (!targetPages || targetPages.length === 0) {
                 throw new Error("Invalid page range for " + file.name);
              }

              const splitPdf = await PDFDocument.create();
              const copiedPages = await splitPdf.copyPages(pdf, targetPages);
              copiedPages.forEach((page) => splitPdf.addPage(page));

              const splitPdfBytes = await splitPdf.save();
              zip.file(file.name.replace('.pdf', '_split.pdf'), splitPdfBytes);
              sCount++;
           } catch(e) {
              console.error(`Error splitting ${file.name}:`, e);
              fCount++;
           }
           setProcessedCount(i + 1);
        }
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        setProcessedUrl(URL.createObjectURL(zipBlob));
      }
      
      setStats({ success: sCount, failed: fCount });
      if (files.length === 1 && sCount === 0) {
         return; // Error already caught/thrown
      }
      
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to split PDF.");
    } finally {
      setIsSplitting(false);
    }
  };

  const downloadProcessed = () => {
    if (!processedUrl) return;
    const link = document.createElement('a');
    link.href = processedUrl;
    link.download = files.length === 1 ? files[0].name.replace('.pdf', '_split.pdf') : 'split_pdfs.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setFiles([]);
    setPageRange('');
    setProcessedUrl(null);
    setSuccess(false);
    setError(null);
  };

  return (
    <div className="converter-card" style={{ maxWidth: '780px', margin: '0 auto' }}>
      
      {upsellFeature && <UpsellModal featureName={upsellFeature} onClose={() => setUpsellFeature(null)} />}

      <div className="tool-main">
        {files.length === 0 && !success && (
          <div 
            className="dropzone"
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('active'); }}
            onDragLeave={(e) => e.currentTarget.classList.remove('active')}
            onDrop={onDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <UploadCloud size={48} className="drop-icon" />
            <h3>Split PDF Document</h3>
            <p>Extract specific pages from your bank statement</p>
            <div className="file-types">
              <span className="file-type-tag">.pdf</span>
              <span className="file-type-tag" style={{ border: '1px solid var(--accent-blue)', color: 'var(--brand-600)', background: '#EFF6FF' }}>Bulk Support (Pro)</span>
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              accept=".pdf" 
              multiple
              style={{ display: 'none' }} 
              onChange={onDrop}
            />
          </div>
        )}

        {files.length > 0 && !success && !isSplitting && (
          <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-heading)' }}>{files.length} Document{files.length > 1 ? 's' : ''} Ready</h4>
                {files.length === 1 && <span className="file-name" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{files[0].name}</span>}
              </div>
              <button className="btn btn-ghost" onClick={reset} style={{ fontSize: '0.85rem' }}>Clear All</button>
            </div>

            <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Pages to Extract (Applies to all files)
              </label>
              <input 
                type="text" 
                placeholder="e.g. 1, 3, 5-10" 
                className="export-select"
                style={{ width: '100%', padding: '0.75rem' }}
                value={pageRange}
                onChange={(e) => setPageRange(e.target.value)}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Separate pages with commas, and use hyphens for ranges.
              </p>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              onClick={handleSplit}
              disabled={isSplitting}
            >
              <Scissors size={18} />
              {files.length > 1 ? `Extract Pages from ${files.length} PDFs` : "Extract Selected Pages"}
            </button>
          </div>
        )}

        {isSplitting && (
          <div className="loader" style={{ padding: '4rem 2rem' }}>
            <Loader2 className="spinner" size={40} />
            <h3>Extracting Pages...</h3>
            <p>Splitting document locally.</p>
            {files.length > 1 && (
               <p style={{ fontWeight: '600', color: 'var(--brand-600)', marginTop: '0.5rem' }}>
                  Processed {processedCount} of {files.length}
               </p>
            )}
          </div>
        )}

        {success && (
          <div className="success-state">
            <CheckCircle size={54} color="var(--brand-500)" />
            <h2>{files.length > 1 ? 'Batch Split Successful!' : 'PDF Split Successfully!'}</h2>
            
            {files.length > 1 ? (
              <p style={{ margin: '0.5rem 0 1.5rem' }}>
                Success: <strong>{stats.success}</strong> | Failed: <strong>{stats.failed}</strong>
              </p>
            ) : (
              <p>Your extracted pages are ready.</p>
            )}

            <div className="success-actions" style={{ justifyContent: 'center', marginTop: '1rem' }}>
              <button className="btn btn-primary" onClick={downloadProcessed}>
                {files.length > 1 ? 'Download ZIP Archive' : 'Download New PDF'}
              </button>
              <button className="btn btn-outline" onClick={reset}>Start New</button>
            </div>
          </div>
        )}

        {error && !isSplitting && (
          <div className="error-badge" style={{ marginTop: '1rem' }}>
            {error}
          </div>
        )}
      </div>

      <div className="tool-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
          <Shield size={14} className="text-muted" />
          <span>100% Client-side processing. Your financial data never leaves this browser.</span>
        </div>
      </div>
    </div>
  );
}
