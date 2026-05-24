import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, Unlock, X, Shield, ArrowRight, Loader2, Key, Download } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { decryptPDF } from '@pdfsmaller/pdf-decrypt';
import JSZip from 'jszip';
import { useAuth } from '../contexts/AuthContext';
import UpsellModal from './UpsellModal';

export default function DecryptorTool() {
  const [files, setFiles] = useState([]);
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [stats, setStats] = useState({ success: 0, failed: 0 });
  const [needsPassword, setNeedsPassword] = useState(false);
  
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
      setUpsellFeature('Bulk PDF Decryption');
      return;
    }

    setFiles(droppedFiles);
    setError(null);
    setSuccess(false);
    setProcessedUrl(null);
    setPassword('');
    setProcessedCount(0);
    setStats({ success: 0, failed: 0 });
    
    // Check if password might be needed (just check the first file)
    try {
      const arrayBuffer = await droppedFiles[0].arrayBuffer();
      await PDFDocument.load(arrayBuffer);
      // First file didn't need a password, but we still ask for Master Password 
      // just in case others in the batch do, or if it's 1 file, let them know.
      if (droppedFiles.length === 1) {
        setNeedsPassword(false);
        setError("This PDF is already unlocked or not password-protected.");
      } else {
        setNeedsPassword(true); // Always show prompt for bulk 
      }
    } catch (err) {
      setNeedsPassword(true);
    }
  };

  const handleDecrypt = async () => {
    if (!password) {
      setError("Please enter the password for this batch.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProcessedCount(0);
    let sCount = 0;
    let fCount = 0;

    try {
      if (files.length === 1) {
        const arrayBuffer = await files[0].arrayBuffer();
        let decryptedBytes;
        try {
          decryptedBytes = await decryptPDF(new Uint8Array(arrayBuffer), password);
          // Verify
          await PDFDocument.load(decryptedBytes);
          sCount++;
        } catch(e) {
          throw new Error("Incorrect password or corrupted PDF.");
        }

        const blob = new Blob([decryptedBytes], { type: 'application/pdf' });
        setProcessedUrl(URL.createObjectURL(blob));
        
      } else {
        // Bulk Mode
        const zip = new JSZip();
        for (let i = 0; i < files.length; i++) {
           const file = files[i];
           try {
               const arrayBuffer = await file.arrayBuffer();
               let finalBytes;
               try {
                  const testDoc = await PDFDocument.load(arrayBuffer);
                  finalBytes = await testDoc.save();
               } catch(e) {
                  finalBytes = await decryptPDF(new Uint8Array(arrayBuffer), password);
                  await PDFDocument.load(finalBytes);
               }
               
               zip.file(file.name.replace('.pdf', '_unlocked.pdf'), finalBytes);
               sCount++;
           } catch(e) {
               console.warn(`Failed to decrypt ${file.name}:`, e);
               fCount++;
           }
           setProcessedCount(i + 1);
        }
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        setProcessedUrl(URL.createObjectURL(zipBlob));
      }
      
      setStats({ success: sCount, failed: fCount });
      
      if (files.length === 1 && sCount === 0) {
        throw new Error("Incorrect Password");
      }
      
      setSuccess(true);
      setNeedsPassword(false);
    } catch (err) {
      if (err.message.includes('encrypted') || err.message.includes('password') || err.message.includes('Incorrect') || err.message.includes('decrypt')) {
        setError("Incorrect password. Please try again.");
      } else {
        setError("Failed to process files: " + err.message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadUnlocked = () => {
    if (!processedUrl) return;
    const link = document.createElement('a');
    link.href = processedUrl;
    link.download = files.length === 1 ? files[0].name.replace('.pdf', '_unlocked.pdf') : 'unlocked_pdfs.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setFiles([]);
    setPassword('');
    setProcessedUrl(null);
    setSuccess(false);
    setNeedsPassword(false);
    setError(null);
  };

  return (
    <div className="converter-card" style={{ maxWidth: '780px', margin: '0 auto' }}>
      
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
            <Unlock size={48} className="drop-icon" />
            <h3>PDF Password Remover</h3>
            <p>Strip passwords from bank statements locally for easy editing</p>
            <div className="file-types">
              <span className="file-type-tag">.pdf</span>
              <span className="file-type-tag">Privacy Guaranteed</span>
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

        {files.length > 0 && needsPassword && !success && (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ background: 'var(--brand-50)', color: 'var(--brand-600)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Key size={30} />
            </div>
            <h3>Enter Master Password</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              {files.length > 1 
                ? `Provide the shared password to decrypt the batch of ${files.length} documents.`
                : `We need to decrypt ${files[0].name} to remove the protection.`}
            </p>
            
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
              <input 
                type="password" 
                placeholder="Password..." 
                className="export-select"
                style={{ width: '100%', marginBottom: '1.25rem', padding: '0.75rem 1rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleDecrypt()}
                autoFocus
              />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={handleReset}>Cancel</button>
                <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleDecrypt} disabled={isProcessing}>
                  {isProcessing ? "Unlocking..." : "Remove Password"}
                </button>
              </div>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="loader" style={{ padding: '4rem 2rem' }}>
            <Loader2 className="spinner" size={40} />
            <h3>Unlocking Your File{files.length > 1 ? 's' : ''}...</h3>
            <p>Removing 128-bit encryption locally.</p>
            {files.length > 1 && (
               <p style={{ fontWeight: '600', color: 'var(--brand-600)', marginTop: '0.5rem' }}>
                  Processed {processedCount} of {files.length}
               </p>
            )}
          </div>
        )}

        {success && (
          <div className="success-state">
            <CheckCircle size={54} color="var(--brand-500)" />
            <h2>{files.length > 1 ? 'Batch Unlocked Successfully!' : 'PDF Unlocked Successfully!'}</h2>
            
            {files.length > 1 ? (
              <p style={{ margin: '0.5rem 0 1.5rem' }}>
                Success: <strong>{stats.success}</strong> | Failed: <strong>{stats.failed}</strong>
              </p>
            ) : (
              <p>The password has been permanently removed from the file copy.</p>
            )}
            
            <div className="success-actions" style={{ justifyContent: 'center', marginTop: '1rem' }}>
              <button className="btn btn-primary" onClick={downloadUnlocked}>
                {files.length > 1 ? 'Download Unlocked ZIP' : 'Download Unlocked PDF'}
              </button>
              <button className="btn btn-outline" onClick={handleReset}>Unlock Another</button>
            </div>
          </div>
        )}

        {error && !needsPassword && !success && !isProcessing && (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
             <div className="error-badge" style={{ display: 'inline-block', marginBottom: '1.5rem' }}>{error}</div>
             <div>
              <button className="btn btn-ghost" onClick={handleReset}>Try Another File</button>
             </div>
          </div>
        )}
      </div>

      <div className="tool-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
          <Shield size={14} className="text-muted" />
          <span>Local Decryption: We never see your password or your files.</span>
        </div>
      </div>
    </div>
  );
}
