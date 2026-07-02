/**
 * Data History Page
 * SCHOOL_ADMIN page for data history
 */

import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import { UserRole } from '@/utils/types';

function DataHistoryContent() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Data History</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">This page will be implemented with API integration.</p>
      </div>
    </div>
  );
}

export default function DataHistory() {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={[UserRole.SCHOOL_ADMIN]}>
        <AdminLayout>
          <DataHistoryContent />
        </AdminLayout>
      </RoleGuard>
    </AuthGuard>
  );
}
