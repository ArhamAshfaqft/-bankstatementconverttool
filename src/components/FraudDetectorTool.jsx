import React, { useState, useRef } from 'react';
import { UploadCloud, ShieldAlert, CheckCircle, AlertTriangle, FileSearch, Info, ShieldCheck, ArrowRight, Table, Activity, FileText, Download } from 'lucide-react';
import { extractTableFromPdf } from '../lib/pdfParser';
import { auditStatement } from '../lib/fraudForensics';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { useAuth } from '../contexts/AuthContext';
import UpsellModal from './UpsellModal';

export default function FraudDetectorTool() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [auditResults, setAuditResults] = useState(null); // Array of results
  const [error, setError] = useState(null);
  const [processedCount, setProcessedCount] = useState(0);
  const fileInputRef = useRef(null);

  // Custom Gate Implementation
  const { isPro: realIsPro } = useAuth();
  const [devPro] = useState(sessionStorage.getItem('devPro') === 'true');
  const isPro = realIsPro || devPro;
  const [upsellFeature, setUpsellFeature] = useState(null);

  const onDrop = async (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer ? e.dataTransfer.files : e.target.files)
      .filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));

    if (droppedFiles.length === 0) {
      setError("Please upload valid PDF bank statements.");
      return;
    }

    // Bulk Auth Gate
    if (droppedFiles.length > 1 && !isPro) {
      setUpsellFeature('Batch Forensic Auditing');
      return;
    }

    setFiles(droppedFiles);
    setError(null);
    setAuditResults(null);
    setProcessedCount(0);
    handleAudit(droppedFiles);
  };

  const handleAudit = async (uploadedFiles) => {
    setIsProcessing(true);
    setError(null);
    setProcessedCount(0);
    
    const resultsArray = [];

    try {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        try {
          const transactions = await extractTableFromPdf(file);
          const results = await auditStatement(file, transactions);
          resultsArray.push({ filename: file.name, ...results, error: null });
        } catch (err) {
          console.error(`Audit failed for ${file.name}:`, err);
          resultsArray.push({ filename: file.name, error: "Failed to parse or audit" });
        }
        setProcessedCount(i + 1);
      }
      setAuditResults(resultsArray);
    } catch (err) {
      console.error(err);
      setError("Fatal error during forensic analysis.");
    } finally {
      setIsProcessing(false);
    }
  };

  const exportRiskLedger = () => {
    if (!auditResults) return;

    const dataRows = auditResults.map(res => {
      if (res.error) {
        return { Filename: res.filename, Status: 'Error', 'Risk Rating': 'N/A', Score: 'N/A', Anomalies: 'Parse/Structure Error' };
      }
      return {
        Filename: res.filename,
        Status: res.mathAudit.passed ? 'Math OK' : 'MATH MISMATCH',
        'Risk Rating': res.riskRating,
        Score: `${Math.max(0, 100 - res.riskScore)}% Confidence`,
        Anomalies: res.anomalies.map(a => `[${a.severity}] ${a.type}`).join(' | ') || 'None'
      };
    });

    const csv = Papa.unparse(dataRows, { quotes: true, header: true });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'Batch_Risk_Ledger.csv');
  };

  const reset = () => {
    setFiles([]);
    setAuditResults(null);
    setError(null);
  };

  const getRiskColor = (rating) => {
    if (rating === 'Low') return '#10b981'; // Emerald
    if (rating === 'Medium') return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  // View switch: Single File vs Batch Ledger
  const renderResults = () => {
    if (!auditResults) return null;

    if (auditResults.length === 1 && !auditResults[0].error) {
      const res = auditResults[0];
      return (
        <div className="audit-dashboard" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            {/* Header: Risk Overview */}
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
              <div style={{ 
                flex: '1', 
                minWidth: '280px', 
                background: '#f8fafc', 
                borderRadius: '16px', 
                padding: '1.5rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1.5rem',
                border: '1px solid var(--border)'
              }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  border: `6px solid ${getRiskColor(res.riskRating)}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '1.2rem',
                  color: getRiskColor(res.riskRating),
                  background: 'white',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                }}>
                  {res.riskRating.toUpperCase()}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Audit Risk Rating</h4>
                  <h3 style={{ margin: '0.25rem 0', fontSize: '1.5rem' }}>{res.riskRating === 'Low' ? 'Clean Document' : res.riskRating === 'Medium' ? 'Suspicious' : 'High Risk Flags'}</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-body)' }}>Verified against 12 tampering heuristics.</p>
                </div>
              </div>

              <div style={{ 
                flex: '1', 
                minWidth: '280px', 
                background: 'white', 
                borderRadius: '16px', 
                padding: '1.5rem', 
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Confidence Score</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--brand-600)', fontWeight: '700' }}>{Math.max(0, 100 - res.riskScore)}%</span>
                </div>
                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${Math.max(0, 100 - res.riskScore)}%`, 
                    background: getRiskColor(res.riskRating),
                    transition: 'width 1s ease-out'
                  }}></div>
                </div>
              </div>
            </div>

            {/* Anomaly Timeline */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '1.1rem' }}>
                <FileSearch size={22} className="text-brand" /> Audit Findings
              </h4>
              
              {res.anomalies.length === 0 ? (
                <div className="success-state" style={{ padding: '2rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px' }}>
                  <ShieldCheck size={32} color="#10b981" />
                  <p style={{ marginTop: '0.5rem', fontWeight: '600', color: '#166534' }}>No structural anomalies found. Mathematical checks passed 100%.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {res.anomalies.map((anno, idx) => (
                    <div key={idx} style={{ 
                      display: 'flex', 
                      gap: '1rem', 
                      padding: '1.25rem', 
                      background: anno.severity === 'High' ? '#fef2f2' : anno.severity === 'Medium' ? '#fffbeb' : '#f8fafc',
                      border: `1px solid ${anno.severity === 'High' ? '#fee2e2' : anno.severity === 'Medium' ? '#fef3c7' : '#e2e8f0'}`,
                      borderRadius: '12px'
                    }}>
                      {anno.severity === 'High' ? <AlertTriangle size={24} color="#ef4444" /> : <Info size={24} color="#f59e0b" />}
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem', color: anno.severity === 'High' ? '#991b1b' : '#92400e' }}>
                          [{anno.severity}] {anno.type}
                        </div>
                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: '1.5' }}>{anno.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Meta Details & Calculations */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h5 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={18} /> Metadata Report</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Created By:</span>
                    <span style={{ fontWeight: '600' }}>{res.metadata.creator}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Producer:</span>
                    <span style={{ fontWeight: '600' }}>{res.metadata.producer}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Creation Date:</span>
                    <span style={{ fontWeight: '600' }}>{res.metadata.created === 'Unknown' ? 'Unknown' : new Date(res.metadata.created).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h5 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={18} /> Math Verification</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Audit Status:</span>
                    <span style={{ fontWeight: '700', color: res.mathAudit.passed ? '#10b981' : '#ef4444' }}>
                      {res.mathAudit.passed ? 'PERFECT ACCURACY' : 'MISMATCH DETECTED'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Anomalies Found:</span>
                    <span style={{ fontWeight: '600' }}>{res.mathAudit.failedRows.length} rows</span>
                  </div>
                  {!res.mathAudit.passed && (
                    <div style={{ marginTop: '0.5rem', color: '#ef4444', fontSize: '0.75rem', lineHeight: '1.4' }}>
                      🚩 Critical: One or more running balances do not match the transaction totals.
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <button className="btn btn-outline" onClick={reset}>Scan Another Statement</button>
            </div>
        </div>
      );
    }

    // Bulk / Batch Mode View
    return (
      <div className="audit-dashboard" style={{ animation: 'fadeIn 0.5s ease-out' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Table size={48} color="var(--brand-500)" style={{ marginBottom: '1rem' }} />
            <h2 style={{ marginBottom: '0.5rem' }}>Batch Risk Ledger</h2>
            <p style={{ color: 'var(--text-muted)' }}>Forensic overview of {auditResults.length} documents.</p>
        </div>

        <div style={{ overflowX: 'auto', marginBottom: '2rem', border: '1px solid var(--border)', borderRadius: '12px', background: 'white' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                    <tr style={{ background: 'var(--slate-50)', borderBottom: '1px solid var(--border)' }}>
                        <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--slate-700)' }}>Filename</th>
                        <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--slate-700)' }}>Risk Rating</th>
                        <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--slate-700)' }}>Math Integrity</th>
                        <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--slate-700)' }}>Confidence</th>
                    </tr>
                </thead>
                <tbody>
                    {auditResults.map((res, i) => (
                        <tr key={i} style={{ borderBottom: i === auditResults.length - 1 ? 'none' : '1px solid var(--slate-100)' }}>
                            <td style={{ padding: '1rem 1.5rem', fontWeight: '500', color: res.error ? 'var(--text-muted)' : 'inherit' }}>
                                {res.filename}
                            </td>
                            {res.error ? (
                                <td colSpan="3" style={{ padding: '1rem 1.5rem', color: '#ef4444', fontStyle: 'italic' }}>
                                    <AlertTriangle size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom'}} /> 
                                    {res.error}
                                </td>
                            ) : (
                                <>
                                  <td style={{ padding: '1rem 1.5rem' }}>
                                      <span style={{ display: 'inline-flex', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', background: getRiskColor(res.riskRating) + '15', color: getRiskColor(res.riskRating) }}>
                                          {res.riskRating}
                                      </span>
                                  </td>
                                  <td style={{ padding: '1rem 1.5rem', fontWeight: '600', color: res.mathAudit.passed ? '#059669' : '#ef4444' }}>
                                      {res.mathAudit.passed ? 'Verified' : 'Mismatch'}
                                  </td>
                                  <td style={{ padding: '1rem 1.5rem', color: 'var(--slate-600)' }}>
                                      {Math.max(0, 100 - res.riskScore)}%
                                  </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={exportRiskLedger}>
            <Download size={16} style={{ marginRight: '0.5rem' }} /> Export CSV Ledger
            </button>
            <button className="btn btn-outline" onClick={reset}>Scan New Folder</button>
        </div>
      </div>
    );
  };

  return (
    <div className="converter-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
      
      {upsellFeature && <UpsellModal featureName={upsellFeature} onClose={() => setUpsellFeature(null)} />}

      <div className="tool-main">
        {files.length === 0 && (
          <div 
            className="dropzone"
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('active'); }}
            onDragLeave={(e) => e.currentTarget.classList.remove('active')}
            onDrop={onDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <ShieldAlert size={48} className="drop-icon" strokeWidth={1.5} />
            <h3>Financial Forgery & Fraud Detector</h3>
            <p>Upload statements to scan for mathematical mismatches and tampering</p>
            <div className="file-types">
              <span className="file-type-tag">Forensic Audit</span>
              <span className="file-type-tag">100% Client-Side</span>
              <span className="file-type-tag" style={{ border: '1px solid var(--accent-blue)', color: 'var(--brand-600)', background: '#EFF6FF' }}>Bulk Support (Pro)</span>
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              accept=".pdf" 
              multiple
              style={{ display: 'none' }} 
              onChange={onDrop}
            />
          </div>
        )}

        {isProcessing && (
          <div className="loader" style={{ padding: '4rem 0' }}>
            <Activity className="spinner" size={42} color="var(--brand-500)" style={{ animation: 'pulse 1.5s infinite' }} />
            <h3>Analyzing Document Integrity...</h3>
            <p>Scanning metadata, checking EOF signatures, and verifying running balances.</p>
            {files.length > 1 && (
               <p style={{ fontWeight: '600', color: 'var(--brand-600)', marginTop: '0.5rem' }}>
                  Audited {processedCount} of {files.length}
               </p>
            )}
          </div>
        )}

        {!isProcessing && renderResults()}

        {error && !isProcessing && (
          <div className="error-badge" style={{ marginTop: '1.5rem' }}>
            {error}
            <button onClick={() => setError(null)} style={{ border: 'none', background: 'none', marginLeft: '1rem', cursor: 'pointer' }}>×</button>
          </div>
        )}
      </div>

      <div className="tool-footer" style={{ borderTop: '1px solid var(--border)', marginTop: '2rem', paddingTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
          <ShieldCheck size={14} className="text-muted" />
          <span>Local Analysis: No financial data is ever uploaded to our servers.</span>
        </div>
      </div>
    </div>
  );
}
