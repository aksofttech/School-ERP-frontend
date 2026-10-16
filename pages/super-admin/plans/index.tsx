import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import SuperAdminLayout from '@/components/layouts/SuperAdminLayout';
import { superAdminService } from '@/services/super-admin.service';
import { toast } from 'react-hot-toast';
import {
    CreditCard,
    Plus,
    Check,
    CheckCircle2,
    Edit3,
    Trash2,
    Sparkles,
    Shield,
    Zap,
    Crown,
    X,
    ChevronRight,
    RefreshCw,
    ToggleLeft,
    ToggleRight,
    Building2,
    Users
} from 'lucide-react';

interface Plan {
    id: string;
    name: string;
    description?: string;
    price: number;
    duration?: number;
    isActive: boolean;
    createdAt?: string;
}

// Curated default features list per plan tier
const PLAN_DEFAULT_FEATURES: Record<string, string[]> = {
    'Starter Trial': [
        'Up to 150 Student Profiles',
        'Student & Teacher Attendance',
        'Digital Notice Board & Events',
        'Basic Gradebook & Report Cards',
        'Email Support'
    ],
    'Standard Campus': [
        'Up to 1,000 Student Profiles',
        'Complete Fee Collection & Invoicing',
        'Automated Timetable Generator',
        'Parent & Student Mobile Portal',
        'SMS & WhatsApp Notifications',
        'Standard Email & Chat Support'
    ],
    'Pro Institutional': [
        'Up to 3,000 Student Profiles',
        'Online Examination & CBT Module',
        'School Bus GPS Fleet Tracking',
        'Staff Payroll & HR Management',
        'Advanced Analytics & PDF Reports',
        'Priority Phone & WhatsApp Support'
    ],
    'Enterprise Apex': [
        'Unlimited Students & Multiple Branches',
        'Custom School Domain & Branding',
        'Biometric & RFID Hardware Sync',
        'Dedicated Technical Account Manager',
        '99.9% Uptime Guarantee & Custom SLA',
        'Automated Hourly Cloud Backups'
    ]
};

