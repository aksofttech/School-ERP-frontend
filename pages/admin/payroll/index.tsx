import AdminLayout from '@/components/layouts/AdminLayout';
import PayrollDashboard from '@/modules/admin/payroll/dashboard/PayrollDashboard';

export default function PayrollPage() {
    return (
        <AdminLayout>
            <PayrollDashboard />
        </AdminLayout>
    );
}
