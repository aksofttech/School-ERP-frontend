import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ExamForm from '@/modules/admin/exams/form/ExamForm';
import { examsService } from '@/services/exams.service';
import Skeleton from '@/components/ui/Skeleton';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Exam } from '@/utils/types';

export default function EditExamPage() {
    const router = useRouter();
    const { id } = router.query;
    const [exam, setExam] = useState<Exam | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            examsService.getExamResults(id as string)
                .then(data => setExam(data.exam))
                .catch(() => setExam(null))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) return (
        <AdminLayout title="Performance Update">
            <div className="p-8">
                <Skeleton className="h-96 w-full rounded-[2.5rem]" />
            </div>
        </AdminLayout>
    );
    
    return <ExamForm initialData={exam || undefined} />;
}
