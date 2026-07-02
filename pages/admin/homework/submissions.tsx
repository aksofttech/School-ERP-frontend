/**
 * Homework Submissions Page
 * SCHOOL_ADMIN page for homework submissions
 */

import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import { UserRole } from '@/utils/types';

function HomeworkSubmissionsContent() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Homework Submissions</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">This page will be implemented with API integration.</p>
      </div>
    </div>
  );
}

export default function HomeworkSubmissions() {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={[UserRole.SCHOOL_ADMIN]}>
        <AdminLayout>
          <HomeworkSubmissionsContent />
        </AdminLayout>
      </RoleGuard>
    </AuthGuard>
  );
}
