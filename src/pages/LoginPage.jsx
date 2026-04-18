import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import SeoHead from '../components/SeoHead';
import { Mail, Lock, ArrowRight, Loader } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SeoHead 
        title={`${isLogin ? 'Log In' : 'Sign Up'} | Bank Statement Converter`}
        description="Log in to access your pro features, bulk processing, and QuickBooks exports."
      />

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
            <p>{isLogin ? 'Log in to access your Pro features.' : 'Sign up to upgrade to Pro.'}</p>
          </div>

          {error && <div className="auth-alert error">{error}</div>}
          {message && <div className="auth-alert success">{message}</div>}

          <form onSubmit={handleAuth} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="accountant@firm.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? <Loader className="spin" size={18} /> : (isLogin ? 'Log In' : 'Sign Up')}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="auth-toggle">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="toggle-btn">
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .auth-container {
          min-height: calc(100vh - 72px - 300px);
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--slate-50);
          padding: 4rem 1rem;
        }

        .auth-card {
          background: white;
          width: 100%;
          max-width: 440px;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--border);
          padding: 2.5rem;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-header h2 {
          font-size: 1.75rem;
          color: var(--text-heading);
          margin-bottom: 0.5rem;
        }

        .auth-header p {
          color: var(--slate-500);
          font-size: 0.95rem;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-heading);
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          color: var(--slate-400);
        }

        .input-with-icon input {
          width: 100%;
          border: 1px solid var(--slate-300);
          background: white;
          padding: 0.75rem 1rem 0.75rem 2.75rem;
          border-radius: var(--radius-md);
          font-size: 0.95rem;
          font-family: inherit;
          color: var(--text-heading);
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .input-with-icon input:focus {
          outline: none;
          border-color: var(--brand-500);
          box-shadow: 0 0 0 3px var(--brand-100);
        }

        .auth-submit {
          margin-top: 0.5rem;
          width: 100%;
          justify-content: center;
          padding: 0.85rem;
        }

        .auth-alert {
          padding: 0.85rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
        }

        .auth-alert.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .auth-alert.success {
          background: #f0fdf4;
          color: #15803d;
          border: 1px solid #bbf7d0;
        }

        .auth-toggle {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.9rem;
          color: var(--slate-500);
        }

        .toggle-btn {
          background: none;
          border: none;
          color: var(--brand-600);
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          font-size: inherit;
          padding: 0;
        }

        .toggle-btn:hover {
          text-decoration: underline;
        }
        
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </>
  );
}
