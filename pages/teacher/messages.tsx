import TeacherLayout from '@/components/layouts/TeacherLayout';
import TeacherMessages from '@/modules/teacher/messages/TeacherMessages';

export default function MessagesPage() {
  return (
    <TeacherLayout>
      <TeacherMessages />
    </TeacherLayout>
  );
}
