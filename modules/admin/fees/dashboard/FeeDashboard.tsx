import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import { USER_ROLES } from '@/utils/role-config';
import { useFeeDashboard } from '@/hooks/useFeeDashboard';
import { format } from 'date-fns';
import { 
    Plus, 
    IndianRupee, 
    TrendingUp, 
    AlertCircle, 
    Calendar, 
    Receipt, 
    Filter, 
    MoreVertical, 
    ArrowUpRight,
    Search,
    CreditCard,
    Bell,
    Wallet
} from 'lucide-react';

export default function FeeDashboard() {
    const { data, loading, error } = useFeeDashboard();

    if (loading) {
        return (
      <>
        
                <div className="flex flex-col h-96 items-center justify-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent shadow-lg shadow-primary/20"></div>
                    <p className="text-sm font-bold text-slate-400 italic animate-pulse tracking-widest uppercase">Loading financial data...</p>
                </div>
            
      </>
    );
    }

    const { statistics, recentTransactions, monthlyOverview } = data || {
        statistics: { totalCollected: 0, outstandingBalance: 0, todayCollection: 0, overdueCount: 0 },
        recentTransactions: [],
        monthlyOverview: []
    };

    return (
        <>
            <Head>
                <title>Fees - School ERP</title>
            </Head>

            <div className="flex flex-col gap-8 animate-in fade-in duration-500">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-primary">
                                    <Wallet size={20} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Finance Overview</span>
                                </div>
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Fees</h1>
                                <p className="text-slate-500 dark:text-slate-400 font-medium h-5">
                                    Total of {statistics.totalCollected.toLocaleString()} collected in this period.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Link 
                                    href="/admin/fees/collection" 
                                    className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-0.5 active:scale-95 transition-all"
                                >
                                    <Plus size={18} />
                                    <span>New Payment</span>
                                </Link>
                            </div>
                        </div>

                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard 
                                label="Total Collected" 
                                value={`₹${statistics.totalCollected.toLocaleString()}`} 
                                icon={<IndianRupee className="text-emerald-500" />}
                                trend="+12.5%"
                                positive={true}
                            />
                            <StatCard 
                                label="Outstanding" 
                                value={`₹${statistics.outstandingBalance.toLocaleString()}`} 
                                icon={<AlertCircle className="text-rose-500" />}
                                trend="+5.2%"
                                positive={false}
                            />
                            <StatCard 
                                label="Today's Intake" 
                                value={`₹${statistics.todayCollection.toLocaleString()}`} 
                                icon={<TrendingUp className="text-primary" />}
                                trend="Today"
                            />
                            <StatCard 
                                label="Due Fees" 
                                value={statistics.overdueCount || 0} 
                                icon={<Bell className="text-orange-500" />}
                                trend="Requires Action"
                                highlight={statistics.overdueCount > 0}
                            />
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Chart Section */}
                            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm group hover:shadow-md transition-all">
                                <div className="flex justify-between items-center mb-10">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Monthly Collection</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Comparison of last 6 months</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-100 dark:border-slate-700">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                            Live Data
                                        </div>
                                    </div>
                                </div>

                                <div className="h-64 flex items-end justify-between gap-4 px-2">
                                    {(monthlyOverview || []).map((entry: any) => {
                                        const maxAmount = Math.max(...monthlyOverview.map((m: any) => m.amount), 1);
                                        const percentage = (entry.amount / maxAmount) * 100;
                                        return (
                                            <div key={entry.month} className="flex-1 flex flex-col items-center gap-4 group/bar h-full justify-end cursor-pointer">
                                                <div className="relative w-full max-w-[48px] bg-slate-100 dark:bg-slate-800 rounded-2xl h-full overflow-hidden">
                                                    <div className="absolute bottom-0 w-full bg-primary/20 group-hover/bar:bg-primary/40 transition-all duration-500 h-full"></div>
                                                    <div 
                                                        className="absolute bottom-0 w-full bg-primary rounded-2xl transition-all duration-700 ease-out group-hover/bar:translate-y-[-2px]" 
                                                        style={{ height: `${Math.max(percentage, 5)}%` }}
                                                    ></div>
                                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1.5 px-3 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all whitespace-nowrap z-10 font-black shadow-xl">
                                                        ₹{entry.amount.toLocaleString()}
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{entry.month}</span>
                                            </div>
                                        )
                                    })}
                                    {(!monthlyOverview || monthlyOverview.length === 0) && (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 italic py-12 gap-4">
                                            <Search className="opacity-20" size={48} />
                                            <p className="font-bold">No history found.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Status and Action Panel */}
                            <div className="flex flex-col gap-6">
                                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-700"></div>
                                    <div className="relative z-10 space-y-8">
                                        <div className="flex justify-between items-start">
                                            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                                                <Receipt size={24} className="text-primary" />
                                            </div>
                                            <Link href="/admin/fees" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                                <ArrowUpRight size={20} className="text-slate-400" />
                                            </Link>
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-2xl font-black tracking-tight">Recent Status</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Recently Paid</p>
                                        </div>
                                        <div className="space-y-3">
                                            {recentTransactions.slice(0, 3).map((item: any, i: number) => (
                                                <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group/item">
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-xs group-hover/item:text-primary transition-colors">
                                                        {item.studentName.charAt(0)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-black truncate">{item.studentName}</p>
                                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{item.class}</p>
                                                    </div>
                                                    <p className="text-xs font-black tracking-tight">₹{item.amount.toLocaleString()}</p>
                                                </div>
                                            ))}
                                            {(!recentTransactions || recentTransactions.length === 0) && (
                                                <p className="text-xs text-slate-500 italic py-4 text-center">No recent transactions found.</p>
                                            )}
                                        </div>
                                        <button className="w-full py-4 bg-primary rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:translate-y-[-2px] active:scale-95 transition-all flex items-center justify-center gap-2">
                                            <Bell size={14} />
                                            Send Reminders
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">Quick Actions</h4>
                                    <div className="grid grid-cols-1 gap-2">
                                        <QuickAction icon={<Receipt size={18} />} label="Create Invoice" />
                                        <QuickAction icon={<CreditCard size={18} />} label="Online Payments" />
                                        <QuickAction icon={<Filter size={18} />} label="Check Balances" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Transactions Table */}
                        <div className="space-y-4">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Recent Transactions</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">List of recent fee payments</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="relative group">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <input 
                                            type="text" 
                                            placeholder="Search transactions..." 
                                            className="pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 w-48 transition-all"
                                        />
                                    </div>
                                    <button className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-primary hover:border-primary/30 transition-all">
                                        <Filter size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
                                                <th className="px-8 py-5">ID</th>
                                                <th className="px-8 py-5">Student Name</th>
                                                <th className="px-8 py-5">Class</th>
                                                <th className="px-8 py-5">Date</th>
                                                <th className="px-8 py-5">Amount</th>
                                                <th className="px-8 py-5">Status</th>
                                                <th className="px-8 py-5 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                            {recentTransactions.map((trx: any) => (
                                                <tr key={trx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                                    <td className="px-8 py-5 font-mono text-[10px] text-slate-400 font-bold uppercase">
                                                        #{trx.id.substring(trx.id.length - 6)}
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{trx.studentName}</span>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                                                            {trx.class}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5 text-xs text-slate-500 font-medium">
                                                        {format(new Date(trx.date), 'MMM dd, yyyy')}
                                                    </td>
                                                    <td className="px-8 py-5 font-black text-slate-900 dark:text-white">
                                                        ₹{trx.amount.toLocaleString()}
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border ${
                                                            trx.status === 'PAID'
                                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-500/20'
                                                                : trx.status === 'OVERDUE'
                                                                    ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/5 dark:border-rose-500/20'
                                                                    : 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/5 dark:border-amber-500/20'
                                                        }`}>
                                                            <div className={`w-1.5 h-1.5 rounded-full ${
                                                                trx.status === 'PAID' ? 'bg-emerald-500' : trx.status === 'OVERDUE' ? 'bg-rose-500' : 'bg-amber-500'
                                                            }`} />
                                                            {trx.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                                                            <MoreVertical size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {(!recentTransactions || recentTransactions.length === 0) && (
                                                <tr>
                                                    <td colSpan={7} className="px-8 py-20 text-center">
                                                        <div className="flex flex-col items-center gap-3 opacity-20">
                                                            <Receipt size={48} />
                                                            <p className="text-sm font-bold italic">No records found for this period.</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
        </>
    );
}

function StatCard({ label, value, icon, trend, positive, highlight }: any) {
    return (
        <div className={`bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-2 transition-all hover:translate-y-[-2px] hover:shadow-md ${highlight ? 'ring-2 ring-orange-500/20' : ''}`}>
            <div className="flex justify-between items-start">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                    {icon}
                </div>
                {trend && (
                    <span className={`text-[10px] font-black px-2.5 py-1.5 rounded-full uppercase tracking-widest ${
                        positive === true 
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' 
                            : positive === false 
                                ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10' 
                                : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                    }`}>
                        {trend}
                    </span>
                )}
            </div>
            <div className="space-y-0.5 mt-2">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">{value}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            </div>
        </div>
    );
}

function QuickAction({ icon, label }: any) {
    return (
        <button className="flex items-center justify-between w-full p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-primary group rounded-2xl transition-all active:scale-[0.98]">
            <div className="flex items-center gap-3">
                <div className="text-slate-400 group-hover:text-white transition-colors">
                    {icon}
                </div>
                <span className="text-[11px] font-black text-slate-600 dark:text-slate-300 group-hover:text-white uppercase tracking-wider">{label}</span>
            </div>
            <Plus size={16} className="text-slate-300 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0" />
        </button>
    );
}


FeeDashboard.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
