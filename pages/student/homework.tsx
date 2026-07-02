import StudentLayout from '@/components/layouts/StudentLayout';
import StudentHomework from '@/modules/student/homework/StudentHomework';

export default function HomeworkPage() {
  return (
    <StudentLayout>
      <StudentHomework />
    </StudentLayout>
  );
}
