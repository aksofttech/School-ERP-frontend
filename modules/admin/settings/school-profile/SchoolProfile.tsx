import React from 'react';
/**
 * School Profile Module
 * Feature container for school profile page
 */

import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import EmptyState from '@/components/ui/EmptyState';
import { UserRole } from '@/utils/types';

export default function SchoolProfile() {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={[UserRole.SCHOOL_ADMIN]}>
        <>

          <div>
            <h1 className="text-3xl font-bold mb-6">School Profile</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <EmptyState message="School profile management will be available here." />
            </div>
          </div>
        
</>
      </RoleGuard>
    </AuthGuard>
  );
}


SchoolProfile.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
