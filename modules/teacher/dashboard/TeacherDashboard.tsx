import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
    Users,
    Activity,
    Star,
    Layers,
    TrendingUp,
    Calendar,
    ArrowRight,
    CheckCircle2,
    Clock,
    BookOpen,
    ClipboardCheck,
    CheckSquare,
    Award,
    Sparkles,
    Megaphone,
    MapPin,
    ChevronRight,
    Plus
} from 'lucide-react';
import { statsService } from '@/services/stats.service';
import { toast } from 'react-hot-toast';
import TeacherLayout from '@/components/layouts/TeacherLayout';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';

export default function TeacherDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await statsService.getTeacherStats();
                setStats(data.data || data);
            } catch (error: any) {
                console.error(error);
                toast.error('Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statistics = stats?.statistics || {};
    const teacher = stats?.teacher || {};
    const gradeAnalytics = stats?.gradeAnalytics || [];
    const upcomingHomework = stats?.upcomingHomework || [];
    const todaySchedule = stats?.todaySchedule || [];
    const recentNotices = stats?.recentNotices || [];

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse p-2">
                <Skeleton className="h-24 w-full rounded-2xl" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Skeleton className="h-28 rounded-2xl" />
                    <Skeleton className="h-28 rounded-2xl" />
                    <Skeleton className="h-28 rounded-2xl" />
                    <Skeleton className="h-28 rounded-2xl" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Skeleton className="lg:col-span-2 h-80 rounded-2xl" />
                    <Skeleton className="h-80 rounded-2xl" />
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Teacher Dashboard | Vikas ERP</title>
            </Head>

            <div className="space-y-6 pb-12 animate-in fade-in duration-300">
                {/* Top Welcome Banner */}
                <div className="bg-gradient-to-r from-primary/10 via-indigo-50/50 to-primary/5 dark:from-primary/20 dark:via-surface-dark dark:to-surface-dark p-6 rounded-2xl border border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/15 px-2.5 py-0.5 rounded-full">
                                Senior Faculty Portal
                            </span>
                            <span className="text-xs text-slate-400 font-medium">• Academic Year 2026-27</span>
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            Welcome back, {teacher.name || 'Rajesh Sharma'}
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Department of Mathematics • Vidya Mandir Senior Secondary School
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Link
                            href="/teacher/attendance"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl shadow-md shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <ClipboardCheck size={16} />
                            <span>Mark Attendance</span>
                        </Link>
                        <Link
                            href="/teacher/assignments"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                        >
                            <Plus size={16} />
                            <span>New Assignment</span>
                        </Link>
                    </div>
                </div>

                {/* 4 KPI Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Assigned Classes */}
                    <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                Assigned Classes
                            </p>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                {statistics.totalClasses || 5}
                            </h3>
                            <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                                Senior Wing (8th - 12th)
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <Layers size={22} />
                        </div>
                    </div>

                    {/* Total Students */}
                    <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                Total Students
                            </p>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                {statistics.totalStudents || 77}
                            </h3>
                            <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
                                Across 5 Active Batches
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                            <Users size={22} />
                        </div>
                    </div>

                    {/* Attendance Rate */}
                    <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                Attendance Rate
                            </p>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                {statistics.attendanceRate || 91}%
                            </h3>
                            <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                                High Classroom Turnout
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <Activity size={22} />
                        </div>
                    </div>

                    {/* Today's Lectures */}
                    <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                Today's Lectures
                            </p>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                {statistics.todayLecturesCount || todaySchedule.length || 4}
                            </h3>
                            <p className="text-[10px] font-semibold text-primary mt-0.5">
                                Periods Scheduled
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                            <Clock size={22} />
                        </div>
                    </div>
                </div>

                {/* Main 2-Column Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column (2 Cols): Class Performance + Today's Schedule */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Class Performance Chart */}
                        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <TrendingUp size={18} className="text-primary" />
                                        Class Academic Performance
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Average Mid-Term examination scores per class for Mathematics
                                    </p>
                                </div>
                                <Link
                                    href="/teacher/exams"
                                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                >
                                    <span>Exams & Marks</span>
                                    <ArrowRight size={14} />
                                </Link>
                            </div>

                            {/* Chart Bars */}
                            <div className="h-60 flex items-end gap-3 sm:gap-6 px-2 pt-8">
                                {gradeAnalytics.map((data: any, idx: number) => {
                                    const avg = data.average || 80;
                                    const isTop = avg >= 88;
                                    return (
                                        <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                                            {/* Score Bubble */}
                                            <div className="mb-2 text-xs font-black text-slate-800 dark:text-slate-100 group-hover:scale-110 group-hover:text-primary transition-all">
                                                {avg}%
                                            </div>

                                            {/* Vertical Bar */}
                                            <div className="w-full max-w-[56px] bg-slate-100 dark:bg-slate-800 rounded-t-xl h-44 relative overflow-hidden flex items-end">
                                                <div
                                                    className={`w-full rounded-t-xl transition-all duration-700 ease-out ${
                                                        isTop
                                                            ? 'bg-gradient-to-t from-primary to-indigo-500 shadow-md shadow-primary/30'
                                                            : 'bg-gradient-to-t from-indigo-600 to-indigo-400'
                                                    }`}
                                                    style={{ height: `${avg}%` }}
                                                />
                                            </div>

                                            {/* Class Label */}
                                            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mt-2 truncate w-full text-center">
                                                {data.label}
                                            </span>
                                        </div>
                                    );
                                })}

                                {gradeAnalytics.length === 0 && (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 italic text-xs">
                                        No exam performance records available.
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-xs text-slate-500 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                                        <span>Highest Average (Class 12th • 91%)</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                                        <span>Class Score</span>
                                    </div>
                                </div>
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                    Passing Criteria: ≥ 40%
                                </span>
                            </div>
                        </div>

                        {/* Today's Lecture Schedule */}
                        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Calendar size={18} className="text-primary" />
                                        Today's Lecture Schedule
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Periods assigned to Rajesh Sharma for today
                                    </p>
                                </div>
                                <Link
                                    href="/teacher/timetable"
                                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                >
                                    <span>Full Timetable</span>
                                    <ChevronRight size={14} />
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {todaySchedule.map((slot: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 hover:border-primary/30 transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-black text-xs flex items-center justify-center shrink-0">
                                                P{idx + 1}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                                                        {slot.class}
                                                    </span>
                                                    <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-md">
                                                        {slot.subject}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                                                    <span>{slot.startTime} - {slot.endTime}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin size={11} />
                                                        {slot.room}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/teacher/attendance`}
                                                className="px-3 py-1.5 text-[11px] font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors border border-primary/20"
                                            >
                                                Take Attendance
                                            </Link>
                                        </div>
                                    </div>
                                ))}

                                {todaySchedule.length === 0 && (
                                    <div className="p-6 text-center text-slate-400 italic text-xs">
                                        No lectures scheduled for today. Check your weekly timetable.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (1 Col): Homework & Campus Notices */}
                    <div className="space-y-6">
                        {/* Upcoming Homework */}
                        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <CheckSquare size={18} className="text-primary" />
                                        Active Homework
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Recent tasks assigned to students
                                    </p>
                                </div>
                                <Link
                                    href="/teacher/assignments"
                                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                >
                                    <span>All</span>
                                    <ArrowRight size={14} />
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {upcomingHomework.map((hw: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 space-y-2 hover:border-primary/30 transition-all"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                                                {hw.title}
                                            </h4>
                                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md shrink-0">
                                                {hw.class}
                                            </span>
                                        </div>

                                        {hw.description && (
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                                {hw.description}
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 pt-1">
                                            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                                <Clock size={12} />
                                                Due: {new Date(hw.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                            </span>
                                            <span>Subject: {hw.subject}</span>
                                        </div>
                                    </div>
                                ))}

                                {upcomingHomework.length === 0 && (
                                    <div className="p-6 text-center text-slate-400 italic text-xs">
                                        No active homework tasks. Click New Assignment to create one.
                                    </div>
                                )}
                            </div>

                            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                                <Link
                                    href="/teacher/assignments"
                                    className="w-full inline-flex items-center justify-center gap-2 py-2 text-xs font-bold text-primary hover:bg-primary/5 rounded-xl transition-colors border border-primary/20"
                                >
                                    <Plus size={14} />
                                    <span>Create New Task</span>
                                </Link>
                            </div>
                        </div>

                        {/* Official Circulars / Notices */}
                        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Megaphone size={18} className="text-primary" />
                                        Campus Circulars
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Official notices from school administration
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {recentNotices.map((notice: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-1"
                                    >
                                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                                            {notice.title}
                                        </p>
                                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                                            <span>{new Date(notice.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            <span className="font-bold text-primary">Official Notice</span>
                                        </div>
                                    </div>
                                ))}

                                {recentNotices.length === 0 && (
                                    <div className="p-4 text-center text-slate-400 italic text-xs">
                                        No recent announcements.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

TeacherDashboard.getLayout = function getLayout(page: React.ReactElement) {
    return <TeacherLayout>{page}</TeacherLayout>;
};
