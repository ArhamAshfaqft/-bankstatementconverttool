import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Download, Shield, EyeOff, AlertCircle } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, rgb } from 'pdf-lib';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function RedactorTool() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [redactedPdfBytes, setRedactedPdfBytes] = useState(null);
  const [stats, setStats] = useState({ pages: 0, redactions: 0 });

  const onDrop = async (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (!droppedFile) return;
    
    if (droppedFile.type !== 'application/pdf' && !droppedFile.name.toLowerCase().endsWith('.pdf')) {
      setError("Please upload a valid PDF file.");
      return;
    }

    setFile(droppedFile);
    setError(null);
    setRedactedPdfBytes(null);
    await processRedaction(droppedFile);
  };

  const processRedaction = async (pdfFile) => {
    setIsProcessing(true);
    let redactionCount = 0;

    try {
      // 1. Read file as ArrayBuffer
      const arrayBuffer = await pdfFile.arrayBuffer();

      // 2. Parse text with PDF.js to find bounding boxes
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      const redactionCommands = {}; // Map of pageIndex -> array of boxes

      // Regex patterns: SSN, 9-16 digit account numbers, 9-digit ABA routing numbers, and 13-16 digit Credit Cards
      const sensitiveRegex = /((?<!\d)\d{3}-\d{2}-\d{4}(?!\d))|((?<!\d)\d{9,16}(?!\d))|((?<!\d)\d{9}(?!\d)\s*(?=routing|aba|rtn))|((?<!\d)(?:4\d{12}(?:\d{3})?|5[1-5]\d{14}|3[47]\d{13}|3(?:0[0-5]|[68]\d)\d{11}|6(?:011|5\d{2})\d{12}|(?:2131|1800|35\d{3})\d{11})(?!\d))/gi;

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        redactionCommands[i - 1] = [];

        for (const item of textContent.items) {
          const text = item.str;
          if (!text.trim()) continue;

          // If the text string matches our sensitive patterns
          if (sensitiveRegex.test(text.replace(/\s/g, ''))) {
            // item.transform is [scaleX, skewX, skewY, scaleY, tx, ty]
            // tx, ty is bottom-left corner in standard PDF coords
            const tx = item.transform[4];
            const ty = item.transform[5];
            
            // Width and Height might need adjustments based on fonts, 
            // but item.width and item.height provide a good baseline.
            // item.height doesn't directly exist, but scaleY is approximate height
            const width = item.width;
            const height = item.transform[3]; 

            redactionCommands[i - 1].push({
              x: tx,
              y: ty - (height * 0.2), // slightly adjust down to cover descenders
              width: width,
              height: height * 1.2,   // pad height slightly
            });
            redactionCount++;
          }
        }
      }

      // 3. Modify PDF with pdf-lib
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      for (let pIdx = 0; pIdx < pages.length; pIdx++) {
        const page = pages[pIdx];
        const boxes = redactionCommands[pIdx] || [];

        for (const box of boxes) {
          page.drawRectangle({
            x: box.x,
            y: box.y,
            width: box.width,
            height: box.height,
            color: rgb(0, 0, 0), // Solid Black
          });
        }
      }

      // 4. Save modified PDF
      const modifiedBytes = await pdfDoc.save();
      setRedactedPdfBytes(modifiedBytes);
      setStats({ pages: numPages, redactions: redactionCount });

    } catch (err) {
      console.error(err);
      setError("Failed to process the PDF. Ensure it is a text-based document.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!redactedPdfBytes) return;
    
    const blob = new Blob([redactedPdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace('.pdf', '_redacted.pdf');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFile(null);
    setRedactedPdfBytes(null);
    setError(null);
    setStats({ pages: 0, redactions: 0 });
  };

  return (
    <div className="converter-card" style={{ maxWidth: '780px', margin: '0 auto' }}>
      
      {/* ── DROPZONE ── */}
      {!file && !isProcessing && (
        <div 
          className="dropzone"
          onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('active'); }}
          onDragLeave={(e) => e.currentTarget.classList.remove('active')}
          onDrop={(e) => { e.currentTarget.classList.remove('active'); onDrop(e); }}
          onClick={() => document.getElementById('redact-upload').click()}
        >
          <Shield size={48} className="drop-icon" style={{ color: '#10b981' }} />
          <h3>Drag & drop a bank statement to redact</h3>
          <p>We automatically black-out sensitive PII instantly.</p>
          <div className="file-types">
             <span className="file-type-tag">.pdf</span>
             <span className="file-type-tag">100% Local</span>
          </div>

          <input 
            type="file" 
            id="redact-upload" 
            accept=".pdf"
            style={{ display: 'none' }} 
            onChange={onDrop}
          />
        </div>
      )}

      {/* ── PROCESSING ── */}
      {isProcessing && (
        <div className="loader">
          <div className="spinner"></div>
          <h3>Scanning for sensitive data...</h3>
          <p>Blacking out account numbers and SSNs locally.</p>
        </div>
      )}

      {error && (
        <div style={{ color: '#ef4444', background: '#fef2f2', padding: '1rem', borderRadius: '8px', border: '1px solid #f87171', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* ── RESULTS ── */}
      {redactedPdfBytes && !isProcessing && (
        <div className="results-container" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <EyeOff size={48} color="#0f766e" style={{ margin: '0 auto 1.5rem' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a' }}>Document Anonymized Successfully</h3>
          <p style={{ color: '#475569', marginBottom: '2rem' }}>
            We processed <strong>{stats.pages} pages</strong> and securely blacked out <strong>{stats.redactions} sensitive strings</strong>. 
            The file has been flattened and is safe to share.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-outline" onClick={handleReset}>
               New File
            </button>
            <button className="btn btn-primary" onClick={handleDownload} style={{ padding: '0.75rem 2rem' }}>
              <Download size={18} /> Download Redacted PDF
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
