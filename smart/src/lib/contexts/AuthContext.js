'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [supabase, setSupabase] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('[AuthContext] Initializing...');
        
        // Create browser client - this handles cookie reading via @supabase/ssr
        const client = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );
        
        setSupabase(client);
        
        // Set up auth state listener FIRST - this will catch any session changes
        const {
          data: { subscription },
        } = client.auth.onAuthStateChange((_event, session) => {
          console.log('[AuthContext] Auth state changed:', { 
            event: _event, 
            hasSession: !!session,
            userEmail: session?.user?.email || 'none'
          });
          setSession(session);
          setUser(session?.user || null);
          setLoading(false);
        });

        // Then fetch initial session - this reads from cookies set by server
        console.log('[AuthContext] Fetching initial session from cookies...');
        const {
          data: { session: initialSession },
          error: sessionError,
        } = await client.auth.getSession();
        
        if (sessionError) {
          console.error('[AuthContext] Error fetching session:', sessionError);
        }
        
        console.log('[AuthContext] Initial session result:', { 
          hasSession: !!initialSession,
          userEmail: initialSession?.user?.email || 'none'
        });
        
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user || null);
          console.log('[AuthContext] ✓ Session restored from cookies');
        } else {
          console.log('[AuthContext] No session found in cookies');
        }
        
        setLoading(false);

        return () => subscription?.unsubscribe();
      } catch (error) {
        console.error('[AuthContext] Error initializing auth:', error);
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
