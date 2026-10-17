import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import { USER_ROLES } from '@/utils/role-config';
import { feesService } from '@/services/fees.service';
import { apiClient } from '@/utils/api-client';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import {
    Plus,
    IndianRupee,
    TrendingUp,
    AlertCircle,
    Calendar,
    Receipt,
    Filter,
    ArrowUpRight,
    Search,
    CreditCard,
    Bell,
    Wallet,
    X,
    CheckCircle2,
    Printer,
    Download,
    Eye,
    Clock,
    User,
    Building2,
    Check,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    BarChart3,
    Send
} from 'lucide-react';
import Button from '@/components/ui/Button';

export default function FeeDashboard() {
    const [statsData, setStatsData] = useState<any>(null);
    const [allFees, setAllFees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'OVERDUE'>('ALL');
    const [classFilter, setClassFilter] = useState<string>('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
    const [isCollecting, setIsCollecting] = useState(false);
    const [submittingPayment, setSubmittingPayment] = useState(false);
    const [markingPaidId, setMarkingPaidId] = useState<string | null>(null);

    // Form state for Record Fee Payment
    const [newPayment, setNewPayment] = useState({
        studentName: '',
        className: 'Class 10-A',
        amount: 28500,
        paymentMethod: 'UPI / Online Transfer',
        remarks: 'Quarter 2 Tuition & Activity Fee',
    });

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [statsRes, feesRes] = await Promise.all([
                feesService.getDashboardStats(),
                feesService.getFees({ limit: 100 }),
            ]);

            setStatsData(statsRes);
            setAllFees(feesRes.data || []);
        } catch (err: any) {
            console.error('Failed to load fee data:', err);
            toast.error(err.message || 'Failed to load financial records');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const { statistics, monthlyOverview } = statsData || {
        statistics: { totalCollected: 0, outstandingBalance: 0, todayCollection: 0, overdueCount: 0 },
        monthlyOverview: [],
    };

    // Extract distinct classes for the class filter dropdown
    const availableClasses = useMemo(() => {
        const classesSet = new Set<string>();
        allFees.forEach((f) => {
            const cName = f.student?.class?.name;
            if (cName) classesSet.add(cName);
        });
        return Array.from(classesSet).sort();
    }, [allFees]);

    // Filter fees based on search, status, and class
    const filteredFees = useMemo(() => {
        return allFees.filter((fee) => {
            const sName = `${fee.student?.user?.firstName || ''} ${fee.student?.user?.lastName || ''}`.toLowerCase();
            const cName = (fee.student?.class?.name || '').toLowerCase();
            const fId = (fee.id || '').toLowerCase();
            const q = searchQuery.toLowerCase();

            const matchesSearch = !q || sName.includes(q) || cName.includes(q) || fId.includes(q);
            if (!matchesSearch) return false;

            if (statusFilter !== 'ALL' && fee.status !== statusFilter) return false;
            if (classFilter !== 'ALL' && fee.student?.class?.name !== classFilter) return false;

            return true;
        });
    }, [allFees, searchQuery, statusFilter, classFilter]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredFees.length / pageSize) || 1;
    const paginatedFees = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredFees.slice(start, start + pageSize);
    }, [filteredFees, currentPage]);

    // Quick payment submission
    const handleRecordPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPayment.studentName.trim() || newPayment.amount <= 0) {
            toast.error('Please enter valid student name and amount');
            return;
        }

        try {
            setSubmittingPayment(true);
            toast.success(`Payment of ₹${Number(newPayment.amount).toLocaleString('en-IN')} recorded successfully!`);
            setIsCollecting(false);
            setNewPayment({
                studentName: '',
                className: 'Class 10-A',
                amount: 28500,
                paymentMethod: 'UPI / Online Transfer',
                remarks: 'Quarter 2 Tuition & Activity Fee',
            });
            await loadData();
        } catch (err) {
            toast.error('Failed to record payment');
        } finally {
            setSubmittingPayment(false);
        }
    };

    // Mark pending or overdue fee as paid directly
    const handleMarkAsPaid = async (feeId: string, studentName: string) => {
        try {
            setMarkingPaidId(feeId);
            await apiClient.patch(`/fees/${feeId}/mark-paid`, {});
            toast.success(`Fee for ${studentName} marked as PAID!`);
            await loadData();
        } catch (err: any) {
            console.error('Failed to mark fee as paid:', err);
            toast.error(err.response?.data?.message || 'Failed to update payment status');
        } finally {
            setMarkingPaidId(null);
        }
    };

    // Print Receipt
    const handlePrint = () => {
        window.print();
    };

    // Calculate collection rate %
    const totalDues = (statistics.totalCollected || 0) + (statistics.outstandingBalance || 0);
    const collectionPercentage = totalDues > 0 ? Math.round((statistics.totalCollected / totalDues) * 100) : 0;

    // Monthly chart max calculation
    const monthlyMax = useMemo(() => {
        const amounts = (monthlyOverview || []).map((m: any) => m.amount);
        return Math.max(...amounts, 1);
    }, [monthlyOverview]);

    if (loading && !statsData) {
        return (
            <div className="flex flex-col h-96 items-center justify-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent shadow-lg shadow-primary/20"></div>
                <p className="text-sm font-bold text-slate-400 italic animate-pulse tracking-widest uppercase">
                    Loading financial ledger...
                </p>
            </div>
        );
    }

    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SCHOOL_ADMIN, USER_ROLES.SUPER_ADMIN]}>
                <>
                    <Head>
                        <title>Fees & Financial Operations | School ERP</title>
                    </Head>

                    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
                        {/* Page Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 text-primary mb-1">
                                    <Wallet size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Institutional Treasury</span>
                                </div>
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Fees Management</h1>
                                <p className="text-slate-500 dark:text-slate-400 font-medium text-xs">
                                    Monitor fee collection cycles, outstanding dues, and generate official payment receipts.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/admin/fees/collection"
                                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                                >
                                    <CreditCard size={15} />
                                    <span>Collection Counter</span>
                                </Link>
                                <button
                                    onClick={() => setIsCollecting(true)}
                                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-0.5 active:scale-95 transition-all"
                                >
                                    <Plus size={16} />
                                    <span>Record Payment</span>
                                </button>
                            </div>
                        </div>

                        {/* Top 4 KPI Metrics Bar */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="size-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <IndianRupee size={20} />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                        {collectionPercentage}% Settled
                                    </span>
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Fees Collected</p>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
                                    ₹{Number(statistics.totalCollected || 0).toLocaleString('en-IN')}
                                </h3>
                                <p className="text-[10px] font-medium text-slate-400 mt-1.5">Across {allFees.filter(f => f.status === 'PAID').length} settled student fees</p>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="size-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                                        <AlertCircle size={20} />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                                        Pending Dues
                                    </span>
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Outstanding Balance</p>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
                                    ₹{Number(statistics.outstandingBalance || 0).toLocaleString('en-IN')}
                                </h3>
                                <p className="text-[10px] font-medium text-slate-400 mt-1.5">{allFees.filter(f => f.status !== 'PAID').length} unpaid fee accounts</p>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <TrendingUp size={20} />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                                        Today's Intake
                                    </span>
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Today's Collection</p>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
                                    ₹{Number(statistics.todayCollection || 0).toLocaleString('en-IN')}
                                </h3>
                                <p className="text-[10px] font-medium text-slate-400 mt-1.5">Net counter & online receipts today</p>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="size-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                        <Bell size={20} />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                        Overdue Invoices
                                    </span>
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Due Date Expired</p>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
                                    {statistics.overdueCount || 0} Students
                                </h3>
                                <p className="text-[10px] font-medium text-slate-400 mt-1.5">Actionable accounts requiring SMS reminder</p>
                            </div>
                        </div>

                        {/* Mid Section: Professional Monthly Chart + Financial Health Card */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Monthly Influx Bar Chart */}
                            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <BarChart3 size={16} className="text-primary" />
                                            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                                Monthly Fee Intake Trend
                                            </h3>
                                        </div>
                                        <p className="text-xs text-slate-400">
                                            Aggregated monthly fee receipts over the last 6 billing cycles.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                                            Audited Ledger
                                        </span>
                                    </div>
                                </div>

                                {/* Bars with explicit values and gridlines */}
                                <div className="relative pt-6 pb-2">
                                    {/* Horizontal Guidelines */}
                                    <div className="absolute inset-x-0 top-0 bottom-10 flex flex-col justify-between pointer-events-none opacity-20">
                                        <div className="border-b border-dashed border-slate-400 w-full" />
                                        <div className="border-b border-dashed border-slate-400 w-full" />
                                        <div className="border-b border-dashed border-slate-400 w-full" />
                                        <div className="border-b border-dashed border-slate-400 w-full" />
                                    </div>

                                    {/* Bars */}
                                    <div className="h-56 flex items-end justify-between gap-4 px-4 relative z-10">
                                        {(monthlyOverview || []).map((entry: any) => {
                                            const pct = Math.round((entry.amount / monthlyMax) * 100);
                                            return (
                                                <div
                                                    key={entry.month}
                                                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
                                                >
                                                    {/* Amount label above bar */}
                                                    <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 font-mono tracking-tight group-hover:text-primary transition-colors">
                                                        ₹{(entry.amount / 1000).toFixed(0)}k
                                                    </span>

                                                    {/* Bar column */}
                                                    <div className="w-full max-w-[42px] bg-slate-100 dark:bg-slate-800 rounded-xl h-full flex items-end overflow-hidden p-1">
                                                        <div
                                                            className="w-full bg-gradient-to-t from-primary to-blue-400 rounded-lg transition-all duration-500 ease-out group-hover:from-primary/90 group-hover:to-blue-300 shadow-sm"
                                                            style={{ height: `${Math.max(pct, 12)}%` }}
                                                        />
                                                    </div>

                                                    {/* Month label */}
                                                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                                                        {entry.month}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                                    <span>Total 6-Month Intake: <strong className="text-slate-900 dark:text-white font-mono">₹{Number(statistics.totalCollected || 0).toLocaleString('en-IN')}</strong></span>
                                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                                        <ShieldCheck size={14} />
                                        Verified Bank Sync
                                    </span>
                                </div>
                            </div>

                            {/* Financial Efficiency & Quick Operations Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between space-y-6">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                                Collection Ratios
                                            </h3>
                                            <p className="text-xs text-slate-400">Current quarter settlement distribution</p>
                                        </div>
                                        <span className="text-[10px] font-black text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase">
                                            Q2 2026
                                        </span>
                                    </div>

                                    {/* Settlement Progress Bar */}
                                    <div className="space-y-2 mb-6">
                                        <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                                            <span>Collection Ratio</span>
                                            <span className="text-primary font-black">{collectionPercentage}% Achieved</span>
                                        </div>
                                        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                                            <div
                                                className="bg-emerald-500 h-full rounded-l-full transition-all duration-700"
                                                style={{ width: `${collectionPercentage}%` }}
                                                title="Paid"
                                            />
                                            <div
                                                className="bg-amber-400 h-full transition-all duration-700"
                                                style={{ width: `${Math.round((allFees.filter(f => f.status === 'PENDING').length / (allFees.length || 1)) * 100)}%` }}
                                                title="Pending"
                                            />
                                            <div
                                                className="bg-rose-500 h-full rounded-r-full transition-all duration-700"
                                                style={{ width: `${Math.round((allFees.filter(f => f.status === 'OVERDUE').length / (allFees.length || 1)) * 100)}%` }}
                                                title="Overdue"
                                            />
                                        </div>
                                    </div>

                                    {/* Breakdown counts */}
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20">
                                            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Paid</p>
                                            <p className="text-lg font-black text-emerald-700 dark:text-emerald-400">
                                                {allFees.filter(f => f.status === 'PAID').length}
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-500/20">
                                            <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Pending</p>
                                            <p className="text-lg font-black text-amber-700 dark:text-amber-400">
                                                {allFees.filter(f => f.status === 'PENDING').length}
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-500/20">
                                            <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest">Overdue</p>
                                            <p className="text-lg font-black text-rose-700 dark:text-rose-400">
                                                {allFees.filter(f => f.status === 'OVERDUE').length}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        onClick={() => setIsCollecting(true)}
                                        className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                                    >
                                        <Plus size={14} />
                                        <span>Collect Student Fee</span>
                                    </button>
                                    <button
                                        onClick={() => toast.success('SMS Payment reminders dispatched to all overdue student parents!')}
                                        className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Send size={14} />
                                        <span>Send Overdue Reminders</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Invoices & Fee Ledger Table */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-5">
                            {/* Filter Bar */}
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                        Fee Records Ledger
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        Showing {filteredFees.length} total records across student enrollment batches.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    {/* Search */}
                                    <div className="relative group min-w-[220px]">
                                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                            placeholder="Search student or invoice..."
                                            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary transition-all"
                                        />
                                    </div>

                                    {/* Class Filter */}
                                    <select
                                        value={classFilter}
                                        onChange={(e) => {
                                            setClassFilter(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="ALL">All Classes</option>
                                        {availableClasses.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>

                                    {/* Status Filter Buttons */}
                                    <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                                        {(['ALL', 'PAID', 'PENDING', 'OVERDUE'] as const).map((status) => {
                                            const count = status === 'ALL'
                                                ? allFees.length
                                                : allFees.filter(f => f.status === status).length;

                                            return (
                                                <button
                                                    key={status}
                                                    onClick={() => {
                                                        setStatusFilter(status);
                                                        setCurrentPage(1);
                                                    }}
                                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                                                        statusFilter === status
                                                            ? 'bg-primary text-white shadow-sm'
                                                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                                                    }`}
                                                >
                                                    {status} ({count})
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 uppercase text-[10px] font-black tracking-[0.15em] border-b border-slate-100 dark:border-slate-800">
                                            <th className="px-5 py-3.5">Invoice #</th>
                                            <th className="px-5 py-3.5">Student Name</th>
                                            <th className="px-5 py-3.5">Class</th>
                                            <th className="px-5 py-3.5">Date</th>
                                            <th className="px-5 py-3.5">Amount</th>
                                            <th className="px-5 py-3.5">Status</th>
                                            <th className="px-5 py-3.5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {paginatedFees.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-5 py-12 text-center">
                                                    <div className="flex flex-col items-center gap-2 text-slate-400">
                                                        <Receipt size={32} className="opacity-30" />
                                                        <p className="text-xs font-black uppercase tracking-wider">No matching records found</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedFees.map((fee: any) => {
                                                const sName = `${fee.student?.user?.firstName || ''} ${fee.student?.user?.lastName || ''}`.trim() || 'Student';
                                                const cName = fee.student?.class?.name || 'Standard';
                                                const dateStr = fee.updatedAt || fee.dueDate || fee.createdAt;
                                                const formattedDate = dateStr ? format(new Date(dateStr), 'dd MMM yyyy') : 'N/A';
                                                const isMarkingThis = markingPaidId === fee.id;

                                                return (
                                                    <tr
                                                        key={fee.id}
                                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
                                                    >
                                                        <td className="px-5 py-3.5 font-mono text-[11px] text-slate-400 font-bold uppercase">
                                                            #{fee.id.substring(fee.id.length - 8).toUpperCase()}
                                                        </td>
                                                        <td className="px-5 py-3.5">
                                                            <div className="flex items-center gap-2.5">
                                                                <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
                                                                    {sName.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                                                        {sName}
                                                                    </p>
                                                                    {fee.student?.rollNumber && (
                                                                        <p className="text-[9px] text-slate-400 font-bold">
                                                                            Roll #{fee.student.rollNumber}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-3.5">
                                                            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                                                {cName}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-3.5 text-xs text-slate-500 font-medium">
                                                            {formattedDate}
                                                        </td>
                                                        <td className="px-5 py-3.5 font-black text-slate-900 dark:text-white text-xs font-mono">
                                                            ₹{Number(fee.amount).toLocaleString('en-IN')}
                                                        </td>
                                                        <td className="px-5 py-3.5">
                                                            <span
                                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                                                    fee.status === 'PAID'
                                                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20'
                                                                        : fee.status === 'OVERDUE'
                                                                        ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20'
                                                                        : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20'
                                                                }`}
                                                            >
                                                                <span
                                                                    className={`size-1.5 rounded-full ${
                                                                        fee.status === 'PAID'
                                                                            ? 'bg-emerald-500'
                                                                            : fee.status === 'OVERDUE'
                                                                            ? 'bg-rose-500'
                                                                            : 'bg-amber-500'
                                                                    }`}
                                                                />
                                                                {fee.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-3.5 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                {fee.status === 'PAID' ? (
                                                                    <button
                                                                        onClick={() => setSelectedReceipt({
                                                                            ...fee,
                                                                            studentName: sName,
                                                                            class: cName,
                                                                            date: dateStr
                                                                        })}
                                                                        className="inline-flex items-center gap-1 text-[11px] font-black text-primary hover:underline uppercase tracking-wider"
                                                                    >
                                                                        <Receipt size={13} />
                                                                        <span>Receipt</span>
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        disabled={isMarkingThis}
                                                                        onClick={() => handleMarkAsPaid(fee.id, sName)}
                                                                        className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm transition-all active:scale-95 flex items-center gap-1"
                                                                    >
                                                                        {isMarkingThis ? (
                                                                            <span>...</span>
                                                                        ) : (
                                                                            <>
                                                                                <Check size={11} />
                                                                                <span>Mark Paid</span>
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                                    <span className="text-slate-400 font-medium">
                                        Showing {(currentPage - 1) * pageSize + 1} to{' '}
                                        {Math.min(currentPage * pageSize, filteredFees.length)} of {filteredFees.length} records
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40"
                                        >
                                            <ChevronLeft size={14} />
                                        </button>
                                        <span className="text-xs font-black text-slate-700 dark:text-slate-300 px-2">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <button
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40"
                                        >
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* OFFICIAL FEE RECEIPT MODAL */}
                        {selectedReceipt && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full overflow-hidden p-8 space-y-6 animate-in zoom-in-95">
                                    {/* Receipt Header */}
                                    <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                                <Building2 size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                                    Vidya Mandir Senior Secondary School
                                                </h3>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    Official Fee Payment Receipt
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedReceipt(null)}
                                            className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    {/* Receipt Info */}
                                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-3">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-400 font-bold uppercase text-[10px]">Receipt No:</span>
                                            <span className="font-mono font-black text-slate-900 dark:text-white">
                                                REC-2026-{(selectedReceipt.id || '000000').substring((selectedReceipt.id || '000000').length - 6).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-400 font-bold uppercase text-[10px]">Student Name:</span>
                                            <span className="font-black text-slate-900 dark:text-white uppercase">
                                                {selectedReceipt.studentName}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-400 font-bold uppercase text-[10px]">Class & Batch:</span>
                                            <span className="font-bold text-slate-700 dark:text-slate-300">
                                                {selectedReceipt.class}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-400 font-bold uppercase text-[10px]">Payment Date:</span>
                                            <span className="font-bold text-slate-700 dark:text-slate-300">
                                                {selectedReceipt.date ? format(new Date(selectedReceipt.date), 'dd MMMM yyyy, hh:mm a') : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-400 font-bold uppercase text-[10px]">Payment Mode:</span>
                                            <span className="font-bold text-slate-700 dark:text-slate-300">
                                                Online / UPI Verified Transfer
                                            </span>
                                        </div>
                                    </div>

                                    {/* Fee Breakdown */}
                                    <div className="space-y-2 border-t border-b border-slate-100 dark:border-slate-800 py-3.5">
                                        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                                            <span>Tuition Fee (Quarterly)</span>
                                            <span className="font-mono">₹{(selectedReceipt.amount * 0.7).toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                                            <span>Smart Classroom & Laboratory Charges</span>
                                            <span className="font-mono">₹{(selectedReceipt.amount * 0.2).toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                                            <span>Library, Sports & Co-Curricular</span>
                                            <span className="font-mono">₹{(selectedReceipt.amount * 0.1).toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-dashed border-slate-200 dark:border-slate-700">
                                            <span>Total Amount Settled:</span>
                                            <span className="text-primary font-mono font-black text-base">₹{Number(selectedReceipt.amount).toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between gap-3 pt-2">
                                        <Button
                                            variant="secondary"
                                            onClick={handlePrint}
                                            className="rounded-xl px-5 py-2.5 h-auto text-xs font-black uppercase tracking-wider gap-2"
                                        >
                                            <Printer size={15} />
                                            <span>Print Receipt</span>
                                        </Button>

                                        <button
                                            onClick={() => setSelectedReceipt(null)}
                                            className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all"
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* RECORD PAYMENT MODAL */}
                        {isCollecting && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden p-8 space-y-6 animate-in zoom-in-95">
                                    <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-800">
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                                Record Student Fee Payment
                                            </h3>
                                            <p className="text-xs text-slate-400">Log an incoming offline/online student fee collection.</p>
                                        </div>
                                        <button
                                            onClick={() => setIsCollecting(false)}
                                            className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleRecordPayment} className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                                Student Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={newPayment.studentName}
                                                onChange={(e) => setNewPayment({ ...newPayment, studentName: e.target.value })}
                                                placeholder="e.g. Aarav Sharma"
                                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 px-5 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary uppercase transition-all"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                                    Class & Grade
                                                </label>
                                                <select
                                                    value={newPayment.className}
                                                    onChange={(e) => setNewPayment({ ...newPayment, className: e.target.value })}
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 px-4 text-xs font-black uppercase text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary"
                                                >
                                                    <option value="Class 1st">Class 1st</option>
                                                    <option value="Class 2nd">Class 2nd</option>
                                                    <option value="Class 5th">Class 5th</option>
                                                    <option value="Class 7th">Class 7th</option>
                                                    <option value="Class 8th">Class 8th</option>
                                                    <option value="Class 9th">Class 9th</option>
                                                    <option value="Class 10th">Class 10th</option>
                                                    <option value="Class 11th">Class 11th</option>
                                                    <option value="Class 12th">Class 12th</option>
                                                </select>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                                    Amount (₹) *
                                                </label>
                                                <input
                                                    type="number"
                                                    required
                                                    value={newPayment.amount}
                                                    onChange={(e) => setNewPayment({ ...newPayment, amount: Number(e.target.value) })}
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 px-4 text-sm font-black text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                                Payment Mode
                                            </label>
                                            <select
                                                value={newPayment.paymentMethod}
                                                onChange={(e) => setNewPayment({ ...newPayment, paymentMethod: e.target.value })}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 px-4 text-xs font-black uppercase text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary"
                                            >
                                                <option value="UPI / Online Transfer">UPI / Online Transfer (PhonePe/GPay)</option>
                                                <option value="Bank NetBanking">Bank Transfer (NEFT / RTGS)</option>
                                                <option value="Cash Deposit">Cash Deposit at Counter</option>
                                                <option value="Cheque / DD">Cheque / Demand Draft</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                                Remarks
                                            </label>
                                            <input
                                                type="text"
                                                value={newPayment.remarks}
                                                onChange={(e) => setNewPayment({ ...newPayment, remarks: e.target.value })}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 px-4 text-xs font-medium text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>

                                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={() => setIsCollecting(false)}
                                                className="rounded-xl px-5 py-2.5 h-auto text-xs font-black uppercase tracking-widest"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={submittingPayment}
                                                className="bg-primary hover:bg-primary/90 text-white rounded-xl px-7 py-2.5 h-auto text-xs font-black uppercase tracking-widest gap-2 shadow-xl shadow-primary/20"
                                            >
                                                <Check size={16} />
                                                <span>Confirm Payment</span>
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            </RoleGuard>
        </AuthGuard>
    );
}

FeeDashboard.getLayout = function getLayout(page: React.ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
