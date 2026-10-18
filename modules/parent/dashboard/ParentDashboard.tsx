import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
    Users,
    GraduationCap,
    TrendingUp,
    Clock,
    Calendar,
    ChevronRight,
    Activity,
    AlertCircle,
    CheckCircle2,
    BookOpen,
    Download,
    ArrowRight,
    RotateCcw,
    CreditCard,
    Award,
    FileText,
    Sparkles,
    Check,
    XCircle,
    Bell,
    Mail,
    Phone,
    UserCheck,
    X,
    CalendarDays
} from 'lucide-react';
import { useParent } from '@/contexts/ParentContext';
import ParentLayout from '@/components/layouts/ParentLayout';
import { statsService } from '@/services/stats.service';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { toast } from 'react-hot-toast';

export default function ParentDashboard() {
    const { selectedChildId, setSelectedChildId, childrenList, loading: contextLoading } = useParent();
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState<any>(null);

    const getNoticeCategory = (title: string = '', content: string = '') => {
        const text = `${title} ${content}`.toLowerCase();
        if (text.includes('holiday') || text.includes('diwali') || text.includes('break') || text.includes('vacation')) {
            return { label: 'Holiday & Festive', color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60', icon: '🏖️' };
        }
        if (text.includes('sports') || text.includes('spardha') || text.includes('match') || text.includes('tournament')) {
            return { label: 'Sports & Athletics', color: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800/60', icon: '🏆' };
        }
        if (text.includes('ptm') || text.includes('parent-teacher') || text.includes('meeting') || text.includes('conference')) {
            return { label: 'Parent-Teacher Meet', color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/60', icon: '👥' };
        }
        if (text.includes('uniform') || text.includes('dress') || text.includes('rule') || text.includes('policy')) {
            return { label: 'School Policy', color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60', icon: '📋' };
        }
        return { label: 'Official Circular', color: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60', icon: '📢' };
    };

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const data = await statsService.getStats('PARENT');
            setDashboardData(data?.data || data);
        } catch (error) {
            console.error('Error fetching parent dashboard:', error);
            toast.error('Failed to load dashboard records.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleSyncData = async () => {
        setIsUpdating(true);
        await fetchDashboardData();
        setIsUpdating(false);
        toast.success('Parent records synchronized with school database.');
    };

    const handlePrintReport = () => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 800)),
            {
                loading: 'Preparing academic progress report...',
                success: 'Opening print dialog...',
                error: 'Failed to generate report.',
            }
        ).then(() => {
            window.print();
        });
    };

    // Active Child (if specific child selected)
    const activeChild = useMemo(() => {
        if (!dashboardData?.children || selectedChildId === 'ALL') return null;
        return dashboardData.children.find((c: any) => c.id === selectedChildId) || null;
    }, [dashboardData, selectedChildId]);

    // Parent & Children data from real backend response
    const children: any[] = dashboardData?.children || [];
    const parent = dashboardData?.parent || {};
    const totalPendingFees = dashboardData?.totalPendingFees || 0;
    const totalPaidFees = dashboardData?.totalPaidFees || 0;
    const averageAttendance = dashboardData?.averageAttendanceRate || 
        (children.length > 0 ? Math.round(children.reduce((acc: number, c: any) => acc + (c.attendanceRate || 0), 0) / children.length) : 0);
    const recentNotices = dashboardData?.recentNotices || [];
    const recentActivities = dashboardData?.recentActivities || [];

    // Filter activities by child if a child is selected
    const displayedActivities = useMemo(() => {
        if (!activeChild) return recentActivities;
        return recentActivities.filter((act: any) => 
            act.detail?.toLowerCase().includes(activeChild.class?.toLowerCase()) ||
            act.title?.toLowerCase().includes(activeChild.class?.toLowerCase())
        );
    }, [recentActivities, activeChild]);

    if (loading || contextLoading) {
        return (
            <ParentLayout>
                <div className="space-y-6 p-4">
                    <Skeleton className="h-28 w-full rounded-3xl" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-32 rounded-3xl" />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Skeleton className="lg:col-span-2 h-96 rounded-3xl" />
                        <Skeleton className="h-96 rounded-3xl" />
                    </div>
                </div>
            </ParentLayout>
        );
    }

    return (
        <ParentLayout>
            <div className="space-y-8 animate-in fade-in duration-500 pb-16">
                {/* Header Banner */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                                <Users size={13} />
                                Parent & Guardian Portal
                            </span>
                            <span className="text-xs text-slate-400 font-medium">• Academic Year 2026-27</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            {activeChild ? `${activeChild.name}'s Academic Dashboard` : 'Family Academic Overview'}
                        </h1>
                        <p className="text-sm font-medium text-slate-500 mt-1">
                            {activeChild 
                                ? `${activeChild.class} - Section ${activeChild.section || 'A'} • Roll #${activeChild.rollNumber || 'N/A'} • Admission No: ${activeChild.admissionNo || 'N/A'}`
                                : `Academic monitoring, real attendance records, and school notifications for ${parent.name || 'Sanjay Agarwal'}.`}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            onClick={handlePrintReport}
                            variant="ghost"
                            className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3 h-auto font-bold text-xs gap-2 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/60"
                        >
                            <Download size={16} />
                            <span>Download Report</span>
                        </Button>
                        <Button
                            onClick={handleSyncData}
                            disabled={isUpdating}
                            className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 py-3 h-auto font-black text-xs uppercase tracking-wider gap-2 shadow-xl shadow-primary/25 transition-all hover:shadow-primary/40 active:scale-95 disabled:opacity-50"
                        >
                            <RotateCcw size={16} className={isUpdating ? 'animate-spin' : ''} />
                            <span>{isUpdating ? 'Syncing...' : 'Sync Data'}</span>
                        </Button>
                    </div>
                </div>

                {/* Interactive Child Selector Tabs */}
                <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto shadow-sm no-scrollbar">
                    <button
                        onClick={() => setSelectedChildId('ALL')}
                        className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                            selectedChildId === 'ALL'
                                ? 'bg-primary text-white shadow-md shadow-primary/25'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                        <div className={`size-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                            selectedChildId === 'ALL' ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                        }`}>
                            <Users size={15} />
                        </div>
                        <span>All Children (Family Overview)</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                            selectedChildId === 'ALL' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}>
                            {children.length}
                        </span>
                    </button>

                    {children.map((child: any) => {
                        const isSelected = selectedChildId === child.id;
                        return (
                            <button
                                key={child.id}
                                onClick={() => setSelectedChildId(child.id)}
                                className={`flex items-center gap-3 px-5 py-3 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                                    isSelected
                                        ? 'bg-primary text-white shadow-md shadow-primary/25'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                            >
                                <div className={`size-7 rounded-lg flex items-center justify-center font-black text-xs uppercase ${
                                    isSelected ? 'bg-white/20 text-white' : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                }`}>
                                    {(child.firstName || child.name || 'C').charAt(0)}
                                </div>
                                <div className="text-left">
                                    <p className="leading-tight">{child.name}</p>
                                    <p className={`text-[10px] font-semibold leading-tight ${
                                        isSelected ? 'text-white/80' : 'text-slate-400'
                                    }`}>
                                        {child.class} • Roll #{child.rollNumber || '—'}
                                    </p>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                                    isSelected ? 'bg-white/20 text-white' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                }`}>
                                    {child.attendanceRate}% Attendance
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* 4 Summary Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Card 1: Wards Count / Current Grade */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    {activeChild ? 'Current Grade' : 'Enrolled Wards'}
                                </p>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                    {activeChild ? activeChild.class : `${children.length} Children`}
                                </h3>
                                <p className="text-xs font-semibold text-slate-500 mt-1">
                                    {activeChild 
                                        ? `Section ${activeChild.section || 'A'} • Senior Wing` 
                                        : (children.map((c: any) => c.firstName || c.name.split(' ')[0]).join(' & ') || 'Vidya Mandir School')}
                                </p>
                            </div>
                            <div className="size-13 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                                <GraduationCap size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Card 2: If Child Selected -> Attendance; If All Children -> Fee Balance */}
                    {activeChild ? (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Attendance Record
                                    </p>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                        {activeChild.attendanceRate}%
                                    </h3>
                                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                                        <CheckCircle2 size={13} />
                                        {activeChild.presentDays || 0} Present Days Recorded
                                    </p>
                                </div>
                                <div className="size-13 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                                    <Activity size={24} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Fee Ledger Status
                                    </p>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                        ₹{totalPendingFees?.toLocaleString() || '0'}
                                    </h3>
                                    <p className={`text-xs font-bold mt-1 flex items-center gap-1 ${
                                        totalPendingFees > 0 ? 'text-amber-500' : 'text-emerald-600 dark:text-emerald-400'
                                    }`}>
                                        <CheckCircle2 size={13} />
                                        {totalPendingFees > 0 ? 'Pending Dues' : 'Up to Date • All Settled'}
                                    </p>
                                </div>
                                <div className="size-13 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                                    <CreditCard size={24} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Card 3: If Child Selected -> Academic Evaluation; If All Children -> School Circulars */}
                    {activeChild ? (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Academic Evaluation
                                    </p>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                        {activeChild.examAverage || 85}% Average
                                    </h3>
                                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-1 flex items-center gap-1">
                                        <Award size={13} />
                                        {activeChild.examResults?.length || 0} Tests Evaluated
                                    </p>
                                </div>
                                <div className="size-13 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                                    <Award size={24} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        School Circulars
                                    </p>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                        {recentNotices.length} Active Notices
                                    </h3>
                                    <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-1 flex items-center gap-1">
                                        <Bell size={13} />
                                        Official School Updates
                                    </p>
                                </div>
                                <div className="size-13 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                                    <Bell size={24} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Card 4: If Child Selected -> Child Fee Balance; If All Children -> Academic Session */}
                    {activeChild ? (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Fee Balance
                                    </p>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                        ₹{activeChild.pendingFees?.toLocaleString() || '0'}
                                    </h3>
                                    <p className={`text-xs font-bold mt-1 ${
                                        (activeChild.pendingFees || 0) > 0 ? 'text-amber-500' : 'text-emerald-600 dark:text-emerald-400'
                                    }`}>
                                        {(activeChild.pendingFees || 0) > 0 ? 'Pending Dues' : 'Up to Date • All Settled'}
                                    </p>
                                </div>
                                <div className="size-13 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                                    <CreditCard size={24} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Academic Session
                                    </p>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                        AY 2026-27
                                    </h3>
                                    <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1">
                                        <Calendar size={13} />
                                        Term 2 in Progress
                                    </p>
                                </div>
                                <div className="size-13 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                                    <Sparkles size={24} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* VIEW 1: FAMILY OVERVIEW (ALL WARDS CARDS) */}
                {selectedChildId === 'ALL' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                                    Children Academic Profiles
                                </h2>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">
                                    Individual profile, performance metrics, and quick academic access for each child.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {children.map((child: any) => {
                                const hasPendingFees = (child.pendingFees || 0) > 0;
                                const attendanceColor = (child.attendanceRate || 0) >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400';
                                const examCount = child.examResults?.length || 0;
                                const homeworkCount = child.homeworkTasks?.length || 0;

                                return (
                                    <div
                                        key={child.id}
                                        className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border-2 border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 hover:border-primary/40 transition-all group"
                                    >
                                        {/* Child Header */}
                                        <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-4">
                                                <div className="size-14 rounded-2xl bg-primary/10 border-2 border-primary/20 text-primary flex items-center justify-center font-black text-xl uppercase shadow-inner shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                                    {(child.firstName || child.name || 'S').charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                                            {child.name}
                                                        </h3>
                                                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-primary/10 text-primary">
                                                            {child.class}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs font-semibold text-slate-400 mt-0.5">
                                                        Roll #{child.rollNumber || '—'} • Section {child.section || 'A'} • Admission: {child.admissionNo || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => setSelectedChildId(child.id)}
                                                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white text-slate-600 dark:text-slate-300 text-xs font-bold transition-all shrink-0"
                                            >
                                                Focus View
                                            </button>
                                        </div>

                                        {/* Key Academic Metrics Grid */}
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attendance</p>
                                                <p className={`text-base font-black mt-0.5 ${attendanceColor}`}>
                                                    {child.attendanceRate}%
                                                </p>
                                                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                                                    {child.presentDays || 0} Present
                                                </p>
                                            </div>

                                            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Exam Score</p>
                                                <p className="text-base font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                                                    {child.examAverage || 85}%
                                                </p>
                                                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                                                    {examCount} Tests Done
                                                </p>
                                            </div>

                                            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fee Balance</p>
                                                <p className={`text-base font-black mt-0.5 ${hasPendingFees ? 'text-amber-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                    ₹{child.pendingFees?.toLocaleString() || '0'}
                                                </p>
                                                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                                                    {hasPendingFees ? 'Due' : 'Cleared'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Recent Exam Highlight (Real data) */}
                                        {child.examResults && child.examResults.length > 0 && (
                                            <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="font-bold text-slate-700 dark:text-slate-300">
                                                        Latest: {child.examResults[0].examName}
                                                    </span>
                                                    <span className="font-black text-indigo-600 dark:text-indigo-400">
                                                        {child.examResults[0].marks} / {child.examResults[0].totalMarks} ({child.examResults[0].percentage}%)
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Quick Links for this Child */}
                                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs font-bold">
                                            <Link
                                                href={`/parent/attendance`}
                                                className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                                            >
                                                <Calendar size={13} />
                                                <span>Attendance</span>
                                            </Link>
                                            <Link
                                                href={`/parent/results`}
                                                className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                                            >
                                                <Award size={13} />
                                                <span>Exam Results</span>
                                            </Link>
                                            <Link
                                                href={`/parent/fees`}
                                                className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                                            >
                                                <CreditCard size={13} />
                                                <span>Fee Ledger</span>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* VIEW 2: INDIVIDUAL CHILD DEEP DIVE (REAL DATA SPOTLIGHT) */}
                {activeChild && (
                    <div className="space-y-6">
                        {/* Child Profile Spotlight */}
                        <div className="bg-gradient-to-r from-primary/10 via-indigo-500/5 to-transparent rounded-3xl p-6 md:p-8 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
                            <div className="flex items-center gap-5">
                                <div className="size-20 rounded-3xl bg-primary text-white flex items-center justify-center font-black text-3xl shadow-xl shadow-primary/20 shrink-0 uppercase">
                                    {(activeChild.firstName || activeChild.name || 'C').charAt(0)}
                                </div>
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                                            {activeChild.name}
                                        </h2>
                                        <span className="px-3 py-1 rounded-full text-xs font-black bg-primary text-white">
                                            Roll #{activeChild.rollNumber || '—'}
                                        </span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">
                                        {activeChild.class} - Section {activeChild.section || 'A'} • Admission No: {activeChild.admissionNo || 'N/A'}
                                    </p>
                                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                                        DOB: {activeChild.dob ? new Date(activeChild.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'} • Gender: {activeChild.gender || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedChildId('ALL')}
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-primary shadow-sm"
                            >
                                <span>← Back to All Children</span>
                            </button>
                        </div>

                        {/* Child Exam Performance & Attendance Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Exam Results Table (Real Data) */}
                            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-xl space-y-5">
                                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                                    <div>
                                        <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                                            <Award size={18} className="text-primary" />
                                            Examination Records & Evaluation Marks
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Official school assessment marks recorded for {activeChild.firstName}.
                                        </p>
                                    </div>
                                    <Link
                                        href="/parent/results"
                                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                    >
                                        <span>Full Report Card</span>
                                        <ChevronRight size={14} />
                                    </Link>
                                </div>

                                {activeChild.examResults && activeChild.examResults.length > 0 ? (
                                    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                                        <table className="w-full text-left text-xs">
                                            <thead className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                                                <tr>
                                                    <th className="p-3.5">Examination</th>
                                                    <th className="p-3.5">Type</th>
                                                    <th className="p-3.5">Marks Obtained</th>
                                                    <th className="p-3.5">Percentage</th>
                                                    <th className="p-3.5 text-right">Result</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {activeChild.examResults.map((res: any, idx: number) => (
                                                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                                        <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                                                            {res.examName}
                                                        </td>
                                                        <td className="p-3.5">
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                                                {res.examType}
                                                            </span>
                                                        </td>
                                                        <td className="p-3.5 font-black text-slate-800 dark:text-slate-200">
                                                            {res.marks} <span className="text-slate-400 font-normal">/ {res.totalMarks}</span>
                                                        </td>
                                                        <td className="p-3.5 font-bold text-slate-700 dark:text-slate-300">
                                                            {res.percentage}%
                                                        </td>
                                                        <td className="p-3.5 text-right">
                                                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                                                res.isPassed 
                                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                                                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                                            }`}>
                                                                {res.isPassed ? <Check size={12} /> : <XCircle size={12} />}
                                                                {res.isPassed ? 'Passed' : 'Needs Attention'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="py-12 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                                        <Award size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                                        <p className="text-xs font-bold text-slate-500">No examination marks published yet</p>
                                    </div>
                                )}
                            </div>

                            {/* Recent Attendance Breakdown (Real Data) */}
                            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-xl space-y-5">
                                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                                    <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                                        <Calendar size={18} className="text-primary" />
                                        Recent Attendance
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Daily presence log for the past sessions.
                                    </p>
                                </div>

                                <div className="space-y-2.5">
                                    {activeChild.recentAttendance && activeChild.recentAttendance.length > 0 ? (
                                        activeChild.recentAttendance.map((att: any, idx: number) => {
                                            const isPresent = att.status === 'PRESENT';
                                            const dateObj = new Date(att.date);

                                            return (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <div className={`size-2.5 rounded-full ${isPresent ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                        <span className="text-xs font-bold text-slate-800 dark:text-white">
                                                            {dateObj.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                                                        </span>
                                                    </div>
                                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                                                        isPresent 
                                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                                    }`}>
                                                        {att.status}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="py-8 text-center text-xs text-slate-400 italic">
                                            No recent attendance records.
                                        </div>
                                    )}
                                </div>

                                <div className="pt-2">
                                    <Link
                                        href="/parent/attendance"
                                        className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all"
                                    >
                                        <span>View Monthly Calendar</span>
                                        <ArrowRight size={13} />
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

                {/* Bottom Row: Unified Academic Assignments & Redesigned School Notices */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Unified Class Assignments & Academic Tasks (No Duplication!) */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-xl space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div>
                                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                                    <BookOpen size={18} className="text-primary" />
                                    {activeChild 
                                        ? `Active Homework & Tasks for ${activeChild.firstName || activeChild.name} (${activeChild.class})`
                                        : 'Academic Tasks & Class Homework'}
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {activeChild
                                        ? `Curriculum homework assignments pending submission for Class ${activeChild.class}.`
                                        : 'Active syllabus tasks and assignments across all enrolled wards.'}
                                </p>
                            </div>
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                                {displayedActivities.length} {displayedActivities.length === 1 ? 'Task' : 'Tasks'}
                            </span>
                        </div>

                        <div className="space-y-3.5">
                            {displayedActivities.length > 0 ? (
                                displayedActivities.map((act: any, i: number) => {
                                    const dueDate = act.dueDate ? new Date(act.dueDate) : null;
                                    const isDueSoon = dueDate ? ((dueDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24)) <= 3 : false;

                                    return (
                                        <div 
                                            key={i} 
                                            className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 hover:border-primary/30 transition-all shadow-sm"
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-0.5 rounded-lg border border-primary/20">
                                                        {act.type || 'Homework'}
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                        {act.detail}
                                                    </span>
                                                </div>
                                                {dueDate && (
                                                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                                        isDueSoon 
                                                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50' 
                                                            : 'bg-slate-200/60 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                                    }`}>
                                                        <Clock size={12} />
                                                        Due: {dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                                                {act.title}
                                            </h4>
                                            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-3 mt-3 border-t border-slate-200/50 dark:border-slate-800/60">
                                                <span>Assigned on {new Date(act.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                <span className="text-primary font-bold">Standard Curriculum • Checked by Subject Faculty</span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-14 text-center bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                                    <BookOpen size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                                    <p className="text-xs font-bold text-slate-500">No pending assignments recorded.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* School Circulars / Notices - Redesigned UI */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-xl flex flex-col justify-between space-y-5">
                        <div>
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center relative">
                                        <Bell size={20} />
                                        <span className="absolute top-2 right-2 size-2 bg-primary rounded-full animate-ping" />
                                        <span className="absolute top-2 right-2 size-2 bg-primary rounded-full" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                                            School Notices
                                        </h3>
                                        <p className="text-[11px] text-slate-500 font-medium">
                                            Official circulars & announcements
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href="/parent/messages"
                                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                >
                                    <span>All</span>
                                    <ChevronRight size={14} />
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {recentNotices.length > 0 ? (
                                    recentNotices.map((notice: any, idx: number) => {
                                        const cat = getNoticeCategory(notice.title, notice.content);
                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => setSelectedNotice(notice)}
                                                className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 border border-slate-200/70 dark:border-slate-800 transition-all cursor-pointer group shadow-sm hover:shadow-md hover:border-primary/30"
                                            >
                                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                                    <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full border ${cat.color}`}>
                                                        <span>{cat.icon}</span>
                                                        <span>{cat.label}</span>
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400">
                                                        {notice.date ? new Date(notice.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Recent'}
                                                    </span>
                                                </div>
                                                <h4 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                                                    {notice.title}
                                                </h4>
                                                {notice.content && (
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mt-1">
                                                        {notice.content}
                                                    </p>
                                                )}
                                                <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-200/40 dark:border-slate-800 text-[10px] font-bold text-primary">
                                                    <span>Tap to read full notice</span>
                                                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-6 text-center text-xs text-slate-400 italic">
                                        No notices published recently.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Direct Link to Official Announcements */}
                        <div className="pt-2">
                            <Link
                                href="/parent/messages"
                                className="block text-center w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all"
                            >
                                Browse All School Communications
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Notice Details Modal */}
                {selectedNotice && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full border mb-2 ${getNoticeCategory(selectedNotice.title, selectedNotice.content).color}`}>
                                        <span>{getNoticeCategory(selectedNotice.title, selectedNotice.content).icon}</span>
                                        <span>{getNoticeCategory(selectedNotice.title, selectedNotice.content).label}</span>
                                    </span>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                                        {selectedNotice.title}
                                    </h3>
                                    <p className="text-xs text-slate-400 font-semibold mt-1">
                                        Published on {selectedNotice.date ? new Date(selectedNotice.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Official School Bulletin'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedNotice(null)}
                                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium space-y-2">
                                <p>{selectedNotice.content}</p>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold pt-2 border-t border-slate-100 dark:border-slate-800">
                                <span>Office of the Principal • Vidya Mandir Senior Secondary School</span>
                                <Button
                                    variant="primary"
                                    onClick={() => setSelectedNotice(null)}
                                    className="rounded-xl px-4 py-2 text-xs font-bold"
                                >
                                    Done
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ParentLayout>
    );
}

ParentDashboard.getLayout = function getLayout(page: React.ReactElement) {
    return <ParentLayout>{page}</ParentLayout>;
};
