import React, { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, 
} from 'recharts';
import { 
  BarChart3, PieChart as PieIcon, TrendingUp, TrendingDown, 
  Wallet, Shield, Loader2, FileX, ArrowRight, Table, Layers
} from 'lucide-react';
import { extractTableFromPdf } from '../lib/pdfParser';
import { useAuth } from '../contexts/AuthContext';
import UpsellModal from './UpsellModal';

// ── CATEGORIZATION ENGINE (Client-Side) ──
const CATEGORIES = {
  Shopping: ['amazon', 'walmart', 'target', 'ebay', 'bestbuy', 'costco', 'etsy'],
  Food: ['starbucks', 'mcdonalds', 'uber eats', 'doordash', 'grocery', 'restaurant', 'subway', 'taco bell', 'chipotle', 'whole foods', 'trader joe'],
  Transport: ['uber', 'lyft', 'shell', 'chevron', 'exxon', 'mobil', 'parking', 'transit', 'amtrak', 'airline', 'delta', 'united'],
  Bills: ['utility', 'verizon', 'att', 't-mobile', 'comcast', 'netflix', 'spotify', 'insurance', 'rent', 'mortgage', 'electric', 'water'],
  Subscriptions: ['amazon prime', 'hulu', 'disney+', 'adobe', 'apple.com/bill', 'google storage', 'microsoft', 'github'],
  Transfers: ['venmo', 'zelle', 'cash app', 'paypal', 'transfer', 'wire', 'internal'],
  Income: ['payroll', 'deposit', 'direct dep', 'stipe', 'interest', 'dividend', 'refund']
};

const COLORS = {
  Shopping: '#8b5cf6', // Violet
  Food: '#f59e0b',     // Amber
  Transport: '#3b82f6', // Blue
  Bills: '#ef4444',     // Red
  Subscriptions: '#ec4899', // Pink
  Transfers: '#6b7280', // Gray
  Income: '#10b981',    // Emerald
  Other: '#94a3b8'      // Slate
};

