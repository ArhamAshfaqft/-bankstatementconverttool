import React, { useState, useCallback } from 'react';
import { UploadCloud, FileText, Download, ChevronDown, RefreshCw, Layers } from 'lucide-react';
import { extractTableFromPdf } from '../lib/pdfParser';
import { downloadFile } from '../lib/exportData';

export default function ConverterTool() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [csvData, setCsvData] = useState(null);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState('');
  const [showAllRows, setShowAllRows] = useState(false);
  const [format, setFormat] = useState('csv');

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlFormat = params.get('format');
    if (urlFormat && ['csv', 'excel', 'qbo'].includes(urlFormat)) {
      setFormat(urlFormat);
    }
  }, []);

  const onDrop = useCallback(async (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0] || e.target.files[0];
    
    if (!file || file.type !== 'application/pdf') {
      setError("Please select a valid PDF file.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setFileName(file.name);
    setShowAllRows(false);

    try {
      const tableData = await extractTableFromPdf(file);
      if (tableData && tableData.length > 0) {
        setCsvData(tableData);
      } else {
        setError("Could not extract any tabular data from this PDF. Make sure it contains text-based tables.");
      }
    } catch (err) {
      console.error(err);
      setError("Error parsing PDF. Make sure it's a valid text-based PDF (not a scanned image).");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleDownload = () => {
    downloadFile(csvData, fileName, format);
  };

  return (
    <div className="converter-card" id="converter">
      {!csvData && !isProcessing && (
        <div 
          className="dropzone"
          onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('active'); }}
          onDragLeave={(e) => e.currentTarget.classList.remove('active')}
          onDrop={(e) => { e.currentTarget.classList.remove('active'); onDrop(e); }}
          onClick={() => document.getElementById('file-upload').click()}
        >
          <UploadCloud size={48} className="drop-icon" />
          <h3>Drag & drop your bank statement PDF</h3>
          <p>Or click to browse files from your computer</p>
          <div className="file-types">
            <span className="file-type-tag">.pdf</span>
            <span className="file-type-tag">Text-based PDFs</span>
            <span className="file-type-tag">No size limit</span>
          </div>
          <input 
            type="file" 
            id="file-upload" 
            accept=".pdf" 
            style={{ display: 'none' }} 
            onChange={onDrop}
          />
        </div>
      )}

      {isProcessing && (
        <div className="loader">
          <div className="spinner"></div>
          <h3>Extracting transaction data...</h3>
          <p>Processing locally in your browser — nothing is uploaded</p>
        </div>
      )}

      {error && <div className="error-msg">{error}</div>}

      {csvData && !isProcessing && (
        <div>
          <div className="results-header">
            <div className="results-meta">
              <h3>
                <FileText size={18} /> 
                {fileName} — Extracted Successfully
              </h3>
              <p>{csvData.length} rows detected</p>
            </div>
            <div className="results-actions">
              <button className="btn btn-outline" onClick={() => { setCsvData(null); setShowAllRows(false); }}>
                <RefreshCw size={16} /> New File
              </button>
              
              <div style={{ display: 'flex', border: '1px solid var(--brand-500)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <select 
                  style={{ border: 'none', background: 'white', padding: '0 1rem', outline: 'none', color: 'var(--text-heading)', fontWeight: '500', borderRight: '1px solid var(--brand-500)', cursor: 'pointer' }}
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                >
                  <option value="csv">CSV (Universal)</option>
                  <option value="excel">Excel (.xlsx)</option>
                  <option value="qbo">QuickBooks (.qbo)</option>
                </select>
                <button className="btn btn-primary" onClick={handleDownload} style={{ borderRadius: 0, border: 'none' }}>
                  <Download size={16} /> Export
                </button>
              </div>
            </div>
          </div>
          
          <div className="table-container">
            <div className="table-scroll">
              <table>
                {csvData.length > 0 && (
                  <thead>
                    <tr>
                      {csvData[0].map((cell, j) => (
                        <th key={j}>{cell}</th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {csvData.slice(1, showAllRows ? csvData.length : 11).map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!showAllRows && csvData.length > 10 && (
              <div className="table-footer">
                <button className="btn btn-ghost" onClick={() => setShowAllRows(true)}>
                  Show all {csvData.length} rows <ChevronDown size={14} />
                </button>
              </div>
            )}
            {showAllRows && csvData.length > 10 && (
              <div className="table-footer">
                <button className="btn btn-ghost" onClick={() => setShowAllRows(false)}>
                  Collapse rows
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
