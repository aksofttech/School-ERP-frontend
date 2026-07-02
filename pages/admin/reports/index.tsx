import AdminLayout from '@/components/layouts/AdminLayout';
import AdvancedBI from '@/modules/admin/reports/AdvancedBI';

export default function ReportsPage() {
    return (
        <AdminLayout>
            <AdvancedBI />
        </AdminLayout>
    );
}
