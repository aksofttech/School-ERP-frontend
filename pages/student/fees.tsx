import StudentLayout from '@/components/layouts/StudentLayout';
import StudentFees from '@/modules/student/fees/StudentFees';

export default function FeesPage() {
  return (
    <StudentLayout>
      <StudentFees />
    </StudentLayout>
  );
}
