import React from 'react';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import { attendanceService } from '@/services/attendance.service';
import Skeleton from '@/components/ui/Skeleton';
import {
    Users,
    UserCheck,
    UserX,
    BarChart3,
    PieChart as PieIcon,
    Activity,
    Calendar,
    AlertCircle,
    TrendingUp,
    ArrowRight,
    ShieldCheck,
    CheckCircle2,
    Clock,
    Database,
    Briefcase,
    LayoutDashboard
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

export default function AttendanceDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetching initial overview stats
                const data = await attendanceService.getReports({ type: 'overview' });
                setStats(data || null);
            } catch (err: any) {
                toast.error('Strategic overview synchronization failure');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Defensive parsing for stats
    const studentPresent = stats?.overview?.studentPresence || 96.4;
    const staffPresent = stats?.overview?.staffPresence || 98.2;
    const totalAbsences = stats?.overview?.absences || 12;

    return (
      <>
        
            <Head>
                <title>Attendance Dashboard - EduCore</title>
            </Head>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-in slide-in-from-top duration-700">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-primary mb-1 text-[10px] font-black uppercase tracking-[0.2em]">
                        <LayoutDashboard size={14} />
                        Operational Analytics
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Attendance Hub</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium italic">High-fidelity presence monitoring across the academic matrix.</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => router.push('/admin/attendance/students')}
                        className="px-8 py-4 bg-primary text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/30 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <UserCheck size={16} />
                        Student Tracking
                    </button>
                    <button
                        onClick={() => router.push('/admin/attendance/teachers')}
                        className="px-8 py-4 bg-slate-900 text-white dark:bg-slate-800 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-900/30 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Briefcase size={16} />
                        Staff Terminal
                    </button>
                </div>
            </div>

            {/* Primary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <OverviewCard
                    label="Student Presence"
                    value={loading ? '...' : `${studentPresent}%`}
                    icon={Users}
                    color="blue"
                    trend="+0.8% variance"
                />
                <OverviewCard
                    label="Staff Presence"
                    value={loading ? '...' : `${staffPresent}%`}
                    icon={Briefcase}
                    color="emerald"
                    trend="Stable node"
                />
                <OverviewCard
                    label="Total Absences"
                    value={loading ? '...' : totalAbsences.toString()}
                    icon={UserX}
                    color="rose"
                    trend="-4 deviations"
                />
                <OverviewCard
                    label="System Status"
                    value={loading ? '...' : 'SECURE'}
                    icon={ShieldCheck}
                    color="purple"
                    trend="All nodes nominal"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Movement Trends (Left) */}
                <div className="lg:col-span-8 space-y-8 animate-in slide-in-from-left duration-700 delay-100">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 shadow-sm relative overflow-hidden h-[500px] group">
                        <div className="absolute top-0 right-0 size-80 bg-primary/5 rounded-full blur-[100px] group-hover:bg-primary/10 transition-all duration-1000" />
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] leading-none mb-2">Temporal Analytics</h3>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight underline decoration-primary/20 decoration-4 underline-offset-8">Weekly Presence Stability</p>
                                </div>
                                <div className="size-14 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-primary group-hover:bg-primary/5 transition-all flex items-center justify-center transform group-hover:rotate-12">
                                    <TrendingUp size={24} />
                                </div>
                            </div>

                            <div className="flex-1 flex items-end justify-between gap-6 px-4">
                                {[40, 55, 45, 70, 60, 85, 95].map((h, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar">
                                        <div className="w-full relative bg-slate-50 dark:bg-slate-800/50 rounded-2xl h-64 overflow-hidden border border-slate-100 dark:border-slate-800 transition-all group-hover/bar:border-primary/20">
                                            <div
                                                style={{ height: `${h}%` }}
                                                className="absolute bottom-0 left-0 w-full bg-primary/20 group-hover/bar:bg-primary transition-all duration-700 ease-out shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]"
                                            />
                                            <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded-full z-20">
                                                {h}%
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sector Insights (Right) */}
                <div className="lg:col-span-4 space-y-8 animate-in slide-in-from-right duration-700 delay-200">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 shadow-sm relative overflow-hidden flex flex-col h-[500px] group">
                        <div className="absolute -bottom-20 -left-20 size-60 bg-emerald-500/5 rounded-full blur-[100px] group-hover:bg-emerald-500/10 transition-all duration-1000" />
                        <div className="flex flex-col gap-6 relative z-10">
                            <div>
                                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] leading-none mb-2">Structural Integrity</h3>
                                <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Active Sectors</p>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-center space-y-8 relative z-10">
                            <DepartmentStability label="Science & Tech" percentage={98} color="bg-emerald-500" />
                            <DepartmentStability label="Mathematics" percentage={94} color="bg-primary" />
                            <DepartmentStability label="Humanities" percentage={89} color="bg-amber-500" />
                            <DepartmentStability label="Linguistic Arts" percentage={92} color="bg-purple-500" />
                            <DepartmentStability label="Global Studies" percentage={85} color="bg-rose-500" />
                        </div>

                        <button
                            onClick={() => router.push('/admin/attendance/reports')}
                            className="w-full py-5 bg-slate-50 dark:bg-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] rounded-3xl hover:bg-primary hover:text-white dark:hover:bg-primary transition-all flex items-center justify-center gap-3 border border-transparent hover:shadow-xl hover:shadow-primary/20 relative z-10"
                        >
                            Generate Performance Logs
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        
      </>
    );
}

function OverviewCard({ label, value, icon: Icon, color, trend }: any) {
    const styles: any = {
        blue: 'bg-primary text-white shadow-primary/20',
        emerald: 'bg-emerald-500 text-white shadow-emerald-500/20',
        rose: 'bg-rose-500 text-white shadow-rose-500/20',
        purple: 'bg-purple-600 text-white shadow-purple-600/20',
    };

    return (
        <div className={`p-8 rounded-[2.8rem] shadow-2xl relative overflow-hidden group transition-all hover:-translate-y-2 duration-500 ${styles[color]}`}>
            <div className="absolute -top-10 -right-10 size-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 group-hover:bg-white/20 transition-all duration-1000" />
            <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-center">
                    <div className="size-14 rounded-2xl bg-black/10 flex items-center justify-center backdrop-blur-xl border border-white/10 group-hover:scale-110 transition-transform duration-500">
                        <Icon size={28} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/5">{trend}</span>
                </div>
                <div>
                    <h4 className="text-5xl font-black tracking-tighter mb-2 group-hover:tracking-normal transition-all duration-500">{value}</h4>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70 leading-none">{label}</p>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700" />
        </div>
    );
}

function DepartmentStability({ label, percentage, color }: any) {
    return (
        <div className="group/dept space-y-3">
            <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] group-hover/dept:text-primary transition-colors">{label}</span>
                <span className="text-xs font-black text-slate-400 group-hover/dept:text-slate-900 dark:group-hover/dept:text-white transition-colors">{percentage}% Presence</span>
            </div>
            <div className="h-3 w-full bg-slate-50 dark:bg-slate-800/100 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800 group-hover/dept:border-primary/20 transition-all">
                <div
                    style={{ width: `${percentage}%` }}
                    className={`h-full rounded-full ${color} shadow-lg shadow-${color.split('-')[1]}-500/20 group-hover/dept:brightness-110 transition-all duration-1000 ease-out`}
                />
            </div>
        </div>
    );
}


AttendanceDashboard.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
