import TeacherLayout from '@/components/layouts/TeacherLayout';
import TeacherExams from '@/modules/teacher/exams/TeacherExams';

export default function ExamsPage() {
    return (
        <TeacherLayout>
            <TeacherExams />
        </TeacherLayout>
    );
}
