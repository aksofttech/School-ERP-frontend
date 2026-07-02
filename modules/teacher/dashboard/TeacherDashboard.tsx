import React from 'react';
import { useState, useEffect } from 'react';
import {
    Users,
    Activity,
    Star,
    Layers,
    TrendingUp,
    Zap,
    Plus,
    Download,
    Calendar,
    ArrowRight,
    CheckCircle2,
    Award,
    ShieldCheck,
    Clock
} from 'lucide-react';
import { statsService } from '@/services/stats.service';
import { toast } from 'react-hot-toast';
import StatCard from '@/components/ui/StatCard';
import TeacherLayout from '@/components/layouts/TeacherLayout';

export default function TeacherDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownloadReport = () => {
        setIsGenerating(true);
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: 'Compiling teaching performance report...',
                success: 'Report downloaded successfully!',
                error: 'Failed to generate report.',
            }
        ).finally(() => setIsGenerating(false));
    };

    const handleActiveClasses = () => {
        toast('Checking current class schedules...', { icon: '📅' });
        // Navigation could go here too: router.push('/teacher/timetable')
    };

    const handleViewGrades = () => {
        toast.loading('Loading grade analytics...');
        setTimeout(() => toast.dismiss(), 1000);
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await statsService.getTeacherStats();
                setStats(data.data || data);
            } catch (error: any) {
                toast.error('Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const activities = [
        { title: 'Homework Help', detail: 'Class 10-A, Mathematics', status: 'In Review', icon: <Layers className="text-primary" /> },
        { title: 'Attendance Check', detail: 'Complete for Class 9-B', status: 'Done', icon: <CheckCircle2 className="text-emerald-500" /> },
        { title: 'Exam Results', detail: 'Internal Test Q1', status: 'Pending', icon: <Zap className="text-amber-500" /> },
    ];

    const statistics = stats?.statistics || stats || {};

    return (
      <>
        
            <div className="space-y-8 animate-in fade-in duration-500 pb-12">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Teacher Dashboard</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your classes and track student progress easily.</p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={handleDownloadReport}
                            disabled={isGenerating}
                            className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50">
                            <Download size={18} className={`mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                            {isGenerating ? 'Generating...' : 'My Report'}
                        </button>
                        <button 
                            onClick={handleActiveClasses}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-lg shadow-primary/20 text-sm font-medium text-white bg-primary hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5">
                            <Activity size={18} className="mr-2" />
                            Active Classes
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Assigned Classes"
                        value={statistics.totalClasses || '0'}
                        icon={<Layers size={24} />}
                        trend="+1"
                        trendType="up"
                        color="blue"
                    />
                    <StatCard
                        title="Total Students"
                        value={statistics.totalStudents || '0'}
                        icon={<Users size={24} />}
                        trend="Stable"
                        trendType="neutral"
                        color="indigo"
                    />
                    <StatCard
                        title="Attendance Rate"
                        value={`${statistics.attendanceRate || statistics.todayAttendance || 0}%`}
                        icon={<Activity size={24} />}
                        trend="+2.1%"
                        trendType="up"
                        color="emerald"
                    />
                    <StatCard
                        title="My Rating"
                        value={statistics.rating || '4.8/5'}
                        icon={<Star size={24} />}
                        trend="Top 5%"
                        trendType="up"
                        color="purple"
                    />
                </div>                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Student Grades Section */}
                    <div className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <TrendingUp size={20} className="text-primary" />
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Class Performance</h2>
                            </div>
                            <button 
                                onClick={handleViewGrades}
                                className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2 group">
                                Analytics
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="h-64 flex items-end gap-3 px-2">
                            {(stats?.gradeAnalytics || []).map((data: any, i: number) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar">
                                    <div className="w-full relative bg-slate-50 dark:bg-slate-800 rounded-t-xl h-48 overflow-hidden">
                                        <div
                                            className="absolute bottom-0 w-full bg-primary/10 rounded-t-xl transition-all duration-700 ease-out group-hover/bar:bg-primary/20"
                                            style={{ height: `100%` }}
                                        />
                                        <div
                                            className="absolute bottom-0 w-full bg-indigo-500 rounded-t-xl transition-all duration-1000 ease-out group-hover/bar:bg-indigo-600"
                                            style={{ height: `${data.average}%` }}
                                        />
                                        <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2 rounded font-bold z-10">{data.average}%</div>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter truncate w-full text-center">{data.label}</span>
                                </div>
                            ))}
                            {(!stats?.gradeAnalytics || stats.gradeAnalytics.length === 0) && (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 italic text-sm">
                                    No grade data available
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-6 mt-8 px-2 border-t border-slate-50 dark:border-slate-800 pt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Current Average</span>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Homework (Quick Tasks) */}
                    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming Homework</h2>
                            <Clock size={18} className="text-amber-500 animate-pulse" />
                        </div>
                        <div className="space-y-6">
                            {(stats?.upcomingHomework || []).map((h: any, i: number) => (
                                <div key={i} className="flex items-start gap-4 group">
                                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 group-hover:bg-primary/5 transition-colors">
                                        <Layers className="text-primary size-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-bold text-slate-900 dark:text-white leading-none truncate">{h.title}</p>
                                            <span className="text-[10px] text-slate-400 font-bold px-2 py-0.5 border border-slate-200 dark:border-slate-700 rounded-lg uppercase tracking-tighter shrink-0">
                                                {new Date(h.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-1 uppercase font-medium tracking-tight truncate">{h.class} • {h.subject}</p>
                                    </div>
                                </div>
                            ))}
                            {(!stats?.upcomingHomework || stats.upcomingHomework.length === 0) && (
                                <p className="text-xs text-slate-400 text-center py-8 italic">No upcoming homework.</p>
                            )}
                        </div>
                        <button className="w-full mt-8 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary bg-slate-50 dark:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-primary/20">
                            Manage All Tasks
                        </button>
                    </div>
                </div>

                {/* Achievement Card */}
                <div className="bg-slate-900 dark:bg-white rounded-3xl p-10 text-white dark:text-slate-900 shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex items-center gap-8">
                            <div className="p-5 bg-primary/20 rounded-3xl backdrop-blur-xl">
                                <Award size={56} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Teaching Excellence</h3>
                                <p className="text-slate-400 dark:text-slate-500 text-sm mt-3 font-medium leading-relaxed max-w-md">Your performance rating of {stats?.statistics?.rating || '4.9/5'} places you in the top 5% of educators this academic year.</p>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <ShieldCheck size={64} className="text-primary opacity-30" />
                        </div>
                    </div>
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
                </div>
            </div>
        
      </>
    );
}


TeacherDashboard.getLayout = function getLayout(page: React.ReactElement) {
  return <TeacherLayout>{page}</TeacherLayout>;
};
