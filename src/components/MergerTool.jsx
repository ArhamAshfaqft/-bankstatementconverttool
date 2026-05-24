import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, Trash2, X, GitMerge, Shield, ArrowRight, Table, ChevronUp, ChevronDown, MonitorSmartphone, Key } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function MergerTool() {
  const [files, setFiles] = useState([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const onDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer ? e.dataTransfer.files : e.target.files);
    addFiles(droppedFiles);
  };

  const addFiles = (newFiles) => {
    const pdfs = newFiles.filter(file => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'));
    if (pdfs.length === 0) {
      setError("Please upload valid PDF files.");
      return;
    }
    setFiles(prev => [...prev, ...pdfs]);
    setError(null);
    setMergedPdfUrl(null);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setMergedPdfUrl(null);
  };

  const moveFile = (index, direction) => {
    const newFiles = [...files];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= newFiles.length) return;
    [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      setError("Please select at least 2 PDF files to merge.");
      return;
    }

    setIsMerging(true);
    setError(null);

    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);
    } catch (err) {
      console.error(err);
      setError("Failed to merge PDFs. One of the files might be corrupted or protected.");
    } finally {
      setIsMerging(false);
    }
  };

  const reset = () => {
    setFiles([]);
    setMergedPdfUrl(null);
    setError(null);
  };

  return (
    <div className="converter-card" style={{ maxWidth: '780px', margin: '0 auto' }}>
      <div className="tool-main">
        {/* Dropzone */}
        {files.length === 0 && (
          <div 
            className="dropzone"
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('active'); }}
            onDragLeave={(e) => e.currentTarget.classList.remove('active')}
            onDrop={onDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <UploadCloud size={48} className="drop-icon" />
            <h3>Merge Multiple PDFs</h3>
            <p>Drag and drop bank statements to combine them</p>
            <div className="file-types">
              <span className="file-type-tag">.pdf only</span>
              <span className="file-type-tag">Max 50MB per file</span>
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              multiple 
              accept=".pdf" 
              style={{ display: 'none' }} 
              onChange={onDrop}
            />
          </div>
        )}

        {/* File List */}
        {files.length > 0 && !mergedPdfUrl && (
          <div className="file-list-container">
            <div className="file-list-header">
              <h4>{files.length} Files Selected</h4>
              <button className="btn-ghost btn-sm" onClick={() => fileInputRef.current.click()}>Add More</button>
            </div>
            <div className="file-list">
              {files.map((file, i) => (
                <div key={i} className="file-item">
                  <div className="file-item-info">
                    <FileText size={18} className="text-muted" />
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                  <div className="file-item-actions">
                    <button onClick={() => moveFile(i, -1)} disabled={i === 0} title="Move Up"><ChevronUp size={16} /></button>
                    <button onClick={() => moveFile(i, 1)} disabled={i === files.length - 1} title="Move Down"><ChevronDown size={16} /></button>
                    <button onClick={() => removeFile(i)} className="text-danger" title="Remove"><X size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="merger-actions">
              <button className="btn btn-ghost" onClick={reset}>Reset</button>
              <button 
                className="btn btn-primary" 
                onClick={mergePdfs} 
                disabled={isMerging || files.length < 2}
                style={{ flex: 1 }}
              >
                {isMerging ? "Merging..." : "Combine into One PDF"}
                <GitMerge size={18} />
              </button>
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              multiple 
              accept=".pdf" 
              style={{ display: 'none' }} 
              onChange={onDrop}
            />
          </div>
        )}

        {/* Success/Download */}
        {mergedPdfUrl && (
          <div className="success-state">
            <CheckCircle size={54} color="var(--brand-500)" />
            <h2>PDFs Combined Successfully!</h2>
            <p>Your merged document is ready for download.</p>
            <div className="success-actions">
              <a href={mergedPdfUrl} download="merged_statements.pdf" className="btn btn-primary" style={{ flex: 1 }}>
                Download Merged PDF
              </a>
              <button className="btn btn-outline" onClick={reset}>Start New Merge</button>
            </div>
          </div>
        )}

        {error && (
          <div className="error-badge" style={{ marginTop: '1rem' }}>
            {error}
          </div>
        )}
      </div>

      <div className="tool-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
          <Shield size={14} className="text-muted" />
          <span>100% Client-side processing. Your financial data never leaves this browser.</span>
        </div>
      </div>
    </div>
  );
}
