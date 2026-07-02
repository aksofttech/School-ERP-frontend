import React from 'react';
import { useState, useEffect } from 'react';
import {
    Activity,
    Calendar,
    Award,
    Star,
    GraduationCap,
    Clock,
    ClipboardList,
    Flame,
    Zap,
    Download,
    TrendingUp,
    CheckCircle2,
    ChevronRight,
    ArrowRight,
    BookOpen,
    Loader2,
    Inbox
} from 'lucide-react';
import { useStudentDashboard } from '@/hooks/useStudentDashboard';
import { useAuthContext } from '@/contexts/AuthContext';
import StatCard from '@/components/ui/StatCard';
import StudentLayout from '@/components/layouts/StudentLayout';

export default function StudentDashboard() {
    const { user } = useAuthContext();
    const { data, loading, error } = useStudentDashboard();

    if (loading) {
        return (
      <>
        
                <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-slate-500 font-medium animate-pulse">Loading your profile...</p>
                </div>
            
      </>
    );
    }

    if (error) {
        console.log('[StudentDashboard] Error state:', error);
        // Check for specific profile missing error
        const isProfileMissing = error.toLowerCase().includes('profile not found') ||
            error.toLowerCase().includes('student not found');

        if (isProfileMissing) {
            return (
                <StudentLayout>
                    <div className="h-[80vh] flex flex-col items-center justify-center space-y-4 text-center px-4">
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-full">
                            <GraduationCap className="w-10 h-10 text-amber-500" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Setup Needed</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md">
                            Your profile is not linked to any class. 
                            Please contact the school office to complete your enrollment.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            Check Again
                        </button>
                    </div>
                </StudentLayout>
            );
        }

        return (
            <StudentLayout>
                <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full">
                        <Activity className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Oops! Something went wrong</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-center max-w-md">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </StudentLayout>
        );
    }

    if (!data) return null;

    return (
        <StudentLayout>
            <div className="space-y-8 animate-in fade-in duration-500 pb-12">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back, {user?.firstName}!</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Check your progress and classes.</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-lg border border-orange-200 dark:border-orange-800/50 shadow-sm transition-all hover:scale-105 group">
                            <Flame size={18} className="group-hover:animate-bounce" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-0.5">Study Days</span>
                                <span className="text-sm font-black leading-none">{data?.streak || '0'} DAYS</span>
                            </div>
                        </div>
                        <button className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            <Download size={18} className="mr-2" />
                            Download Report
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="My Grade"
                        value={data?.gpa || "0.0"}
                        icon={<GraduationCap size={24} />}
                        trend={data?.rankText || "N/A"}
                        trendType={data?.rankText ? "up" : "neutral"}
                        color="indigo"
                    />
                    <StatCard
                        title="Attendance"
                        value={data?.attendancePercent || "0%"}
                        icon={<Clock size={24} />}
                        trend={data?.attendanceStatus || "POOR"}
                        trendType={data?.attendanceStatus === 'GOOD' ? 'up' : data?.attendanceStatus === 'AVERAGE' ? 'neutral' : 'down'}
                        color="emerald"
                    />
                    <StatCard
                        title="Active Assignments"
                        value={data?.activeAssignmentsCount.toString().padStart(2, '0') || "00"}
                        icon={<ClipboardList size={24} />}
                        trend={data?.activeAssignmentsCount === 0 ? "ALL CLEAR" : `${data?.activeAssignmentsCount} PENDING`}
                        trendType={data?.activeAssignmentsCount === 0 ? "up" : "down"}
                        color="blue"
                    />
                    <StatCard
                        title="Activity Points"
                        value="0"
                        icon={<Star size={24} />}
                        trend="0 RECENT"
                        trendType="neutral"
                        color="purple"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Performance Overview */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                                <Activity size={20} className="text-primary" />
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">My Progress</h2>
                            </div>
                            <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1 group">
                                See Details
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {data?.performanceData && data.performanceData.some(d => d.score > 0) ? (
                            <div className="h-64 flex items-end justify-between gap-4 px-2">
                                {data.performanceData.map((d, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar">
                                        <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl relative overflow-hidden flex items-end h-full">
                                            <div
                                                className="w-full bg-primary/20 group-hover:bg-primary transition-all duration-500 rounded-t-xl"
                                                style={{ height: `${d.score}%` }}
                                            />
                                            <div className="absolute top-2 left-0 right-0 text-center opacity-0 group-hover/bar:opacity-100 transition-opacity">
                                                <span className="text-[10px] font-bold text-primary">{d.score}%</span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{d.name}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                                <Activity size={32} className="mb-2 opacity-20" />
                                <p className="text-xs font-bold uppercase tracking-widest">No Performance Data</p>
                            </div>
                        )}
                    </div>

                    {/* Assignments */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Pending Homework</h2>

                        {data?.pendingAssignments && data.pendingAssignments.length > 0 ? (
                            <div className="space-y-6 flex-1 overflow-auto max-h-[300px] pr-2 scrollbar-thin">
                                {data.pendingAssignments.map((task, i) => (
                                    <div key={i} className="group cursor-pointer">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex flex-col">
                                                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors line-clamp-1">{task.title}</h4>
                                                <span className="text-[9px] text-slate-400 font-bold uppercase">{task.subject}</span>
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${task.priority === 'HIGH' ? 'text-red-500' : 'text-slate-400'}`}>{task.due}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${task.priority === 'HIGH' ? 'bg-red-500' : 'bg-primary/40'}`}
                                                style={{ width: `${task.progress || 10}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-8">
                                <Inbox size={32} className="mb-2 opacity-20" />
                                <p className="text-xs font-bold uppercase tracking-widest text-emerald-500">All Done!</p>
                            </div>
                        )}

                        <button className="w-full mt-6 py-3 text-xs font-black uppercase tracking-widest text-white bg-primary rounded-xl shadow-lg shadow-primary/20 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2">
                            View All Assignments
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>

                {/* Bottom Section: Class Schedule & School Alerts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Class Schedule */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-all hover:shadow-md">
                        <div className="flex items-center gap-2 mb-6">
                            <Calendar size={20} className="text-emerald-500" />
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Classes Today</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {(data?.stats?.todaySchedule || []).length > 0 ? (
                                data.stats.todaySchedule.map((item: any, i: number) => {
                                    const now = new Date();
                                    const currentHour = now.getHours();
                                    const currentMinute = now.getMinutes();
                                    const [itemHour, itemMinute] = item.time.split(':').map(Number);
                                    
                                    let status = 'PENDING';
                                    if (itemHour === currentHour) status = 'ACTIVE';
                                    else if (itemHour > currentHour) status = 'NEXT';

                                    return (
                                        <div key={i} className={`p-4 rounded-xl border-2 transition-all ${status === 'ACTIVE' ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-slate-100 dark:border-slate-800'}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-bold text-slate-900 dark:text-white">{item.time}</span>
                                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded tracking-tighter ${status === 'ACTIVE' ? 'bg-primary text-white animate-pulse' : 'bg-slate-50 dark:bg-slate-800 text-slate-500'}`}>{status}</span>
                                            </div>
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 truncate">{item.subject}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{item.room} • {item.teacher}</p>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="col-span-full py-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No classes scheduled for today</p>
                                </div>
                            )}
                        </div>
                        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/50 flex items-center gap-3">
                            <Clock size={16} className="text-slate-400" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live timetable sync active</p>
                        </div>
                    </div>

                    {/* School Announcement Card */}
                    <div className="bg-primary p-6 rounded-2xl shadow-xl shadow-primary/20 relative overflow-hidden group transition-all hover:scale-[1.02]">
                        <div className="absolute -top-10 -right-10 size-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <Zap className="text-white mb-4 animate-pulse" size={24} />
                                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4 italic">School Alerts</h3>
                                <div className="space-y-4">
                                    {(data?.stats?.notices || []).length > 0 ? (
                                        data.stats.notices.map((notice: any, i: number) => (
                                            <div key={i} className="border-l-2 border-white/20 pl-3">
                                                <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-0.5">{notice.title}</h4>
                                                <p className="text-xs text-blue-100 opacity-80 leading-relaxed line-clamp-2">{notice.message}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs font-bold text-blue-100 opacity-80 italic">No new announcements today.</p>
                                    )}
                                </div>
                            </div>
                            <button className="mt-8 text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all border-t border-white/10 pt-4">
                                Open Notice Board
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}


StudentDashboard.getLayout = function getLayout(page: React.ReactElement) {
  return <StudentLayout>{page}</StudentLayout>;
};
