import React, { useState, useRef } from 'react';
import { UploadCloud, Lock, Download, Shield, Key, AlertCircle, Loader2, CheckCircle, FileText, X } from 'lucide-react';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt-lite';
import JSZip from 'jszip';
import { useAuth } from '../contexts/AuthContext';
import UpsellModal from './UpsellModal';

export default function ProtectorTool() {
  const [files, setFiles] = useState([]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [processedCount, setProcessedCount] = useState(0);
  
  // Custom Gate Implementation
  const { isPro: realIsPro } = useAuth();
  const [devPro] = useState(sessionStorage.getItem('devPro') === 'true');
  const isPro = realIsPro || devPro;
  const [upsellFeature, setUpsellFeature] = useState(null);
  
  const fileInputRef = useRef(null);

  const onDrop = async (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer ? e.dataTransfer.files : e.target.files)
      .filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    
    if (droppedFiles.length === 0) {
      setError("Please upload valid PDF files.");
      return;
    }
    
    // Bulk Auth Gate
    if (droppedFiles.length > 1 && !isPro) {
      setUpsellFeature('Bulk PDF Protection');
      return;
    }

    setFiles(droppedFiles);
    setError(null);
    setSuccess(false);
    setProcessedUrl(null);
    setPassword('');
    setConfirmPassword('');
    setProcessedCount(0);
  };

  const handleProtect = async () => {
    if (!password) {
      setError("Please enter a password to protect the file(s).");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    if (password.length < 4) {
      setError("Please choose a stronger password (at least 4 characters).");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProcessedCount(0);

    try {
      if (files.length === 1) {
        const arrayBuffer = await files[0].arrayBuffer();
        const encryptedBytes = await encryptPDF(new Uint8Array(arrayBuffer), password);
        const blob = new Blob([encryptedBytes], { type: 'application/pdf' });
        setProcessedUrl(URL.createObjectURL(blob));
        setProcessedCount(1);
      } else {
        // Bulk Mode
        const zip = new JSZip();
        for (let i = 0; i < files.length; i++) {
           const file = files[i];
           const arrayBuffer = await file.arrayBuffer();
           const encryptedBytes = await encryptPDF(new Uint8Array(arrayBuffer), password);
           zip.file(file.name.replace('.pdf', '_protected.pdf'), encryptedBytes);
           setProcessedCount(i + 1);
        }
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        setProcessedUrl(URL.createObjectURL(zipBlob));
      }
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Failed to encrypt PDFs: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadProtected = () => {
    if (!processedUrl) return;
    const link = document.createElement('a');
    link.href = processedUrl;
    link.download = files.length === 1 ? files[0].name.replace('.pdf', '_protected.pdf') : 'protected_pdfs.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setFiles([]);
    setPassword('');
    setConfirmPassword('');
    setProcessedUrl(null);
    setSuccess(false);
    setError(null);
  };

  return (
    <div className="converter-card" style={{ maxWidth: '780px', margin: '0 auto' }}>
      
      {upsellFeature && <UpsellModal featureName={upsellFeature} onClose={() => setUpsellFeature(null)} />}

      {files.length === 0 && !success && (
        <div 
          className="dropzone"
          onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('active'); }}
          onDragLeave={(e) => e.currentTarget.classList.remove('active')}
          onDrop={onDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <UploadCloud size={48} className="drop-icon" />
          <h3>Password-Protect Your Statement</h3>
          <p>Encrypt any PDF locally before sharing or archiving</p>
          <div className="file-types">
            <span className="file-type-tag">.pdf</span>
            <span className="file-type-tag">Pure Browser Crypto</span>
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

      {files.length > 0 && !success && !isProcessing && (
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <div style={{ textAlign: 'left' }}>
              <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-heading)' }}>{files.length} Document{files.length > 1 ? 's' : ''} Ready</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Apply a Master Password to lock all files</p>
            </div>
            <button className="btn btn-ghost" onClick={handleReset} style={{ fontSize: '0.85rem' }}>Clear All</button>
          </div>

          <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>Master Password</label>
              <input 
                type="password"
                placeholder="Type password..."
                className="export-select"
                style={{ width: '100%', padding: '0.75rem 1rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>Confirm Password</label>
              <input 
                type="password"
                placeholder="Confirm password..."
                className="export-select"
                style={{ width: '100%', padding: '0.75rem 1rem' }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleProtect()}
              />
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleProtect}>
              Encrypt {files.length > 1 ? `All ${files.length} PDFs` : 'PDF'} <Lock size={16} style={{ marginLeft: '0.5rem' }}/>
            </button>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="loader" style={{ padding: '4rem 2rem' }}>
          <Loader2 className="spinner" size={40} />
          <h3>Securing Your File{files.length > 1 ? 's' : ''}...</h3>
          <p>Processing with 128-bit encryption locally.</p>
          {files.length > 1 && (
             <p style={{ fontWeight: '600', color: 'var(--brand-600)', marginTop: '0.5rem' }}>
                Completed {processedCount} of {files.length}
             </p>
          )}
        </div>
      )}

      {success && (
        <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{ background: '#ecfdf5', color: '#059669', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle size={30} />
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>Encryption Complete</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Your file{files.length > 1 ? 's are' : ' is'} now password-protected.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-ghost" onClick={handleReset}>Protect Another</button>
            <button className="btn btn-primary" onClick={downloadProtected}>
              {files.length > 1 ? 'Download Secure ZIP' : 'Download Protected PDF'}
            </button>
          </div>
        </div>
      )}

      {error && !isProcessing && (
        <div className="error-badge" style={{ margin: '1rem' }}>
          {error}
        </div>
      )}

      <div className="tool-footer" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.81rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={14} /> 
          <span>Vault-Grade Security: Encryption keys never leave your browser.</span>
        </div>
      </div>
    </div>
  );
}
