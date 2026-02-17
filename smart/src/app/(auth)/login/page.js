'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { GoogleIcon, BookmarkIcon } from '@/components/icons';
import { useToast } from '@/lib/contexts/ToastContext';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [supabase, setSupabase] = useState(null);
  const { showError } = useToast();

  useEffect(() => {
    try {
      const client = createClient();
      setSupabase(client);
    } catch (err) {
      console.error('Error initializing Supabase:', err);
    }
  }, []);

  const handleGoogleSignIn = async () => {
    if (!supabase) {
      showError('Supabase client not initialized');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
      });

      if (error) {
        showError(error.message || 'Failed to sign in with Google');
      }
    } catch (err) {
      console.error('Google sign in error:', err);
      showError('Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card className="p-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <BookmarkIcon size={32} className="text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold">Smart Bookmark</h1>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold mb-2">Welcome Back</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Sign in to manage your bookmarks
          </p>
        </div>

        {/* Google Sign In Button */}
        <Button
          onClick={handleGoogleSignIn}
          disabled={loading || !supabase}
          className="w-full flex items-center justify-center gap-3"
          variant="primary"
        >
          <GoogleIcon size={20} />
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </Button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400">
              Features
            </span>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-3 text-sm">
          <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <span className="text-lg">🔒</span>
            <span>Secure Google OAuth authentication</span>
          </li>
          <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <span className="text-lg">✨</span>
            <span>Real-time bookmark sync across devices</span>
          </li>
          <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <span className="text-lg">🌙</span>
            <span>Dark mode support</span>
          </li>
        </ul>

        {/* Footer */}
        <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-8">
          Your bookmarks are stored securely and visible only to you.
        </p>
      </Card>
    </div>
  );
}
