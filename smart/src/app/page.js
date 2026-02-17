'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useEffect } from 'react';
import { ROUTES } from '@/lib/constants/routes';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export const dynamic = 'force-dynamic';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log('[Home] Auth state:', { user: !!user, loading, userEmail: user?.email });
    
    if (!loading) {
      if (user) {
        console.log('[Home] User authenticated, redirecting to dashboard');
        router.push(ROUTES.DASHBOARD);
      } else {
        console.log('[Home] No user, redirecting to login');
        router.push(ROUTES.LOGIN);
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" />
    </div>
  );
}

