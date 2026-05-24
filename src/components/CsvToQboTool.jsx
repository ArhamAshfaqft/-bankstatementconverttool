import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Download, Shield, RefreshCw, CheckCircle, Table } from 'lucide-react';
import Papa from 'papaparse';
import { generateOfxFile } from '../lib/exportData';
import { useAuth } from '../contexts/AuthContext';
import UpsellModal from './UpsellModal';

export default function CsvToQboTool() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [csvRows, setCsvRows] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Column Mappings
  const [dateCol, setDateCol] = useState(-1);
  const [descCol, setDescCol] = useState(-1);
  const [amtCol, setAmtCol] = useState(-1);
  const [checkCol, setCheckCol] = useState(-1);

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
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError("Please upload a valid .csv file.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setFileName(file.name);
    setSuccess(false);

    Papa.parse(file, {
      skipEmptyLines: 'greedy',
      complete: (results) => {
        setIsProcessing(false);
        const data = results.data;
        if (!data || data.length < 2) {
          setError("This CSV is empty or has too few rows to convert.");
          return;
        }

        setCsvRows(data);
        const firstRow = data[0];
        setHeaders(firstRow);

        // Auto-detect columns
        let dIdx = -1, deIdx = -1, aIdx = -1, cIdx = -1;
        firstRow.forEach((h, idx) => {
          const val = h.toLowerCase().trim();
          if (val.includes('date')) dIdx = idx;
          else if (val.includes('desc') || val.includes('payee') || val.includes('narration') || val.includes('particulars')) deIdx = idx;
          else if (val.includes('amount') || val.includes('debit') || val.includes('credit') || val.includes('value')) aIdx = idx;
          else if (val.includes('check') || val.includes('chk') || val.includes('ref')) cIdx = idx;
        });

        // Fallbacks
        setDateCol(dIdx !== -1 ? dIdx : 0);
        setDescCol(deIdx !== -1 ? deIdx : (firstRow.length > 1 ? 1 : 0));
        setAmtCol(aIdx !== -1 ? aIdx : (firstRow.length > 2 ? 2 : 0));
        setCheckCol(cIdx !== -1 ? cIdx : -1);
      },
      error: (err) => {
        setIsProcessing(false);
        setError("Error parsing CSV file: " + err.message);
      }
    });
  };

  const handleConvert = () => {
    if (!isPro) {
      setUpsellFeature('QBO Exports');
      return;
    }

    if (dateCol === -1 || descCol === -1 || amtCol === -1) {
      setError("Please map the Date, Description, and Amount columns.");
      return;
    }

    try {
      // Map CSV to standard structure: [Date, Description, Amount]
      // We skip the first row (headers)
      const mappedRows = [['Date', 'Description', 'Amount']];
      
      for (let i = 1; i < csvRows.length; i++) {
        const row = csvRows[i];
        if (!row || row.length === 0) continue;

        const dateVal = row[dateCol] || '';
        const descVal = row[descCol] || '';
        const amtVal = row[amtCol] || '';
        const checkVal = checkCol !== -1 ? row[checkCol] || '' : '';

        // If check is present, let's append it or format it
        const finalDesc = checkVal ? `${descVal} (Chk #${checkVal})` : descVal;

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
      link.download = fileName.replace(/\.csv$/i, '') + '.qbo';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSuccess(true);
    } catch (err) {
      setError("Failed to convert: " + err.message);
    }
  };

  const handleReset = () => {
    setCsvRows(null);
    setHeaders([]);
    setFileName('');
    setDateCol(-1);
    setDescCol(-1);
    setAmtCol(-1);
    setCheckCol(-1);
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="converter-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {upsellFeature && <UpsellModal isOpen={!!upsellFeature} onClose={() => setUpsellFeature(null)} featureName={upsellFeature} />}

      {/* DROPZONE */}
      {!csvRows && !isProcessing && (
        <div 
          className="dropzone"
          onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('active'); }}
          onDragLeave={(e) => e.currentTarget.classList.remove('active')}
          onDrop={(e) => { e.currentTarget.classList.remove('active'); onDrop(e); }}
          onClick={() => fileInputRef.current.click()}
        >
          <Table size={48} className="drop-icon" style={{ color: 'var(--brand-500)' }} />
          <h3>Drag & drop your transactions CSV</h3>
          <p>Map your spreadsheet columns and convert directly to QuickBooks (.QBO)</p>
          <div className="file-types">
            <span className="file-type-tag">.csv</span>
            <span className="file-type-tag">Universal QuickBooks Wrap</span>
            <span className="file-type-tag">100% Offline</span>
          </div>
          <input 
            type="file" 
            ref={fileInputRef}
            accept=".csv" 
            style={{ display: 'none' }} 
            onChange={onDrop}
          />
        </div>
      )}

      {/* PROCESSING */}
      {isProcessing && (
        <div className="loader">
          <div className="spinner"></div>
          <h3>Reading spreadsheet data...</h3>
          <p>Processing locally inside your browser</p>
        </div>
      )}

      {error && <div className="error-msg">{error}</div>}

      {/* COLUMN MAPPER SCREEN */}
      {csvRows && !isProcessing && !success && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <div>
              <h3 style={{ margin: 0 }}>Map Columns for {fileName}</h3>
              <p style={{ margin: '0.25rem 0 0', color: 'var(--slate-500)', fontSize: '0.85rem' }}>Match your spreadsheet columns to QuickBooks standard fields.</p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={handleReset}>Change File</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem', padding: '1.5rem', background: 'var(--slate-50)', borderRadius: '12px', border: '1px solid var(--border)' }}>
            
            {/* Date Map */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Date Column <span style={{ color: 'red' }}>*</span></label>
              <select className="export-select" style={{ width: '100%' }} value={dateCol} onChange={(e) => setDateCol(parseInt(e.target.value))}>
                <option value={-1}>-- Select Column --</option>
                {headers.map((h, idx) => (
                  <option key={idx} value={idx}>{h || `Column ${idx + 1}`}</option>
                ))}
              </select>
            </div>

            {/* Description Map */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Payee / Description <span style={{ color: 'red' }}>*</span></label>
              <select className="export-select" style={{ width: '100%' }} value={descCol} onChange={(e) => setDescCol(parseInt(e.target.value))}>
                <option value={-1}>-- Select Column --</option>
                {headers.map((h, idx) => (
                  <option key={idx} value={idx}>{h || `Column ${idx + 1}`}</option>
                ))}
              </select>
            </div>

            {/* Amount Map */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Amount Column <span style={{ color: 'red' }}>*</span></label>
              <select className="export-select" style={{ width: '100%' }} value={amtCol} onChange={(e) => setAmtCol(parseInt(e.target.value))}>
                <option value={-1}>-- Select Column --</option>
                {headers.map((h, idx) => (
                  <option key={idx} value={idx}>{h || `Column ${idx + 1}`}</option>
                ))}
              </select>
            </div>

            {/* Check Map */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Check Number (Optional)</label>
              <select className="export-select" style={{ width: '100%' }} value={checkCol} onChange={(e) => setCheckCol(parseInt(e.target.value))}>
                <option value={-1}>-- None --</option>
                {headers.map((h, idx) => (
                  <option key={idx} value={idx}>{h || `Column ${idx + 1}`}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mapped Row Preview */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Mapped Preview (First 5 Rows)</h4>
            <div className="table-container">
              <table style={{ background: 'white' }}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {csvRows.slice(1, 6).map((row, i) => (
                    <tr key={i}>
                      <td>{row[dateCol] || '-'}</td>
                      <td>
                        {row[descCol] || '-'}
                        {checkCol !== -1 && row[checkCol] ? ` (Chk #${row[checkCol]})` : ''}
                      </td>
                      <td style={{ fontWeight: '500', color: parseFloat(row[amtCol]) < 0 ? 'var(--slate-800)' : 'var(--brand-600)' }}>
                        {row[amtCol] || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <button className="btn btn-outline" onClick={handleReset}>Cancel</button>
            <button 
              className="btn btn-primary" 
              onClick={handleConvert}
              disabled={dateCol === -1 || descCol === -1 || amtCol === -1}
            >
              <Download size={16} /> Convert & Download QBO
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS STATE */}
      {success && (
        <div className="success-state" style={{ padding: '3rem 2rem' }}>
          <CheckCircle size={54} color="var(--brand-500)" style={{ marginBottom: '1.5rem' }} />
          <h2>CSV Converted Successfully!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Your QuickBooks Web Connect (.QBO) file is downloaded. You can now import it directly into QuickBooks without errors.</p>
          <div className="success-actions" style={{ justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={handleConvert}>
              <Download size={16} /> Re-download QBO
            </button>
            <button className="btn btn-outline" onClick={handleReset}>
              Convert Another CSV
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