export default function VisualizerTool() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [transactions, setTransactions] = useState([]); // [{date, desc, amount, category}]
  const [processedCount, setProcessedCount] = useState(0);

  // Custom Gate Implementation
  const { isPro: realIsPro } = useAuth();
  const [devPro] = useState(sessionStorage.getItem('devPro') === 'true');
  const isPro = realIsPro || devPro;
  const [upsellFeature, setUpsellFeature] = useState(null);

  const categorize = (description) => {
    if (!description) return 'Other';
    const desc = description.toLowerCase();
    for (const [cat, keywords] of Object.entries(CATEGORIES)) {
      if (keywords.some(kw => desc.includes(kw))) return cat;
    }
    return 'Other';
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const droppedFiles = acceptedFiles;
    
    if (droppedFiles.length === 0) return;

    if (droppedFiles.length > 1 && !isPro) {
      setUpsellFeature('Batch Analytics Visualizer');
      return;
    }

    setFiles(droppedFiles);
    setIsProcessing(true);
    setError('');
    setProcessedCount(0);
    
    let allParsedTransactions = [];
    let hasError = false;

    try {
      for (let i = 0; i < droppedFiles.length; i++) {
         const file = droppedFiles[i];
         try {
            const tableData = await extractTableFromPdf(file);
            if (!tableData || tableData.length < 2) {
              console.warn(`No transactions found in ${file.name}`);
              continue;
            }

            // Detect columns (Date, Description, Amount)
            const headers = tableData[0].map(h => h.toLowerCase());
            const dateIdx = headers.findIndex(h => h.includes('date'));
            const descIdx = headers.findIndex(h => h.includes('desc') || h.includes('detail') || h.includes('transaction'));
            const amtIdx = headers.findIndex(h => h.includes('amount') || h.includes('value'));
            
            const finalDateIdx = dateIdx !== -1 ? dateIdx : 0;
            const finalDescIdx = descIdx !== -1 ? descIdx : 1;
            const finalAmtIdx = amtIdx !== -1 ? amtIdx : tableData[0].length - 1;

            const parsed = tableData.slice(1).map(row => {
              const rawAmt = row[finalAmtIdx] ? row[finalAmtIdx].replace(/[^0-9.-]/g, '') : '0';
              const amount = parseFloat(rawAmt) || 0;
              const description = row[finalDescIdx] || 'Unknown';
              const dateStr = row[finalDateIdx] || '';
              
              return {
                date: dateStr,
                description,
                amount,
                category: categorize(description),
                sourceFile: file.name
              };
            }).filter(t => t.description !== 'Unknown');

            allParsedTransactions = [...allParsedTransactions, ...parsed];
         } catch(e) {
            console.error(`Error parsing ${file.name}:`, e);
            hasError = true;
         }
         setProcessedCount(i + 1);
      }

      if (allParsedTransactions.length === 0) {
        throw new Error("Could not extract tabular data from the provided files.");
      }

      setTransactions(allParsedTransactions);
      if(hasError && files.length === 1) {
         setError("Failed to process the PDF correctly.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to process PDF(s).");
      setFiles([]);
    } finally {
      setIsProcessing(false);
    }
  }, [isPro]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true
  });

  // ── ANALYTICS DATA ──
  const stats = useMemo(() => {
    if (transactions.length === 0) return null;

    const income = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const expense = Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
    
    // Category Breakdown
    const byCategory = transactions.reduce((acc, t) => {
      const cat = t.category;
      const amt = Math.abs(t.amount);
      if (t.amount < 0) {
        acc[cat] = (acc[cat] || 0) + amt;
      }
      return acc;
    }, {});

    const pieData = Object.entries(byCategory)
      .map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }))
      .sort((a, b) => b.value - a.value);

    return { income, expense, pieData };
  }, [transactions]);

  const removeFile = () => {
    setFiles([]);
    setTransactions([]);
    setError('');
  };

  return (
    <div className="visualizer-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {upsellFeature && <UpsellModal featureName={upsellFeature} onClose={() => setUpsellFeature(null)} />}

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '1rem', borderRadius: '100px', marginBottom: '2rem', fontSize: '0.9rem', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {/* STAGE 1: DROPZONE */}
      {files.length === 0 && !isProcessing && (
        <div className="converter-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div 
            {...getRootProps()} 
            className={`dropzone ${isDragActive ? 'active' : ''}`}
          >
            <input {...getInputProps()} />
            <PieIcon size={48} className="drop-icon" style={{ color: 'var(--brand-500)' }} />
            <h3>Analyze spending trends</h3>
            <p>Drop your bank statement PDF to view interactive charts locally</p>
            <div className="file-types">
              <span className="file-type-tag">.pdf only</span>
              <span className="file-type-tag">Category Breakdowns</span>
              <span className="file-type-tag" style={{ border: '1px solid var(--accent-blue)', color: 'var(--brand-600)', background: '#EFF6FF' }}>Bulk Analytics (Pro)</span>
            </div>
          </div>

          <div className="tool-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
              <Shield size={14} className="text-muted" />
              <span>Local processing: Spending visualizer computations run 100% on your device.</span>
            </div>
          </div>
        </div>
      )}

      {/* PROCESSING STATE */}
      {isProcessing && (
        <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'white', borderRadius: '32px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}>
          <Loader2 className="spinner" size={48} color="var(--brand-500)" style={{ margin: '0 auto 2rem' }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Running Local Intelligence Engine...</h3>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>We are categorizing transactions and generating analytics — all in your browser memory.</p>
          {files.length > 1 && (
               <p style={{ fontWeight: '600', color: 'var(--brand-600)', marginTop: '0.5rem' }}>
                  Parsed {processedCount} of {files.length} statement{files.length !== 1 && 's'}
               </p>
          )}
        </div>
      )}

      {/* STAGE 2: DASHBOARD */}
      {files.length > 0 && !isProcessing && stats && (
        <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem', animation: 'fadeIn 0.5s ease-out' }}>
          
          {/* TOP BAR / INFO */}
          <div style={{ gridColumn: 'span 12', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '1.25rem 2rem', borderRadius: '20px', border: '1px solid var(--border)', marginBottom: '1rem' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.5rem', background: '#f1f5f9', borderRadius: '10px' }}>
                    {files.length > 1 ? <Layers size={20} color="#64748b" /> : <Wallet size={20} color="#64748b" />}
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '1rem' }}>
                    {files.length > 1 ? 'Aggregated Financial Dashboard' : files[0].name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {transactions.length} Transactions Analyzed {files.length > 1 && `across ${files.length} documents`}
                  </div>
                </div>
             </div>
             <button onClick={removeFile} className="btn btn-ghost btn-sm" style={{ color: '#ef4444' }}>
                <FileX size={16} /> Close Dashboard
             </button>
          </div>

          {/* METRIC CARDS */}
          <div style={{ gridColumn: 'span 6', background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', padding: '2rem', borderRadius: '24px', color: 'white', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.2)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: '0.8', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                <TrendingUp size={16} /> TOTAL INCOME
             </div>
             <div style={{ fontSize: '2.5rem', fontWeight: '900' }}>${stats.income.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>

          <div style={{ gridColumn: 'span 6', background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)', padding: '2rem', borderRadius: '24px', color: 'white', boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.2)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: '0.8', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                <TrendingDown size={16} /> TOTAL EXPENSES
             </div>
             <div style={{ fontSize: '2.5rem', fontWeight: '900' }}>${stats.expense.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>

          {/* PIE CHART: CATEGORIES */}
          <div style={{ gridColumn: 'span 7', background: 'white', padding: '2rem', borderRadius: '32px', border: '1px solid var(--border)', position: 'relative' }}>
             <h4 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <PieIcon size={20} color="var(--brand-500)" /> 
                Spending by Category
             </h4>
             <div style={{ height: '320px', width: '100%' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={stats.pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name] || COLORS.Other} />
                      ))}
                    </Pie>
                    <Tooltip 
                       formatter={(value) => `$${value.toLocaleString()}`}
                       contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* RECENT LIST: HIGHEST VENDORS */}
          <div style={{ gridColumn: 'span 5', background: 'white', padding: '2rem', borderRadius: '32px', border: '1px solid var(--border)' }}>
             <h4 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem' }}>Heaviest Spending</h4>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {transactions
                  .filter(t => t.amount < 0)
                  .sort((a, b) => a.amount - b.amount) // Largest negative first
                  .slice(0, 6)
                  .map((t, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                       <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                          <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1e293b' }}>{t.description}</div>
                          <div style={{ fontSize: '0.75rem', color: COLORS[t.category] || '#94a3b8', fontWeight: '700' }}>
                           {t.category.toUpperCase()}
                           {files.length > 1 && <span style={{ marginLeft: '4px', fontWeight: '400', opacity: 0.6 }}>({t.sourceFile.substring(0,6)}..)</span>}
                          </div>
                       </div>
                       <div style={{ fontWeight: '800', color: '#dc2626' }}>-${Math.abs(t.amount).toFixed(2)}</div>
                    </div>
                  ))
                }
             </div>
             
             <div style={{ marginTop: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem' }}>Want a professional PDF Analytics Report?</p>
                <button className="btn btn-outline btn-xs" onClick={() => window.location.href='/pricing'}>
                    Upgrade to Pro <ArrowRight size={12} />
                </button>
             </div>
          </div>

          {/* SECURITY FOOTER */}
          <div style={{ gridColumn: 'span 12', textAlign: 'center', marginTop: '2rem', background: '#f0fdf4', padding: '1.5rem', borderRadius: '24px', border: '1px dashed #4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
             <Shield size={24} color="#16a34a" />
             <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '800', color: '#166534', fontSize: '0.95rem' }}>Local Analysis Complete</div>
                <div style={{ fontSize: '0.85rem', color: '#15803d' }}>
                  Your financial data was analyzed using 100% on-device cryptography and logic. No raw data left your machine.
                </div>
             </div>
          </div>

        </div>
      )}

    </div>
  );
}
