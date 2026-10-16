import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Settings,
    Globe,
    Mail,
    Lock,
    Save,
    Building2,
    ShieldCheck,
    Bell,
    Database,
    RefreshCw,
    CheckCircle2,
    Send,
    Download,
    Trash2,
    ChevronRight,
    AlertTriangle,
    Sliders,
    Smartphone,
    Server
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { superAdminService } from '@/services/super-admin.service';
import { toast } from 'react-hot-toast';

export default function GlobalSettings() {
    const [activeTab, setActiveTab] = useState<'general' | 'onboarding' | 'security' | 'gateways' | 'maintenance'>('general');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testingEmail, setTestingEmail] = useState(false);
    const [testEmailAddress, setTestEmailAddress] = useState('');
    const [backingUp, setBackingUp] = useState(false);
    const [clearingCache, setClearingCache] = useState(false);

    // Master settings state
    const [settings, setSettings] = useState<any>({
        general: {
            platformName: 'Vikas ERP',
            tagline: 'Next-Gen Multi-School Operating System',
            supportEmail: 'support@vikaserp.com',
            supportPhone: '+91 98290 00001',
            currency: 'INR',
            currencySymbol: '₹',
            timezone: 'Asia/Kolkata',
            academicYear: '2026-2027',
            dateFormat: 'DD/MM/YYYY',
        },
        onboarding: {
            allowSelfRegistration: true,
            requireAdminApproval: true,
            defaultTrialDays: 30,
            maxTrialStudents: 150,
            defaultPlan: 'Starter Trial',
            subdomainFormat: '{code}.vikaserp.com',
        },
        security: {
            require2FA: false,
            sessionTimeoutMinutes: 60,
            maxLoginAttempts: 5,
            enforceStrongPassword: true,
            passwordExpiryDays: 90,
            allowMultipleLogins: false,
        },
        smtp: {
            provider: 'SendGrid',
            host: 'smtp.sendgrid.net',
            port: 587,
            secure: false,
            senderEmail: 'notifications@vikaserp.com',
            senderName: 'Vikas ERP Notifications',
            username: 'apikey',
        },
        notifications: {
            emailEnabled: true,
            smsEnabled: true,
            smsProvider: 'Fast2SMS India',
            whatsappEnabled: true,
        },
        maintenance: {
            maintenanceMode: false,
            maintenanceMessage: 'Scheduled system upgrades are currently in progress. All school records remain fully secure.',
            emergencyAlert: '',
            lastBackup: new Date().toISOString(),
        },
    });

    const fetchSettings = async () => {
        try {
            const data = await superAdminService.getSettings();
            if (data) {
                setSettings((prev: any) => ({ ...prev, ...data }));
            }
        } catch (error) {
            console.error('Failed to load settings', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await superAdminService.updateSettings(settings);
            toast.success('Global configuration saved successfully!');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleSendTestEmail = async () => {
        if (!testEmailAddress) {
            toast.error('Please enter a recipient email address');
            return;
        }
        setTestingEmail(true);
        try {
            const res = await superAdminService.sendTestEmail(testEmailAddress);
            toast.success(res?.message || `Test email dispatched to ${testEmailAddress}`);
            setTestEmailAddress('');
        } catch (error) {
            toast.error('Failed to send test email');
        } finally {
            setTestingEmail(false);
        }
    };

    const handleBackupDatabase = async () => {
        setBackingUp(true);
        try {
            const res = await superAdminService.backupDatabase();
            toast.success(res?.message || 'Database snapshot generated successfully');
            setSettings((prev: any) => ({
                ...prev,
                maintenance: { ...prev.maintenance, lastBackup: res.timestamp || new Date().toISOString() }
            }));
        } catch (error) {
            toast.error('Failed to backup database');
        } finally {
            setBackingUp(false);
        }
    };

    const handleClearCache = async () => {
        setClearingCache(true);
        try {
            const res = await superAdminService.clearCache();
            toast.success(res?.message || 'System cache cleared');
        } catch (error) {
            toast.error('Failed to clear cache');
        } finally {
            setClearingCache(false);
        }
    };

    const updateNestedField = (section: string, field: string, value: any) => {
        setSettings((prev: any) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300 pb-16">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Link href="/super-admin/dashboard" className="hover:text-primary transition-colors">
                    Super Admin
                </Link>
                <ChevronRight size={14} />
                <span className="font-semibold text-slate-900 dark:text-white">Global Settings</span>
            </div>

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                            <Settings size={26} />
                        </div>
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                Platform Global Settings
                            </h1>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Super Admin central control for branding, multi-tenancy, security, gateways, and maintenance.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/25 active:scale-95 disabled:opacity-50"
                    >
                        <Save size={15} className={`mr-2 ${saving ? 'animate-spin' : ''}`} />
                        {saving ? 'Saving...' : 'Save All Changes'}
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                {[
                    { id: 'general', label: 'General & Identity', icon: Globe },
                    { id: 'onboarding', label: 'School Onboarding Policy', icon: Building2 },
                    { id: 'security', label: 'Security & Access', icon: ShieldCheck },
                    { id: 'gateways', label: 'Email, SMS & Alerts', icon: Mail },
                    { id: 'maintenance', label: 'Maintenance & Backups', icon: Database },
                ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                isActive
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                        >
                            <Icon size={15} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* TAB CONTENT */}

            {/* 1. General Settings */}
            {activeTab === 'general' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                            <Globe className="text-indigo-600 size-5" />
                            <h3 className="font-bold text-base text-slate-900 dark:text-white">Platform Branding</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                    Platform Name
                                </label>
                                <input
                                    type="text"
                                    value={settings.general.platformName}
                                    onChange={(e) => updateNestedField('general', 'platformName', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                    Platform Tagline
                                </label>
                                <input
                                    type="text"
                                    value={settings.general.tagline}
                                    onChange={(e) => updateNestedField('general', 'tagline', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                        Default Currency
                                    </label>
                                    <select
                                        value={settings.general.currency}
                                        onChange={(e) => {
                                            const curr = e.target.value;
                                            updateNestedField('general', 'currency', curr);
                                            updateNestedField('general', 'currencySymbol', curr === 'INR' ? '₹' : '$');
                                        }}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="INR">₹ INR (Indian Rupee)</option>
                                        <option value="USD">$ USD (US Dollar)</option>
                                        <option value="EUR">€ EUR (Euro)</option>
                                        <option value="GBP">£ GBP (British Pound)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                        Academic Year
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.general.academicYear}
                                        onChange={(e) => updateNestedField('general', 'academicYear', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                            <Sliders className="text-emerald-600 size-5" />
                            <h3 className="font-bold text-base text-slate-900 dark:text-white">Localization & Contact</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                    Official Support Email
                                </label>
                                <input
                                    type="email"
                                    value={settings.general.supportEmail}
                                    onChange={(e) => updateNestedField('general', 'supportEmail', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                    Support Helpline Number
                                </label>
                                <input
                                    type="text"
                                    value={settings.general.supportPhone}
                                    onChange={(e) => updateNestedField('general', 'supportPhone', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                        Default Timezone
                                    </label>
                                    <select
                                        value={settings.general.timezone}
                                        onChange={(e) => updateNestedField('general', 'timezone', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                                        <option value="UTC">UTC (Coordinated Universal Time)</option>
                                        <option value="America/New_York">America/New_York (EST)</option>
                                        <option value="Asia/Dubai">Asia/Dubai (GST +4:00)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                        Date Format
                                    </label>
                                    <select
                                        value={settings.general.dateFormat}
                                        onChange={(e) => updateNestedField('general', 'dateFormat', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="DD/MM/YYYY">DD/MM/YYYY (Indian Standard)</option>
                                        <option value="MM/DD/YYYY">MM/DD/YYYY (US Standard)</option>
                                        <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Onboarding Policy */}
            {activeTab === 'onboarding' && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <Building2 className="text-indigo-600 size-5" />
                        <div>
                            <h3 className="font-bold text-base text-slate-900 dark:text-white">Institution Registration Policy</h3>
                            <p className="text-xs text-slate-500">Govern how new schools and campuses register and provision instances.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                            <div>
                                <p className="font-bold text-xs text-slate-900 dark:text-white">Allow Public Self-Registration</p>
                                <p className="text-[11px] text-slate-500">Allow schools to sign up via public onboarding portal.</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.onboarding.allowSelfRegistration}
                                onChange={(e) => updateNestedField('onboarding', 'allowSelfRegistration', e.target.checked)}
                                className="size-5 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                            <div>
                                <p className="font-bold text-xs text-slate-900 dark:text-white">Require Super Admin Approval</p>
                                <p className="text-[11px] text-slate-500">New school accounts remain pending until manually verified by you.</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.onboarding.requireAdminApproval}
                                onChange={(e) => updateNestedField('onboarding', 'requireAdminApproval', e.target.checked)}
                                className="size-5 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Default Evaluation Period (Days)
                            </label>
                            <input
                                type="number"
                                min="7"
                                max="90"
                                value={settings.onboarding.defaultTrialDays}
                                onChange={(e) => updateNestedField('onboarding', 'defaultTrialDays', parseInt(e.target.value) || 30)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Maximum Trial Student Capacity
                            </label>
                            <input
                                type="number"
                                min="50"
                                max="1000"
                                value={settings.onboarding.maxTrialStudents}
                                onChange={(e) => updateNestedField('onboarding', 'maxTrialStudents', parseInt(e.target.value) || 150)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Default Provisioned Plan
                            </label>
                            <input
                                type="text"
                                value={settings.onboarding.defaultPlan}
                                onChange={(e) => updateNestedField('onboarding', 'defaultPlan', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Subdomain Routing Pattern
                            </label>
                            <input
                                type="text"
                                value={settings.onboarding.subdomainFormat}
                                onChange={(e) => updateNestedField('onboarding', 'subdomainFormat', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Security & Access */}
            {activeTab === 'security' && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <ShieldCheck className="text-purple-600 size-5" />
                        <div>
                            <h3 className="font-bold text-base text-slate-900 dark:text-white">Security & Authentication Protocols</h3>
                            <p className="text-xs text-slate-500">Configure global login defenses, session timeouts, and password compliance.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                            <div>
                                <p className="font-bold text-xs text-slate-900 dark:text-white">Require Super Admin 2FA</p>
                                <p className="text-[11px] text-slate-500">Enforce OTP/Authenticator for platform administrator logins.</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.security.require2FA}
                                onChange={(e) => updateNestedField('security', 'require2FA', e.target.checked)}
                                className="size-5 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                            <div>
                                <p className="font-bold text-xs text-slate-900 dark:text-white">Enforce Strong Password Complexity</p>
                                <p className="text-[11px] text-slate-500">Require uppercase, lowercase, numbers, and symbols across all schools.</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.security.enforceStrongPassword}
                                onChange={(e) => updateNestedField('security', 'enforceStrongPassword', e.target.checked)}
                                className="size-5 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Inactivity Session Timeout
                            </label>
                            <select
                                value={settings.security.sessionTimeoutMinutes}
                                onChange={(e) => updateNestedField('security', 'sessionTimeoutMinutes', parseInt(e.target.value))}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="15">15 Minutes</option>
                                <option value="30">30 Minutes</option>
                                <option value="60">60 Minutes (1 Hour)</option>
                                <option value="240">4 Hours</option>
                                <option value="1440">24 Hours</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Max Failed Login Attempts (Lockout)
                            </label>
                            <select
                                value={settings.security.maxLoginAttempts}
                                onChange={(e) => updateNestedField('security', 'maxLoginAttempts', parseInt(e.target.value))}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="3">3 Attempts (High Security)</option>
                                <option value="5">5 Attempts (Standard)</option>
                                <option value="10">10 Attempts (Relaxed)</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. Gateways: SMTP & SMS */}
            {activeTab === 'gateways' && (
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                            <Mail className="text-emerald-600 size-5" />
                            <div>
                                <h3 className="font-bold text-base text-slate-900 dark:text-white">SMTP Email Gateway</h3>
                                <p className="text-xs text-slate-500">Configure global transaction email server for passwords, invoices, and notices.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                    SMTP Server Host
                                </label>
                                <input
                                    type="text"
                                    value={settings.smtp.host}
                                    onChange={(e) => updateNestedField('smtp', 'host', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                    SMTP Port
                                </label>
                                <input
                                    type="number"
                                    value={settings.smtp.port}
                                    onChange={(e) => updateNestedField('smtp', 'port', parseInt(e.target.value) || 587)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                    Sender Email (From)
                                </label>
                                <input
                                    type="email"
                                    value={settings.smtp.senderEmail}
                                    onChange={(e) => updateNestedField('smtp', 'senderEmail', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                    Sender Display Name
                                </label>
                                <input
                                    type="text"
                                    value={settings.smtp.senderName}
                                    onChange={(e) => updateNestedField('smtp', 'senderName', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Test Email Box */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                            <input
                                type="email"
                                placeholder="Enter email to test SMTP dispatch (e.g. your@email.com)"
                                value={testEmailAddress}
                                onChange={(e) => setTestEmailAddress(e.target.value)}
                                className="w-full sm:flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                type="button"
                                onClick={handleSendTestEmail}
                                disabled={testingEmail}
                                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Send size={14} className={testingEmail ? 'animate-spin' : ''} />
                                {testingEmail ? 'Sending...' : 'Send Test Email'}
                            </button>
                        </div>
                    </div>

                    {/* SMS & Alerts Gateway */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                            <Smartphone className="text-blue-600 size-5" />
                            <div>
                                <h3 className="font-bold text-base text-slate-900 dark:text-white">SMS & WhatsApp Alerts Gateway</h3>
                                <p className="text-xs text-slate-500">Provider channels for parent attendance SMS and emergency broadcast alerts.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-xs text-slate-900 dark:text-white">SMS Gateway Active</p>
                                    <p className="text-[11px] text-slate-500">Dispatch SMS alerts for student attendance.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.smsEnabled}
                                    onChange={(e) => updateNestedField('notifications', 'smsEnabled', e.target.checked)}
                                    className="size-5 text-indigo-600 rounded focus:ring-indigo-500"
                                />
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-xs text-slate-900 dark:text-white">WhatsApp Business Webhook</p>
                                    <p className="text-[11px] text-slate-500">Send PDF fee receipts to parents via WhatsApp.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.whatsappEnabled}
                                    onChange={(e) => updateNestedField('notifications', 'whatsappEnabled', e.target.checked)}
                                    className="size-5 text-indigo-600 rounded focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                    SMS Provider
                                </label>
                                <select
                                    value={settings.notifications.smsProvider}
                                    onChange={(e) => updateNestedField('notifications', 'smsProvider', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="Fast2SMS India">Fast2SMS (India DLT Compliant)</option>
                                    <option value="Twilio Global">Twilio (Global Multi-Country)</option>
                                    <option value="MSG91">MSG91 Enterprise</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 5. Maintenance & Disaster Recovery */}
            {activeTab === 'maintenance' && (
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                            <AlertTriangle className="text-amber-500 size-5" />
                            <div>
                                <h3 className="font-bold text-base text-slate-900 dark:text-white">System Maintenance Mode</h3>
                                <p className="text-xs text-slate-500">Toggle offline status and broadcast emergency updates to all school tenants.</p>
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm text-amber-900 dark:text-amber-200">
                                        Platform Maintenance Mode
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        settings.maintenance.maintenanceMode
                                            ? 'bg-rose-500 text-white'
                                            : 'bg-emerald-500 text-white'
                                    }`}>
                                        {settings.maintenance.maintenanceMode ? 'ACTIVE - SYSTEM OFFLINE' : 'NORMAL - ONLINE'}
                                    </span>
                                </div>
                                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                                    When activated, school portals will show the maintenance screen while Super Admin retains access.
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.maintenance.maintenanceMode}
                                onChange={(e) => updateNestedField('maintenance', 'maintenanceMode', e.target.checked)}
                                className="size-6 text-amber-600 rounded focus:ring-amber-500 cursor-pointer"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Public Maintenance Message Displayed to Schools
                            </label>
                            <textarea
                                rows={2}
                                value={settings.maintenance.maintenanceMessage}
                                onChange={(e) => updateNestedField('maintenance', 'maintenanceMessage', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                            <Database className="text-indigo-600 size-5" />
                            <div>
                                <h3 className="font-bold text-base text-slate-900 dark:text-white">Database Backup & Cache Operations</h3>
                                <p className="text-xs text-slate-500">Trigger Neon PostgreSQL database snapshots and clear runtime caches.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                                <div>
                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Database Snapshot</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Last snapshot: <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{new Date(settings.maintenance.lastBackup).toLocaleString()}</span>
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleBackupDatabase}
                                    disabled={backingUp}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-indigo-700 disabled:opacity-50 gap-2"
                                >
                                    <Download size={14} className={backingUp ? 'animate-spin' : ''} />
                                    {backingUp ? 'Creating Snapshot...' : 'Initiate DB Snapshot Now'}
                                </button>
                            </div>

                            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                                <div>
                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Cache & Session Flusher</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Purge temporary cache states and force fresh queries.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleClearCache}
                                    disabled={clearingCache}
                                    className="inline-flex items-center px-4 py-2 bg-slate-800 text-slate-200 dark:bg-slate-700 rounded-xl text-xs font-bold hover:bg-slate-900 disabled:opacity-50 gap-2"
                                >
                                    <Trash2 size={14} className={clearingCache ? 'animate-spin' : ''} />
                                    {clearingCache ? 'Flushing...' : 'Clear App Caches'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
