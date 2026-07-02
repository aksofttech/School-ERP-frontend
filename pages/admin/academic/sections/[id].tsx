import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import ClassSections from '@/modules/admin/academic/classes/ClassSections';

export default function SectionsPage() {
    const router = useRouter();
    const { id } = router.query;

    return (
        <AdminLayout>
            {id ? <ClassSections classId={id as string} /> : null}
        </AdminLayout>
    );
}
