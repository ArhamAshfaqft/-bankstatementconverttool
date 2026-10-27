import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, Shield, X, ArrowRight, Loader2, Search, Eraser, Download } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

export default function RedactorTool() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  
  
  const fileInputRef = useRef(null);

  const onDrop = async (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer ? e.dataTransfer.files : e.target.files)
      .filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    
    if (droppedFiles.length === 0) {
      setError("Please upload valid PDF files.");
      return;
    }
    

    setFiles(droppedFiles);
    setError(null);
    setSuccess(false);
    setProcessedUrl(null);
    setProcessedCount(0);
  };

  const handleRedact = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setError(null);
    setProcessedCount(0);

    try {
      if (files.length === 1) {
        const arrayBuffer = await files[0].arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const cleanPdf = await PDFDocument.create();
        const copiedPages = await cleanPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => cleanPdf.addPage(page));
        const redactedPdfBytes = await cleanPdf.save();
        const blob = new Blob([redactedPdfBytes], { type: 'application/pdf' });
        setProcessedUrl(URL.createObjectURL(blob));
        setProcessedCount(1);
      } else {
        // Bulk Mode
        const zip = new JSZip();
        for (let i = 0; i < files.length; i++) {
           const file = files[i];
           try {
             const arrayBuffer = await file.arrayBuffer();
             const pdf = await PDFDocument.load(arrayBuffer);
             const cleanPdf = await PDFDocument.create();
             const copiedPages = await cleanPdf.copyPages(pdf, pdf.getPageIndices());
             copiedPages.forEach((page) => cleanPdf.addPage(page));
             const redactedPdfBytes = await cleanPdf.save();
             zip.file(file.name.replace(/\.pdf$/i, '_copy.pdf'), redactedPdfBytes);
           } catch(e) {
             console.error(`Error stripping ${file.name}:`, e);
           }
           setProcessedCount(i + 1);
        }
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        setProcessedUrl(URL.createObjectURL(zipBlob));
      }
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Failed to process PDF(s).");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadProcessed = () => {
    if (!processedUrl) return;
    const link = document.createElement('a');
    link.href = processedUrl;
    link.download = files.length === 1 ? files[0].name.replace(/\.pdf$/i, '_copy.pdf') : 'pdf_copies.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setFiles([]);
    setProcessedUrl(null);
    setSuccess(false);
    setError(null);
  };

  return (
    <div className="converter-card" style={{ maxWidth: '780px', margin: '0 auto' }}>

      <div className="tool-main">
        {files.length === 0 && !success && (
          <div 
            className="dropzone"
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('active'); }}
            onDragLeave={(e) => e.currentTarget.classList.remove('active')}
            onDrop={onDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <Shield size={48} className="drop-icon" style={{ color: 'var(--slate-400)' }} />
            <h3>Create a PDF copy</h3>
            <p>Copies pages into a new document locally. Visible information remains.</p>
            <div className="file-types">
              <span className="file-type-tag">.pdf</span>
              <span className="file-type-tag">100% Local</span>
              <span className="file-type-tag" style={{ border: '1px solid var(--accent-blue)', color: 'var(--brand-600)', background: '#EFF6FF' }}>Bulk Support</span>
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

        {files.length > 0 && !success && !isProcessing && (
          <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-heading)' }}>{files.length} Document{files.length > 1 ? 's' : ''} Ready</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ready to create local copies</p>
              </div>
              <button className="btn btn-ghost" onClick={handleReset} style={{ fontSize: '0.85rem' }}>Clear All</button>
            </div>

            <div className="info-box" style={{ marginBottom: '2rem', background: 'var(--slate-50)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--slate-200)' }}>
              <h5 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Eraser size={14} /> Check before sharing
              </h5>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: '1.4' }}>
                This tool copies pages into a new PDF. It does not redact visible text, images, or account numbers, and removal of all embedded metadata is not guaranteed.
              </p>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              onClick={handleRedact}
              disabled={isProcessing}
            >
              <Shield size={18} />
              Create PDF Copy
            </button>
          </div>
        )}

        {isProcessing && (
          <div className="loader" style={{ padding: '4rem 2rem' }}>
            <Loader2 className="spinner" size={40} />
            <h3>Copying Your File{files.length > 1 ? 's' : ''}...</h3>
            <p>Creating a new PDF locally.</p>
            {files.length > 1 && (
               <p style={{ fontWeight: '600', color: 'var(--brand-600)', marginTop: '0.5rem' }}>
                  Finished {processedCount} of {files.length}
               </p>
            )}
          </div>
        )}

        {success && (
          <div className="success-state">
            <CheckCircle size={54} color="var(--brand-500)" />
            <h2>{files.length > 1 ? 'Copies Ready' : 'Copy Ready'}</h2>
            <p>Open the result and check all visible and hidden content before sharing.</p>
            <div className="success-actions" style={{ justifyContent: 'center', marginTop: '1rem' }}>
              <button className="btn btn-primary" onClick={downloadProcessed}>
                {files.length > 1 ? 'Download PDF Copies ZIP' : 'Download PDF Copy'}
              </button>
              <button className="btn btn-outline" onClick={handleReset}>Start New</button>
            </div>
          </div>
        )}

        {error && !isProcessing && (
          <div className="error-badge" style={{ marginTop: '1rem' }}>
            {error}
          </div>
        )}
      </div>

      <div className="tool-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
          <Shield size={14} className="text-muted" />
          <span>Zero-Upload Policy. No financial data ever leaves your device.</span>
        </div>
      </div>
    </div>
  );
}
