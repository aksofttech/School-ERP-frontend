import AdminLayout from '@/components/layouts/AdminLayout';
import TimetableOrchestration from '@/modules/admin/academic/timetable/TimetableOrchestration';

export default function TimetablePage() {
    return (
        <AdminLayout title="Staff Timetable">
            <TimetableOrchestration />
        </AdminLayout>
    );
}
