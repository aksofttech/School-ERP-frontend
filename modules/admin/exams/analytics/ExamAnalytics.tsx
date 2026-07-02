import React from 'react';
/**
 * Exam Analytics Module
 * Feature container for exam analytics page
 */

import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import EmptyState from '@/components/ui/EmptyState';
import { UserRole } from '@/utils/types';

export default function ExamAnalytics() {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={[UserRole.SCHOOL_ADMIN]}>
        <>

          <div>
            <h1 className="text-3xl font-bold mb-6">Exam Analytics</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <EmptyState message="Exam analytics and reports will be available here." />
            </div>
          </div>
        
</>
      </RoleGuard>
    </AuthGuard>
  );
}


ExamAnalytics.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
