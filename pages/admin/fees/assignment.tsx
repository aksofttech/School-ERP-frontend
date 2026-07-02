import AdminLayout from '@/components/layouts/AdminLayout';
import FeeAssignment from '@/modules/admin/fees/assignment/FeeAssignment';

export default function FeeAssignmentPage() {
    return (
        <AdminLayout>
            <FeeAssignment />
        </AdminLayout>
    );
}
