/**
 * Reusable Admin Page Template
 * Wraps content with AuthGuard, RoleGuard, and AdminLayout
 */

import { ReactNode } from 'react';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import { UserRole } from '@/utils/types';

interface AdminPageTemplateProps {
  children: ReactNode;
}

export default function AdminPageTemplate({ children }: AdminPageTemplateProps) {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={[UserRole.SCHOOL_ADMIN]}>
        <AdminLayout>
          {children}
        </AdminLayout>
      </RoleGuard>
    </AuthGuard>
  );
}
