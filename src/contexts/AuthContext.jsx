import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if the user is a Pro subscriber
  const isPro = profile?.subscription_tier === 'pro';

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // 2. Global URL Parameter listener (Detect Upgrade anywhere)
    const params = new URLSearchParams(window.location.search);
    const licenseKey = params.get('license_key');
    const freemiusId = params.get('user_id');

    if (licenseKey) {
      console.log("🛠️ Detected License Key in URL. Triggering global upgrade...");
      // Wrap in a function that waits for the user to be available
      const triggerUpgrade = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
           await supabase
            .from('profiles')
            .update({
              freemius_license_key: licenseKey,
              freemius_id: freemiusId,
              subscription_tier: 'pro'
            })
            .eq('id', session.user.id);
          
          await fetchProfile(session.user.id);
          console.log("✅ Global upgrade successful!");
        }
      };
      triggerUpgrade();
    }

    // 3. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }
      if (data) {
        setProfile(data);
      }
    } catch (err) {
      console.error('Error in fetchProfile:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkProStatus = async () => {
    if (!user) return false;
    
    // Explicitly fetch and wait for the latest data from Supabase
    const { data, error } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();
      
    if (data) {
      setProfile(prev => ({ ...prev, ...data }));
      return data.subscription_tier === 'pro';
    }
    return false;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, isPro, loading, checkProStatus, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