export default function PlansList() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Modal states
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        duration: '12',
        description: '',
        isActive: true
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchPlans = async () => {
        try {
            const res = await superAdminService.getPlans();
            const list = Array.isArray(res) ? res : (res?.data || []);
            setPlans(list);
        } catch (error) {
            console.error('Failed to fetch plans:', error);
            toast.error('Failed to load subscription plans');
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleOpenCreate = () => {
        setFormData({
            name: '',
            price: '',
            duration: '12',
            description: '',
            isActive: true
        });
        setIsCreateOpen(true);
    };

    const handleOpenEdit = (plan: Plan) => {
        setEditingPlan(plan);
        setFormData({
            name: plan.name,
            price: plan.price.toString(),
            duration: (plan.duration || 12).toString(),
            description: plan.description || '',
            isActive: plan.isActive
        });
    };

    const handleSubmitCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error('Plan name is required');
            return;
        }
        setSubmitting(true);
        try {
            await superAdminService.createPlan({
                name: formData.name.trim(),
                price: parseFloat(formData.price) || 0,
                duration: parseInt(formData.duration, 10) || 12,
                description: formData.description.trim() || undefined,
            });
            toast.success(`Plan "${formData.name}" created successfully!`);
            setIsCreateOpen(false);
            fetchPlans();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create plan');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPlan) return;
        setSubmitting(true);
        try {
            await superAdminService.updatePlan(editingPlan.id, {
                name: formData.name.trim(),
                price: parseFloat(formData.price) || 0,
                duration: parseInt(formData.duration, 10) || 12,
                description: formData.description.trim() || undefined,
                isActive: formData.isActive
            });
            toast.success(`Plan "${formData.name}" updated successfully!`);
            setEditingPlan(null);
            fetchPlans();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update plan');
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleStatus = async (plan: Plan) => {
        try {
            await superAdminService.updatePlan(plan.id, {
                isActive: !plan.isActive
            });
            toast.success(`Plan "${plan.name}" is now ${!plan.isActive ? 'Active' : 'Disabled'}`);
            setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, isActive: !p.isActive } : p));
        } catch (error) {
            toast.error('Failed to change plan status');
        }
    };

    const handleDeletePlan = async (plan: Plan) => {
        if (!confirm(`Are you sure you want to delete the plan "${plan.name}"?`)) return;
        try {
            await superAdminService.deletePlan(plan.id);
            toast.success(`Plan "${plan.name}" deleted.`);
            setPlans(prev => prev.filter(p => p.id !== plan.id));
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete plan');
        }
    };

    const getPlanFeatures = (name: string) => {
        return PLAN_DEFAULT_FEATURES[name] || [
            'Student & Faculty Database Management',
            'Attendance & Exam Management',
            'School Fee Invoicing System',
            'Multi-Role Dashboards & Permissions',
            'Cloud Backups & 24/7 Security'
        ];
    };

    const getPlanIcon = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes('enterprise') || lower.includes('apex')) return <Crown className="size-6 text-amber-500" />;
        if (lower.includes('pro') || lower.includes('institutional')) return <Sparkles className="size-6 text-indigo-500" />;
        if (lower.includes('standard') || lower.includes('campus')) return <Zap className="size-6 text-blue-500" />;
        return <Shield className="size-6 text-emerald-500" />;
    };

    return (
        <SuperAdminLayout>
            <Head>
                <title>Subscription Plans - Vikas ERP Super Admin</title>
            </Head>

            <div className="space-y-8 animate-in fade-in duration-300 pb-16">
                {/* Breadcrumb Navigation */}
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Link href="/super-admin/dashboard" className="hover:text-primary transition-colors">
                        Super Admin
                    </Link>
                    <ChevronRight size={14} />
                    <span className="font-semibold text-slate-900 dark:text-white">
                        Subscription Plans
                    </span>
                </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                <CreditCard size={26} />
                            </div>
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                    Monetization & Plans
                                </h1>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                    Manage pricing tiers, institutional subscription rates, and features.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { setIsRefreshing(true); fetchPlans(); }}
                            disabled={isRefreshing}
                            className="inline-flex items-center px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
                        >
                            <RefreshCw size={14} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                            Sync Plans
                        </button>
                        <button
                            onClick={handleOpenCreate}
                            className="inline-flex items-center px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/25 active:scale-95"
                        >
                            <Plus size={16} className="mr-1.5" />
                            Draft New Tier
                        </button>
                    </div>
                </div>

                {/* Plans Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array(4).fill(0).map((_, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 animate-pulse space-y-4">
                                <div className="h-8 w-24 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                                <div className="h-10 w-32 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                                <div className="space-y-2 pt-4">
                                    <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded"></div>
                                    <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                    <div className="h-4 w-5/6 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : plans.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-dashed border-slate-300 dark:border-slate-700 space-y-4">
                        <CreditCard size={48} className="mx-auto text-slate-400" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">No active plans found</h3>
                        <p className="text-sm text-slate-500 max-w-md mx-auto">
                            Get started by creating your first subscription tier for participating schools.
                        </p>
                        <button
                            onClick={handleOpenCreate}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-indigo-700"
                        >
                            <Plus size={16} className="mr-2" />
                            Create First Plan
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {plans.map((plan) => {
                            const isPro = plan.name.toLowerCase().includes('pro');
                            const isEnterprise = plan.name.toLowerCase().includes('enterprise');
                            const features = getPlanFeatures(plan.name);

                            return (
                                <div
                                    key={plan.id}
                                    className={`relative bg-white dark:bg-slate-900 rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between hover:shadow-xl ${
                                        isPro
                                            ? 'border-indigo-500/60 shadow-indigo-500/10 dark:border-indigo-500/40 ring-1 ring-indigo-500/20'
                                            : isEnterprise
                                            ? 'border-amber-500/50 shadow-amber-500/10 dark:border-amber-500/30'
                                            : 'border-slate-200 dark:border-slate-800'
                                    }`}
                                >
                                    <div>
                                        {/* Tier Badge / Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm">
                                                {getPlanIcon(plan.name)}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleToggleStatus(plan)}
                                                    title={plan.isActive ? 'Click to Disable' : 'Click to Enable'}
                                                    className="transition-transform active:scale-95"
                                                >
                                                    {plan.isActive ? (
                                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                            Draft
                                                        </span>
                                                    )}
                                                </button>
                                                {isPro && (
                                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
                                                        Popular
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Plan Name & Description */}
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1.5 tracking-tight">
                                            {plan.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed min-h-[36px]">
                                            {plan.description || 'Full institutional management suite for schools and academies.'}
                                        </p>

                                        {/* Price & Billing Duration */}
                                        <div className="mt-5 mb-6 pb-5 border-b border-slate-100 dark:border-slate-800">
                                            <div className="flex items-baseline gap-1.5">
                                                <span className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                                    {plan.price === 0 ? 'Free' : `₹${plan.price.toLocaleString('en-IN')}`}
                                                </span>
                                                {plan.price > 0 && (
                                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                        /{plan.duration === 1 ? 'Month' : `${plan.duration || 12} Mos`}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-slate-400 mt-1 font-medium">
                                                Billed {plan.duration === 1 ? 'monthly' : `annually (${plan.duration || 12} months)`}
                                            </p>
                                        </div>

                                        {/* Features List */}
                                        <div className="space-y-2.5 mb-6">
                                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                                                Included Capabilities
                                            </p>
                                            {features.map((feat, idx) => (
                                                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                                                    <div className="p-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                                                        <Check size={12} strokeWidth={3} />
                                                    </div>
                                                    <span className="leading-tight font-medium">{feat}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                                        <button
                                            onClick={() => handleOpenEdit(plan)}
                                            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Edit3 size={14} />
                                            Edit Rates & Details
                                        </button>
                                        <div className="flex items-center justify-between gap-2">
                                            <button
                                                onClick={() => handleToggleStatus(plan)}
                                                className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold py-1 px-2"
                                            >
                                                {plan.isActive ? 'Disable Tier' : 'Enable Tier'}
                                            </button>
                                            <button
                                                onClick={() => handleDeletePlan(plan)}
                                                className="text-[11px] text-rose-500 hover:text-rose-700 font-semibold py-1 px-2"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Create Plan Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 lg:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-xl">
                                    <Plus size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Draft New Subscription Tier
                                </h3>
                            </div>
                            <button
                                onClick={() => setIsCreateOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                    Plan Tier Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Premium Growth, Enterprise Plus"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                        Price (₹ INR) *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        required
                                        placeholder="e.g. 4999 (0 for free)"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                        Duration (Months)
                                    </label>
                                    <select
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="1">1 Month (Monthly)</option>
                                        <option value="3">3 Months (Quarterly)</option>
                                        <option value="6">6 Months (Half-Yearly)</option>
                                        <option value="12">12 Months (Annually)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Brief summary of who this plan is for and key advantages..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 disabled:opacity-50"
                                >
                                    {submitting ? 'Creating...' : 'Create Subscription Tier'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Plan Modal */}
            {editingPlan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 lg:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-xl">
                                    <Edit3 size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Edit Plan: {editingPlan.name}
                                </h3>
                            </div>
                            <button
                                onClick={() => setEditingPlan(null)}
                                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitEdit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                    Plan Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                        Price (₹ INR) *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                        Duration (Months)
                                    </label>
                                    <select
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="1">1 Month (Monthly)</option>
                                        <option value="3">3 Months (Quarterly)</option>
                                        <option value="6">6 Months (Half-Yearly)</option>
                                        <option value="12">12 Months (Annually)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="planActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                                />
                                <label htmlFor="planActive" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Active for new school subscriptions
                                </label>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setEditingPlan(null)}
                                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 disabled:opacity-50"
                                >
                                    {submitting ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </SuperAdminLayout>
    );
}
