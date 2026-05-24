import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Download, Shield, RefreshCw, CheckCircle, Zap } from 'lucide-react';
import { parseQifToRows } from '../lib/qifParser';
import { generateOfxFile } from '../lib/exportData';
import { useAuth } from '../contexts/AuthContext';
import UpsellModal from './UpsellModal';

export default function QifToQboTool() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedRows, setParsedRows] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showAllRows, setShowAllRows] = useState(false);

  const { isPro: realIsPro } = useAuth();
  const [devPro] = useState(sessionStorage.getItem('devPro') === 'true');
  const isPro = realIsPro || devPro;
  const [upsellFeature, setUpsellFeature] = useState(null);

  const fileInputRef = useRef(null);

  const onDrop = async (e) => {
    e.preventDefault();
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.name.toLowerCase().endsWith('.qif')) {
      setError("Please upload a valid .qif file.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setFileName(file.name);
    setSuccess(false);

    try {
      const text = await file.text();
      const rows = parseQifToRows(text);
      if (rows && rows.length > 1) {
        setParsedRows(rows);
      } else {
        setError("No valid transaction entries found in this QIF file.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to parse QIF file. Make sure it is not corrupted.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConvert = () => {
    if (!isPro) {
      setUpsellFeature('QBO Exports');
      return;
    }

    try {
      // Map parsed QIF rows to standard structure needed by generateOfxFile
      // The parsed rows are: [Date, Description, Amount, Check No, Category, Memo, Cleared]
      // generateOfxFile expects roughly: [Date, Description, Amount]
      // We skip the header row (index 0)
      const mappedRows = [['Date', 'Description', 'Amount']];
      
      for (let i = 1; i < parsedRows.length; i++) {
        const row = parsedRows[i];
        const dateVal = row[0];
        const descVal = row[1];
        const amtVal = row[2];
        const checkVal = row[3];
        const categoryVal = row[4];
        const memoVal = row[5];

        let finalDesc = descVal;
        if (categoryVal || memoVal) {
          const detail = [categoryVal, memoVal].filter(Boolean).join(' - ');
          finalDesc = `${descVal} (${detail})`;
        }
        if (checkVal) {
          finalDesc = `${finalDesc} (Chk #${checkVal})`;
        }

        mappedRows.push([
          dateVal,
          finalDesc,
          amtVal
        ]);
      }

      const qboContent = generateOfxFile(mappedRows);
      const blob = new Blob([qboContent], { type: 'application/vnd.intu.qbo;charset=utf-8' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName.replace(/\.qif$/i, '') + '.qbo';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSuccess(true);
    } catch (err) {
      setError("Failed to convert: " + err.message);
    }
  };

  const handleReset = () => {
    setParsedRows(null);
    setFileName('');
    setError(null);
    setSuccess(false);
    setShowAllRows(false);
  };

  const activeRowCount = parsedRows ? parsedRows.length - 1 : 0;

  return (
    <div className="converter-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {upsellFeature && <UpsellModal isOpen={!!upsellFeature} onClose={() => setUpsellFeature(null)} featureName={upsellFeature} />}

      {/* DROPZONE */}
      {!parsedRows && !isProcessing && (
        <div 
          className="dropzone"
          onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('active'); }}
          onDragLeave={(e) => e.currentTarget.classList.remove('active')}
          onDrop={(e) => { e.currentTarget.classList.remove('active'); onDrop(e); }}
          onClick={() => fileInputRef.current.click()}
        >
          <Zap size={48} className="drop-icon" style={{ color: '#6366f1' }} />
          <h3>Drag & drop your Quicken .qif file</h3>
          <p>Quickly convert legacy Quicken files to QuickBooks (.QBO) locally</p>
          <div className="file-types">
            <span className="file-type-tag">.qif</span>
            <span className="file-type-tag">QuickBooks Direct Import</span>
            <span className="file-type-tag">100% Local</span>
          </div>
          <input 
            type="file" 
            ref={fileInputRef}
            accept=".qif" 
            style={{ display: 'none' }} 
            onChange={onDrop}
          />
        </div>
      )}

      {/* PROCESSING */}
      {isProcessing && (
        <div className="loader">
          <div className="spinner"></div>
          <h3>Parsing Quicken statement...</h3>
          <p>Extracting QIF transaction records locally</p>
        </div>
      )}

      {error && <div className="error-msg">{error}</div>}

      {/* PREVIEW & CONVERT SCREEN */}
      {parsedRows && !isProcessing && !success && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <div>
              <h3 style={{ margin: 0 }}>Review QIF Transactions: {fileName}</h3>
              <p style={{ margin: '0.25rem 0 0', color: 'var(--slate-50)', fontSize: '0.85rem' }}></p>
              <p style={{ margin: '0.25rem 0 0', color: 'var(--slate-500)', fontSize: '0.85rem' }}>Found {activeRowCount} transaction entries.</p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={handleReset}>Change File</button>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <div className="table-container">
              <table style={{ background: 'white' }}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Payee</th>
                    <th>Amount</th>
                    <th>Check No.</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.slice(1, showAllRows ? parsedRows.length : 6).map((row, i) => (
                    <tr key={i}>
                      <td>{row[0] || '-'}</td>
                      <td>{row[1] || '-'}</td>
                      <td style={{ fontWeight: '500', color: parseFloat(row[2]) < 0 ? 'var(--slate-800)' : 'var(--brand-600)' }}>
                        {row[2] || '-'}
                      </td>
                      <td>{row[3] || '-'}</td>
                      <td>{row[4] || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!showAllRows && parsedRows.length > 6 && (
              <div className="table-footer">
                <button className="btn btn-ghost" onClick={() => setShowAllRows(true)}>
                  Show all {parsedRows.length - 1} rows
                </button>
              </div>
            )}
            {showAllRows && parsedRows.length > 6 && (
              <div className="table-footer">
                <button className="btn btn-ghost" onClick={() => setShowAllRows(false)}>
                  Collapse rows
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <button className="btn btn-outline" onClick={handleReset}>Cancel</button>
            <button className="btn btn-primary" onClick={handleConvert}>
              <Download size={16} /> Convert to QBO
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS SCREEN */}
      {success && (
        <div className="success-state" style={{ padding: '3rem 2rem' }}>
          <CheckCircle size={54} color="var(--brand-500)" style={{ marginBottom: '1.5rem' }} />
          <h2>QIF Converted Successfully!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Your QuickBooks Web Connect (.QBO) file is ready. Import it into QuickBooks directly to reconcile your transactions.</p>
          <div className="success-actions" style={{ justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={handleConvert}>
              <Download size={16} /> Re-download QBO
            </button>
            <button className="btn btn-outline" onClick={handleReset}>
              Convert Another QIF
            </button>
          </div>
        </div>
      )}

      <div className="tool-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
          <Shield size={14} className="text-muted" />
          <span>Local conversion: Your transaction data never leaves this browser.</span>
        </div>
      </div>
    </div>
  );
}
