import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Download, ChevronDown, RefreshCw, Pencil, Check, EyeOff, Eye, Shield } from 'lucide-react';
import { parseQboToRows } from '../lib/qboParser';
import { downloadFile } from '../lib/exportData';
import { useAuth } from '../contexts/AuthContext';
import UpsellModal from './UpsellModal';

const COLUMN_PRESETS = ['Date', 'Description', 'Amount', 'Check No.', 'Reference / FitId', 'Type', 'Memo'];

export default function QboToCsvTool() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [rawData, setRawData] = useState(null);
  const [workingData, setWorkingData] = useState(null);
  const [excludedRows, setExcludedRows] = useState(new Set());
  const [editMode, setEditMode] = useState(false);
  const [editingCell, setEditingCell] = useState(null);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState('');
  const [showAllRows, setShowAllRows] = useState(false);
  const [format, setFormat] = useState('csv');
  const editInputRef = useRef(null);

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
    const ext = file.name.toLowerCase().split('.').pop();
    if (ext !== 'qbo' && ext !== 'ofx') {
      setError("Please upload a valid .qbo or .ofx Web Connect statement.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setFileName(file.name);
    setShowAllRows(false);
    setEditMode(false);
    setEditingCell(null);
    setExcludedRows(new Set());

    try {
      const text = await file.text();
      const tableData = parseQboToRows(text);
      if (tableData && tableData.length > 1) {
        setRawData(tableData);
        setWorkingData(JSON.parse(JSON.stringify(tableData)));
      } else {
        setError("No transactions found in this QBO/OFX file. Make sure it's not empty or corrupted.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to read file. Please ensure it's a valid text-based QBO/OFX statement.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (format !== 'csv' && !isPro) {
      setUpsellFeature('Premium Excel Export');
      return;
    }

    const exportableData = workingData.filter((_, i) => i === 0 || !excludedRows.has(i));
    downloadFile(exportableData, fileName, format);
  };

  const updateCell = (rowIdx, colIdx, value) => {
    setWorkingData(prev => {
      const copy = prev.map(r => [...r]);
      copy[rowIdx][colIdx] = value;
      return copy;
    });
  };

  const toggleRowExclusion = (rowIdx) => {
    setExcludedRows(prev => {
      const next = new Set(prev);
      if (next.has(rowIdx)) next.delete(rowIdx);
      else next.add(rowIdx);
      return next;
    });
  };

  const resetEdits = () => {
    setWorkingData(JSON.parse(JSON.stringify(rawData)));
    setExcludedRows(new Set());
    setEditingCell(null);
  };

  const startCellEdit = (rowIdx, colIdx) => {
    if (!editMode) return;
    setEditingCell({ row: rowIdx, col: colIdx });
    setTimeout(() => editInputRef.current?.focus(), 50);
  };

  const commitCellEdit = () => setEditingCell(null);

  const handleCellKeyDown = (e) => {
    if (e.key === 'Enter') commitCellEdit();
    if (e.key === 'Escape') setEditingCell(null);
  };

  const handleReset = () => {
    setRawData(null);
    setWorkingData(null);
    setShowAllRows(false);
    setEditMode(false);
    setEditingCell(null);
    setExcludedRows(new Set());
    setError(null);
  };

  const csvData = workingData;
  const activeRowCount = csvData ? csvData.length - 1 - excludedRows.size : 0;

  return (
    <div className="converter-card" style={{ maxWidth: '850px', margin: '0 auto' }}>
      
      {upsellFeature && <UpsellModal isOpen={!!upsellFeature} onClose={() => setUpsellFeature(null)} featureName={upsellFeature} />}

      {/* DROPZONE */}
      {!csvData && !isProcessing && (
        <div 
          className="dropzone"
          onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('active'); }}
          onDragLeave={(e) => e.currentTarget.classList.remove('active')}
          onDrop={(e) => { e.currentTarget.classList.remove('active'); onDrop(e); }}
          onClick={() => fileInputRef.current.click()}
        >
          <UploadCloud size={48} className="drop-icon" />
          <h3>Drag & drop your QuickBooks .qbo or .ofx file</h3>
          <p>Extract QBO statement data locally in seconds</p>
          <div className="file-types">
            <span className="file-type-tag">.qbo</span>
            <span className="file-type-tag">.ofx</span>
            <span className="file-type-tag">100% Offline</span>
          </div>
          <input 
            type="file" 
            ref={fileInputRef}
            accept=".qbo,.ofx" 
            style={{ display: 'none' }} 
            onChange={onDrop}
          />
        </div>
      )}

      {/* PROCESSING */}
      {isProcessing && (
        <div className="loader">
          <div className="spinner"></div>
          <h3>Reading Web Connect statement...</h3>
          <p>Extracting XML/SGML transactions locally in browser</p>
        </div>
      )}

      {error && <div className="error-msg">{error}</div>}

      {/* RESULTS GRID */}
      {csvData && !isProcessing && (
        <div>
          <div className="results-header">
            <div className="results-meta">
              <h3>
                <FileText size={18} /> 
                {fileName} — Parsed
              </h3>
              <p>
                {activeRowCount} transaction{activeRowCount !== 1 ? 's' : ''} detected
                {excludedRows.size > 0 && <span className="excluded-count"> ({excludedRows.size} excluded)</span>}
              </p>
            </div>
            
            <div className="results-actions">
              {editMode ? (
                <div className="edit-actions-group">
                  <button className="btn btn-ghost btn-sm" onClick={resetEdits}>
                    <RefreshCw size={14} /> Reset
                  </button>
                  <button className="btn btn-success btn-sm" onClick={() => { setEditMode(false); setEditingCell(null); }}>
                    <Check size={14} /> Done
                  </button>
                </div>
              ) : (
                <button className="btn btn-outline btn-sm" onClick={() => setEditMode(true)}>
                  <Pencil size={14} /> Edit
                </button>
              )}

              <button className="btn btn-outline btn-sm" onClick={handleReset}>
                New File
              </button>
              
              <div className="export-group">
                <select 
                  className="export-select"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                >
                  <option value="csv">CSV (Universal)</option>
                  <option value="excel">Excel (.xlsx)</option>
                </select>
                <button className="btn btn-primary export-btn" onClick={handleDownload}>
                  <Download size={16} /> Export
                </button>
              </div>
            </div>
          </div>

          {editMode && (
            <div className="edit-banner">
              <Pencil size={14} />
              <span>Edit Mode — Click any cell to modify values, or use the eye icon to exclude rows from export.</span>
            </div>
          )}
          
          <div className="table-container">
            <div className="table-scroll">
              <table className={editMode ? 'editable' : ''}>
                <thead>
                  <tr>
                    {editMode && <th className="row-action-col"></th>}
                    {csvData[0].map((cell, j) => (
                      <th key={j}>{cell}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(1, showAllRows ? csvData.length : 11).map((row, i) => {
                    const actualIdx = i + 1;
                    const isExcluded = excludedRows.has(actualIdx);
                    return (
                      <tr key={i} className={`${isExcluded ? 'row-excluded' : ''}`}>
                        {editMode && (
                          <td className="row-action-cell">
                            <button
                              className={`row-toggle-btn ${isExcluded ? 'is-excluded' : ''}`}
                              onClick={() => toggleRowExclusion(actualIdx)}
                            >
                              {isExcluded ? <Eye size={14} /> : <EyeOff size={14} />}
                            </button>
                          </td>
                        )}
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className={editMode ? 'cell-editable' : ''}
                            onClick={() => startCellEdit(actualIdx, j)}
                          >
                            {editingCell?.row === actualIdx && editingCell?.col === j ? (
                              <input
                                ref={editInputRef}
                                className="cell-input"
                                type="text"
                                value={cell}
                                onChange={(e) => updateCell(actualIdx, j, e.target.value)}
                                onBlur={commitCellEdit}
                                onKeyDown={handleCellKeyDown}
                                autoFocus
                              />
                            ) : (
                              <span>{cell}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {!showAllRows && csvData.length > 10 && (
              <div className="table-footer">
                <button className="btn btn-ghost" onClick={() => setShowAllRows(true)}>
                  Show all {csvData.length - 1} rows <ChevronDown size={14} />
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

      <div className="tool-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
          <Shield size={14} className="text-muted" />
          <span>Local processing: Your QBO/OFX data never leaves your computer.</span>
        </div>
      </div>
    </div>
  );
}
