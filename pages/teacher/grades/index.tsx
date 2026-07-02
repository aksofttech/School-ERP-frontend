import TeacherLayout from '@/components/layouts/TeacherLayout';
import TeacherGrades from '@/modules/teacher/grades/TeacherGrades';

export default function GradesPage() {
    return (
        <TeacherLayout>
            <TeacherGrades />
        </TeacherLayout>
    );
}
