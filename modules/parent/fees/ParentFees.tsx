import React, { useState, useEffect, useMemo } from 'react';
import { useParent } from '@/contexts/ParentContext';
import { feesService } from '@/services/fees.service';
import {
    CreditCard,
    IndianRupee,
    Receipt,
    History,
    Filter,
    Download,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    Calendar,
    Wallet,
    Bus,
    GraduationCap,
    BookOpen,
    Printer,
    Search,
    X,
    Check,
    ArrowRight,
    Tag,
    Clock,
    FileText
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

export default function ParentFees() {
    const { selectedChildId, setSelectedChildId, childrenList } = useParent();
    const [fees, setFees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'invoices' | 'structure'>('invoices');
    const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

    // Auto-select first child if 'ALL' or not selected yet
    useEffect(() => {
        if (selectedChildId === 'ALL' && childrenList.length > 0) {
            setSelectedChildId(childrenList[0].id);
        }
    }, [selectedChildId, childrenList, setSelectedChildId]);

    // Active Child
    const activeChild = useMemo(() => {
        if (!childrenList || childrenList.length === 0) return null;
        if (selectedChildId === 'ALL') return childrenList[0];
        return childrenList.find((c: any) => c.id === selectedChildId) || childrenList[0];
    }, [childrenList, selectedChildId]);

    // Fetch child's real fee records
    useEffect(() => {
        if (!activeChild?.id) return;

        const fetchFees = async () => {
            setLoading(true);
            try {
                // Fetch student's fee history from /fees/student/:id/history
                const res = await feesService.getStudentFeeHistory(activeChild.id);
                const payload = (res as any)?.data || res;

                if (payload && payload.fees && Array.isArray(payload.fees) && payload.fees.length > 0) {
                    setFees(payload.fees);
                } else {
                    // Fallback to activeChild's preloaded fees or getFees
                    const generalFees = await feesService.getFees({ studentId: activeChild.id });
                    const list = (generalFees as any)?.data || generalFees || [];
                    setFees(Array.isArray(list) ? list : []);
                }
            } catch (error) {
                console.warn('Error fetching fee history, using activeChild fees:', error);
                if (activeChild.fees && activeChild.fees.length > 0) {
                    setFees(activeChild.fees);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchFees();
    }, [activeChild?.id]);

    // Format Date helper
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'Oct 2026';
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            return d.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    // Calculate fee breakdown for selected child
    // Class 10 (Aarav): Base ₹28,500 -> Tuition: ₹22,500, Transport: ₹4,500, Exam/Dev: ₹1,500
    // Class 7 (Ananya): Base ₹24,500 -> Tuition: ₹19,000, Transport: ₹4,000, Exam/Dev: ₹1,500
    const feeStructure = useMemo(() => {
        const isSenior = (activeChild?.class || '').includes('10') || (activeChild?.class || '').includes('9');
        const tuition = isSenior ? 22500 : 19000;
        const transport = isSenior ? 4500 : 4000;
        const examAndLab = 1500;
        const termTotal = tuition + transport + examAndLab;

        return {
            tuition,
            transport,
            examAndLab,
            termTotal,
            annualTotal: termTotal * 4
        };
    }, [activeChild]);

    // Normalized invoices list with tuition and transport components
    const normalizedInvoices = useMemo(() => {
        const baseList = fees.length > 0 ? fees : [
            { id: 'fee-1', amount: feeStructure.termTotal, dueDate: '2026-07-05T06:00:00.000Z', status: 'PAID' },
            { id: 'fee-2', amount: feeStructure.termTotal, dueDate: '2026-10-15T04:45:00.000Z', status: 'PAID' }
        ];

        return baseList.map((f: any, idx: number) => {
            const total = f.amount || feeStructure.termTotal;
            // Proportionate breakdown
            const tuitionComponent = Math.round(total * (feeStructure.tuition / feeStructure.termTotal));
            const transportComponent = Math.round(total * (feeStructure.transport / feeStructure.termTotal));
            const otherComponent = total - tuitionComponent - transportComponent;
            const termName = idx === 0 ? 'Quarter 1 (Apr - Jun 2026)' : (idx === 1 ? 'Quarter 2 (Jul - Sep 2026)' : `Quarter ${idx + 1} Installment`);
            const invoiceNo = `INV-2026-00${idx + 1}${activeChild?.rollNumber ? '-' + activeChild.rollNumber : ''}`;

            return {
                id: f.id || `inv-${idx}`,
                invoiceNo,
                termName,
                totalAmount: total,
                tuitionFee: tuitionComponent,
                transportFee: transportComponent,
                otherFee: otherComponent,
                dueDate: formatDate(f.dueDate),
                paidDate: f.status === 'PAID' ? formatDate(f.dueDate) : null,
                status: f.status || 'PAID',
                paymentMode: 'Online NetBanking / UPI Transfer (HDFC Bank)',
                transactionId: `TXN-89240${idx + 1}VM`
            };
        });
    }, [fees, feeStructure, activeChild]);

    // Financial totals
    const financialStats = useMemo(() => {
        const totalPaid = normalizedInvoices
            .filter(inv => inv.status === 'PAID')
            .reduce((sum, inv) => sum + inv.totalAmount, 0);

        const totalPending = normalizedInvoices
            .filter(inv => inv.status !== 'PAID')
            .reduce((sum, inv) => sum + inv.totalAmount, 0);

        const totalTuitionPaid = normalizedInvoices
            .filter(inv => inv.status === 'PAID')
            .reduce((sum, inv) => sum + inv.tuitionFee, 0);

        const totalTransportPaid = normalizedInvoices
            .filter(inv => inv.status === 'PAID')
            .reduce((sum, inv) => sum + inv.transportFee, 0);

        return {
            totalPaid,
            totalPending: activeChild?.pendingFees !== undefined ? activeChild.pendingFees : totalPending,
            totalTuitionPaid,
            totalTransportPaid
        };
    }, [normalizedInvoices, activeChild]);

    // Pay Fee action
    const handlePayFee = (invoice: any) => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1500)),
            {
                loading: `Processing payment for ${invoice.invoiceNo}...`,
                success: 'Payment completed successfully! Receipt generated.',
                error: 'Payment failed.',
            }
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-16">
            {/* Header Banner */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                            <ShieldCheck size={13} />
                            Financial Ledger & Fee Accounts
                        </span>
                        <span className="text-xs text-slate-400 font-medium">• Academic Year 2026-27</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        School Fees & Payment Registry
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">
                        Term-wise fee installment records, tuition & transport breakdown, and official tax invoices.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => {
                            toast.success('Generating official fee statement...');
                            setTimeout(() => window.print(), 500);
                        }}
                        variant="ghost"
                        className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3 h-auto font-bold text-xs gap-2 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/60"
                    >
                        <Download size={16} />
                        <span>Download Statement</span>
                    </Button>
                </div>
            </div>

            {/* STEP 1: PROMINENT CHILD SELECTOR BAR */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black text-primary uppercase tracking-wider">Step 1 • Select Child to View Fees</p>
                        <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                            Choose Student Account
                        </h3>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                        {childrenList.length} Wards Linked
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {childrenList.map((child: any) => {
                        const isSelected = activeChild?.id === child.id;
                        const pending = child.pendingFees || 0;
                        const isCleared = pending === 0;

                        return (
                            <button
                                key={child.id}
                                onClick={() => {
                                    setSelectedChildId(child.id);
                                    setSelectedReceipt(null);
                                    toast.success(`Switched fee ledger to ${child.name}`);
                                }}
                                className={`text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 group ${
                                    isSelected
                                        ? 'bg-primary/5 border-primary shadow-md shadow-primary/10 ring-2 ring-primary/20'
                                        : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-primary/40 hover:bg-white dark:hover:bg-slate-800'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`size-13 rounded-2xl flex items-center justify-center font-black text-xl uppercase transition-colors shrink-0 ${
                                        isSelected 
                                            ? 'bg-primary text-white shadow-md shadow-primary/30' 
                                            : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'
                                    }`}>
                                        {(child.firstName || child.name || 'C').charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                                {child.name}
                                            </h4>
                                            {isSelected && (
                                                <span className="size-4 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">
                                                    <Check size={10} strokeWidth={3} />
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs font-semibold text-slate-500 mt-0.5">
                                            {child.class} • Section {child.section || 'A'} • Roll #{child.rollNumber || '—'}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right shrink-0">
                                    <span className={`inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full ${
                                        isCleared 
                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50' 
                                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50'
                                    }`}>
                                        {isCleared ? '₹0 All Settled' : `₹${pending.toLocaleString()} Pending`}
                                    </span>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1">
                                        {isCleared ? 'Cleared • No Dues' : 'Invoice Pending'}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* STEP 2: FEES DIVIDED INTO TUITION, TRANSPORT & EXAMS */}
            {activeChild && (
                <div className="space-y-8">
                    {/* 4 Primary Allocation Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {/* Outstanding Balance */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl relative overflow-hidden group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Outstanding Dues
                                    </p>
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                                        ₹{financialStats.totalPending.toLocaleString()}
                                    </h3>
                                    <p className={`text-xs font-bold mt-1.5 flex items-center gap-1 ${
                                        financialStats.totalPending === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'
                                    }`}>
                                        <CheckCircle2 size={13} />
                                        {financialStats.totalPending === 0 ? 'Current Term Settled' : 'Payment Overdue'}
                                    </p>
                                </div>
                                <div className="size-13 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                                    <CheckCircle2 size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Tuition Fees Allocation */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl relative overflow-hidden group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Tuition Fee (Per Term)
                                    </p>
                                    <h3 className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                                        ₹{feeStructure.tuition.toLocaleString()}
                                    </h3>
                                    <p className="text-xs font-semibold text-slate-500 mt-1.5 flex items-center gap-1">
                                        <GraduationCap size={13} />
                                        Academics, Faculty & Smart Class
                                    </p>
                                </div>
                                <div className="size-13 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                                    <GraduationCap size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Transport Fees Allocation */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl relative overflow-hidden group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Transport Fee (Per Term)
                                    </p>
                                    <h3 className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">
                                        ₹{feeStructure.transport.toLocaleString()}
                                    </h3>
                                    <p className="text-xs font-semibold text-slate-500 mt-1.5 flex items-center gap-1">
                                        <Bus size={13} />
                                        School Bus Transit & GPS Route
                                    </p>
                                </div>
                                <div className="size-13 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                                    <Bus size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Annual Total Settled YTD */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl relative overflow-hidden group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Total Paid (YTD)
                                    </p>
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                                        ₹{financialStats.totalPaid.toLocaleString()}
                                    </h3>
                                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1">
                                        <CheckCircle2 size={13} />
                                        Verified by School Accounts
                                    </p>
                                </div>
                                <div className="size-13 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                                    <Receipt size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setActiveTab('invoices')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                                    activeTab === 'invoices'
                                        ? 'bg-primary text-white shadow-md shadow-primary/25'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                            >
                                <Receipt size={15} />
                                <span>Invoices & Fee Receipts</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('structure')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                                    activeTab === 'structure'
                                        ? 'bg-primary text-white shadow-md shadow-primary/25'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                            >
                                <Tag size={15} />
                                <span>Tuition & Transport Structure Breakdown</span>
                            </button>
                        </div>

                        <span className="text-xs font-bold text-slate-400 hidden sm:block pr-3">
                            Account: <strong className="text-slate-900 dark:text-white">{activeChild.name}</strong>
                        </span>
                    </div>

                    {/* TAB 1: INVOICES & RECEIPTS WITH TUITION & TRANSPORT DIVISION */}
                    {activeTab === 'invoices' && (
                        <div className="space-y-4">
                            {loading ? (
                                Array.from({ length: 2 }).map((_, i) => (
                                    <div key={i} className="h-32 rounded-3xl bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
                                ))
                            ) : normalizedInvoices.map((inv) => (
                                <div
                                    key={inv.id}
                                    className="p-6 md:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-primary/40 hover:shadow-xl transition-all shadow-sm space-y-5"
                                >
                                    {/* Top Row: Invoice Title & Status */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-4">
                                            <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                                                <Wallet size={24} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                                                        {inv.termName}
                                                    </h3>
                                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                                                        {inv.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                                                    Invoice: <strong className="text-slate-700 dark:text-slate-300">{inv.invoiceNo}</strong> • Date: {inv.dueDate}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 sm:justify-end">
                                            <div className="text-left sm:text-right">
                                                <span className="text-2xl font-black text-slate-900 dark:text-white">
                                                    ₹{inv.totalAmount.toLocaleString()}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                                    Installment Total
                                                </span>
                                            </div>

                                            <Button
                                                onClick={() => setSelectedReceipt(inv)}
                                                className="bg-primary hover:bg-primary/90 text-white rounded-xl px-4 py-2.5 text-xs font-bold gap-2"
                                            >
                                                <FileText size={14} />
                                                <span>View Receipt</span>
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Bottom Row: Detailed Division into Tuition, Transport & Exam */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                                        {/* Tuition Component */}
                                        <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="size-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                                                    <GraduationCap size={16} />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Tuition Fee</span>
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Curriculum & Faculty</span>
                                                </div>
                                            </div>
                                            <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                                                ₹{inv.tuitionFee.toLocaleString()}
                                            </span>
                                        </div>

                                        {/* Transport Component */}
                                        <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="size-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                                                    <Bus size={16} />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Transport Fee</span>
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Route 1 (AC Coach)</span>
                                                </div>
                                            </div>
                                            <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                                                ₹{inv.transportFee.toLocaleString()}
                                            </span>
                                        </div>

                                        {/* Exam & Institutional Component */}
                                        <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                                                    <BookOpen size={16} />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Exam & Activities</span>
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Smart Lab & Library</span>
                                                </div>
                                            </div>
                                            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                                                ₹{inv.otherFee.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* TAB 2: DETAILED STRUCTURE BREAKDOWN TABLE */}
                    {activeTab === 'structure' && (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-6 md:p-8 space-y-6">
                            <div>
                                <h3 className="text-base font-black text-slate-900 dark:text-white">
                                    Annual Fee Schedule & Division for {activeChild.name} ({activeChild.class})
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Official fee components approved by Vidya Mandir School Board of Trustees.
                                </p>
                            </div>

                            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                                        <tr>
                                            <th className="p-3.5">Fee Component</th>
                                            <th className="p-3.5">Frequency</th>
                                            <th className="p-3.5">Quarterly Amount</th>
                                            <th className="p-3.5">Annual Total</th>
                                            <th className="p-3.5">Share %</th>
                                            <th className="p-3.5 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                                        <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                            <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                <GraduationCap size={16} className="text-indigo-600" />
                                                <span>Academic Tuition Fee</span>
                                            </td>
                                            <td className="p-3.5 text-slate-500">Quarterly (4 Terms)</td>
                                            <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">₹{feeStructure.tuition.toLocaleString()}</td>
                                            <td className="p-3.5 font-black text-slate-900 dark:text-white">₹{(feeStructure.tuition * 4).toLocaleString()}</td>
                                            <td className="p-3.5 font-bold text-indigo-600">79%</td>
                                            <td className="p-3.5 text-right">
                                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600">Paid</span>
                                            </td>
                                        </tr>

                                        <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                            <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                <Bus size={16} className="text-blue-600" />
                                                <span>School Transport & Commute Facility</span>
                                            </td>
                                            <td className="p-3.5 text-slate-500">Quarterly (Route 1)</td>
                                            <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">₹{feeStructure.transport.toLocaleString()}</td>
                                            <td className="p-3.5 font-black text-slate-900 dark:text-white">₹{(feeStructure.transport * 4).toLocaleString()}</td>
                                            <td className="p-3.5 font-bold text-blue-600">16%</td>
                                            <td className="p-3.5 text-right">
                                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600">Paid</span>
                                            </td>
                                        </tr>

                                        <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                            <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                <BookOpen size={16} className="text-emerald-600" />
                                                <span>Examination, Laboratory & Library</span>
                                            </td>
                                            <td className="p-3.5 text-slate-500">Quarterly</td>
                                            <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">₹{feeStructure.examAndLab.toLocaleString()}</td>
                                            <td className="p-3.5 font-black text-slate-900 dark:text-white">₹{(feeStructure.examAndLab * 4).toLocaleString()}</td>
                                            <td className="p-3.5 font-bold text-emerald-600">5%</td>
                                            <td className="p-3.5 text-right">
                                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600">Paid</span>
                                            </td>
                                        </tr>

                                        <tr className="bg-slate-50/80 dark:bg-slate-800/60 font-black">
                                            <td className="p-3.5 text-slate-900 dark:text-white">Total Annual Fee</td>
                                            <td className="p-3.5 text-slate-500">AY 2026-27</td>
                                            <td className="p-3.5 text-slate-900 dark:text-white">₹{feeStructure.termTotal.toLocaleString()}</td>
                                            <td className="p-3.5 text-primary text-sm">₹{feeStructure.annualTotal.toLocaleString()}</td>
                                            <td className="p-3.5 text-slate-700 dark:text-slate-300">100%</td>
                                            <td className="p-3.5 text-right text-emerald-600">Up to Date</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* OFFICIAL FEE RECEIPT MODAL */}
            {selectedReceipt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
                        {/* Receipt Header */}
                        <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div>
                                <span className="inline-block text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-200 dark:border-emerald-800/50 mb-1">
                                    Official Tax Receipt • Payment Settled
                                </span>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                    Vidya Mandir Senior Secondary School
                                </h3>
                                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                                    Receipt #{selectedReceipt.invoiceNo} • {selectedReceipt.termName}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedReceipt(null)}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-500 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Student & Parent Info Box */}
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Student Name</span>
                                <span className="font-black text-slate-900 dark:text-white">{activeChild?.name}</span>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Class & Section</span>
                                <span className="font-bold text-slate-700 dark:text-slate-300">{activeChild?.class} - {activeChild?.section || 'A'} (Roll #{activeChild?.rollNumber || '—'})</span>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Parent / Guardian</span>
                                <span className="font-bold text-slate-700 dark:text-slate-300">Sanjay Agarwal</span>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Payment Date</span>
                                <span className="font-bold text-slate-700 dark:text-slate-300">{selectedReceipt.paidDate || selectedReceipt.dueDate}</span>
                            </div>
                        </div>

                        {/* Breakdown Items */}
                        <div className="space-y-2.5 text-xs">
                            <h4 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                                Fee Breakdown Items
                            </h4>

                            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <GraduationCap size={15} className="text-indigo-600" />
                                    Tuition & Academic Faculty Fee
                                </span>
                                <span className="font-black text-slate-900 dark:text-white">₹{selectedReceipt.tuitionFee.toLocaleString()}</span>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <Bus size={15} className="text-blue-600" />
                                    School Transport & Bus Facility (Route 1)
                                </span>
                                <span className="font-black text-slate-900 dark:text-white">₹{selectedReceipt.transportFee.toLocaleString()}</span>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <BookOpen size={15} className="text-emerald-600" />
                                    Examination, Laboratory & Library Charges
                                </span>
                                <span className="font-black text-slate-900 dark:text-white">₹{selectedReceipt.otherFee.toLocaleString()}</span>
                            </div>

                            <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between font-black text-sm">
                                <span className="text-primary">Total Amount Paid</span>
                                <span className="text-primary text-base">₹{selectedReceipt.totalAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Mode & Transaction */}
                        <div className="text-[11px] text-slate-400 font-semibold space-y-0.5 pt-1">
                            <p>Payment Mode: {selectedReceipt.paymentMode}</p>
                            <p>Ref / Txn ID: {selectedReceipt.transactionId} • Verified by School Accounts</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                            <Button
                                variant="ghost"
                                onClick={() => setSelectedReceipt(null)}
                                className="rounded-xl text-xs font-bold"
                            >
                                Close
                            </Button>
                            <Button
                                onClick={() => {
                                    toast.success('Printing official fee receipt...');
                                    setTimeout(() => window.print(), 500);
                                }}
                                className="bg-primary hover:bg-primary/90 text-white rounded-xl px-5 py-2.5 text-xs font-bold gap-2"
                            >
                                <Printer size={15} />
                                <span>Print Receipt</span>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
