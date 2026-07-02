import React from 'react';
import { useState, useEffect } from 'react';
import {
    Settings2,
    School,
    Mail,
    Phone,
    MapPin,
    Globe,
    ShieldCheck,
    Save,
    Activity,
    Upload,
    Camera,
    Layers
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSettings } from '@/hooks/useSettings';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';
import AdminLayout from '@/components/layouts/AdminLayout';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import { USER_ROLES } from '@/utils/role-config';
import Head from 'next/head';

const settingsSchema = z.object({
    institutionName: z.string().min(3, 'Name too short'),
    address: z.string().min(10, 'Address required'),
    contactEmail: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number required'),
    accreditationNo: z.string().optional(),
    currency: z.string(),
});

type SettingsValues = z.infer<typeof settingsSchema>;

export default function InstitutionSettings() {
    const { settings, loading, updateSettings } = useSettings();
    const [saving, setSaving] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<SettingsValues>({
        resolver: zodResolver(settingsSchema),
    });

    useEffect(() => {
        if (settings) {
            reset(settings);
        }
    }, [settings, reset]);

    const onSubmit = async (data: SettingsValues) => {
        setSaving(true);
        try {
            await updateSettings(data);
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
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
                <AdminLayout title="School Settings">
                    <Head>
                        <title>School Settings | School ERP</title>
                    </Head>
                    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-1">School Profile</h1>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic text-primary">Manage your school details and branding</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={saving}
                                    className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-10 py-6 h-auto font-black text-xs uppercase tracking-widest gap-3 shadow-xl shadow-primary/20"
                                >
                                    {saving ? <Activity size={18} className="animate-spin" /> : <Save size={18} />}
                                    Save Settings
                                </Button>
                            </div>
                        </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Branding & Entity Profile */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8">
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[9px] uppercase tracking-widest">VERIFIED</Badge>
                        </div>

                        <div className="flex flex-col items-center space-y-6">
                            <div className="relative group">
                                <div className="size-32 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden group-hover:scale-105 transition-transform">
                                    <School size={64} className="text-slate-300" />
                                </div>
                                <button className="absolute -bottom-2 -right-2 size-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-all">
                                    <Camera size={18} />
                                </button>
                            </div>

                            <div className="space-y-1">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{settings?.institutionName}</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] italic">Accreditation: {settings?.accreditationNo || 'PENDING'}</p>
                            </div>
                        </div>

                        <div className="space-y-2 pt-4">
                            <Button variant="secondary" className="w-full justify-center py-4 rounded-xl font-black text-[10px] uppercase tracking-widest border-2">
                                Change Logo
                                <Layers size={14} className="ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Global Configuration Matrix */}
                <div className="lg:col-span-8">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="size-10 bg-indigo-500 text-white rounded-xl flex items-center justify-center shadow-lg">
                                <Settings2 size={20} />
                            </div>
                            <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">General Settings</h2>
                        </div>

                        <div className="p-10">
                            <form className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">School Name</label>
                                    <div className="relative group">
                                        <School size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                                        <input
                                            {...register('institutionName')}
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl py-5 pl-14 pr-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300"
                                        />
                                    </div>
                                    {errors.institutionName && <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest pl-4 italic">{errors.institutionName.message}</p>}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">School Address</label>
                                    <div className="relative group">
                                        <MapPin size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                                        <input
                                            {...register('address')}
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl py-5 pl-14 pr-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                                        <div className="relative group">
                                            <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                                            <input
                                                {...register('contactEmail')}
                                                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl py-5 pl-14 pr-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300"
                                            />
                                        </div>
                                    </div>
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
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Accreditation Number</label>
                                        <div className="relative group">
                                            <ShieldCheck size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                                            <input
                                                {...register('accreditationNo')}
                                                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl py-5 pl-14 pr-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Currency</label>
                                        <div className="relative group">
                                            <Globe size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                                            <select
                                                {...register('currency')}
                                                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl py-5 pl-14 pr-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all appearance-none"
                                            >
                                                <option value="USD">USD ($)</option>
                                                <option value="INR">INR (₹)</option>
                                                <option value="EUR">EUR (€)</option>
                                                <option value="GBP">GBP (£)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
                    </div>
                </AdminLayout>
            </RoleGuard>
        </AuthGuard>
    );
}


InstitutionSettings.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
