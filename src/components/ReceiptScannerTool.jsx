import React, { useState, useRef } from 'react';
import { Camera, Download, RotateCcw, FileText, AlertCircle, Loader2, Shield } from 'lucide-react';
import Tesseract from 'tesseract.js';
import Papa from 'papaparse';
import { useAuth } from '../contexts/AuthContext';
import UpsellModal from './UpsellModal';

export default function ReceiptScannerTool() {
  const { isPro: realIsPro } = useAuth();
  const [devPro, setDevPro] = useState(sessionStorage.getItem('devPro') === 'true');
  const isPro = realIsPro || devPro;
  const [upsellFeature, setUpsellFeature] = useState(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [rawText, setRawText] = useState('');
  const [extractedData, setExtractedData] = useState([]);
  const fileInputRef = useRef(null);

  const onDrop = async (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (!droppedFile) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/tiff'];
    if (!validTypes.includes(droppedFile.type)) {
      setError("Please upload a valid image file (JPG, PNG, WebP, BMP, or TIFF).");
      return;
    }

    // Gate: OCR Scanner is Pro
    if (!isPro) {
      setUpsellFeature('Receipt & Invoice OCR Scanner');
      return;
    }

    setFile(droppedFile);
    setError(null);
    setRawText('');
    setExtractedData([]);

    // Create preview
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(droppedFile);

    await processOcr(droppedFile);
  };

  const processOcr = async (imageFile) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const result = await Tesseract.recognize(imageFile, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const text = result.data.text;
      setRawText(text);

      // Extract structured data from raw OCR text
      const parsed = extractReceiptData(text);
      setExtractedData(parsed);

    } catch (err) {
      console.error('OCR Error:', err);
      setError("Failed to process image. Please try a clearer photo.");
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Extracts structured receipt data from raw OCR text.
   * Targets: Date, Vendor/Store Name, Individual Line Items, and Total.
   */
  const extractReceiptData = (text) => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const results = [];

    // --- 1. Vendor Name: Usually the first non-empty line ---
    let vendor = lines[0] || 'Unknown Vendor';

    // --- 2. Date Detection ---
    let date = '';
    const datePatterns = [
      /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/,        // MM/DD/YYYY or DD-MM-YY
      /(\w{3,9}\s+\d{1,2},?\s*\d{2,4})/i,                 // January 15, 2025
      /(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/,                // YYYY-MM-DD
    ];
    for (const line of lines) {
      for (const pat of datePatterns) {
        const m = line.match(pat);
        if (m) { date = m[1]; break; }
      }
      if (date) break;
    }

    // --- 3. Total Amount ---
    let total = '';
    const totalPatterns = [
      /(?:total|grand\s*total|amount\s*due|balance\s*due|net\s*total)\s*[:\s]*\$?\s*([\d,]+\.?\d*)/i,
      /\$\s*([\d,]+\.\d{2})\s*$/i,
    ];
    // Scan from bottom up for totals (more reliable)
    for (let i = lines.length - 1; i >= 0; i--) {
      for (const pat of totalPatterns) {
        const m = lines[i].match(pat);
        if (m) { total = '$' + m[1]; break; }
      }
      if (total) break;
    }

    // --- 4. Line Items: Lines with a dollar amount ---
    const lineItemRegex = /^(.+?)\s+\$?\s*([\d,]+\.\d{2})\s*$/;
    const skipWords = /total|subtotal|tax|change|cash|visa|mastercard|amex|debit|credit|balance|due|payment|tendered/i;

    for (const line of lines) {
      const m = line.match(lineItemRegex);
      if (m && !skipWords.test(m[1])) {
        results.push({
          date: date || '-',
          vendor: vendor,
          description: m[1].trim(),
          amount: '$' + m[2],
        });
      }
    }

    // If no line items detected, create a single summary row
    if (results.length === 0 && total) {
      results.push({
        date: date || '-',
        vendor: vendor,
        description: 'Receipt Total',
        amount: total,
      });
    }

    // If absolutely nothing found, return the raw text as a fallback
    if (results.length === 0) {
      results.push({
        date: date || '-',
        vendor: vendor,
        description: 'Could not parse line items',
        amount: total || '-',
      });
    }

    return results;
  };

  const handleDownloadCsv = () => {
    if (extractedData.length === 0) return;

    const csvRows = [
      ['Date', 'Vendor', 'Description', 'Amount'],
      ...extractedData.map(r => [r.date, r.vendor, r.description, r.amount]),
    ];

    const csv = Papa.unparse(csvRows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (file?.name?.replace(/\.[^/.]+$/, '') || 'receipt') + '_extracted.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadRawText = () => {
    if (!rawText) return;
    const blob = new Blob([rawText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (file?.name?.replace(/\.[^/.]+$/, '') || 'receipt') + '_raw.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setRawText('');
    setExtractedData([]);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="converter-card" style={{ maxWidth: '880px', margin: '0 auto' }}>

      {/* ── DROPZONE ── */}
      {!file && !isProcessing && (
        <div
          className="dropzone"
          onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('active'); }}
          onDragLeave={(e) => e.currentTarget.classList.remove('active')}
          onDrop={(e) => { e.currentTarget.classList.remove('active'); onDrop(e); }}
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera size={48} className="drop-icon" style={{ color: '#10b981' }} />
          <h3>Drop a receipt or invoice image</h3>
          <p>We'll extract text and structured data using local OCR.</p>
          <div className="file-types">
            <span className="file-type-tag">.jpg</span>
            <span className="file-type-tag">.png</span>
            <span className="file-type-tag">.webp</span>
            <span className="file-type-tag">.bmp</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/bmp,image/tiff"
            style={{ display: 'none' }}
            onChange={onDrop}
          />
        </div>
      )}

      {/* ── PROCESSING ── */}
      {isProcessing && (
        <div className="loader">
          <div className="spinner"></div>
          <h3>Running local OCR engine...</h3>
          <p>Recognizing text directly in your browser — nothing is uploaded.</p>
          <div style={{ width: '100%', maxWidth: '400px', margin: '1.5rem auto 0', background: '#e2e8f0', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #0d9488, #10b981)',
              borderRadius: '8px',
              transition: 'width 0.3s ease',
            }} />
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>{progress}% complete</p>
        </div>
      )}

      {error && (
        <div style={{ color: '#ef4444', background: '#fef2f2', padding: '1rem', borderRadius: '8px', border: '1px solid #f87171', display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '1rem' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* ── RESULTS ── */}
      {extractedData.length > 0 && !isProcessing && (
        <div>
          {/* Top bar */}
          <div className="results-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.15rem' }}>
                <FileText size={18} /> {file?.name} — OCR Complete
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                {extractedData.length} item{extractedData.length !== 1 ? 's' : ''} extracted
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button className="btn btn-outline btn-sm" onClick={handleReset}>
                <RotateCcw size={14} /> New Image
              </button>
              <button className="btn btn-outline btn-sm" onClick={handleDownloadRawText}>
                Raw Text
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleDownloadCsv} style={{ padding: '0.5rem 1.25rem' }}>
                <Download size={14} /> Download CSV
              </button>
            </div>
          </div>

          {/* Two-column layout: preview + table */}
          <div style={{ display: 'grid', gridTemplateColumns: preview ? '280px 1fr' : '1fr', gap: '1.5rem', alignItems: 'start' }}>
            {/* Image preview */}
            {preview && (
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', background: '#f8fafc' }}>
                <img src={preview} alt="Receipt preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            )}

            {/* Extracted data table */}
            <div className="table-container">
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Vendor</th>
                      <th>Description</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {extractedData.map((row, i) => (
                      <tr key={i}>
                        <td>{row.date}</td>
                        <td>{row.vendor}</td>
                        <td>{row.description}</td>
                        <td>{row.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Raw OCR text toggle */}
          <details style={{ marginTop: '1.5rem' }}>
            <summary style={{ cursor: 'pointer', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>
              View Raw OCR Output
            </summary>
            <pre style={{
              marginTop: '0.75rem',
              padding: '1rem',
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.8rem',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              maxHeight: '300px',
              overflow: 'auto',
              color: '#334155',
            }}>
              {rawText}
            </pre>
          </details>
        </div>
      )}
      {error && (
        <div style={{ color: '#ef4444', background: '#fef2f2', padding: '1rem', borderRadius: '8px', border: '1px solid #f87171', display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '1rem' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <UpsellModal 
        isOpen={!!upsellFeature} 
        onClose={() => setUpsellFeature(null)} 
        featureName={upsellFeature} 
      />

      {/* SaaS Footer Info */}
      <div className="tool-footer" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--slate-500)' }}>
        <div className="security-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={14} /> 
          <span>100% Client-side processing. OCR data never leaves this browser.</span>
        </div>
        
        {/* Dev Toggle for Testing */}
        {import.meta.env.DEV && (
          <div className="dev-tools" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#94a3b8', background: '#f8fafc', padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <span>Dev Toggle:</span>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={devPro} 
                onChange={(e) => {
                  const val = e.target.checked;
                  setDevPro(val);
                  sessionStorage.setItem('devPro', val);
                }}
                style={{ marginRight: '4px' }}
              />
              Force Pro
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
