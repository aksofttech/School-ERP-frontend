import React, { useState } from 'react';

// Mock Data
const licensesData = [
    { id: 1, name: 'Microsoft 365 A3', key: 'XXXX-XXXX-A83B', plan: 'Enterprise', seats: 450, totalSeats: 500, status: 'Active', expiry: 'Nov 24, 2024', autoRenew: true, icon: 'M', color: 'indigo' },
    { id: 2, name: 'Zoom Education', key: 'XXXX-XXXX-9B2F', plan: 'Pro', seats: 20, totalSeats: 20, status: 'Expiring Soon', expiry: 'In 3 Days', autoRenew: false, icon: 'Z', color: 'blue' },
    { id: 3, name: 'Library Module', key: 'XXXX-XXXX-C44D', plan: 'Basic', seats: 0, totalSeats: 1, status: 'Expired', expiry: 'Jan 15, 2023', autoRenew: false, icon: 'L', color: 'orange' },
    { id: 4, name: 'Adobe CC', key: 'XXXX-XXXX-F890', plan: 'Education All Apps', seats: 45, totalSeats: 50, status: 'Active', expiry: 'Dec 10, 2024', autoRenew: true, icon: 'A', color: 'teal' },
    { id: 5, name: 'Slack Pro', key: 'XXXX-XXXX-E123', plan: 'Business+', seats: 120, totalSeats: 200, status: 'Active', expiry: 'Feb 28, 2025', autoRenew: true, icon: 'S', color: 'pink' },
];

const LicenseManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All Assets');
    const [visibleKeys, setVisibleKeys] = useState<Record<number, boolean>>({});

    const toggleKeyVisibility = (id: number) => {
        setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const filteredLicenses = licensesData.filter(license => {
        const matchesSearch = license.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            license.plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
            license.key.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterType === 'All Assets' ||
            (filterType === 'Enterprise' && license.plan.includes('Enterprise')) ||
            (filterType === 'Subscription' && (license.plan.includes('Pro') || license.plan.includes('Business'))) ||
            (filterType === 'Lifetime' && license.plan.includes('Basic'));

        return matchesSearch && matchesFilter;
    });

    const kpis = [
        {
            label: 'Active Assets',
            value: licensesData.filter(l => l.status === 'Active').length.toString(),
            icon: 'verified',
            color: 'indigo',
            trend: '+2 this month'
        },
        {
            label: 'Utilization',
            value: `${Math.round(licensesData.reduce((acc, curr) => acc + (curr.seats / curr.totalSeats), 0) / licensesData.length * 100)}%`,
            icon: 'hub',
            color: 'emerald',
            trend: 'Optimal Range'
        },
        {
            label: 'Expiring 30d',
            value: licensesData.filter(l => l.status === 'Expiring Soon').length.toString().padStart(2, '0'),
            icon: 'auto_delete',
            color: 'rose',
            trend: 'Requires Attention'
        },
        {
            label: 'Annual Cost',
            value: '₹14.2k',
            icon: 'payments',
            color: 'blue',
            trend: 'Under Budget'
        },
    ];

    return (
        <div className="scroll-smooth animate-in fade-in duration-700">
            <div className="max-w-[1600px] mx-auto flex flex-col gap-8">

                {/* Urgent Action Banner - Premium Glassmorphism */}
                <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-md border border-amber-200/50 dark:border-amber-900/30 rounded-[2rem] p-6 flex items-center gap-6 shadow-2xl shadow-amber-500/5">
                    <div className="h-16 w-16 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/40 relative z-10">
                        <span className="material-icons-round text-3xl animate-pulse">priority_high</span>
                    </div>
                    <div className="flex-1 relative z-10">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Zoom Education Subscription Expiring</h3>
                        <p className="text-slate-600 dark:text-slate-400 font-medium mt-1">Your core license for virtual learning will terminate in <span className="text-amber-600 dark:text-amber-400 font-black">72 hours</span>. Renew now to prevent service blackouts.</p>
                    </div>
                    <div className="flex items-center gap-3 relative z-10">
                        <button className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm transition-all hover:scale-105 active:scale-95">
                            Renew Now
                        </button>
                        <button className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white/50 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-icons-round text-slate-400">close</span>
                        </button>
                    </div>
                    {/* Subtle Background Icon */}
                    <span className="material-icons-round absolute -right-10 -bottom-10 text-[200px] text-amber-500/5 rotate-12">history_edu</span>
                </div>

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">License Assets</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Global management of enterprise software and strategic subscriptions.</p>
                    </div>
                    <button className="flex items-center gap-3 bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95">
                        <span className="material-icons-round text-xl">add_moderator</span>
                        <span>Provision New License</span>
                    </button>
                </div>

                {/* Strategic KPIs - High End Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {kpis.map((kpi, i) => (
                        <div key={i} className="group bg-white dark:bg-card-dark p-8 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-primary transition-all duration-500 relative overflow-hidden">
                            <div className="flex items-start justify-between relative z-10">
                                <div className={`h-14 w-14 rounded-2xl bg-${kpi.color}-50 dark:bg-${kpi.color}-900/20 text-${kpi.color}-600 dark:text-${kpi.color}-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                                    <span className="material-icons-round text-2xl">{kpi.icon}</span>
                                </div>
                                <div className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                            </div>
                            <div className="mt-8 relative z-10">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white mt-1 tracking-tighter">{kpi.value}</h3>
                                <p className={`text-[10px] font-bold mt-2 ${kpi.color === 'rose' ? 'text-rose-500' : 'text-slate-500'}`}>{kpi.trend}</p>
                            </div>
                            {/* Decorative Gradient Overlay */}
                            <div className={`absolute -right-20 -bottom-20 h-40 w-40 bg-${kpi.color}-500/5 rounded-full blur-3xl group-hover:bg-${kpi.color}-500/10 transition-colors`}></div>
                        </div>
                    ))}
                </div>

                {/* Intelligent Asset Explorer */}
                <div className="bg-white dark:bg-card-dark rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden lg:col-span-12">
                    {/* Enhanced Control Bar */}
                    <div className="p-8 border-b border-slate-100 dark:border-slate-700/50 flex flex-col lg:flex-row justify-between items-center gap-6 bg-slate-50/30 dark:bg-slate-800/20">
                        <div className="relative w-full lg:max-w-md">
                            <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-sm font-bold text-slate-900 dark:text-white shadow-inner focus:outline-none"
                                placeholder="Search resources, keys or vendors..."
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
                            {['All Assets', 'Enterprise', 'Subscription', 'Lifetime'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilterType(f)}
                                    className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterType === f ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-100 dark:border-slate-800 hover:bg-slate-50'}`}
                                >
                                    {f}
                                </button>
                            ))}
                            <div className="h-10 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden lg:block"></div>
                            <button className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-primary transition-colors">
                                <span className="material-icons-round">tune</span>
                            </button>
                        </div>
                    </div>

                    {/* Premium Asset Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-800/40">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Software Asset</th>
                                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">License Key</th>
                                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Strategic Plan</th>
                                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Seat Utilization</th>
                                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Current Health</th>
                                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Lifecycle</th>
                                    <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {filteredLicenses.map((license) => (
                                    <tr key={license.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-300">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-black text-lg bg-${license.color}-500/10 text-${license.color}-600 drop-shadow-sm`}>
                                                    {license.icon}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 dark:text-white leading-tight">{license.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{license.plan}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div
                                                className="flex items-center gap-2 group/key cursor-pointer"
                                                onClick={() => toggleKeyVisibility(license.id)}
                                            >
                                                <span className="font-mono text-xs font-bold text-slate-500 group-hover/key:text-primary transition-colors">
                                                    {visibleKeys[license.id] ? license.key : '••••-••••-••••'}
                                                </span>
                                                <span className="material-icons-round text-sm text-slate-300 group-hover/key:text-primary transition-all">
                                                    {visibleKeys[license.id] ? 'visibility_off' : 'visibility'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                                {license.plan.split(' ')[0]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="min-w-[140px]">
                                                <div className="flex justify-between items-end mb-1.5">
                                                    <span className="text-xs font-black text-slate-900 dark:text-white">{license.seats} <span className="text-slate-400 font-bold">Allocated</span></span>
                                                    <span className="text-[10px] font-black text-slate-400">{Math.round((license.seats / license.totalSeats) * 100)}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${license.status === 'Expiring Soon' ? 'from-amber-400 to-orange-500' : 'from-primary to-indigo-400'}`}
                                                        style={{ width: `${(license.seats / license.totalSeats) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${license.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' :
                                                license.status === 'Expiring Soon' ? 'bg-amber-500/10 text-amber-600' : 'bg-rose-500/10 text-rose-600'
                                                }`}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${license.status === 'Active' ? 'bg-emerald-500' : license.status === 'Expiring Soon' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'}`}></span>
                                                {license.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div>
                                                <p className={`text-xs font-black ${license.status === 'Expiring Soon' ? 'text-amber-600' : 'text-slate-700 dark:text-slate-300'}`}>{license.expiry}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{license.autoRenew ? 'Auto-Renewal ON' : 'Manual Control'}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary transition-all">
                                                    <span className="material-icons-round text-xl">edit_note</span>
                                                </button>
                                                <button className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 hover:text-rose-500 transition-all">
                                                    <span className="material-icons-round text-xl">delete_outline</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredLicenses.length === 0 && (
                            <div className="p-20 text-center">
                                <span className="material-icons-round text-6xl text-slate-200 mb-4 block">search_off</span>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">No assets found</h3>
                                <p className="text-slate-500 mt-2 font-medium">Try adjusting your search or filters to find what you're looking for.</p>
                            </div>
                        )}
                    </div>

                    {/* Intelligent Pagination */}
                    <div className="p-8 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/20 dark:bg-slate-800/10 flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Showing <span className="text-slate-900 dark:text-white">1 - {filteredLicenses.length}</span> of {licensesData.length} Resources
                        </p>
                        <div className="flex items-center gap-2">
                            <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50 transition-all">
                                <span className="material-icons-round">chevron_left</span>
                            </button>
                            <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs shadow-lg transition-transform active:scale-95">1</button>
                            <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-black text-xs hover:bg-slate-50 transition-all">2</button>
                            <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50 transition-all">
                                <span className="material-icons-round">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LicenseManagement;

