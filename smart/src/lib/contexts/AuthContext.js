'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [supabase, setSupabase] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const client = createClient();
        setSupabase(client);
        
        const {
          data: { session },
        } = await client.auth.getSession();
        setSession(session);
        setUser(session?.user || null);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (!supabase) return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ session, user, loading, supabase }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Return a default context for SSR/build time
    return {
      session: null,
      user: null,
      loading: true,
      supabase: null,
    };
  }
  return context;
};
