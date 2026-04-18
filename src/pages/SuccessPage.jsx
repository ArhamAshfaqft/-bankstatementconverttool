import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function SuccessPage() {
  const { user, isPro, checkProStatus } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function handleSuccess() {
      const params = new URLSearchParams(window.location.search);
      const licenseKey = params.get('license_key');
      const freemiusId = params.get('user_id');

      // 1. If we have a license key from the URL redirect, update the profile immediately
      if (licenseKey && user) {
        console.log("Updating profile from URL license key...");
        await supabase
          .from('profiles')
          .update({
            freemius_license_key: licenseKey,
            freemius_id: freemiusId,
            subscription_tier: 'pro'
          })
          .eq('id', user.id);
      }

      // 2. Regardless of URL, check if the database says they are Pro
      console.log("Starting verification polling...");
      let attempts = 0;
      const interval = setInterval(async () => {
        attempts++;
        const upgraded = await checkProStatus();
        if (upgraded) {
          console.log("Upgrade confirmed!");
          setVerifying(false);
          clearInterval(interval);
        } else if (attempts >= 5) {
          // If after 15 seconds we still aren't Pro, stop spinning and 
          // let the user go back, but they might need to logout/in
          setVerifying(false);
          clearInterval(interval);
        }
      }, 3000);

      return () => clearInterval(interval);
    }

    if (user) {
      handleSuccess();
    } else {
      // If no user, maybe it's still loading
      setTimeout(() => {
        if (!user) setVerifying(false);
      }, 5000);
    }
  }, [user, checkProStatus]);

  return (
    <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '500px', textAlign: 'center', padding: '3rem' }}>
        <CheckCircle size={64} style={{ color: 'var(--brand-500)', marginBottom: '1.5rem' }} />
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Welcome to Pro!</h1>
        <p style={{ color: 'var(--text-body)', marginBottom: '2rem', lineHeight: '1.6' }}>
          Thank you for choosing Bank Statement Tools. Your account is being upgraded. 
          This usually takes a few seconds.
        </p>

        {verifying ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--text-muted)' }}>
            <Loader className="spinner" size={18} />
            <span>Verifying subscription...</span>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={() => navigate('/')} style={{ width: '100%' }}>
            Go to My Dashboard <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
