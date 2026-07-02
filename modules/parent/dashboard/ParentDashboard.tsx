import React from 'react';
import { useState, useEffect } from 'react';
import { useParent } from '@/contexts/ParentContext';
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
    Loader2
} from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import ParentLayout from '@/components/layouts/ParentLayout';
import { toast } from 'react-hot-toast';
import { statsService } from '@/services/stats.service';

export default function ParentDashboard() {
    const { selectedChildId, childrenList, loading: contextLoading } = useParent();
    const [isUpdating, setIsUpdating] = useState(false);
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const data = await statsService.getStats('PARENT');
            setDashboardData(data);
        } catch (error) {
            console.error('Error fetching parent dashboard:', error);
            toast.error('Failed to load dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleDownloadReports = () => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: 'Preparing academic reports...',
                success: 'Reports downloaded successfully!',
                error: 'Failed to generate reports.',
            }
        ).then(() => {
            window.print();
        });
    };

    const handleCheckUpdates = async () => {
        setIsUpdating(true);
        await fetchDashboardData();
        setIsUpdating(false);
        toast.success('Your data is now up to date.');
    };

    const activeChild = selectedChildId !== 'ALL' ? childrenList.find(c => c.id === selectedChildId) : null;
    const displayFees = activeChild ? activeChild.pendingFees : dashboardData?.totalPendingFees;
    const displayActivities = dashboardData?.recentActivities ? (
        activeChild 
        ? dashboardData.recentActivities.filter((act: any) => act.detail.includes(activeChild.class))
        : dashboardData.recentActivities
    ) : [];

    const getStats = () => {
        if (!dashboardData) return [];

        if (selectedChildId === 'ALL') {
            return [
                { label: 'Total Wards', value: childrenList.length.toString(), icon: <Users size={24} />, sub: 'ACTIVE', color: 'blue' as const },
                { label: 'Pending Dues', value: `₹${dashboardData.totalPendingFees?.toLocaleString() || '0'}`, icon: <AlertCircle size={24} />, sub: 'TOTAL', color: 'orange' as const },
                { label: 'Avg Attendance', value: `${Math.round(childrenList.reduce((acc, c) => acc + (c.attendanceRate || 0), 0) / (childrenList.length || 1))}%`, icon: <Activity size={24} />, sub: 'OPTIMAL', color: 'emerald' as const },
            ];
        }
        
        const child = childrenList.find(c => c.id === selectedChildId);
        return [
            { label: 'Attendance', value: `${child?.attendanceRate || 0}%`, icon: <CheckCircle2 size={24} />, sub: (child?.attendanceRate || 0) >= 75 ? 'GOOD' : 'POOR', color: 'emerald' as const },
            { label: 'Pending Fee', value: `₹${child?.pendingFees?.toLocaleString() || '0'}`, icon: <AlertCircle size={24} />, sub: child?.pendingFees ? 'PAYMENT DUE' : 'UP TO DATE', color: 'orange' as const },
            { label: 'Class', value: child?.class || 'N/A', icon: <GraduationCap size={24} />, sub: 'CURRENT GRADE', color: 'indigo' as const },
        ];
    };

    if (loading || contextLoading) {
        return (
      <>
        
                <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-slate-500 font-medium animate-pulse uppercase tracking-widest text-xs">Loading Family Data...</p>
                </div>
            
      </>
    );
    }

    return (
        <ParentLayout>
            <div className="space-y-8 animate-in fade-in duration-500 pb-12">
                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">
                            {selectedChildId === 'ALL' ? 'Family Overview' : `Student: ${childrenList.find(c => c.id === selectedChildId)?.name}`}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
                            {selectedChildId === 'ALL'
                                ? 'Monitor academic progress and school notifications for all your children.'
                                : 'Detailed academic reports and attendance records for this student.'}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={handleDownloadReports}
                            className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                            <Download size={16} className="mr-2" />
                            Reports
                        </button>
                        <button 
                            onClick={handleCheckUpdates}
                            disabled={isUpdating}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-lg shadow-primary/20 text-xs font-black uppercase tracking-widest text-white bg-primary hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5 disabled:opacity-50">
                            <Activity size={16} className={`mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
                            {isUpdating ? 'Updating...' : 'Sync Data'}
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getStats().map((stat, i) => (
                        <StatCard
                            key={i}
                            title={stat.label}
                            value={stat.value}
                            icon={stat.icon}
                            trend={stat.sub}
                            trendType={stat.sub === 'POOR' || stat.sub === 'PAYMENT DUE' ? 'down' : 'up'}
                            color={stat.color}
                        />
                    ))}
                </div>

                {/* Content switching based on context */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Activity Stream */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight italic">
                                {selectedChildId === 'ALL' ? 'Recent Activity' : 'Academic Timeline'}
                            </h3>
                            <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1 group">
                                View History
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="space-y-8">
                            {displayActivities.length > 0 ? (
                                displayActivities.map((act: any, i: number) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="flex flex-col items-center">
                                            <div className={`size-3 rounded-full border-2 border-white dark:border-slate-900 z-10 ${i === 0 ? 'bg-primary animate-pulse' : 'bg-slate-200 dark:bg-slate-700'}`} />
                                            {i !== (displayActivities.length - 1) && <div className="w-0.5 h-full bg-slate-100 dark:bg-slate-800 -mt-1" />}
                                        </div>
                                        <div className="pb-8 flex-1">
                                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 group-hover:border-primary/20 transition-all">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{act.type}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(act.date).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-sm font-black text-slate-900 dark:text-white mb-2 italic uppercase tracking-tight">{act.title}</p>
                                                <p className="text-xs text-slate-500 font-medium leading-relaxed">{act.detail}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                                    <Clock size={32} className="mx-auto text-slate-300 mb-3 opacity-50" />
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">No recent activities found</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Side Widgets */}
                    <div className="space-y-6">
                        {/* Fee Reminder Card */}
                        <div className="bg-slate-900 dark:bg-slate-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group transition-all hover:scale-[1.02]">
                            <div className="relative z-10 flex flex-col h-full justify-between min-h-[260px]">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <AlertCircle className="text-orange-500" size={20} />
                                        <h3 className="text-xl font-black uppercase tracking-tight italic">Fee Notice</h3>
                                    </div>
                                    <p className="text-slate-400 text-xs font-semibold leading-relaxed">Ensure all pending dues are settled to maintain uninterrupted academic services for your children.</p>
                                </div>

                                <div className="mt-auto">
                                    <div className="flex items-end justify-between mb-6">
                                        <div>
                                            <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest leading-none mb-2">Current Balance</p>
                                            <p className="text-4xl font-black italic">₹{displayFees?.toLocaleString() || '0'}</p>
                                        </div>
                                        {displayFees > 0 && (
                                            <span className="px-3 py-1 bg-red-600 text-[10px] font-black italic rounded-lg text-white animate-pulse uppercase tracking-widest">DUE</span>
                                        )}
                                    </div>

                                    <button 
                                        disabled={!displayFees}
                                        className="w-full bg-primary text-white font-black uppercase tracking-widest text-xs py-4 rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed">
                                        Proceed to Pay
                                    </button>
                                </div>
                            </div>
                            <div className="absolute -top-10 -right-10 size-48 bg-primary/20 rounded-full blur-[100px] pointer-events-none group-hover:scale-150 transition-transform duration-1000"></div>
                        </div>
                    </div>
                </div>
            </div>
        </ParentLayout>
    );
}


ParentDashboard.getLayout = function getLayout(page: React.ReactElement) {
  return <ParentLayout>{page}</ParentLayout>;
};
