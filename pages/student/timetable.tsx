import StudentLayout from '@/components/layouts/StudentLayout';
import StudentTimetable from '@/modules/student/timetable/StudentTimetable';

export default function TimetablePage() {
  return (
    <StudentLayout>
      <StudentTimetable />
    </StudentLayout>
  );
}
