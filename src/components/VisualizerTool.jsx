import React, { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area 
} from 'recharts';
import { 
  BarChart3, PieChart as PieIcon, TrendingUp, TrendingDown, 
  Wallet, Shield, Loader2, FileX, ArrowRight, Download, Eye
} from 'lucide-react';
import { extractTableFromPdf } from '../lib/pdfParser';
import { useAuth } from '../contexts/AuthContext';

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
  const { isPro } = useAuth();
  
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [transactions, setTransactions] = useState([]); // [{date, desc, amount, category}]

  const categorize = (description) => {
    const desc = description.toLowerCase();
    for (const [cat, keywords] of Object.entries(CATEGORIES)) {
      if (keywords.some(kw => desc.includes(kw))) return cat;
    }
    return 'Other';
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const droppedFile = acceptedFiles[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setIsProcessing(true);
      setError('');
      
      try {
        const tableData = await extractTableFromPdf(droppedFile);
        if (!tableData || tableData.length < 2) {
          throw new Error("No transactions found in this PDF.");
        }

        // Detect columns (Date, Description, Amount)
        // Header looks for keywords
        const headers = tableData[0].map(h => h.toLowerCase());
        const dateIdx = headers.findIndex(h => h.includes('date'));
        const descIdx = headers.findIndex(h => h.includes('desc') || h.includes('detail') || h.includes('transaction'));
        const amtIdx = headers.findIndex(h => h.includes('amount') || h.includes('value'));
        
        // Fallback to 0, 1, last if not found
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
            category: categorize(description)
          };
        }).filter(t => t.description !== 'Unknown');

        setTransactions(parsed);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to process PDF.");
        setFile(null);
      } finally {
        setIsProcessing(false);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
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
    setFile(null);
    setTransactions([]);
    setError('');
  };

  return (
    <div className="visualizer-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* HEADER SECTION */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ 
          width: '64px', height: '64px', background: 'var(--brand-50)', 
          color: 'var(--brand-600)', borderRadius: '18px', display: 'flex', 
          alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
          boxShadow: '0 4px 12px rgba(var(--brand-rgb), 0.1)'
        }}>
          <BarChart3 size={32} />
        </div>
        <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--text-heading)', marginBottom: '0.75rem', letterSpacing: '-0.03em' }}>
          Statement Intelligence Dashboard
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Visualize your spending habits instantly. Our AI-assisted local engine categorizes your transactions without uploading a byte.
        </p>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '1rem', borderRadius: '100px', marginBottom: '2rem', fontSize: '0.9rem', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {/* STAGE 1: DROPZONE */}
      {!file && !isProcessing && (
        <div 
          {...getRootProps()} 
          className={`dropzone ${isDragActive ? 'active' : ''}`}
          style={{ 
            padding: '5rem 2rem', 
            borderRadius: '32px',
            border: `2px dashed ${isDragActive ? 'var(--brand-400)' : '#cbd5e1'}`,
            background: isDragActive ? 'var(--brand-50)' : 'white',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <input {...getInputProps()} />
          <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 2rem' }}>
             <PieIcon size={80} style={{ color: '#e2e8f0' }} />
             <TrendingUp size={32} style={{ position: 'absolute', bottom: '0', right: '0', color: 'var(--brand-500)' }} />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Drop your statement PDF</h3>
          <p style={{ color: '#64748b' }}>Analyze spending, categories, and trends immediately.</p>
          
          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '0.4rem 0.8rem', borderRadius: '100px', fontWeight: '600', color: '#475569' }}>ANALYZE SPENDING</span>
            <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '0.4rem 0.8rem', borderRadius: '100px', fontWeight: '600', color: '#475569' }}>CATEGORIZE VENDORS</span>
            <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '0.4rem 0.8rem', borderRadius: '100px', fontWeight: '600', color: '#475569' }}>100% PRIVATE</span>
          </div>
        </div>
      )}

      {/* PROCESSING STATE */}
      {isProcessing && (
        <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'white', borderRadius: '32px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}>
          <Loader2 className="spinner" size={48} color="var(--brand-500)" style={{ margin: '0 auto 2rem' }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Running Local Intelligence Engine...</h3>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>We are categorizing transactions and generating analytics — all in your browser memory.</p>
        </div>
      )}

      {/* STAGE 2: DASHBOARD */}
      {file && !isProcessing && stats && (
        <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
          
          {/* TOP BAR / INFO */}
          <div style={{ gridColumn: 'span 12', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '1.25rem 2rem', borderRadius: '20px', border: '1px solid var(--border)', marginBottom: '1rem' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.5rem', background: '#f1f5f9', borderRadius: '10px' }}>
                    <Wallet size={20} color="#64748b" />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '1rem' }}>{file.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{transactions.length} Transactions Analyzed</div>
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
                          <div style={{ fontSize: '0.75rem', color: COLORS[t.category] || '#94a3b8', fontWeight: '700' }}>{t.category.toUpperCase()}</div>
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
