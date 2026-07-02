import React from 'react';
/**
 * Teacher Timetable Module
 * Feature container for teacher timetable page
 */

import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import EmptyState from '@/components/ui/EmptyState';
import { UserRole } from '@/utils/types';

export default function TeacherTimetable() {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={[UserRole.SCHOOL_ADMIN]}>
        <>

          <div>
            <h1 className="text-3xl font-bold mb-6">Teacher Timetable</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <EmptyState message="Teacher timetable management will be available here." />
            </div>
          </div>
        
</>
      </RoleGuard>
    </AuthGuard>
  );
}


TeacherTimetable.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
