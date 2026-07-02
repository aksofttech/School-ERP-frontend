import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProfileView from '@/modules/common/profile/ProfileView';
import AdminLayout from '@/components/layouts/AdminLayout';
import TeacherLayout from '@/components/layouts/TeacherLayout';
import StudentLayout from '@/components/layouts/StudentLayout';
import ParentLayout from '@/components/layouts/ParentLayout';
import SuperAdminLayout from '@/components/layouts/SuperAdminLayout';

export default function ProfilePage() {
    const { user, authenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Profile...</p>
                </div>
            </div>
        );
    }

    if (!authenticated || !user) {
        if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
        }
        return null;
    }

    // Wrap the profile content in the appropriate layout
    const renderContent = () => <ProfileView />;

    switch (user.role) {
        case 'SUPER_ADMIN':
            return <SuperAdminLayout title="My Profile">{renderContent()}</SuperAdminLayout>;
        case 'SCHOOL_ADMIN':
            return <AdminLayout>{renderContent()}</AdminLayout>;
        case 'TEACHER':
            return <TeacherLayout>{renderContent()}</TeacherLayout>;
        case 'STUDENT':
            return <StudentLayout>{renderContent()}</StudentLayout>;
        case 'PARENT':
            return <ParentLayout>{renderContent()}</ParentLayout>;
        default:
            return <div className="p-8">{renderContent()}</div>;
    }
}
