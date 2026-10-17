import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
    School,
    Mail,
    Phone,
    MapPin,
    ShieldCheck,
    Save,
    Activity,
    Camera,
    LogOut,
    Lock,
    KeyRound,
    CheckCircle2,
    AlertTriangle,
    Calendar,
    BadgeCheck,
    Building2,
    UserCheck,
    Hash,
    Sparkles,
    Check
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSettings } from '@/hooks/useSettings';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth.service';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';
import AdminLayout from '@/components/layouts/AdminLayout';

const settingsSchema = z.object({
    institutionName: z.string().min(3, 'Institution name must be at least 3 characters'),
    schoolCode: z.string().optional(),
    address: z.string().min(6, 'Address is required'),
    contactEmail: z.string().email('Please enter a valid email address'),
    phone: z.string().min(8, 'Phone number is required'),
    accreditationNo: z.string().optional(),
    currency: z.string().optional(),
    academicYear: z.string().optional(),
    board: z.string().optional(),
});

type SettingsValues = z.infer<typeof settingsSchema>;

export default function InstitutionSettings() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const { settings, loading, updateSettings } = useSettings();
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'session'>('profile');
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    // Password change state
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [changingPassword, setChangingPassword] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isDirty }
    } = useForm<SettingsValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            institutionName: 'Vidya Mandir Senior Secondary School',
            schoolCode: 'VMSSS-JPR',
            address: 'Plot 42, Knowledge Park, Mansarovar, Jaipur, Rajasthan 302022',
            contactEmail: 'contact@vidyamandir.edu.in',
            phone: '0141-2789100',
            accreditationNo: 'CBSE-AFF-2024-RJ092',
            currency: 'INR',
            academicYear: '2026-2027',
            board: 'CBSE New Delhi',
        }
    });

    useEffect(() => {
        if (settings) {
            reset({
                institutionName: settings.institutionName || 'Vidya Mandir Senior Secondary School',
                schoolCode: settings.schoolCode || 'VMSSS-JPR',
                address: settings.address || 'Plot 42, Knowledge Park, Mansarovar, Jaipur, Rajasthan 302022',
                contactEmail: settings.contactEmail || 'contact@vidyamandir.edu.in',
                phone: settings.phone || '0141-2789100',
                accreditationNo: settings.accreditationNo || 'CBSE-AFF-2024-RJ092',
                currency: settings.currency || 'INR',
                academicYear: settings.academicYear || '2026-2027',
                board: settings.board || 'CBSE New Delhi',
            });
        }
    }, [settings, reset]);

    const watchedName = watch('institutionName');
    const watchedAccreditation = watch('accreditationNo');

    const onSubmit = async (data: SettingsValues) => {
        setSaving(true);
        try {
            await updateSettings(data);
            toast.success('Settings updated successfully!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!oldPassword || !newPassword) {
            toast.error('Please enter both current and new password');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            toast.error('New password must be at least 6 characters');
            return;
        }

        setChangingPassword(true);
        try {
            await authService.changePassword(oldPassword, newPassword);
            toast.success('Password updated successfully');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            toast.error(err.response?.data?.message || err.message || 'Failed to change password');
        } finally {
            setChangingPassword(false);
        }
    };

    const handleConfirmLogout = async () => {
        setLoggingOut(true);
        try {
            await logout();
            toast.success('Logged out successfully');
            router.push('/auth/login');
        } catch (error) {
            toast.error('Error logging out');
            router.push('/auth/login');
        } finally {
            setLoggingOut(false);
            setShowLogoutModal(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse p-2">
                <Skeleton className="h-14 w-1/3 rounded-2xl" />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <Skeleton className="lg:col-span-4 h-96 rounded-3xl" />
                    <Skeleton className="lg:col-span-8 h-96 rounded-3xl" />
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Settings | Vikas ERP</title>
            </Head>

            <div className="space-y-6 pb-16 animate-in fade-in duration-300">
                {/* Top Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-0.5 rounded-full">
                                Institution & Security
                            </span>
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            Settings
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Manage school branding, campus credentials, regional parameters, and account security.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            onClick={handleSubmit(onSubmit)}
                            disabled={saving}
                            className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 py-2.5 h-auto font-bold text-xs gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {saving ? (
                                <>
                                    <Activity size={16} className="animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    <span>Save Settings</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Sub-Navigation Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-700 gap-2">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all ${
                            activeTab === 'profile'
                                ? 'border-primary text-primary font-black'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <Building2 size={16} />
                        <span>School Profile</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('security')}
                        className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all ${
                            activeTab === 'security'
                                ? 'border-primary text-primary font-black'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <KeyRound size={16} />
                        <span>Admin Account & Password</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('session')}
                        className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all ${
                            activeTab === 'session'
                                ? 'border-rose-500 text-rose-500 font-black'
                                : 'border-transparent text-slate-500 hover:text-rose-500'
                        }`}
                    >
                        <LogOut size={16} />
                        <span>Session & Sign Out</span>
                    </button>
                </div>

                {/* Tab 1: School Profile */}
                {activeTab === 'profile' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left Column: School Crest & Quick Info */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm text-center relative overflow-hidden">
                                <div className="absolute top-4 right-4">
                                    <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                                        <BadgeCheck size={12} />
                                        VERIFIED
                                    </span>
                                </div>

                                <div className="flex flex-col items-center mt-2">
                                    <div className="relative group mb-4">
                                        <div className="w-28 h-28 rounded-2xl bg-gradient-to-tr from-primary/10 via-indigo-50 to-indigo-100 dark:from-indigo-950/40 dark:via-slate-800 dark:to-slate-700 flex items-center justify-center border-2 border-primary/20 shadow-inner group-hover:scale-105 transition-all">
                                            <School size={48} className="text-primary" />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => toast.success('Upload logo feature: Select image file.')}
                                            className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center shadow-md hover:scale-110 transition-all"
                                            title="Change Crest"
                                        >
                                            <Camera size={14} />
                                        </button>
                                    </div>

                                    <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                                        {watchedName || 'Vidya Mandir Senior Secondary School'}
                                    </h2>
                                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                                        Affiliation: {watchedAccreditation || 'CBSE-AFF-2024-RJ092'}
                                    </p>
                                    <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                                        <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md">
                                            Co-Educational
                                        </span>
                                        <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md">
                                            Est. 2008
                                        </span>
                                        <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                                            Session 2026-27
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-left space-y-3">
                                    <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                                        <MapPin size={15} className="text-slate-400 shrink-0" />
                                        <span className="truncate">Mansarovar, Jaipur, Rajasthan</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                                        <Mail size={15} className="text-slate-400 shrink-0" />
                                        <span className="truncate">contact@vidyamandir.edu.in</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                                        <Phone size={15} className="text-slate-400 shrink-0" />
                                        <span className="truncate">0141-2789100</span>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => toast.success('Select new school logo')}
                                        className="w-full justify-center py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700"
                                    >
                                        <Camera size={14} className="mr-2" />
                                        Update School Logo
                                    </Button>
                                </div>
                            </div>

                            {/* Session Quick Card */}
                            <div className="bg-slate-50 dark:bg-surface-dark/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                                <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300">
                                    <span>Current Session</span>
                                    <span className="text-emerald-500 font-extrabold flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                                        Active
                                    </span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                                    Academic Year: 2026-2027 (Term 1 & Term 2)
                                </p>
                            </div>
                        </div>

                        {/* Right Column: Settings Form */}
                        <div className="lg:col-span-8">
                            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 lg:p-8 space-y-6">
                                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Building2 size={18} className="text-primary" />
                                        Institution Information
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Official school details displayed across report cards, receipts, and communication circulars.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    {/* School Name & Code */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="md:col-span-2 space-y-1.5">
                                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                School / Institution Name
                                            </label>
                                            <div className="relative">
                                                <School size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    {...register('institutionName')}
                                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                    placeholder="Enter school name"
                                                />
                                            </div>
                                            {errors.institutionName && (
                                                <p className="text-[11px] text-rose-500 font-medium">{errors.institutionName.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                Campus Code
                                            </label>
                                            <div className="relative">
                                                <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    {...register('schoolCode')}
                                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all uppercase"
                                                    placeholder="e.g. VMSSS-JPR"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Campus Address
                                        </label>
                                        <div className="relative">
                                            <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                {...register('address')}
                                                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                placeholder="Enter complete campus address"
                                            />
                                        </div>
                                        {errors.address && (
                                            <p className="text-[11px] text-rose-500 font-medium">{errors.address.message}</p>
                                        )}
                                    </div>

                                    {/* Contact Email & Phone */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                Official Email Address
                                            </label>
                                            <div className="relative">
                                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    {...register('contactEmail')}
                                                    type="email"
                                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                    placeholder="e.g. contact@vidyamandir.edu.in"
                                                />
                                            </div>
                                            {errors.contactEmail && (
                                                <p className="text-[11px] text-rose-500 font-medium">{errors.contactEmail.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                Official Phone / Landline
                                            </label>
                                            <div className="relative">
                                                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    {...register('phone')}
                                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                    placeholder="e.g. 0141-2789100"
                                                />
                                            </div>
                                            {errors.phone && (
                                                <p className="text-[11px] text-rose-500 font-medium">{errors.phone.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Accreditation & Board */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                Affiliation Number
                                            </label>
                                            <div className="relative">
                                                <ShieldCheck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    {...register('accreditationNo')}
                                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all uppercase"
                                                    placeholder="e.g. CBSE-AFF-2024-RJ092"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                Affiliation Board
                                            </label>
                                            <div className="relative">
                                                <BadgeCheck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <select
                                                    {...register('board')}
                                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="CBSE New Delhi">CBSE (Central Board)</option>
                                                    <option value="ICSE / CISCE">ICSE / CISCE</option>
                                                    <option value="RBSE Rajasthan">State Board (RBSE)</option>
                                                    <option value="IB International">IB International</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Bar */}
                                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <span className="text-[11px] text-slate-400 font-medium">
                                            Last modified: Today (Vikas ERP Cloud)
                                        </span>
                                        <Button
                                            type="submit"
                                            disabled={saving}
                                            className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 py-2.5 h-auto font-bold text-xs gap-2 shadow-lg shadow-primary/20 transition-all"
                                        >
                                            {saving ? <Activity size={16} className="animate-spin" /> : <Save size={16} />}
                                            Save Settings
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 2: Admin Account & Password */}
                {activeTab === 'security' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Current User Card */}
                        <div className="lg:col-span-4">
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 text-center">
                                <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-2xl mx-auto shadow-sm">
                                    {user?.firstName?.charAt(0) || 'V'}
                                </div>

                                <div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                                        {user?.firstName} {user?.lastName || 'Rathore'}
                                    </h3>
                                    <p className="text-xs text-primary font-bold mt-0.5 uppercase tracking-wide">
                                        Campus Administrator
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                        {user?.email || 'admin@vidyamandir.edu.in'}
                                    </p>
                                </div>

                                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 text-left space-y-2 text-xs">
                                    <div className="flex justify-between text-slate-500">
                                        <span>Role Permission</span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">Full Campus Admin</span>
                                    </div>
                                    <div className="flex justify-between text-slate-500">
                                        <span>Phone</span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">{user?.phone || '9829011111'}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-500">
                                        <span>Security Status</span>
                                        <span className="font-bold text-emerald-500 flex items-center gap-1">
                                            <CheckCircle2 size={12} />
                                            Active
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Password Change Form */}
                        <div className="lg:col-span-8">
                            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 lg:p-8 space-y-6">
                                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <KeyRound size={18} className="text-primary" />
                                        Update Account Password
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Choose a strong password with at least 6 characters including letters and numbers.
                                    </p>
                                </div>

                                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Current Password
                                        </label>
                                        <div className="relative">
                                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="password"
                                                value={oldPassword}
                                                onChange={(e) => setOldPassword(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                placeholder="Enter current password"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                placeholder="Enter new password (min. 6 characters)"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Confirm New Password
                                        </label>
                                        <div className="relative">
                                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                placeholder="Re-enter new password"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <Button
                                            type="submit"
                                            disabled={changingPassword}
                                            className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 py-2.5 h-auto font-bold text-xs gap-2 shadow-lg shadow-primary/20 transition-all"
                                        >
                                            {changingPassword ? <Activity size={16} className="animate-spin" /> : <Save size={16} />}
                                            Update Password
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 3: Session & Sign Out (Exclusively Here) */}
                {activeTab === 'session' && (
                    <div className="max-w-2xl mx-auto space-y-6">
                        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 lg:p-8 space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                                    <LogOut size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                                        Sign Out of Vikas ERP
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        You are currently signed in as <span className="font-bold text-slate-800 dark:text-slate-200">{user?.firstName} {user?.lastName}</span> ({user?.email}).
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-3 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Active Campus</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200">
                                        {settings?.institutionName || 'Vidya Mandir Senior Secondary School'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Session Status</span>
                                    <span className="inline-flex items-center gap-1.5 font-bold text-emerald-500">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                        Authenticated (Secure Cookie)
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Session Termination</span>
                                    <span className="text-slate-500">Only accessible via this Settings page</span>
                                </div>
                            </div>

                            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowLogoutModal(true)}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <LogOut size={16} />
                                    <span>Log Out Now</span>
                                </button>
                                <span className="text-[11px] text-slate-400">
                                    Sign out clears your authentication token and cookies safely.
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
                            <AlertTriangle size={24} />
                        </div>

                        <div className="text-center space-y-1">
                            <h4 className="text-lg font-black text-slate-900 dark:text-white">
                                Confirm Sign Out
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Are you sure you want to end your current session? You will need to log in again with your credentials.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 pt-3">
                            <button
                                type="button"
                                onClick={() => setShowLogoutModal(false)}
                                disabled={loggingOut}
                                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmLogout}
                                disabled={loggingOut}
                                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-600/20 inline-flex items-center justify-center gap-2 transition-all"
                            >
                                {loggingOut ? <Activity size={14} className="animate-spin" /> : <LogOut size={14} />}
                                <span>Yes, Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

InstitutionSettings.getLayout = function getLayout(page: React.ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
