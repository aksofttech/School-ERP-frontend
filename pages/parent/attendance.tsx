import ParentLayout from '@/components/layouts/ParentLayout';
import ParentAttendance from '@/modules/parent/attendance/ParentAttendance';

export default function AttendancePage() {
  return (
    <ParentLayout>
      <ParentAttendance />
    </ParentLayout>
  );
}
