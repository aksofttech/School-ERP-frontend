import SuperAdminLayout from '@/components/layouts/SuperAdminLayout';
import SystemHealth from '@/modules/super-admin/system/SystemHealth';

export default function SystemLogsPage() {
  return (
    <SuperAdminLayout>
      <SystemHealth />
    </SuperAdminLayout>
  );
}
