import StudentLayout from '@/components/layouts/StudentLayout';
import StudentExams from '@/modules/student/exams/StudentExams';

export default function ExamsPage() {
  return (
    <StudentLayout>
      <StudentExams />
    </StudentLayout>
  );
}
