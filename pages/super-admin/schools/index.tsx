import SuperAdminLayout from '@/components/layouts/SuperAdminLayout';
import SchoolRegistry from '@/modules/super-admin/schools/SchoolRegistry';

export default function SchoolsPage() {
  return (
    <SuperAdminLayout>
      <SchoolRegistry />
    </SuperAdminLayout>
  );
}
