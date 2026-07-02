import StudentLayout from '@/components/layouts/StudentLayout';
import StudentDownloads from '@/modules/student/downloads/StudentDownloads';

export default function DownloadsPage() {
  return (
    <StudentLayout>
      <StudentDownloads />
    </StudentLayout>
  );
}
