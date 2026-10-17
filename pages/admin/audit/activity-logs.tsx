import { useEffect } from 'react';
import { useRouter } from 'next/router';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import { USER_ROLES } from '@/utils/role-config';

export default function ActivityLogs() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/admin/dashboard');
    }, [router]);

    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN]}>
                <div className="flex h-screen items-center justify-center">
                    <p className="text-sm font-bold text-slate-400">Activity logs are restricted to Super Admin only. Redirecting...</p>
                </div>
            </RoleGuard>
        </AuthGuard>
    );
}
