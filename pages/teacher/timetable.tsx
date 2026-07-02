import TeacherLayout from '@/components/layouts/TeacherLayout';
import TeacherTimetable from '@/modules/teacher/timetable/TeacherTimetable';

export default function TimetablePage() {
  return (
    <TeacherLayout>
      <TeacherTimetable />
    </TeacherLayout>
  );
}
