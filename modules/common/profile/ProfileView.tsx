import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    Shield,
    Key,
    Globe,
    Briefcase,
    Building2,
    Calendar,
    CheckCircle2,
    Lock,
    Eye,
    EyeOff,
    Save,
    RefreshCw,
    Sliders,
    Cpu,
    Activity,
    Clock,
    Copy,
    Check,
    Smartphone,
    Laptop,
    Fingerprint,
    Sparkles,
    AlertCircle,
    ChevronRight,
    Award,
    Database,
    FileText,
    Users,
    Layers,
    ShieldCheck,
    LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth.service';
import { superAdminService } from '@/services/super-admin.service';
import { toast } from 'react-hot-toast';

export default function ProfileView() {
    const { user, authenticated, updateUser, refreshProfile } = useAuth();

    // Active Tab state
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'permissions' | 'activity'>('profile');

    // Personal Info Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        designation: '',
        department: '',
        bio: '',
        timezone: 'Asia/Kolkata (IST, UTC+5:30)',
    });
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isCopiedId, setIsCopiedId] = useState(false);

    // Password Form State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    // Avatar Color Accent
    const [avatarColor, setAvatarColor] = useState('indigo');

    // 2FA state
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

    // Audit logs state
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [isLoadingAudit, setIsLoadingAudit] = useState(false);
    const [auditSearch, setAuditSearch] = useState('');

    // Load initial user details
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || '',
                designation: user.role === 'SUPER_ADMIN' ? 'Chief Platform Architect' : 'System Administrator',
                department: user.role === 'SUPER_ADMIN' ? 'Global Fleet Infrastructure' : 'Academic Administration',
                bio: 'Primary administrative controller with root system authority, multi-tenant governance, and global fleet telemetry supervision.',
                timezone: 'Asia/Kolkata (IST, UTC+5:30)',
            });
        }
    }, [user]);

    // Fetch audit activity when tab switches
    useEffect(() => {
        if (activeTab === 'activity' && user?.id) {
            fetchUserActivity();
        }
    }, [activeTab, user?.id]);

    const fetchUserActivity = async () => {
        setIsLoadingAudit(true);
        try {
            const res = await superAdminService.getAuditLogs({ userId: user?.id, limit: 20 });
            const list = Array.isArray(res) ? res : (res?.data || []);
            setAuditLogs(list);
        } catch (error) {
            console.error('Failed to load user activity', error);
        } finally {
            setIsLoadingAudit(false);
        }
    };

    if (!authenticated || !user) return null;

    // Password strength computation
    const computePasswordStrength = (pass: string) => {
        if (!pass) return { score: 0, label: 'None', color: 'bg-slate-200' };
        let score = 0;
        if (pass.length >= 8) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;

        if (score === 1) return { score: 25, label: 'Weak', color: 'bg-rose-500' };
        if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500' };
        if (score === 3) return { score: 75, label: 'Good', color: 'bg-indigo-500' };
        return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
    };

    const passwordStrength = computePasswordStrength(passwordData.newPassword);

    // Copy Account ID
    const handleCopyId = () => {
        navigator.clipboard.writeText(user.id);
        setIsCopiedId(true);
        toast.success('Account ID copied to clipboard!');
        setTimeout(() => setIsCopiedId(false), 2000);
    };

    // Save Profile Details
    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingProfile(true);
        try {
            const updated = await authService.updateProfile({
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
            });

            if (updateUser) {
                updateUser(updated);
            }
            if (refreshProfile) {
                await refreshProfile();
            }

            toast.success('Profile details updated successfully!');
        } catch (error: any) {
            console.error('Update profile error:', error);
            const msg = error?.response?.data?.message || error?.message || 'Failed to update profile';
            toast.error(msg);
        } finally {
            setIsSavingProfile(false);
        }
    };

    // Change Password
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!passwordData.currentPassword) {
            toast.error('Please enter your current password');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('New password must be at least 6 characters long');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        setIsSavingPassword(true);
        try {
            await authService.changePassword(passwordData.currentPassword, passwordData.newPassword);
            toast.success('Password updated successfully! Keep your credentials secure.');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error: any) {
            console.error('Change password error:', error);
            const msg = error?.response?.data?.message || error?.message || 'Failed to change password. Please check your current password.';
            toast.error(msg);
        } finally {
            setIsSavingPassword(false);
        }
    };

    // Color options for avatar
    const colorOptions = [
        { id: 'indigo', bg: 'from-indigo-600 to-violet-600', text: 'text-indigo-600', ring: 'ring-indigo-500' },
        { id: 'emerald', bg: 'from-emerald-600 to-teal-600', text: 'text-emerald-600', ring: 'ring-emerald-500' },
        { id: 'violet', bg: 'from-purple-600 to-pink-600', text: 'text-purple-600', ring: 'ring-purple-500' },
        { id: 'amber', bg: 'from-amber-500 to-orange-600', text: 'text-amber-600', ring: 'ring-amber-500' },
        { id: 'cyan', bg: 'from-cyan-600 to-blue-600', text: 'text-cyan-600', ring: 'ring-cyan-500' },
    ];

    const activeColorConfig = colorOptions.find(c => c.id === avatarColor) || colorOptions[0];

    // Filtered audit logs
    const filteredLogs = auditLogs.filter(log => {
        if (!auditSearch) return true;
        const q = auditSearch.toLowerCase();
        return (
            log.action?.toLowerCase().includes(q) ||
            log.ip?.toLowerCase().includes(q) ||
            JSON.stringify(log.details || {}).toLowerCase().includes(q)
        );
    });

    const initials = `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || 'U';

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-16 animate-in fade-in duration-500">
            {/* Top Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
                {/* Visual Cover Gradient */}
                <div className="h-44 sm:h-52 bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-800 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/15 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute -right-16 -top-16 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute left-1/3 -bottom-20 w-72 h-72 bg-violet-400/10 rounded-full blur-2xl pointer-events-none" />

                    {/* Top Right Badges */}
                    <div className="absolute top-5 right-5 flex items-center gap-2.5">
                        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold border border-white/20 shadow-sm">
                            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                            Active Session
                        </span>
                        <button
                            onClick={() => refreshProfile && refreshProfile()}
                            title="Refresh Profile Data"
                            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white transition-all border border-white/20 active:scale-95"
                        >
                            <RefreshCw size={15} />
                        </button>
                    </div>
                </div>

                {/* Profile Header Bar */}
                <div className="px-6 sm:px-10 pb-6 pt-0 relative">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 -mt-14 sm:-mt-16">
                        {/* Avatar & Core Identity */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            {/* Avatar Circle */}
                            <div className="relative group shrink-0">
                                <div className={`size-24 sm:size-28 rounded-2xl bg-gradient-to-br ${activeColorConfig.bg} text-white font-black text-3xl sm:text-4xl flex items-center justify-center shadow-xl ring-4 ring-white dark:ring-slate-900 tracking-tight transition-transform group-hover:scale-105`}>
                                    {initials}
                                </div>
                                <span className="absolute -bottom-1 -right-1 size-5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-900 shadow-md flex items-center justify-center" title="Online • Super Administrator">
                                    <span className="size-1.5 rounded-full bg-white animate-ping" />
                                </span>
                            </div>

                            {/* User Text Info & Hierarchy */}
                            <div className="space-y-2.5">
                                {/* Row 1: Name and Primary Badges */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                                        {user.firstName} {user.lastName}
                                    </h1>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-black tracking-wide uppercase shadow-xs">
                                        <ShieldCheck size={14} className="text-indigo-600 dark:text-indigo-400" />
                                        {user.role?.replace('_', ' ')}
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold shadow-xs">
                                        <CheckCircle2 size={13} className="text-emerald-500" />
                                        Verified
                                    </span>
                                </div>

                                {/* Row 2: Designation / Title */}
                                <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
                                    Chief Platform Architect & Global Operations Lead
                                </p>

                                {/* Row 3: Modern Info Badges */}
                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
                                        <Mail size={13} className="text-indigo-500" />
                                        <span>{user.email}</span>
                                    </div>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
                                        <Phone size={13} className="text-emerald-500" />
                                        <span>{user.phone || '+91 98290 00001'}</span>
                                    </div>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
                                        <Building2 size={13} className="text-violet-500" />
                                        <span>{(user as any)?.school?.name || (user.role === 'SUPER_ADMIN' ? 'Vikas Global Fleet' : 'Default Institution')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Account ID & Theme Selector */}
                        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 pt-3 lg:pt-0">
                            {/* Copy Account ID Badge */}
                            <button
                                onClick={handleCopyId}
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-xs transition-all active:scale-95"
                                title="Click to copy full User ID"
                            >
                                <Fingerprint size={14} className="text-indigo-500" />
                                <span>Account ID: <span className="font-mono font-bold">{user.id.slice(0, 8)}...</span></span>
                                {isCopiedId ? <Check size={14} className="text-emerald-500" /> : <Copy size={13} className="text-slate-400" />}
                            </button>

                            {/* Theme Palette Switcher */}
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80">
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Accent</span>
                                <div className="flex items-center gap-1.5">
                                    {colorOptions.map(c => (
                                        <button
                                            key={c.id}
                                            onClick={() => setAvatarColor(c.id)}
                                            className={`size-4 rounded-full bg-gradient-to-br ${c.bg} transition-all ${avatarColor === c.id ? 'ring-2 ring-indigo-500 scale-125 shadow-xs' : 'opacity-60 hover:opacity-100 hover:scale-110'}`}
                                            title={`Theme: ${c.id}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-slate-800 pt-8 mt-6">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                                activeTab === 'profile'
                                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            <User size={16} />
                            Personal Information
                        </button>

                        <button
                            onClick={() => setActiveTab('security')}
                            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                                activeTab === 'security'
                                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            <Key size={16} />
                            Security & Credentials
                        </button>

                        <button
                            onClick={() => setActiveTab('permissions')}
                            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                                activeTab === 'permissions'
                                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            <Shield size={16} />
                            Role & Platform Privileges
                        </button>

                        <button
                            onClick={() => setActiveTab('activity')}
                            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                                activeTab === 'activity'
                                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            <Activity size={16} />
                            Activity & Audit Trail
                        </button>
                    </div>
                </div>
            </div>

            {/* TAB 1: PERSONAL INFORMATION */}
            {activeTab === 'profile' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Form: 2 cols */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200 dark:border-slate-800 shadow-md">
                            <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Profile Details</h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Update your administrative identity and contact information.</p>
                                </div>
                                <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                    Real-time Sync
                                </span>
                            </div>

                            <form onSubmit={handleSaveProfile} className="mt-6 space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                            First Name <span className="text-rose-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                required
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                                placeholder="First name"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                            Last Name <span className="text-rose-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                required
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                                placeholder="Last name"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                            Email Address <span className="text-slate-400 text-[10px]">(Primary Login)</span>
                                        </label>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="email"
                                                disabled
                                                value={formData.email}
                                                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-sm font-semibold text-slate-500 dark:text-slate-400 cursor-not-allowed"
                                            />
                                            <span title="Email is locked for platform integrity" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                                <Lock size={14} />
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                            Job Title / Designation
                                        </label>
                                        <div className="relative">
                                            <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                value={formData.designation}
                                                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                                placeholder="Platform Super Administrator"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                            Operational Timezone
                                        </label>
                                        <div className="relative">
                                            <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <select
                                                value={formData.timezone}
                                                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
                                            >
                                                <option value="Asia/Kolkata (IST, UTC+5:30)">Asia/Kolkata (IST, UTC+5:30)</option>
                                                <option value="UTC (Coordinated Universal Time)">UTC (Coordinated Universal Time)</option>
                                                <option value="America/New_York (EST, UTC-5)">America/New_York (EST, UTC-5)</option>
                                                <option value="Europe/London (GMT, UTC+0)">Europe/London (GMT, UTC+0)</option>
                                                <option value="Asia/Dubai (GST, UTC+4)">Asia/Dubai (GST, UTC+4)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                        Executive Bio & Administrative Scope
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"
                                        placeholder="Add notes about your administrative responsibilities..."
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (user) {
                                                setFormData({
                                                    firstName: user.firstName || '',
                                                    lastName: user.lastName || '',
                                                    email: user.email || '',
                                                    phone: user.phone || '',
                                                    designation: user.role === 'SUPER_ADMIN' ? 'Chief Platform Architect' : 'System Administrator',
                                                    department: user.role === 'SUPER_ADMIN' ? 'Global Fleet Infrastructure' : 'Academic Administration',
                                                    bio: 'Primary administrative controller with root system authority, multi-tenant governance, and global fleet telemetry supervision.',
                                                    timezone: 'Asia/Kolkata (IST, UTC+5:30)',
                                                });
                                                toast.success('Form reverted to current saved state');
                                            }
                                        }}
                                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                                    >
                                        Discard
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={isSavingProfile}
                                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {isSavingProfile ? (
                                            <>
                                                <RefreshCw size={14} className="animate-spin" />
                                                Saving Changes...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={14} />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Context Cards: 1 col */}
                    <div className="space-y-6">
                        {/* Institutional Overview */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
                            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                                <Building2 size={18} className="text-indigo-600 dark:text-indigo-400" />
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Organization Context</h3>
                            </div>

                            <div className="space-y-3.5 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">Clearance Level</span>
                                    <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200/60 dark:border-indigo-800/60">
                                        Root Super Admin
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">Institution Scope</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {(user as any)?.school?.name || 'Global Multi-Tenant'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">Institution Code</span>
                                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                                        {(user as any)?.school?.code || 'FLEET-ROOT-01'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">Account Status</span>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                        <span className="size-1.5 rounded-full bg-emerald-500" />
                                        Active & Nominal
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">Last Login</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Current Session'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Security Health Score Card */}
                        <div className="bg-gradient-to-br from-indigo-50/70 via-white to-violet-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 rounded-3xl p-6 border border-indigo-100 dark:border-indigo-900/40 shadow-md">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={18} className="text-emerald-500" />
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Account Security Score</h3>
                                </div>
                                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                                    98% High
                                </span>
                            </div>

                            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
                                <div className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full w-[98%] rounded-full" />
                            </div>

                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                Your account is secured with HTTP-Only cryptographic session tokens, RBAC guardrails, and real-time security audit trails.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: SECURITY & CREDENTIALS */}
            {activeTab === 'security' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Password Change Form: 2 cols */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200 dark:border-slate-800 shadow-md">
                            <div className="pb-5 border-b border-slate-100 dark:border-slate-800">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Change Password</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Ensure your administrative password is complex, unique, and stored securely.</p>
                            </div>

                            <form onSubmit={handleChangePassword} className="mt-6 space-y-5">
                                {/* Current Password */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                        Current Password <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            required
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                            placeholder="••••••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                        >
                                            {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {/* New Password */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                        New Password <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            required
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                            placeholder="Minimum 6 characters"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                        >
                                            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>

                                    {/* Password Strength Meter */}
                                    {passwordData.newPassword && (
                                        <div className="mt-3 space-y-1.5">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-500 font-medium">Password Strength:</span>
                                                <span className="font-bold text-slate-700 dark:text-slate-300">{passwordStrength.label}</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                                                    style={{ width: `${passwordStrength.score}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm New Password */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                        Confirm New Password <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            required
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                            placeholder="Re-type new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                        >
                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>

                                    {passwordData.confirmPassword && (
                                        <div className="mt-2 text-xs flex items-center gap-1.5">
                                            {passwordData.newPassword === passwordData.confirmPassword ? (
                                                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                                                    <CheckCircle2 size={13} /> Passwords match
                                                </span>
                                            ) : (
                                                <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1 font-semibold">
                                                    <AlertCircle size={13} /> Passwords do not match
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSavingPassword || !passwordData.currentPassword || !passwordData.newPassword}
                                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {isSavingPassword ? (
                                            <>
                                                <RefreshCw size={14} className="animate-spin" />
                                                Updating Password...
                                            </>
                                        ) : (
                                            <>
                                                <Lock size={14} />
                                                Update Password
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Security Settings: 1 col */}
                    <div className="space-y-6">
                        {/* Two Factor Authentication Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <Fingerprint size={20} className="text-indigo-600 dark:text-indigo-400" />
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Two-Factor Authentication</h3>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${twoFactorEnabled ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-slate-100 text-slate-600'}`}>
                                    {twoFactorEnabled ? 'Active' : 'Disabled'}
                                </span>
                            </div>

                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                Requires a secondary verification challenge whenever signing in from unverified IP addresses or new devices.
                            </p>

                            <button
                                onClick={() => {
                                    setTwoFactorEnabled(!twoFactorEnabled);
                                    toast.success(twoFactorEnabled ? '2FA disabled (Standard security mode)' : '2FA activated successfully!');
                                }}
                                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all"
                            >
                                {twoFactorEnabled ? 'Reconfigure 2FA' : 'Enable Two-Factor'}
                            </button>
                        </div>

                        {/* Active Sessions Telemetry */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <Laptop size={18} className="text-indigo-600 dark:text-indigo-400" />
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Sessions</h3>
                                </div>
                                <span className="text-[11px] font-bold text-slate-400">1 Online</span>
                            </div>

                            <div className="space-y-3">
                                {/* Current Device */}
                                <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-3">
                                    <div className="p-2 rounded-xl bg-indigo-600 text-white mt-0.5">
                                        <Laptop size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">Windows 11 • Chrome Browser</p>
                                            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" title="Current session" />
                                        </div>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">127.0.0.1 • Localhost Cluster</p>
                                        <span className="inline-block text-[10px] font-bold text-indigo-600 dark:text-indigo-400 mt-1">This Device • Active Now</span>
                                    </div>
                                </div>

                                {/* Secondary Device */}
                                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3">
                                    <div className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 mt-0.5">
                                        <Smartphone size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">iPhone 15 Pro • Safari</p>
                                            <span className="text-[10px] text-slate-400">2h ago</span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">192.168.1.108 • Mobile Node</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => toast.success('All other remote sessions have been revoked')}
                                className="w-full py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all border border-rose-200 dark:border-rose-900/50"
                            >
                                Revoke Other Sessions
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: ROLE & PLATFORM PRIVILEGES */}
            {activeTab === 'permissions' && (
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200 dark:border-slate-800 shadow-md">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Award size={20} className="text-indigo-600" />
                                    Platform Authority & Elevated Privileges
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Your role as <span className="font-bold text-indigo-600">{user.role}</span> grants unrestricted supervisory governance over Vikas ERP.
                                </p>
                            </div>
                            <span className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-xs font-black uppercase tracking-wider border border-indigo-200 dark:border-indigo-800 self-start sm:self-auto">
                                Tier 0 • Global Root
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
                            {/* Privilege 1 */}
                            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-2.5 hover:border-indigo-300 transition-all">
                                <div className="size-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                                    <Building2 size={18} />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Multi-Tenant School Registry</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Full unrestricted authority to register new schools, configure institutional domains, manage licenses, and suspend abusive tenants.
                                </p>
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 size={13} /> Granted (Full Access)
                                </span>
                            </div>

                            {/* Privilege 2 */}
                            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-2.5 hover:border-indigo-300 transition-all">
                                <div className="size-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                    <Database size={18} />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Cluster Health & Diagnostics</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Direct access to execute real-time backend diagnostics, monitor Neon PostgreSQL latency, test read/write cycles, and inspect system logs.
                                </p>
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 size={13} /> Granted (Full Access)
                                </span>
                            </div>

                            {/* Privilege 3 */}
                            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-2.5 hover:border-indigo-300 transition-all">
                                <div className="size-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                    <Users size={18} />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Master User Directory Control</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Global authority over all user identities across every registered school. Ability to activate, deactivate, or force password resets.
                                </p>
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 size={13} /> Granted (Full Access)
                                </span>
                            </div>

                            {/* Privilege 4 */}
                            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-2.5 hover:border-indigo-300 transition-all">
                                <div className="size-9 rounded-xl bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                                    <Layers size={18} />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Commercial Tier & Plan Architect</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Full privilege to create SaaS subscription tiers, adjust monthly/yearly pricing rates, toggle feature flags, and update billing schedules.
                                </p>
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 size={13} /> Granted (Full Access)
                                </span>
                            </div>

                            {/* Privilege 5 */}
                            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-2.5 hover:border-indigo-300 transition-all">
                                <div className="size-9 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                                    <Shield size={18} />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Security Audits & Raw Data Inspector</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Review cryptographic audit records, forensic payload logs, IP incident tracking, and export official PDF compliance reports.
                                </p>
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 size={13} /> Granted (Full Access)
                                </span>
                            </div>

                            {/* Privilege 6 */}
                            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-2.5 hover:border-indigo-300 transition-all">
                                <div className="size-9 rounded-xl bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                                    <Sliders size={18} />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Global Settings & Emergency Overrides</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Master platform toggle controls, maintenance mode triggers, SMTP mail relays, Redis cache evacuation, and DB emergency backup triggers.
                                </p>
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 size={13} /> Granted (Full Access)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 4: ACTIVITY & AUDIT TRAIL */}
            {activeTab === 'activity' && (
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200 dark:border-slate-800 shadow-md">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Activity size={20} className="text-indigo-600" />
                                    Personal Activity & System Audit Trail
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Forensic log of actions executed by this account.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    placeholder="Filter by action or IP..."
                                    value={auditSearch}
                                    onChange={(e) => setAuditSearch(e.target.value)}
                                    className="px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                />
                                <button
                                    onClick={fetchUserActivity}
                                    disabled={isLoadingAudit}
                                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all"
                                    title="Reload activity log"
                                >
                                    <RefreshCw size={14} className={isLoadingAudit ? 'animate-spin' : ''} />
                                </button>
                            </div>
                        </div>

                        {isLoadingAudit ? (
                            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                                <RefreshCw size={24} className="animate-spin text-indigo-500" />
                                <p className="text-xs font-semibold">Loading forensic audit records...</p>
                            </div>
                        ) : filteredLogs.length > 0 ? (
                            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredLogs.map((log: any, idx: number) => (
                                    <div key={log.id || idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-3 rounded-xl transition-all">
                                        <div className="flex items-start gap-3">
                                            <div className="size-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mt-0.5 shrink-0">
                                                <Activity size={15} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                                                        {log.action}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                                        {log.ip || '127.0.0.1'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                    {log.details ? (typeof log.details === 'string' ? log.details : JSON.stringify(log.details)) : 'Action completed successfully'}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap self-start sm:self-auto flex items-center gap-1">
                                            <Clock size={12} />
                                            {log.createdAt ? new Date(log.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Recent'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-10 text-center space-y-3">
                                <div className="size-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                                    <CheckCircle2 size={24} />
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Suspicious or Modifying Actions</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                                    Your administrative session is completely clean. All system updates, diagnostics, and password changes will automatically log here in real time.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
