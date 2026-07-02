import AdminLayout from '@/components/layouts/AdminLayout';
import FeePayments from '@/modules/admin/fees/payments/FeePayments';

export default function FeePaymentsPage() {
    return (
        <AdminLayout>
            <FeePayments />
        </AdminLayout>
    );
}
