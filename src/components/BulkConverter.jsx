import React, { useState, useCallback, useRef } from 'react';
import { FolderOpen, Upload, Loader2, Download, CheckCircle, AlertCircle, Trash2, Play, FileText, X, Eye, ChevronDown } from 'lucide-react';
import { extractTableFromPdf } from '../lib/pdfParser';
import { downloadFile } from '../lib/exportData';

export default function BulkConverter() {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [previewFile, setPreviewFile] = useState(null);
  const [format, setFormat] = useState('csv');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // ── Add files by their full paths (from folder or file picker) ──
  const addFilesByPath = (paths) => {
    const newFiles = paths
      .filter(p => p.toLowerCase().endsWith('.pdf'))
      .filter(p => !files.some(f => f.path === p))
      .map(p => ({
        name: p.split(/[\\/]/).pop(),
        path: p,
        status: 'queued',
        data: null,
        rows: 0,
        error: null,
      }));
    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  // ── Select folder via native dialog ──
  const handleSelectFolder = async () => {
    if (!window.electronAPI) return;
    const folderPath = await window.electronAPI.selectFolder();
    if (!folderPath) return;
    const pdfNames = await window.electronAPI.readFolder(folderPath);
    const fullPaths = pdfNames.map(name => `${folderPath}\\${name}`);
    addFilesByPath(fullPaths);
  };

  // ── Select individual files via native dialog ──
  const handleSelectFiles = async () => {
    if (!window.electronAPI) return;
    const paths = await window.electronAPI.selectFiles();
    if (paths && paths.length > 0) {
      addFilesByPath(paths);
    }
  };

  // ── Drag & Drop handler ──
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const pdfPaths = droppedFiles
      .filter(f => f.name.toLowerCase().endsWith('.pdf'))
      .map(f => f.path) // Electron gives us the real filesystem path
      .filter(Boolean);

    if (pdfPaths.length > 0) {
      addFilesByPath(pdfPaths);
    }
  }, [files]);

  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(false); };

  // ── Process all queued files ──
  const startProcessing = async () => {
    setStatus('processing');
    setProgress(0);

    const updatedFiles = [...files];
    let processedCount = 0;

    for (let i = 0; i < updatedFiles.length; i++) {
      const file = updatedFiles[i];
      if (file.status === 'done') {
        processedCount++;
        setProgress(Math.round((processedCount / updatedFiles.length) * 100));
        continue; // skip already processed
      }

      setCurrentFile(file.name);
      updatedFiles[i].status = 'processing';
      setFiles([...updatedFiles]);

      try {
        const buffer = await window.electronAPI.readPdfFile(file.path);
        if (!buffer) throw new Error('Could not read file');

        const data = await extractTableFromPdf(new Uint8Array(buffer));
        if (data && data.length > 1) {
          updatedFiles[i].status = 'done';
          updatedFiles[i].data = data;
          updatedFiles[i].rows = data.length - 1; // minus header
        } else {
          updatedFiles[i].status = 'error';
          updatedFiles[i].error = 'No table data found';
        }
      } catch (err) {
        console.error(`Error processing ${file.name}:`, err);
        updatedFiles[i].status = 'error';
        updatedFiles[i].error = err.message || 'Processing failed';
      }

      processedCount++;
      setProgress(Math.round((processedCount / updatedFiles.length) * 100));
      setFiles([...updatedFiles]);
    }

    setCurrentFile('');
    setStatus('done');
  };

  // ── Native Export Helper ──
  const performNativeExport = async (data, baseName) => {
    if (!window.electronAPI) return;
    
    let fileData;
    let filters;
    let extension;
    
    if (format === 'csv') {
      const Papa = await import('papaparse');
      fileData = Papa.default.unparse(data);
      filters = [{ name: 'CSV Files', extensions: ['csv'] }];
      extension = 'csv';
    } else if (format === 'excel') {
      const XLSX = await import('xlsx');
      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Transactions");
      // Use buffer for native saving
      fileData = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
      filters = [{ name: 'Excel Files', extensions: ['xlsx'] }];
      extension = 'xlsx';
    } else if (format === 'qbo') {
      // Basic QBO fallback (would usually import from exportData.js)
      const { generateQboFile } = await import('../lib/exportData');
      fileData = generateQboFile(data);
      filters = [{ name: 'QuickBooks Data', extensions: ['qbo'] }];
      extension = 'qbo';
    }

    const success = await window.electronAPI.saveFile({
      defaultName: `${baseName}.${extension}`,
      filters,
      data: fileData
    });
    
    if (!success) console.log("Export canceled or failed");
  };

  // ── Export individual file ──
  const exportFile = (file) => {
    if (file.data) {
      performNativeExport(file.data, file.name.replace('.pdf', ''));
    }
  };

  // ── Export all combined ──
  const exportAllCombined = () => {
    const successFiles = files.filter(f => f.status === 'done' && f.data);
    if (successFiles.length === 0) return;

    let combined = [];
    successFiles.forEach((file, idx) => {
      if (idx === 0) {
        combined = [...file.data]; // include header
      } else {
        combined.push(...file.data.slice(1)); // skip header
      }
    });

    performNativeExport(combined, 'Combined_Statements');
  };

  // ── Remove a file from queue ──
  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (previewFile && previewFile === files[index]) setPreviewFile(null);
  };

  // ── Clear all ──
  const clearAll = () => {
    setFiles([]);
    setStatus('idle');
    setProgress(0);
    setPreviewFile(null);
  };

  // ── Computed stats ──
  const doneCount = files.filter(f => f.status === 'done').length;
  const errorCount = files.filter(f => f.status === 'error').length;
  const totalRows = files.reduce((sum, f) => sum + (f.rows || 0), 0);
  const hasFiles = files.length > 0;
  const allDone = hasFiles && files.every(f => f.status === 'done' || f.status === 'error');

  // ── EMPTY STATE: No files loaded yet ──
  if (!hasFiles) {
    return (
      <div
        style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div style={{
          border: isDragOver ? '2px solid var(--ds-accent)' : '2px dashed #cbd5e1',
          background: isDragOver ? '#f0fdfa' : 'white',
          borderRadius: '12px',
          padding: '3rem 4rem',
          textAlign: 'center',
          transition: 'all 0.2s',
          cursor: 'pointer',
          maxWidth: '520px',
          width: '100%',
        }}>
          <Upload size={48} style={{ color: 'var(--ds-accent)', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: '#1e293b' }}>
            Drop PDF files here
          </h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.875rem', lineHeight: '1.6' }}>
            Drag and drop bank statement PDFs directly, or use the buttons below to browse.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="ds-btn ds-btn-primary" onClick={handleSelectFiles}>
              <FileText size={16} /> Select Files
            </button>
            <button className="ds-btn ds-btn-outline" onClick={handleSelectFolder}>
              <FolderOpen size={16} /> Open Folder
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN VIEW: Files loaded ──
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '0' }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* ── TOOLBAR ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.65rem 1rem',
        background: 'white', borderBottom: '1px solid #e2e8f0',
        borderRadius: '6px 6px 0 0', flexShrink: 0,
      }}>
        <button className="ds-btn ds-btn-outline" onClick={handleSelectFiles} style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
          <FileText size={14} /> Add Files
        </button>
        <button className="ds-btn ds-btn-outline" onClick={handleSelectFolder} style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
          <FolderOpen size={14} /> Add Folder
        </button>
        <button className="ds-btn ds-btn-outline" onClick={clearAll} style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', color: '#ef4444', borderColor: '#fca5a5' }}>
          <Trash2 size={14} /> Clear All
        </button>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Format picker */}
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            style={{
              border: '1px solid #e2e8f0', borderRadius: '4px', padding: '0.35rem 0.5rem',
              fontSize: '0.75rem', fontWeight: 600, outline: 'none', background: 'white', cursor: 'pointer',
            }}
          >
            <option value="csv">CSV</option>
            <option value="excel">Excel (.xlsx)</option>
            <option value="qbo">QuickBooks (.qbo)</option>
          </select>

          {allDone && doneCount > 0 ? (
            <button className="ds-btn ds-btn-primary" onClick={exportAllCombined} style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
              <Download size={14} /> Export All ({totalRows} rows)
            </button>
          ) : (
            <button
              className="ds-btn ds-btn-primary"
              onClick={startProcessing}
              disabled={status === 'processing'}
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
            >
              {status === 'processing' ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
              {status === 'processing' ? `Processing... ${progress}%` : `Process ${files.length} File${files.length > 1 ? 's' : ''}`}
            </button>
          )}
        </div>
      </div>

      {/* ── PROGRESS BAR (only during processing) ── */}
      {status === 'processing' && (
        <div style={{ height: '3px', background: '#e2e8f0', flexShrink: 0 }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'var(--ds-accent)', transition: 'width 0.3s' }} />
        </div>
      )}

      {/* ── STATS BAR ── */}
      <div style={{
        padding: '0.4rem 1rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0',
        display: 'flex', gap: '1.5rem', fontSize: '0.7rem', fontWeight: 600, flexShrink: 0,
      }}>
        <span style={{ color: '#64748b' }}>{files.length} file{files.length !== 1 ? 's' : ''} queued</span>
        {doneCount > 0 && <span style={{ color: '#10b981' }}>✓ {doneCount} parsed</span>}
        {errorCount > 0 && <span style={{ color: '#ef4444' }}>✗ {errorCount} failed</span>}
        {totalRows > 0 && <span style={{ color: '#0d9488' }}>{totalRows} total rows extracted</span>}
        {status === 'processing' && currentFile && (
          <span style={{ marginLeft: 'auto', color: '#3b82f6' }}>Reading: {currentFile}</span>
        )}
      </div>

      {/* ── SPLIT VIEW: File list + Preview ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        {/* File List */}
        <div style={{ width: previewFile ? '45%' : '100%', overflow: 'auto', transition: 'width 0.2s' }}>
          <table className="ds-table" style={{ fontSize: '0.8rem' }}>
            <thead>
              <tr>
                <th style={{ width: '36px' }}>#</th>
                <th>File</th>
                <th style={{ width: '90px' }}>Rows</th>
                <th style={{ width: '90px' }}>Status</th>
                <th style={{ width: '110px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, idx) => (
                <tr key={idx} style={{ background: previewFile === file ? '#f0fdfa' : undefined }}>
                  <td style={{ color: '#94a3b8' }}>{idx + 1}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <FileText size={13} style={{ color: '#94a3b8', flexShrink: 0 }} />
                      <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                    </div>
                  </td>
                  <td>{file.rows > 0 ? file.rows : '—'}</td>
                  <td>
                    <StatusBadge status={file.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
                      {file.status === 'done' && (
                        <>
                          <button onClick={() => setPreviewFile(previewFile === file ? null : file)}
                            title="Preview data"
                            style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '0.2rem 0.4rem', cursor: 'pointer', color: '#64748b', fontSize: '0.65rem' }}>
                            <Eye size={12} />
                          </button>
                          <button onClick={() => exportFile(file)}
                            title="Export this file"
                            style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '0.2rem 0.4rem', cursor: 'pointer', color: '#0d9488', fontSize: '0.65rem' }}>
                            <Download size={12} />
                          </button>
                        </>
                      )}
                      {status !== 'processing' && (
                        <button onClick={() => removeFile(idx)}
                          title="Remove from queue"
                          style={{ background: 'none', border: '1px solid #fca5a5', borderRadius: '4px', padding: '0.2rem 0.4rem', cursor: 'pointer', color: '#ef4444', fontSize: '0.65rem' }}>
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Data Preview Pane ── */}
        {previewFile && previewFile.data && (
          <div style={{ flex: 1, borderLeft: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{
              padding: '0.5rem 0.75rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
            }}>
              <span style={{ fontWeight: 600, fontSize: '0.8rem', color: '#1e293b' }}>
                {previewFile.name} — {previewFile.rows} rows
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="ds-btn ds-btn-outline" onClick={() => exportFile(previewFile)} style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem' }}>
                  <Download size={12} /> Export
                </button>
                <button onClick={() => setPreviewFile(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                  <X size={16} />
                </button>
              </div>
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
              <table className="ds-table" style={{ fontSize: '0.75rem' }}>
                {previewFile.data.length > 0 && (
                  <thead>
                    <tr>
                      {previewFile.data[0].map((h, i) => <th key={i}>{h}</th>)}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {previewFile.data.slice(1, 100).map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => <td key={ci}>{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
              {previewFile.data.length > 101 && (
                <div style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.7rem', color: '#94a3b8' }}>
                  Showing first 100 of {previewFile.rows} rows
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Drag overlay ── */}
      {isDragOver && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(13, 148, 136, 0.08)',
          border: '3px dashed var(--ds-accent)', borderRadius: '6px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 50, pointerEvents: 'none',
        }}>
          <div style={{ background: 'white', padding: '1.5rem 3rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Upload size={32} style={{ color: 'var(--ds-accent)', marginBottom: '0.5rem' }} />
            <p style={{ fontWeight: 600, color: '#1e293b' }}>Drop PDF files to add to queue</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Status Badge ──
function StatusBadge({ status }) {
  const map = {
    queued: { bg: '#f1f5f9', color: '#64748b', label: 'Queued' },
    processing: { bg: '#eff6ff', color: '#3b82f6', label: 'Reading...' },
    done: { bg: '#ecfdf5', color: '#10b981', label: 'Done' },
    error: { bg: '#fef2f2', color: '#ef4444', label: 'Error' },
  };
  const s = map[status] || map.queued;
  return (
    <span style={{
      display: 'inline-block', fontSize: '0.65rem', padding: '0.15rem 0.45rem',
      borderRadius: '4px', background: s.bg, color: s.color, fontWeight: 700,
    }}>
      {s.label}
    </span>
  );
}
