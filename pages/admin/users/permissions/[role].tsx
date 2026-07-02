import AdminLayout from '@/components/layouts/AdminLayout';
import RolePermissions from '@/modules/admin/users/roles/RolePermissions';

export default function PermissionsPage() {
    return (
        <AdminLayout>
            <RolePermissions />
        </AdminLayout>
    );
}
