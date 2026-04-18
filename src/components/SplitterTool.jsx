import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { Scissors, FileX, Download, Settings, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function SplitterTool() {
  const { isPro } = useAuth();
  
  const [file, setFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pageRange, setPageRange] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const droppedFile = acceptedFiles[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setError('');
      setSuccess(false);
      
      // Calculate total pages quickly to show the user
      setIsProcessing(true);
      try {
        const arrayBuffer = await droppedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPageCount();
        setTotalPages(pages);
        setPageRange(`1-${pages}`);
      } catch (err) {
        setError("Could not read PDF. It might be corrupted or heavily encrypted.");
        setFile(null);
      } finally {
        setIsProcessing(false);
      }
    } else {
      setError("Please drop a valid PDF file.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  const removeFile = () => {
    setFile(null);
    setTotalPages(0);
    setPageRange('');
    setSuccess(false);
    setError('');
  };

  const handleSplit = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setError('');
    setSuccess(false);

    try {
      // 1. Parse Range String
      const pagesToKeep = new Set();
      const parts = pageRange.split(',').map(p => p.trim()).filter(Boolean);
      
      for (const part of parts) {
        if (part.includes('-')) {
          const [startStr, endStr] = part.split('-');
          const start = parseInt(startStr, 10);
          const end = parseInt(endStr, 10);
          
          if (isNaN(start) || isNaN(end) || start < 1 || end > totalPages || start > end) {
            throw new Error(`Invalid range: ${part}. Pages must be between 1 and ${totalPages}.`);
          }
          
          for (let i = start; i <= end; i++) {
            pagesToKeep.add(i);
          }
        } else {
          const num = parseInt(part, 10);
          if (isNaN(num) || num < 1 || num > totalPages) {
            throw new Error(`Invalid page: ${part}. Pages must be between 1 and ${totalPages}.`);
          }
          pagesToKeep.add(num);
        }
      }

      if (pagesToKeep.size === 0) {
        throw new Error("No pages selected to extract.");
      }

      // Convert from 1-indexed to 0-indexed and sort
      const extractedIndices = Array.from(pagesToKeep).sort((a,b) => a-b).map(p => p - 1);

      // 2. Load PDF and Build New One
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      
      const newPdf = await PDFDocument.create();
      
      const copiedPages = await newPdf.copyPages(sourcePdf, extractedIndices);
      copiedPages.forEach((page) => {
        newPdf.addPage(page);
      });
      
      const pdfBytes = await newPdf.save();

      // 3. Trigger Download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Extracted_${file.name}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to split the PDF. Make sure it isn\'t heavily encrypted.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="converter-card" style={{ maxWidth: '800px', margin: '2rem auto' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ 
          width: '56px', height: '56px', background: 'var(--brand-50)', 
          color: 'var(--brand-600)', borderRadius: '16px', display: 'flex', 
          alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' 
        }}>
          <Scissors size={28} />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-heading)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Split Financial Documents Locally
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Extract specific pages from massive consolidated statements. Zero file uploads.
        </p>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#059669', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} /> Successfully split and downloaded the PDF.
        </div>
      )}

      {/* STAGE 1: UPLOAD */}
      {!file && !isProcessing && (
        <div 
          {...getRootProps()} 
          className={`dropzone ${isDragActive ? 'active' : ''}`}
          style={{ 
            padding: '4rem 2rem', 
            background: isDragActive ? 'var(--brand-50)' : '#f8fafc',
            borderColor: isDragActive ? 'var(--brand-500)' : '#cbd5e1'
          }}
        >
          <input {...getInputProps()} />
          <Scissors size={40} className="drop-icon" style={{ color: isDragActive ? 'var(--brand-500)' : '#94a3b8' }} />
          <h3>Select a PDF file</h3>
          <p>or drag and drop it here</p>
          <div className="file-types" style={{ marginTop: '1.5rem' }}>
            <span className="file-type-tag">.pdf</span>
          </div>
        </div>
      )}

      {/* PROCESSING STATE */}
      {isProcessing && (
        <div className="loader">
          <Loader2 className="spinner" size={40} color="var(--brand-500)" />
          <h3>Processing File Locally</h3>
          <p>Analyzing document structure without uploading to any server...</p>
        </div>
      )}

      {/* STAGE 2: CONFIGURE & SPLIT */}
      {file && !isProcessing && (
        <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '12px', padding: '2rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontWeight: '600', color: 'var(--text-heading)', fontSize: '1.1rem' }}>{file.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                {(file.size / 1024 / 1024).toFixed(2)} MB • {totalPages} Pages total
              </div>
            </div>
            <button onClick={removeFile} className="btn btn-ghost" style={{ color: '#dc2626' }}>
              <FileX size={18} /> Replace
            </button>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-heading)', marginBottom: '0.5rem' }}>
              Pages to Extract
            </label>
            <input 
              type="text" 
              value={pageRange}
              onChange={(e) => setPageRange(e.target.value)}
              placeholder="e.g., 1-5, 8, 11-13" 
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'white',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--brand-500)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Separate page numbers or ranges with commas. Example: 1-3, 5, 8-10
            </p>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
            onClick={handleSplit}
          >
            <Download size={18} /> Split & Download PDF
          </button>
        </div>
      )}

      {/* PRIVACY BADGE */}
      <div style={{ textAlign: 'center', marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#059669', fontSize: '0.85rem', fontWeight: '500' }}>
         <Shield size={16} /> 100% Secure. File never leaves your browser.
      </div>

    </div>
  );
}
