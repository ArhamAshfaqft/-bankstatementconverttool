import React, { useState, useCallback, useRef } from 'react';
import { UploadCloud, FileText, Download, ChevronDown, RefreshCw, Pencil, X, EyeOff, Eye, Check, Layers, Archive, GitMerge, Shield } from 'lucide-react';
import { extractTableFromPdf } from '../lib/pdfParser';
import { downloadFile, generateFileBlob } from '../lib/exportData';
import UpsellModal from './UpsellModal';
import JSZip from 'jszip';
import { useAuth } from '../contexts/AuthContext';

const COLUMN_PRESETS = ['Date', 'Post Date', 'Description', 'Details', 'Reference', 'Check No.', 'Amount', 'Debit', 'Credit', 'Balance', 'Type', 'Category'];
const FORMAT_EXT = { csv: '.csv', excel: '.xlsx', qbo: '.qbo' };

export default function ConverterTool() {
  // ── Core State ──
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

  // ── Bulk State ──
  const [processedFiles, setProcessedFiles] = useState([]);   // [{name, rows, status, data, workingData, excludedRows}]
  const [bulkProgress, setBulkProgress] = useState(null);
  const [bulkMode, setBulkMode] = useState('merge');           // 'merge' | 'separate'
  const [activeFileIndex, setActiveFileIndex] = useState(0);

  // ── SaaS State ──
  const { isPro: realIsPro } = useAuth();
  const [devPro, setDevPro] = useState(sessionStorage.getItem('devPro') === 'true');
  const isPro = realIsPro || devPro;
  const [upsellFeature, setUpsellFeature] = useState(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlFormat = params.get('format');
    if (urlFormat && ['csv', 'excel', 'qbo'].includes(urlFormat)) {
      setFormat(urlFormat);
    }
  }, []);

  // ══════════════════════════════════════════════════
  //  FILE HANDLING
  // ══════════════════════════════════════════════════

  const onDrop = useCallback(async (e) => {
    e.preventDefault();
    const fileList = e.dataTransfer?.files || e.target.files;
    if (!fileList || fileList.length === 0) return;

    const pdfFiles = Array.from(fileList).filter(f =>
      f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );

    if (pdfFiles.length === 0) {
      setError("Please select valid PDF file(s).");
      return;
    }

    // Gate: Bulk requires Pro
    if (pdfFiles.length > 1 && !isPro) {
      setUpsellFeature('Bulk Processing');
      return;
    }

    if (pdfFiles.length === 1) {
      await processSingleFile(pdfFiles[0]);
    } else {
      await processBulkFiles(pdfFiles);
    }
  }, [isPro, bulkMode]);

  const processSingleFile = async (file) => {
    setIsProcessing(true);
    setError(null);
    setFileName(file.name);
    setShowAllRows(false);
    setEditMode(false);
    setEditingCell(null);
    setExcludedRows(new Set());
    setProcessedFiles([]);
    setBulkProgress(null);

    try {
      const tableData = await extractTableFromPdf(file);
      if (tableData && tableData.length > 0) {
        setRawData(tableData);
        setWorkingData(JSON.parse(JSON.stringify(tableData)));
      } else {
        setError("Could not extract any tabular data from this PDF. Make sure it contains text-based tables.");
      }
    } catch (err) {
      console.error(err);
      setError("Error parsing PDF. Make sure it's a valid text-based PDF (not a scanned image).");
    } finally {
      setIsProcessing(false);
    }
  };

  const processBulkFiles = async (files) => {
    setIsProcessing(true);
    setError(null);
    setShowAllRows(false);
    setEditMode(false);
    setEditingCell(null);
    setExcludedRows(new Set());

    const fileResults = [];
    let combinedHeader = null;
    let combinedRows = [];
    let failCount = 0;

    for (let i = 0; i < files.length; i++) {
      setBulkProgress({ current: i + 1, total: files.length, name: files[i].name });

      try {
        const tableData = await extractTableFromPdf(files[i]);
        if (tableData && tableData.length > 1) {
          const header = tableData[0];
          const rows = tableData.slice(1);
          if (!combinedHeader) combinedHeader = header;
          combinedRows.push(...rows);
          fileResults.push({ 
            name: files[i].name, 
            rows: rows.length, 
            status: 'done', 
            data: tableData,
            workingData: JSON.parse(JSON.stringify(tableData)),
            excludedRows: new Set()
          });
        } else {
          fileResults.push({ name: files[i].name, rows: 0, status: 'empty', data: null, workingData: null, excludedRows: new Set() });
          failCount++;
        }
      } catch (err) {
        console.error(`Failed: ${files[i].name}`, err);
        fileResults.push({ name: files[i].name, rows: 0, status: 'error', data: null, workingData: null, excludedRows: new Set() });
        failCount++;
      }
    }

    setBulkProgress(null);
    setProcessedFiles(fileResults);

    if (bulkMode === 'merge') {
      // ── MERGE: Combine everything into one table ──
      if (combinedHeader && combinedRows.length > 0) {
        const merged = [combinedHeader, ...combinedRows];
        setFileName(`${files.length}_statements_merged`);
        setRawData(merged);
        setWorkingData(JSON.parse(JSON.stringify(merged)));
        if (failCount > 0) {
          setError(`${failCount} of ${files.length} file(s) could not be parsed. Merged ${combinedRows.length} transactions from the rest.`);
        }
      } else {
        setError("Could not extract data from any of the uploaded files.");
      }
    } else {
      // ── SEPARATE: Show first file's data as preview, keep all individual results ──
      const firstGoodIdx = fileResults.findIndex(f => f.status === 'done');
      if (firstGoodIdx !== -1) {
        const firstGood = fileResults[firstGoodIdx];
        setActiveFileIndex(firstGoodIdx);
        setFileName(firstGood.name);
        setRawData(firstGood.data);
        setWorkingData(JSON.parse(JSON.stringify(firstGood.data)));
        setExcludedRows(new Set());
        if (failCount > 0) {
          setError(`${failCount} of ${files.length} file(s) could not be parsed.`);
        }
      } else {
        setError("Could not extract data from any of the uploaded files.");
      }
    }

    setIsProcessing(false);
  };

  // ══════════════════════════════════════════════════
  //  EXPORT
  // ══════════════════════════════════════════════════

  const handleDownload = async () => {
    // Gate: Excel/QBO requires Pro
    if (format !== 'csv' && !isPro) {
      setUpsellFeature('Premium Exports (Excel & QBO)');
      return;
    }

    // Separate mode with multiple files → ZIP
    if (bulkMode === 'separate' && processedFiles.length > 1) {
      await downloadAsZip();
      return;
    }

    // Standard single/merge download
    downloadFile(getExportData(), fileName, format);
  };

  const switchActiveFile = (idx) => {
    if (idx === activeFileIndex || bulkMode !== 'separate') return;
    const nextFile = processedFiles[idx];
    if (nextFile.status !== 'done') return;
    
    // Sync current edits before switching
    const updatedFiles = [...processedFiles];
    if (activeFileIndex >= 0 && updatedFiles[activeFileIndex]) {
      updatedFiles[activeFileIndex].workingData = workingData ? JSON.parse(JSON.stringify(workingData)) : null;
      updatedFiles[activeFileIndex].excludedRows = new Set(excludedRows);
    }
    setProcessedFiles(updatedFiles);

    setActiveFileIndex(idx);
    setFileName(nextFile.name);
    setRawData(nextFile.data);
    setWorkingData(nextFile.workingData ? JSON.parse(JSON.stringify(nextFile.workingData)) : null);
    setExcludedRows(new Set(nextFile.excludedRows));
    setEditMode(false);
    setEditingCell(null);
    setShowAllRows(false);
  };

  const downloadAsZip = async () => {
    // Sync active view right before downloading
    let finalFiles = [...processedFiles];
    if (activeFileIndex >= 0 && finalFiles[activeFileIndex]) {
      finalFiles[activeFileIndex].workingData = workingData;
      finalFiles[activeFileIndex].excludedRows = excludedRows;
    }

    const zip = new JSZip();
    const ext = FORMAT_EXT[format] || '.csv';
    const actualFormat = format;
    const goodFiles = finalFiles.filter(f => f.status === 'done' && f.workingData);

    for (const file of goodFiles) {
      const cleanName = file.name.replace(/\.pdf$/i, '') + ext;
      const exportableData = file.workingData.filter((_, i) => i === 0 || !file.excludedRows.has(i));
      const blob = generateFileBlob(exportableData, actualFormat);
      if (blob) {
        zip.file(cleanName, blob);
      }
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `statements_${goodFiles.length}_files${ext.replace('.', '_')}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ══════════════════════════════════════════════════
  //  EDITING
  // ══════════════════════════════════════════════════

  const getExportData = () => {
    if (!workingData) return [];
    return workingData.filter((_, i) => i === 0 || !excludedRows.has(i));
  };

  const updateCell = (rowIdx, colIdx, value) => {
    setWorkingData(prev => {
      const copy = prev.map(r => [...r]);
      copy[rowIdx][colIdx] = value;
      return copy;
    });
  };

  const updateHeader = (colIdx, value) => updateCell(0, colIdx, value);

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
    if (e.key === 'Tab') {
      e.preventDefault();
      commitCellEdit();
      if (editingCell) {
        const maxCol = workingData[0].length - 1;
        const nextCol = editingCell.col < maxCol ? editingCell.col + 1 : 0;
        const nextRow = editingCell.col < maxCol ? editingCell.row : Math.min(editingCell.row + 1, workingData.length - 1);
        startCellEdit(nextRow, nextCol);
      }
    }
  };

  const handleReset = () => {
    setRawData(null);
    setWorkingData(null);
    setShowAllRows(false);
    setEditMode(false);
    setEditingCell(null);
    setExcludedRows(new Set());
    setProcessedFiles([]);
    setBulkProgress(null);
    setError(null);
  };

  const csvData = workingData;
  const activeRowCount = csvData ? csvData.length - 1 - excludedRows.size : 0;
  const goodFileCount = processedFiles.filter(f => f.status === 'done').length;

  // ══════════════════════════════════════════════════
  //  RENDER
  // ══════════════════════════════════════════════════

  return (
    <div className="converter-card" id="converter">
      
      <UpsellModal 
        isOpen={!!upsellFeature} 
        onClose={() => setUpsellFeature(null)} 
        featureName={upsellFeature} 
      />

      {/* ── DROPZONE ── */}
      {!csvData && !isProcessing && (
        <div 
          className="dropzone"
          onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('active'); }}
          onDragLeave={(e) => e.currentTarget.classList.remove('active')}
          onDrop={(e) => { e.currentTarget.classList.remove('active'); onDrop(e); }}
          onClick={() => document.getElementById('file-upload').click()}
        >
          <UploadCloud size={48} className="drop-icon" />
          <h3>Drag & drop your bank statement PDF(s)</h3>
          <p>One file free, or upload multiple with Pro.</p>
          <div className="file-types">
            <span className="file-type-tag">.pdf</span>
            <span className="file-type-tag">Text-based PDFs</span>
            <span className="file-type-tag">No size limit</span>
          </div>

          {/* Bulk Mode Selector (Pro only) */}
          {isPro && (
            <div className="bulk-mode-selector" onClick={(e) => e.stopPropagation()}>
              <button 
                className={`mode-btn ${bulkMode === 'merge' ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setBulkMode('merge'); }}
              >
                <GitMerge size={14} /> Merge into one file
              </button>
              <button 
                className={`mode-btn ${bulkMode === 'separate' ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setBulkMode('separate'); }}
              >
                <Archive size={14} /> Keep separate (ZIP)
              </button>
            </div>
          )}

          <input 
            type="file" 
            id="file-upload" 
            accept=".pdf" 
            multiple
            style={{ display: 'none' }} 
            onChange={onDrop}
          />
        </div>
      )}

      {/* ── PROCESSING ── */}
      {isProcessing && (
        <div className="loader">
          <div className="spinner"></div>
          {bulkProgress ? (
            <>
              <h3>Processing file {bulkProgress.current} of {bulkProgress.total}...</h3>
              <p className="bulk-file-name">{bulkProgress.name}</p>
              <div className="bulk-progress-bar">
                <div className="bulk-progress-fill" style={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}></div>
              </div>
            </>
          ) : (
            <>
              <h3>Extracting transaction data...</h3>
              <p>Processing locally in your browser — nothing is uploaded</p>
            </>
          )}
        </div>
      )}

      {error && <div className="error-msg">{error}</div>}

      {/* ── RESULTS ── */}
      {csvData && !isProcessing && (
        <div>
          <div className="results-header">
            <div className="results-meta">
              <h3>
                <FileText size={18} /> 
                {fileName} — Extracted Successfully
              </h3>
              <p>
                {activeRowCount} transaction{activeRowCount !== 1 ? 's' : ''} detected
                {excludedRows.size > 0 && <span className="excluded-count"> ({excludedRows.size} excluded)</span>}
                {processedFiles.length > 1 && (
                  <span className="merged-badge">
                    {bulkMode === 'merge' ? <><GitMerge size={12} /> Merged from {goodFileCount} files</> : <><Archive size={12} /> {goodFileCount} files ready for ZIP</>}
                  </span>
                )}
              </p>
            </div>
            <div className="results-actions">
              {editMode ? (
                <div className="edit-actions-group">
                  <button className="btn btn-ghost btn-sm" onClick={resetEdits} title="Reset all edits">
                    <RefreshCw size={14} /> Reset
                  </button>
                  <button className="btn btn-success btn-sm" onClick={() => { setEditMode(false); setEditingCell(null); }}>
                    <Check size={14} /> Done Editing
                  </button>
                </div>
              ) : (
                <button className="btn btn-outline btn-sm" onClick={() => setEditMode(true)}>
                  <Pencil size={14} /> Edit Results
                </button>
              )}

              <button className="btn btn-outline" onClick={handleReset}>
                <RefreshCw size={16} /> New File
              </button>
              
              <div className="export-group">
                <select 
                  className="export-select"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                >
                  <option value="csv">CSV (Universal)</option>
                  <option value="excel">Excel (.xlsx)</option>
                  <option value="qbo">QuickBooks (.qbo)</option>
                </select>
                <button className="btn btn-primary export-btn" onClick={handleDownload}>
                  {bulkMode === 'separate' && processedFiles.length > 1 ? (
                    <><Archive size={16} /> Download ZIP</>
                  ) : (
                    <><Download size={16} /> Export</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Bulk file summary */}
          {processedFiles.length > 1 && (
            <div className="bulk-summary">
              {bulkMode === 'merge' ? <GitMerge size={14} /> : <Archive size={14} />}
              <span>
                {goodFileCount} file{goodFileCount !== 1 ? 's' : ''} {bulkMode === 'merge' ? 'merged' : 'processed'} successfully
                {processedFiles.some(f => f.status !== 'done') && (
                  <span className="bulk-errors"> · {processedFiles.length - goodFileCount} failed</span>
                )}
              </span>
              <button className="btn-ghost btn-xs" onClick={() => {
                const el = document.getElementById('bulk-details');
                if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
              }}>Details</button>
              <div id="bulk-details" style={{ display: 'none', width: '100%', marginTop: '0.5rem' }}>
                {processedFiles.map((f, i) => (
                  <div 
                    key={i} 
                    className={`bulk-file-row ${f.status} ${i === activeFileIndex && bulkMode === 'separate' ? 'active-file' : ''}`}
                    onClick={() => bulkMode === 'separate' && switchActiveFile(i)}
                    style={{ cursor: bulkMode === 'separate' && f.status === 'done' ? 'pointer' : 'default' }}
                    title={bulkMode === 'separate' && f.status === 'done' ? "Click to view and edit this file" : undefined}
                  >
                    <FileText size={12} />
                    <span>{f.name}</span>
                    <span className="bulk-file-stat">
                      {f.status === 'done' ? `${f.rows} rows` : f.status === 'empty' ? 'No data' : 'Error'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Separate mode info */}
          {bulkMode === 'separate' && processedFiles.length > 1 && (
            <div className="separate-info">
              <Archive size={14} />
              <span>
                <strong>Separate Mode:</strong> You can click on the file names above to view and edit them individually. Click <strong>"Download ZIP"</strong> to get all {goodFileCount} files packaged into a zip archive.
              </span>
            </div>
          )}

          {editMode && (
            <div className="edit-banner">
              <Pencil size={14} />
              <span>Edit Mode — Click any cell to correct it. Use the <EyeOff size={12} style={{verticalAlign: 'middle'}} /> icon to exclude rows.</span>
            </div>
          )}
          
          {/* ── TABLE ── */}
          <div className="table-container">
            <div className="table-scroll">
              <table className={editMode ? 'editable' : ''}>
                {csvData.length > 0 && (
                  <thead>
                    <tr>
                      {editMode && <th className="row-action-col"></th>}
                      {csvData[0].map((cell, j) => (
                        <th key={j}>
                          {editMode ? (
                            <select
                              className="column-selector"
                              value={cell}
                              onChange={(e) => updateHeader(j, e.target.value)}
                            >
                              <option value={cell}>{cell}</option>
                              {COLUMN_PRESETS.filter(p => p !== cell).map(p => (
                                <option key={p} value={p}>{p}</option>
                              ))}
                            </select>
                          ) : cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {csvData.slice(1, showAllRows ? csvData.length : 11).map((row, i) => {
                    const actualIdx = i + 1;
                    const isExcluded = excludedRows.has(actualIdx);
                    return (
                      <tr key={i} className={`${isExcluded ? 'row-excluded' : ''} ${editMode ? 'row-editable' : ''}`}>
                        {editMode && (
                          <td className="row-action-cell">
                            <button
                              className={`row-toggle-btn ${isExcluded ? 'is-excluded' : ''}`}
                              onClick={() => toggleRowExclusion(actualIdx)}
                              title={isExcluded ? 'Include this row' : 'Exclude this row'}
                            >
                              {isExcluded ? <Eye size={14} /> : <EyeOff size={14} />}
                            </button>
                          </td>
                        )}
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className={`${editMode ? 'cell-editable' : ''} ${editingCell?.row === actualIdx && editingCell?.col === j ? 'cell-active' : ''}`}
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
      {/* SaaS Footer Info */}
      <div className="tool-footer" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--slate-500)' }}>
        <div className="security-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={14} /> 
          <span>100% Client-side processing. Your financial data never leaves this browser.</span>
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
