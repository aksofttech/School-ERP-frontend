import SuperAdminLayout from '@/components/layouts/SuperAdminLayout';
import SecurityAudit from '@/modules/super-admin/security/SecurityAudit';

export default function SecurityPage() {
    return (
        <SuperAdminLayout>
            <SecurityAudit />
        </SuperAdminLayout>
    );
}
