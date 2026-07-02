import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    UserCircle2,
    Mail,
    Phone,
    Shield,
    Lock,
    Save,
    ChevronLeft,
    Camera,
    Activity,
    History,
    Key
} from 'lucide-react';
import Link from 'next/link';
import { usersService } from '@/services/users.service';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import AdminLayout from '@/components/layouts/AdminLayout';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import { USER_ROLES } from '@/utils/role-config';
import Head from 'next/head';

const userProfileSchema = z.object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    role: z.string(),
    isActive: z.boolean(),
});

type UserProfileValues = z.infer<typeof userProfileSchema>;

export default function UserProfile() {
    const router = useRouter();
    const { id } = router.query;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'activity'>('profile');

    const { register, handleSubmit, reset, formState: { errors } } = useForm<UserProfileValues>({
        resolver: zodResolver(userProfileSchema),
    });

    useEffect(() => {
        if (id) {
            fetchUser();
        }
    }, [id]);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const user = await usersService.getById(id as string);
            reset({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isActive: user.isActive,
            });
        } catch (err: any) {
            toast.error(err.message || 'Failed to load user profile');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: UserProfileValues) => {
        setSaving(true);
        try {
            await usersService.update(id as string, data);
            toast.success('Profile updated successfully');
        } catch (err: any) {
            toast.error(err.message || 'Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
      <>
        
                <div className="space-y-8 animate-pulse p-8">
                    <Skeleton className="h-40 w-full rounded-[2.5rem]" />
                    <Skeleton className="h-96 w-full rounded-[2.5rem]" />
                </div>
            
      </>
    );
    }

    return (
        <div className="pb-12">
            <Head>
                <title>User Profile | School ERP</title>
            </Head>
            <div className="space-y-8 animate-in fade-in duration-500 pb-12">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <Link href="/admin/users" className="size-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:text-primary transition-colors">
                                    <ChevronLeft size={20} />
                                </Link>
                                <div>
                                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tightLeading-none mb-1">User Details</h1>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic text-primary">Manage account and permissions</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={saving}
                                    className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-8 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20"
                                >
                                    {saving ? <Activity size={18} className="animate-spin" /> : <Save size={18} />}
                                    Save Profile
                                </Button>
                            </div>
                        </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar / Quick Stats */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8">
                            <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 uppercase tracking-widest font-black">ACTIVE</Badge>
                        </div>

                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="relative group">
                                <div className="size-32 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden group-hover:scale-105 transition-transform">
                                    <UserCircle2 size={64} className="text-slate-300" />
                                </div>
                                <button className="absolute -bottom-2 -right-2 size-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-all">
                                    <Camera size={18} />
                                </button>
                            </div>

                            <div className="space-y-1">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Profile Details</h2>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] italic">Role: Administrator</p>
                            </div>
                        </div>

                        <div className="space-y-1 pt-4">
                            {[
                                { label: 'Days Active', value: '142 Days', icon: Activity },
                                { label: 'Total Logins', value: '1,284', icon: Shield },
                                { label: 'Last Action', value: '12ms', icon: History }
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                                    <div className="flex items-center gap-3">
                                        <stat.icon size={16} className="text-primary" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                                    </div>
                                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Profile Settings */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                        <div className="flex border-b border-slate-100 dark:border-slate-800 p-2">
                            {[
                                { id: 'profile', label: 'Personal Info', icon: UserCircle2 },
                                { id: 'security', label: 'Security', icon: Lock },
                                { id: 'activity', label: 'Activity Log', icon: Activity }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                                        ? 'bg-slate-900 text-white dark:bg-primary shadow-xl'
                                        : 'text-slate-400 hover:text-primary'
                                        }`}
                                >
                                    <tab.icon size={16} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-10">
                            {activeTab === 'profile' && (
                                <form className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">First Name</label>
                                            <div className="relative group">
                                                <UserCircle2 size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                                                <input
                                                    {...register('firstName')}
                                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl py-5 pl-14 pr-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300"
                                                />
                                            </div>
                                            {errors.firstName && <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest pl-4 italic">{errors.firstName.message}</p>}
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Last Name</label>
                                            <div className="relative group">
                                                <UserCircle2 size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                                                <input
                                                    {...register('lastName')}
                                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl py-5 pl-14 pr-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300"
                                                />
                                            </div>
                                            {errors.lastName && <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest pl-4 italic">{errors.lastName.message}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                                        <div className="relative group">
                                            <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                                            <input
                                                {...register('email')}
                                                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl py-5 pl-14 pr-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300"
                                            />
                                        </div>
                                        {errors.email && <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest pl-4 italic">{errors.email.message}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
                                            <div className="relative group">
                                                <Phone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                                                <input
                                                    {...register('phone')}
                                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl py-5 pl-14 pr-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">User Role</label>
                                            <div className="relative group">
                                                <Shield size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                                                <select
                                                    {...register('role')}
                                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl py-5 pl-14 pr-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all appearance-none"
                                                >
                                                    <option value="SUPER_ADMIN">SUPER ADMIN</option>
                                                    <option value="SCHOOL_ADMIN">ADMIN</option>
                                                    <option value="TEACHER">TEACHER</option>
                                                    <option value="STUDENT">STUDENT</option>
                                                    <option value="PARENT">PARENT</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {activeTab === 'security' && (
                                <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                                    <div className="p-8 bg-amber-500/5 border border-amber-500/20 rounded-3xl space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Key size={20} className="text-amber-500" />
                                            <h3 className="text-sm font-black text-amber-500 uppercase tracking-widest">Security Settings</h3>
                                        </div>
                                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                                            Update password or security settings for this user. Ensure verification of the user before continuing.
                                        </p>
                                    </div>

                                    <div className="space-y-6">
                                        <Button variant="secondary" className="w-full justify-between py-6 rounded-2xl font-black text-xs uppercase tracking-widest border-2">
                                            Send Password Reset Email
                                            <Mail size={18} />
                                        </Button>
                                        <Button variant="secondary" className="w-full justify-between py-6 rounded-2xl font-black text-xs uppercase tracking-widest border-2 border-rose-500/20 text-rose-500 hover:bg-rose-500/10">
                                            Logout from all devices
                                            <History size={18} />
                                        </Button>
                                        <Button variant="secondary" className="w-full justify-between py-6 rounded-2xl font-black text-xs uppercase tracking-widest border-2 border-rose-500 text-rose-500 bg-rose-500/5">
                                            Delete Account
                                            <Lock size={18} />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'activity' && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="flex items-start gap-4 p-5 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-100">
                                            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                                <History size={20} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Page visited: [Academic Records]</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] italic">04:21:00 UTC | ID: {9283 - i}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}


UserProfile.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
