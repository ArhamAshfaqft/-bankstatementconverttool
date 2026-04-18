import React, { useState, useCallback, useRef } from 'react';
import { 
  UploadCloud, FileText, Download, Trash2, GripVertical, ArrowUp, 
  ArrowDown, Scissors, GitMerge, Lock, Eye, Shield 
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { useAuth } from '../contexts/AuthContext';
import UpsellModal from './UpsellModal';

export default function MergerTool({ mode: initialMode = 'merge' }) {
  const { isPro: realIsPro } = useAuth();
  const [devPro, setDevPro] = useState(sessionStorage.getItem('devPro') === 'true');
  const isPro = realIsPro || devPro;
  const [upsellFeature, setUpsellFeature] = useState(null);

  const [files, setFiles] = useState([]);          // [{id, name, size, pageCount, arrayBuffer}]
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [activeMode, setActiveMode] = useState(initialMode); // 'merge' | 'split'
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const dragItem = useRef(null);

  // Split state
  const [splitFile, setSplitFile] = useState(null);  // {name, pageCount, arrayBuffer}
  const [splitRanges, setSplitRanges] = useState([{ from: 1, to: 1 }]);

  // ══════════════════════════════════════════════════
  //  FILE HANDLING
  // ══════════════════════════════════════════════════

  const loadPdfInfo = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    return {
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      pageCount: pdf.getPageCount(),
      arrayBuffer: arrayBuffer,
    };
  };

  const onDrop = useCallback(async (e) => {
    e.preventDefault();
    const fileList = e.dataTransfer?.files || e.target.files;
    if (!fileList || fileList.length === 0) return;

    const pdfFiles = Array.from(fileList).filter(f =>
      f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );

    if (pdfFiles.length === 0) {
      setError("Please select valid PDF files.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      if (activeMode === 'split') {
        // Split mode: only accept one file
        const info = await loadPdfInfo(pdfFiles[0]);
        setSplitFile(info);
        setSplitRanges([{ from: 1, to: info.pageCount }]);
      } else {
        // Merge mode: accept multiple
        const loaded = [];
        for (const f of pdfFiles) {
          if (files.length + loaded.length >= 2 && !isPro) {
            setUpsellFeature('Merging Multiple Files');
            break;
          }
          try {
            const info = await loadPdfInfo(f);
            loaded.push(info);
          } catch (err) {
            console.error(`Failed to load ${f.name}:`, err);
          }
        }
        setFiles(prev => [...prev, ...loaded]);
      }
    } catch (err) {
      console.error(err);
      setError("Error reading PDF file(s). Make sure they are valid PDFs.");
    } finally {
      setIsProcessing(false);
    }
  }, [activeMode]);

  // ══════════════════════════════════════════════════
  //  MERGE
  // ══════════════════════════════════════════════════

  const removeFile = (id) => setFiles(prev => prev.filter(f => f.id !== id));

  const moveFile = (fromIdx, toIdx) => {
    if (toIdx < 0 || toIdx >= files.length) return;
    const updated = [...files];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setFiles(updated);
  };

  const handleDragStart = (idx) => { dragItem.current = idx; };
  const handleDragEnter = (idx) => { setDragOverIdx(idx); };
  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverIdx !== null && dragItem.current !== dragOverIdx) {
      moveFile(dragItem.current, dragOverIdx);
    }
    dragItem.current = null;
    setDragOverIdx(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    setError(null);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const sourcePdf = await PDFDocument.load(file.arrayBuffer, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      triggerDownload(blob, `merged_${files.length}_statements.pdf`);
    } catch (err) {
      console.error(err);
      setError("Failed to merge PDFs. One or more files may be corrupted or encrypted.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ══════════════════════════════════════════════════
  //  SPLIT
  // ══════════════════════════════════════════════════

  const addSplitRange = () => {
    setSplitRanges(prev => [...prev, { from: 1, to: splitFile?.pageCount || 1 }]);
  };

  const updateSplitRange = (idx, field, value) => {
    setSplitRanges(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: parseInt(value) || 1 };
      return copy;
    });
  };

  const removeSplitRange = (idx) => {
    setSplitRanges(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSplit = async () => {
    if (!splitFile) return;
    setIsProcessing(true);
    setError(null);

    try {
      for (let i = 0; i < splitRanges.length; i++) {
        const range = splitRanges[i];
        const from = Math.max(1, Math.min(range.from, splitFile.pageCount));
        const to = Math.max(from, Math.min(range.to, splitFile.pageCount));
        
        const sourcePdf = await PDFDocument.load(splitFile.arrayBuffer, { ignoreEncryption: true });
        const newPdf = await PDFDocument.create();
        
        const pageIndices = [];
        for (let p = from - 1; p < to; p++) pageIndices.push(p);
        
        const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
        copiedPages.forEach(page => newPdf.addPage(page));

        const splitBytes = await newPdf.save();
        const blob = new Blob([splitBytes], { type: 'application/pdf' });
        const cleanName = splitFile.name.replace(/\.pdf$/i, '');
        triggerDownload(blob, `${cleanName}_pages_${from}-${to}.pdf`);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to split PDF. The file may be corrupted or encrypted.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ══════════════════════════════════════════════════
  //  UTILS
  // ══════════════════════════════════════════════════

  const triggerDownload = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const totalPages = files.reduce((sum, f) => sum + f.pageCount, 0);

  const handleReset = () => {
    setFiles([]);
    setSplitFile(null);
    setSplitRanges([{ from: 1, to: 1 }]);
    setError(null);
  };

  // ══════════════════════════════════════════════════
  //  RENDER
  // ══════════════════════════════════════════════════

  return (
    <div className="merger-card" id="merger-tool">

      {/* Mode Toggle */}
      <div className="merger-mode-toggle">
        <button 
          className={`mode-tab ${activeMode === 'merge' ? 'active' : ''}`}
          onClick={() => { setActiveMode('merge'); handleReset(); }}
        >
          <GitMerge size={16} /> Merge PDFs
        </button>
        <button 
          className={`mode-tab ${activeMode === 'split' ? 'active' : ''}`}
          onClick={() => { setActiveMode('split'); handleReset(); }}
        >
          <Scissors size={16} /> Split PDF
        </button>
      </div>

      {/* ── MERGE MODE ── */}
      {activeMode === 'merge' && (
        <>
          {/* Dropzone (always visible in merge mode, so user can add more) */}
          <div 
            className="dropzone merger-dropzone"
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('active'); }}
            onDragLeave={(e) => e.currentTarget.classList.remove('active')}
            onDrop={(e) => { e.currentTarget.classList.remove('active'); onDrop(e); }}
            onClick={() => document.getElementById('merger-file-upload').click()}
          >
            <UploadCloud size={36} className="drop-icon" />
            <h3>{files.length === 0 ? 'Drop your PDF bank statements here' : 'Drop more PDFs to add'}</h3>
            <p>Select multiple files to merge into one PDF. 100% local processing.</p>
            <div className="file-types">
              <span className="file-type-tag">.pdf</span>
              <span className="file-type-tag">Multiple files</span>
              <span className="file-type-tag">No upload</span>
            </div>
            <input 
              type="file" 
              id="merger-file-upload" 
              accept=".pdf" 
              multiple
              style={{ display: 'none' }} 
              onChange={onDrop}
            />
          </div>

          {/* File List (reorderable) */}
          {files.length > 0 && (
            <div className="merger-file-list">
              <div className="merger-file-list-header">
                <h4><GitMerge size={14}/> {files.length} files · {totalPages} total pages</h4>
                <button className="btn btn-ghost btn-sm" onClick={handleReset}>Clear All</button>
              </div>

              {files.map((file, idx) => (
                <div 
                  key={file.id}
                  className={`merger-file-item ${dragOverIdx === idx ? 'drag-over' : ''}`}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragEnter={() => handleDragEnter(idx)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <div className="merger-file-grip">
                    <GripVertical size={14} />
                  </div>
                  <div className="merger-file-number">{idx + 1}</div>
                  <FileText size={16} className="merger-file-icon" />
                  <div className="merger-file-info">
                    <span className="merger-file-name">{file.name}</span>
                    <span className="merger-file-meta">{file.pageCount} page{file.pageCount !== 1 ? 's' : ''} · {formatSize(file.size)}</span>
                  </div>
                  <div className="merger-file-actions">
                    <button className="btn-icon" onClick={() => moveFile(idx, idx - 1)} disabled={idx === 0} title="Move up">
                      <ArrowUp size={14} />
                    </button>
                    <button className="btn-icon" onClick={() => moveFile(idx, idx + 1)} disabled={idx === files.length - 1} title="Move down">
                      <ArrowDown size={14} />
                    </button>
                    <button className="btn-icon danger" onClick={() => removeFile(file.id)} title="Remove">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              <button 
                className="btn btn-primary merger-action-btn" 
                onClick={handleMerge}
                disabled={files.length < 2 || isProcessing}
              >
                {isProcessing ? (
                  <><div className="spinner-sm"></div> Merging...</>
                ) : (
                  <><GitMerge size={16} /> Merge {files.length} PDFs into One</>
                )}
              </button>
            </div>
          )}
        </>
      )}

      {/* ── SPLIT MODE ── */}
      {activeMode === 'split' && (
        <>
          {!splitFile ? (
            <div 
              className="dropzone merger-dropzone"
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('active'); }}
              onDragLeave={(e) => e.currentTarget.classList.remove('active')}
              onDrop={(e) => { e.currentTarget.classList.remove('active'); onDrop(e); }}
              onClick={() => document.getElementById('splitter-file-upload').click()}
            >
              <UploadCloud size={36} className="drop-icon" />
              <h3>Drop your PDF bank statement here</h3>
              <p>Select a multi-page PDF to extract specific page ranges.</p>
              <div className="file-types">
                <span className="file-type-tag">.pdf</span>
                <span className="file-type-tag">Single file</span>
                <span className="file-type-tag">No upload</span>
              </div>
              <input 
                type="file" 
                id="splitter-file-upload" 
                accept=".pdf"
                style={{ display: 'none' }} 
                onChange={onDrop}
              />
            </div>
          ) : (
            <div className="split-workspace">
              <div className="split-file-info">
                <FileText size={18} />
                <div>
                  <strong>{splitFile.name}</strong>
                  <span className="split-page-count">{splitFile.pageCount} pages</span>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={handleReset} style={{marginLeft: 'auto'}}>
                  Change File
                </button>
              </div>

              <div className="split-ranges">
                <h4>Extract Page Ranges</h4>
                {splitRanges.map((range, idx) => (
                  <div key={idx} className="split-range-row">
                    <span className="split-range-label">Range {idx + 1}:</span>
                    <label>
                      From page
                      <input 
                        type="number" 
                        min={1} 
                        max={splitFile.pageCount}
                        value={range.from}
                        onChange={(e) => updateSplitRange(idx, 'from', e.target.value)}
                        className="split-input"
                      />
                    </label>
                    <label>
                      to page
                      <input 
                        type="number" 
                        min={range.from} 
                        max={splitFile.pageCount}
                        value={range.to}
                        onChange={(e) => updateSplitRange(idx, 'to', e.target.value)}
                        className="split-input"
                      />
                    </label>
                    {splitRanges.length > 1 && (
                      <button className="btn-icon danger" onClick={() => removeSplitRange(idx)}>
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
                <button className="btn btn-ghost btn-sm" onClick={addSplitRange}>
                  + Add Another Range
                </button>
              </div>

              <button 
                className="btn btn-primary merger-action-btn"
                onClick={handleSplit}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <><div className="spinner-sm"></div> Splitting...</>
                ) : (
                  <><Scissors size={16} /> Split & Download {splitRanges.length} File{splitRanges.length !== 1 ? 's' : ''}</>
                )}
              </button>
            </div>
          )}
        </>
      )}

      {/* Privacy reminder */}
      <div className="merger-privacy">
        <Lock size={12} />
        <span>Your PDFs are processed 100% locally in your browser. Nothing is uploaded.</span>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <UpsellModal 
        isOpen={!!upsellFeature} 
        onClose={() => setUpsellFeature(null)} 
        featureName={upsellFeature} 
      />

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
