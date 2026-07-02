import AdminLayout from '@/components/layouts/AdminLayout';
import FeeCollection from '@/modules/admin/fees/collection/FeeCollection';

export default function FeeCollectionPage() {
    return (
        <AdminLayout>
            <FeeCollection />
        </AdminLayout>
    );
}
