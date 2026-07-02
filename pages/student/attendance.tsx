import StudentLayout from '@/components/layouts/StudentLayout';
import StudentAttendance from '@/modules/student/attendance/StudentAttendance';

export default function AttendancePage() {
  return (
    <StudentLayout>
      <StudentAttendance />
    </StudentLayout>
  );
}
