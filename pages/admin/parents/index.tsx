import AdminLayout from '@/components/layouts/AdminLayout';
import ParentsList from '@/modules/admin/parents/list/ParentsList';

export default function ParentsListPage() {
    return (
        <AdminLayout>
            <ParentsList />
        </AdminLayout>
    );
}
