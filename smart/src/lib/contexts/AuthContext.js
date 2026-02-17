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
        
        // Set up auth state listener FIRST
        const {
          data: { subscription },
        } = client.auth.onAuthStateChange((_event, session) => {
          console.log('Auth state changed:', { event: _event, hasSession: !!session });
          setSession(session);
          setUser(session?.user || null);
          setLoading(false);
        });

        // Then fetch initial session
        const {
          data: { session: initialSession },
        } = await client.auth.getSession();
        
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user || null);
        }
        
        setLoading(false);

        return () => subscription?.unsubscribe();
      } catch (error) {
        console.error('Error initializing auth:', error);
        setSession(null);
        setUser(null);
        setLoading(false);
      }
    };

    const cleanup = initializeAuth();
    return () => {
      cleanup?.then((unsub) => unsub?.());
    };
  }, []);


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
