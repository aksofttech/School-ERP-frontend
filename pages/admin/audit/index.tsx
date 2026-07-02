import AdminLayout from '@/components/layouts/AdminLayout';
import AuditLog from '@/modules/admin/audit/AuditLog';

export default function AuditPage() {
    return (
        <AdminLayout>
            <AuditLog />
        </AdminLayout>
    );
}
