import SuperAdminLayout from '@/components/layouts/SuperAdminLayout';
import GlobalSettings from '@/modules/super-admin/settings/GlobalSettings';

export default function SettingsPage() {
    return (
        <SuperAdminLayout>
            <GlobalSettings />
        </SuperAdminLayout>
    );
}
