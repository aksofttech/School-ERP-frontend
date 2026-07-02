import TeacherLayout from '@/components/layouts/TeacherLayout';
import TeacherAttendance from '@/modules/teacher/attendance/TeacherAttendance';

export default function AttendancePage() {
    return (
        <TeacherLayout>
            <TeacherAttendance />
        </TeacherLayout>
    );
}
