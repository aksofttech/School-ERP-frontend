/**
 * Role-based Access Guard
 * Protects routes based on user role
 * Redirects to appropriate dashboard if role doesn't match
 * Uses localStorage for user data
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { getDashboardRoute, isValidRole, hasRole, UserRole } from '@/utils/role-config';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[]; // Use centralized role types
  redirectTo?: string;
}

export default function RoleGuard({ children, allowedRoles, redirectTo }: RoleGuardProps) {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

  const isAuthorized = !loading && isAuthenticated() && user && hasRole(user.role, allowedRoles);

  console.log('[RoleGuard] Rendering:', { loading, isAuthorized, userRole: user?.role, allowedRoles });

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated() || !user) {
      router.push('/auth/login');
      return;
    }

    const userRole = user.role;

    // Validate role
    if (!isValidRole(userRole)) {
      router.push('/auth/login');
      return;
    }

    // Check if user has required role
    const hasRequiredRole = hasRole(userRole, allowedRoles);
    if (!hasRequiredRole) {
      // Redirect to user's dashboard if role doesn't match
      const dashboard = getDashboardRoute(userRole) || '/auth/login';
      if (router.pathname !== dashboard) {
        router.push(redirectTo || dashboard);
      }
    }
  }, [loading, user, isAuthenticated, router, redirectTo, allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
