import React, { useState, useEffect, useCallback } from 'react';
import {
    ShieldCheck,
    Layers,
    Clock,
    CreditCard,
    Search,
    SlidersHorizontal,
    Eye,
    EyeOff,
    Edit3,
    Trash2,
    Plus,
    ChevronLeft,
    ChevronRight,
    AlertTriangle,
    X,
    CheckCircle2,
    Copy,
    Download,
    RefreshCw,
    ExternalLink,
    Key,
    Shield,
    Calendar,
    Users,
    Check,
    Database
} from 'lucide-react';
import { superAdminService } from '@/services/super-admin.service';
import { toast } from 'react-hot-toast';

export interface LicenseItem {
    id: string | number;
    name: string;
    key: string;
    plan: string;
    seats: number;
    totalSeats: number;
    status: 'Active' | 'Expiring Soon' | 'Expired';
    expiry: string;
    autoRenew: boolean;
    icon: string;
    color: string;
    cost: string;
    vendor?: string;
    createdAt?: string;
    updatedAt?: string;
}

export default function LicenseManagement() {
    const [licenses, setLicenses] = useState<LicenseItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All Assets');
    const [visibleKeys, setVisibleKeys] = useState<Record<string | number, boolean>>({});
    const [copiedKeyId, setCopiedKeyId] = useState<string | number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bannerDismissed, setBannerDismissed] = useState(false);

    // Modal state for Provision New License
    const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
    const [newLicenseForm, setNewLicenseForm] = useState({
        name: '',
        plan: 'Enterprise',
        key: '',
        seats: 50,
        totalSeats: 100,
        expiry: '2027-12-31',
        cost: '₹3,000',
        autoRenew: true,
        color: 'indigo',
        vendor: 'Enterprise Software Group'
    });

    // Modal state for Edit License
    const [editingLicense, setEditingLicense] = useState<LicenseItem | null>(null);

    // Delete Confirmation
    const [deletingId, setDeletingId] = useState<string | number | null>(null);

    // Fetch Licenses from Neon Database
    const fetchLicenses = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await superAdminService.getLicenses({
                search: searchTerm,
                plan: filterType !== 'All Assets' ? filterType : undefined
            });
            setLicenses(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to load licenses from DB', error);
            toast.error('Failed to fetch real license data from database');
        } finally {
            setIsLoading(false);
        }
    }, [searchTerm, filterType]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchLicenses();
        }, 200);
        return () => clearTimeout(timer);
    }, [fetchLicenses]);

    // Toggle Key Visibility
    const toggleKeyVisibility = (id: string | number) => {
        setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Copy Key
    const handleCopyKey = (license: LicenseItem) => {
        navigator.clipboard.writeText(license.key);
        setCopiedKeyId(license.id);
        toast.success(`Copied key for ${license.name}`);
        setTimeout(() => setCopiedKeyId(null), 2000);
    };

    // Quick Renew in Real DB
    const handleRenewLicense = async (id: string | number) => {
        try {
            const updated = await superAdminService.renewLicense(id);
            setLicenses(prev => prev.map(lic => lic.id === id ? { ...lic, ...updated } : lic));
            toast.success('License renewed in database for 12 months!');
        } catch (error) {
            console.error('Renew error', error);
            toast.error('Failed to renew license in database');
        }
    };

    // Save New License in Real DB
    const handleCreateLicense = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLicenseForm.name) {
            toast.error('Please enter software asset name');
            return;
        }

        setIsSubmitting(true);
        try {
            const created = await superAdminService.createLicense(newLicenseForm);
            setLicenses(prev => [created, ...prev]);
            setIsProvisionModalOpen(false);
            setNewLicenseForm({
                name: '',
                plan: 'Enterprise',
                key: '',
                seats: 50,
                totalSeats: 100,
                expiry: '2027-12-31',
                cost: '₹3,000',
                autoRenew: true,
                color: 'indigo',
                vendor: 'Enterprise Software Group'
            });
            toast.success(`Provisioned ${created.name} in Neon DB!`);
        } catch (error) {
            console.error('Create license error', error);
            toast.error('Failed to create license in database');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Save Edited License in Real DB
    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingLicense) return;

        setIsSubmitting(true);
        try {
            const updated = await superAdminService.updateLicense(editingLicense.id, editingLicense);
            setLicenses(prev => prev.map(l => l.id === editingLicense.id ? { ...l, ...updated } : l));
            toast.success(`Updated ${editingLicense.name} in database`);
            setEditingLicense(null);
        } catch (error) {
            console.error('Update license error', error);
            toast.error('Failed to update license in database');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete License from Real DB
    const handleDeleteLicense = async (id: string | number) => {
        try {
            await superAdminService.deleteLicense(id);
            setLicenses(prev => prev.filter(l => l.id !== id));
            setDeletingId(null);
            toast.success('License asset permanently removed from database');
        } catch (error) {
            console.error('Delete license error', error);
            toast.error('Failed to delete license from database');
        }
    };

    // Export CSV
    const handleExportCSV = () => {
        const headers = ['ID', 'Software Asset', 'Vendor', 'Plan', 'License Key', 'Allocated Seats', 'Total Seats', 'Status', 'Expiry', 'Auto Renew', 'Annual Cost'];
        const rows = licenses.map(l => [
            l.id,
            `"${l.name}"`,
            `"${l.vendor || 'N/A'}"`,
            `"${l.plan}"`,
            `"${l.key}"`,
            l.seats,
            l.totalSeats,
            l.status,
            `"${l.expiry}"`,
            l.autoRenew ? 'YES' : 'NO',
            `"${l.cost}"`
        ]);
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `license_assets_db_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Real database licenses exported to CSV');
    };

    // Dynamic KPIs from real DB state
    const activeCount = licenses.filter(l => l.status === 'Active').length;
    const expiringItem = licenses.find(l => l.status === 'Expiring Soon');
    const expiringCount = licenses.filter(l => l.status === 'Expiring Soon').length;
    const avgUtilization = licenses.length > 0
        ? Math.round((licenses.reduce((acc, curr) => acc + (Number(curr.seats) / (Number(curr.totalSeats) || 1)), 0) / licenses.length) * 100)
        : 0;

    // Compute total cost
    const totalCostSum = licenses.reduce((sum, item) => {
        const numeric = Number(String(item.cost || '0').replace(/[^0-9.]/g, '')) || 0;
        return sum + numeric;
    }, 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-16">
            {/* Urgent Action Banner - Dynamic based on real DB */}
            {!bannerDismissed && expiringItem && (
                <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-orange-500/10 dark:from-amber-950/40 dark:via-slate-900 dark:to-orange-950/30 backdrop-blur-md border border-amber-200 dark:border-amber-800/60 rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg shadow-amber-500/5">
                    <div className="flex items-start gap-4">
                        <div className="size-13 p-3.5 rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/30 flex items-center justify-center shrink-0">
                            <AlertTriangle size={24} className="animate-bounce" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                                    {expiringItem.name} Expiring Soon
                                </h3>
                                <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider">
                                    Database Alert
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                                Core institutional license terminates on <span className="text-amber-600 dark:text-amber-400 font-bold">{expiringItem.expiry}</span>. Renew now to avoid classroom disruption.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                        <button
                            onClick={() => handleRenewLicense(expiringItem.id)}
                            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                        >
                            <RefreshCw size={13} />
                            Renew in DB
                        </button>
                        <button
                            onClick={() => setBannerDismissed(true)}
                            title="Dismiss notification"
                            className="p-2.5 rounded-xl hover:bg-amber-200/50 dark:hover:bg-amber-900/40 text-slate-500 dark:text-slate-400 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                        <Key className="text-indigo-600" size={28} />
                        License Assets & Strategic Subscriptions
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 flex items-center gap-2">
                        <span>Global enterprise software keys, digital learning modules, and tenant seat allocations.</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200/60 dark:border-indigo-800/60">
                            <Database size={11} /> Neon DB Live
                        </span>
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchLicenses}
                        disabled={isLoading}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
                        title="Refresh from Neon DB"
                    >
                        <RefreshCw size={15} className={isLoading ? 'animate-spin text-indigo-600' : ''} />
                    </button>
                    <button
                        onClick={handleExportCSV}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
                    >
                        <Download size={14} />
                        Export CSV
                    </button>
                    <button
                        onClick={() => setIsProvisionModalOpen(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
                    >
                        <Plus size={15} />
                        Provision New License
                    </button>
                </div>
            </div>

            {/* Strategic KPIs (Computed from real DB) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Active Assets */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between group hover:border-indigo-400 dark:hover:border-indigo-600 transition-all">
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Active Assets</p>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1.5">{activeCount}</h3>
                        <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            Live in Neon Database
                        </p>
                    </div>
                    <div className="size-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ShieldCheck size={24} />
                    </div>
                </div>

                {/* Utilization */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between group hover:border-emerald-400 dark:hover:border-emerald-600 transition-all">
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Seat Utilization</p>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1.5">{avgUtilization}%</h3>
                        <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                            Optimal Fleet Range
                        </p>
                    </div>
                    <div className="size-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Layers size={24} />
                    </div>
                </div>

                {/* Expiring 30D */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between group hover:border-rose-400 dark:hover:border-rose-600 transition-all">
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Expiring Soon</p>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1.5">
                            {expiringCount.toString().padStart(2, '0')}
                        </h3>
                        <p className="text-[10px] font-bold text-rose-500 mt-1">
                            {expiringCount > 0 ? 'Action Recommended' : 'All Clear'}
                        </p>
                    </div>
                    <div className="size-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Clock size={24} />
                    </div>
                </div>

                {/* Annual Cost */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between group hover:border-blue-400 dark:hover:border-blue-600 transition-all">
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Annual Spend</p>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1.5">
                            ₹{totalCostSum.toLocaleString('en-IN')}
                        </h3>
                        <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-1">
                            Total Asset Investment
                        </p>
                    </div>
                    <div className="size-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CreditCard size={24} />
                    </div>
                </div>
            </div>

            {/* Asset Explorer Table & Controls */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                {/* Control Bar */}
                <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row justify-between items-center gap-4 bg-slate-50/50 dark:bg-slate-900/40">
                    <div className="relative w-full lg:max-w-md">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search software asset, key or plan..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar">
                        {['All Assets', 'Enterprise', 'Subscription', 'Lifetime'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilterType(f)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                                    filterType === f
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="py-20 text-center space-y-3">
                            <RefreshCw size={28} className="animate-spin text-indigo-600 mx-auto" />
                            <p className="text-xs font-bold text-slate-500">Querying live licenses from Neon DB...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400">
                                    <th className="px-6 py-4">Software Asset</th>
                                    <th className="px-5 py-4">License Key</th>
                                    <th className="px-5 py-4">Strategic Plan</th>
                                    <th className="px-5 py-4">Seat Utilization</th>
                                    <th className="px-5 py-4">Health Status</th>
                                    <th className="px-5 py-4">Lifecycle & Expiry</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {licenses.map((license) => {
                                    const percent = Math.round((Number(license.seats) / (Number(license.totalSeats) || 1)) * 100);
                                    return (
                                        <tr key={license.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3.5">
                                                    <div className={`size-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-xs shrink-0 border border-indigo-200/50 dark:border-indigo-800/50`}>
                                                        {license.icon || 'LC'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white">{license.name}</p>
                                                        <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                                                            {license.vendor ? `${license.vendor} • ` : ''}Annual Spend: {license.cost}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-[11px]">
                                                        {visibleKeys[license.id] ? license.key : '••••-••••-••••'}
                                                    </span>
                                                    <button
                                                        onClick={() => toggleKeyVisibility(license.id)}
                                                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                                        title={visibleKeys[license.id] ? 'Hide Key' : 'Reveal Key'}
                                                    >
                                                        {visibleKeys[license.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleCopyKey(license)}
                                                        className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                                                        title="Copy License Key"
                                                    >
                                                        {copiedKeyId === license.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={13} />}
                                                    </button>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                                    {license.plan}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="w-36 space-y-1">
                                                    <div className="flex justify-between items-center text-[10px] font-bold">
                                                        <span className="text-slate-700 dark:text-slate-300">{license.seats} / {license.totalSeats} seats</span>
                                                        <span className="text-slate-400">{percent}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all ${
                                                                percent > 90 ? 'bg-amber-500' : percent > 50 ? 'bg-indigo-600' : 'bg-emerald-500'
                                                            }`}
                                                            style={{ width: `${Math.min(percent, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    license.status === 'Active'
                                                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                                                        : license.status === 'Expiring Soon'
                                                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 animate-pulse'
                                                        : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                                                }`}>
                                                    <span className={`size-1.5 rounded-full ${
                                                        license.status === 'Active' ? 'bg-emerald-500' : license.status === 'Expiring Soon' ? 'bg-amber-500' : 'bg-rose-500'
                                                    }`} />
                                                    {license.status}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className={`font-bold ${license.status === 'Expiring Soon' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
                                                    {license.expiry}
                                                </p>
                                                <p className="text-[10px] text-slate-400 mt-0.5">
                                                    {license.autoRenew ? 'Auto-Renewal Active' : 'Manual Renewal'}
                                                </p>
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {license.status === 'Expiring Soon' && (
                                                        <button
                                                            onClick={() => handleRenewLicense(license.id)}
                                                            className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 font-bold text-[11px] transition-colors"
                                                        >
                                                            Renew
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => setEditingLicense(license)}
                                                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                                                        title="Edit License in DB"
                                                    >
                                                        <Edit3 size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeletingId(license.id)}
                                                        className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 transition-colors"
                                                        title="Delete License from DB"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}

                    {!isLoading && licenses.length === 0 && (
                        <div className="py-16 text-center space-y-3">
                            <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                                <Search size={22} />
                            </div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No licenses found in database</h3>
                            <p className="text-xs text-slate-400">Try adjusting your search criteria or click 'Provision New License' to add one to Neon DB.</p>
                        </div>
                    )}
                </div>

                {/* Pagination footer */}
                <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                    <p>
                        Showing <span className="font-bold text-slate-900 dark:text-white">{licenses.length}</span> live records from Neon PostgreSQL
                    </p>
                    <div className="flex items-center gap-1.5">
                        <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1">
                            <ChevronLeft size={13} /> Prev
                        </button>
                        <span className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold">1</span>
                        <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1">
                            Next <ChevronRight size={13} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal: Provision New License */}
            {isProvisionModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Provision New License (Neon DB)</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Creates a persistent software asset directly in PostgreSQL.</p>
                            </div>
                            <button
                                onClick={() => setIsProvisionModalOpen(false)}
                                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateLicense} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                    Software Asset Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newLicenseForm.name}
                                    onChange={(e) => setNewLicenseForm({ ...newLicenseForm, name: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                    placeholder="e.g. Canva for Campus & Education"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        Plan Tier
                                    </label>
                                    <select
                                        value={newLicenseForm.plan}
                                        onChange={(e) => setNewLicenseForm({ ...newLicenseForm, plan: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                                    >
                                        <option value="Enterprise">Enterprise</option>
                                        <option value="Subscription Pro">Subscription Pro</option>
                                        <option value="Lifetime Basic">Lifetime Basic</option>
                                        <option value="Campus Tier">Campus Tier</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        Annual Spend
                                    </label>
                                    <input
                                        type="text"
                                        value={newLicenseForm.cost}
                                        onChange={(e) => setNewLicenseForm({ ...newLicenseForm, cost: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                        placeholder="₹3,000"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        Initial Allocated Seats
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={newLicenseForm.seats}
                                        onChange={(e) => setNewLicenseForm({ ...newLicenseForm, seats: Number(e.target.value) })}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        Total Seat Pool
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={newLicenseForm.totalSeats}
                                        onChange={(e) => setNewLicenseForm({ ...newLicenseForm, totalSeats: Number(e.target.value) })}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                    Software Vendor
                                </label>
                                <input
                                    type="text"
                                    value={newLicenseForm.vendor}
                                    onChange={(e) => setNewLicenseForm({ ...newLicenseForm, vendor: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                    placeholder="e.g. Canva Pty Ltd"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                    License Key <span className="text-slate-400 font-normal">(Auto-generated if empty)</span>
                                </label>
                                <input
                                    type="text"
                                    value={newLicenseForm.key}
                                    onChange={(e) => setNewLicenseForm({ ...newLicenseForm, key: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-mono font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                    placeholder="XXXX-XXXX-XXXX-XXXX"
                                />
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newLicenseForm.autoRenew}
                                        onChange={(e) => setNewLicenseForm({ ...newLicenseForm, autoRenew: e.target.checked })}
                                        className="size-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                    />
                                    Enable Auto-Renewal Strategy
                                </label>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsProvisionModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Saving to DB...' : 'Provision License'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Edit License in Real DB */}
            {editingLicense && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Edit License: {editingLicense.name}</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Updates will persist in PostgreSQL.</p>
                            </div>
                            <button
                                onClick={() => setEditingLicense(null)}
                                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEdit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        Allocated Seats
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={editingLicense.seats}
                                        onChange={(e) => setEditingLicense({ ...editingLicense, seats: Number(e.target.value) })}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        Total Seat Pool
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={editingLicense.totalSeats}
                                        onChange={(e) => setEditingLicense({ ...editingLicense, totalSeats: Number(e.target.value) })}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        Health Status
                                    </label>
                                    <select
                                        value={editingLicense.status}
                                        onChange={(e) => setEditingLicense({ ...editingLicense, status: e.target.value as any })}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Expiring Soon">Expiring Soon</option>
                                        <option value="Expired">Expired</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        Expiry Date
                                    </label>
                                    <input
                                        type="text"
                                        value={editingLicense.expiry}
                                        onChange={(e) => setEditingLicense({ ...editingLicense, expiry: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                    Annual Cost
                                </label>
                                <input
                                    type="text"
                                    value={editingLicense.cost}
                                    onChange={(e) => setEditingLicense({ ...editingLicense, cost: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editingLicense.autoRenew}
                                        onChange={(e) => setEditingLicense({ ...editingLicense, autoRenew: e.target.checked })}
                                        className="size-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                    />
                                    Auto-Renewal Active
                                </label>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setEditingLicense(null)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Saving...' : 'Save to DB'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Delete Confirmation */}
            {deletingId !== null && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-sm w-full p-6 text-center space-y-4">
                        <div className="size-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                            <Trash2 size={24} />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete License from Neon DB?</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            This will permanently remove the license asset and revoke seat access for associated schools.
                        </p>
                        <div className="flex items-center justify-center gap-3 pt-2">
                            <button
                                onClick={() => setDeletingId(null)}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteLicense(deletingId)}
                                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 transition-all active:scale-95"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
