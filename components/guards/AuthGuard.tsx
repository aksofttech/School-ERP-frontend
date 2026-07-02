/**
 * Authentication Guard
 * Protects routes that require authentication
 * Redirects to login if user is not authenticated
 * Uses localStorage for token check
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();

  console.log('[AuthGuard] Rendering:', { loading, authenticated: isAuthenticated(), userEmail: user?.email });

  useEffect(() => {
    // Only redirect if NOT loading and NOT authenticated
    if (!loading && !isAuthenticated()) {
      const currentPath = router.pathname;
      if (currentPath !== '/auth/login') {
        console.log('[AuthGuard] Redirecting to login from:', currentPath);
        router.replace('/auth/login');
      }
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
}
