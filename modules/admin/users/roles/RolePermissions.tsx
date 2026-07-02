import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
    ShieldCheck,
    Save,
    RefreshCcw,
    Lock,
    Unlock,
    Eye,
    Edit,
    Trash2,
    CheckSquare,
    AlertCircle,
    ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import { usersService } from '@/services/users.service';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import Skeleton from '@/components/ui/Skeleton';
import AdminLayout from '@/components/layouts/AdminLayout';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import { USER_ROLES } from '@/utils/role-config';
import Head from 'next/head';

const MODULES = [
    { id: 'dashboard', name: 'Dashboard & Reports' },
    { id: 'students', name: 'Student List' },
    { id: 'teachers', name: 'Teacher Management' },
    { id: 'academic', name: 'Classes & Subjects' },
    { id: 'attendance', name: 'Attendance' },
    { id: 'fees', name: 'Fees & Finance' },
    { id: 'exams', name: 'Exams & Results' },
    { id: 'settings', name: 'App Settings' }
];

const PERMISSIONS = [
    { id: 'read', name: 'View Only', icon: Eye },
    { id: 'write', name: 'Can Edit', icon: Edit },
    { id: 'delete', name: 'Can Delete', icon: Trash2 },
    { id: 'approve', name: 'Admin Control', icon: CheckSquare }
];

export default function RolePermissions() {
    const router = useRouter();
    const { role } = router.query;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [matrix, setMatrix] = useState<Record<string, string[]>>({});

    useEffect(() => {
        if (role) {
            fetchPermissions();
        }
    }, [role]);

    const fetchPermissions = async () => {
        setLoading(true);
        try {
            // Mocking or fetching actual permissions
            const data = await usersService.getPermissions();
            // Assume data format: { [role]: { [module]: ['read', 'write'] } }
            setMatrix(data[role as string] || {});
        } catch (err) {
            // Fallback matrix for demo/initial state if API fails
            const initialMatrix: Record<string, string[]> = {};
            MODULES.forEach(m => initialMatrix[m.id] = ['read']);
            setMatrix(initialMatrix);
        } finally {
            setLoading(false);
        }
    };

    const togglePermission = (moduleId: string, permId: string) => {
        setMatrix(prev => {
            const current = prev[moduleId] || [];
            const updated = current.includes(permId)
                ? current.filter(p => p !== permId)
                : [...current, permId];
            return { ...prev, [moduleId]: updated };
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await usersService.updateRolePermissions(role as string, matrix as any);
            toast.success('Permissions saved successfully.');
        } catch (err: any) {
            toast.error(err.message || 'Failed to save permissions');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
                <>

                    <Head>
                        <title>Role Permissions | School ERP</title>
                    </Head>
                    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <Link href="/admin/users" className="size-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:text-primary transition-colors">
                                        <ChevronLeft size={20} />
                                    </Link>
                                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-1">Manage Permissions</h1>
                                </div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic text-primary">Manage module-level access for {role || 'Select Role'}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={fetchPermissions}
                                    variant="secondary"
                                    className="rounded-2xl px-6 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2"
                                >
                                    <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
                                    Refresh
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={saving || loading}
                                    className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-8 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20"
                                >
                                    {saving ? (
                                        <RefreshCcw size={18} className="animate-spin" />
                                    ) : (
                                        <Save size={18} />
                                    )}
                                    Save Changes
                                </Button>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                                            <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-1/3">App Feature / Module</th>
                                            {PERMISSIONS.map(p => (
                                                <th key={p.id} className="px-6 py-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <p.icon size={16} className="text-slate-300" />
                                                        {p.name}
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                        {loading ? (
                                            Array.from({ length: 6 }).map((_, i) => (
                                                <tr key={i}>
                                                    <td className="px-10 py-8"><Skeleton className="h-6 w-48 rounded-lg" /></td>
                                                    {PERMISSIONS.map(p => (
                                                        <td key={p.id} className="px-6 py-8"><Skeleton className="h-8 w-8 mx-auto rounded-lg" /></td>
                                                    ))}
                                                </tr>
                                            ))
                                        ) : (
                                            MODULES.map((m) => (
                                                <tr key={m.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                                                    <td className="px-10 py-8">
                                                        <div className="flex items-center gap-4">
                                                            <div className="size-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                                                            <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">{m.name}</p>
                                                        </div>
                                                    </td>
                                                    {PERMISSIONS.map(p => {
                                                        const isActive = matrix[m.id]?.includes(p.id);
                                                        return (
                                                            <td key={p.id} className="px-6 py-8">
                                                                <button
                                                                    onClick={() => togglePermission(m.id, p.id)}
                                                                    className={`size-10 rounded-xl mx-auto flex items-center justify-center transition-all border-2 ${isActive
                                                                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-lg shadow-emerald-500/20'
                                                                        : 'bg-slate-50 dark:bg-slate-800/50 border-transparent text-slate-300 hover:border-slate-200'
                                                                        }`}
                                                                >
                                                                    {isActive ? <Unlock size={18} /> : <Lock size={18} />}
                                                                </button>
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-8 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
                                <AlertCircle className="text-amber-500" size={20} />
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                                    WARNING: Changing these settings will immediately update access for all users in the <span className="text-slate-900 dark:text-white font-black">[{role}]</span> group.
                                </p>
                            </div>
                        </div>
                    </div>
                
</>
            </RoleGuard>
        </AuthGuard>
    );
}


RolePermissions.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
