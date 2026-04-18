import React from 'react';
import { X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UpsellModal({ isOpen, onClose, featureName }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgradeClick = () => {
    onClose();
    navigate('/pricing');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="modal-header">
          <div className="pro-badge">PRO FEATURE</div>
          <h2>Unlock {featureName}</h2>
          <p>You've hit a limit on the Free plan. Upgrade to the Pro Accountant plan to instantly unlock this feature.</p>
        </div>

        <div className="modal-body">
          <ul className="modal-features">
            <li><Check size={18} className="text-success" /> <div><strong>Bulk Processing:</strong> Merge 12 months at once.</div></li>
            <li><Check size={18} className="text-success" /> <div><strong>Excel/QBO Export:</strong> Universal accounting import.</div></li>
            <li><Check size={18} className="text-success" /> <div><strong>Unlimited Files:</strong> No monthly caps.</div></li>
            <li><Check size={18} className="text-success" /> <div><strong>Smart Normalization:</strong> Auto-fixes messy dates.</div></li>
          </ul>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Maybe Later</button>
          <button className="btn btn-primary" onClick={handleUpgradeClick}>View Pricing & Upgrade</button>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(17, 24, 39, 0.4);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.2s ease;
        }

        .modal-content {
          background: white;
          border-radius: var(--radius-xl);
          padding: 2rem;
          max-width: 480px;
          width: 90%;
          position: relative;
          box-shadow: var(--shadow-xl);
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: var(--radius-full);
          transition: all 0.2s;
        }

        .modal-close:hover {
          background: #f1f5f9;
          color: var(--text-heading);
        }

        .pro-badge {
          display: inline-block;
          background: #fef3c7;
          color: #d97706;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }

        .modal-header h2 {
          font-size: 1.5rem;
          color: var(--text-heading);
          margin-bottom: 0.5rem;
        }

        .modal-header p {
          color: var(--text-body);
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }

        .modal-body {
          text-align: left;
        }

        .modal-features {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem;
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: var(--radius-md);
          border: 1px solid #e2e8f0;
        }

        .modal-features li {
          display: grid;
          grid-template-columns: 20px 1fr;
          align-items: start;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          font-size: 0.95rem;
          color: var(--text-heading);
          line-height: 1.4;
        }

        .modal-features li:last-child {
          margin-bottom: 0;
        }

        .text-success {
          color: #10b981;
          margin-top: 2px;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
