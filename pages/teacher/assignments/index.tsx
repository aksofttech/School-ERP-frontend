import TeacherLayout from '@/components/layouts/TeacherLayout';
import TeacherAssignments from '@/modules/teacher/assignments/TeacherAssignments';

export default function AssignmentsPage() {
    return (
        <TeacherLayout>
            <TeacherAssignments />
        </TeacherLayout>
    );
}
