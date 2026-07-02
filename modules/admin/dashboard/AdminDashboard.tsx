import React from 'react';
import {
  GraduationCap,
  Users,
  UserCheck,
  CreditCard,
  TrendingUp,
  Download,
  Plus,
  Calendar,
  ArrowUpRight,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  Activity,
  Bus
} from 'lucide-react';
import Link from 'next/link';
import AdminLayout from '@/components/layouts/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import { useStats } from '@/hooks/useStats';

export default function AdminDashboard() {
  const { stats, loading } = useStats();

  return (
      <>
        
      <div className="space-y-8 animate-in fade-in duration-500 pb-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">School Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Overview of school activities and statistics.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => window.print()}
              className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Download size={18} className="mr-2" />
              Download Report
            </button>
            <Link 
              href="/admin/students/add"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-lg shadow-primary/20 text-sm font-medium text-white bg-primary hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5"
            >
              <Plus size={18} className="mr-2" />
              Add Student
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            title="Total Users"
            value={stats?.statistics?.totalUsers || '0'}
            icon={<Users size={24} />}
            trend="Stable"
            trendType="neutral"
            color="orange"
          />
          <StatCard
            title="Total Students"
            value={stats?.statistics?.totalStudents || '0'}
            icon={<GraduationCap size={24} />}
            trend="+4.2%"
            trendType="up"
            color="indigo"
          />
          <StatCard
            title="Total Teachers"
            value={stats?.statistics?.totalTeachers || '0'}
            icon={<Users size={24} />}
            trend="+2"
            trendType="neutral"
            color="blue"
          />
          <StatCard
            title="Active Classes"
            value={stats?.statistics?.activeClasses || '0'}
            icon={<UserCheck size={24} />}
            trend="+12%"
            trendType="up"
            color="purple"
          />
          <StatCard
            title="Daily Attendance"
            value={`${stats?.statistics?.todayAttendance || 0}%`}
            icon={<CreditCard size={24} />}
            trend="+8.2%"
            trendType="up"
            color="emerald"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Attendance Analytics */}
          <div className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-primary" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Weekly Attendance</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded font-bold uppercase tracking-widest">Last 7 Days</span>
              </div>
            </div>

            <div className="h-64 flex items-end gap-2 px-2">
              {(stats?.attendanceHistory || []).map((entry: any, i: number) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group cursor-help">
                  <div className="w-full relative bg-slate-100 dark:bg-slate-800 rounded-t-lg h-48 overflow-hidden">
                    <div
                      className="absolute bottom-0 w-full bg-primary/40 rounded-t-lg transition-all duration-700 ease-out group-hover:bg-primary/60"
                      style={{ height: `${entry.percentage}%` }}
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold">{entry.percentage}%</div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">{entry.day}</span>
                </div>
              ))}
              {(!stats?.attendanceHistory || stats.attendanceHistory.length === 0) && (
                <div className="w-full h-full flex items-center justify-center text-slate-400 italic text-sm">
                  No attendance data available
                </div>
              )}
            </div>
            <div className="flex items-center gap-6 mt-8 px-2 border-t border-slate-100 dark:border-slate-800 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary/40" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance %</span>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Updates</h2>
                <Activity size={18} className="text-purple-500 animate-pulse" />
            </div>
            <div className="space-y-6">
              {(stats?.recentActivities || []).map((activity: any, i: number) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className={`p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-primary group-hover:bg-primary/5 transition-all`}>
                    <Activity size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-none truncate">{activity.action}</p>
                      <span className="text-[10px] text-slate-400 font-bold">
                        {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-medium tracking-tight truncate">{activity.user}</p>
                  </div>
                </div>
              ))}
              {(!stats?.recentActivities || stats.recentActivities.length === 0) && (
                <p className="text-xs text-slate-400 text-center py-8 italic">No recent activities.</p>
              )}
            </div>
            <Link 
              href="/admin/audit"
              className="w-full mt-8 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary border border-dashed border-slate-200 dark:border-slate-700 rounded-xl transition-all hover:bg-slate-50 flex items-center justify-center"
            >
                View Activity Logs
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {[
            { label: 'Transport Vehicles', value: stats?.statistics?.totalVehicles || 0, icon: <Bus size={20} />, color: 'bg-indigo-500', max: 50 },
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <span className="text-slate-400">{item.icon}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                </div>
                <span className="text-sm font-black text-slate-900 dark:text-white">{item.value} <span className="text-[10px] text-slate-400 font-bold ml-1">Total</span></span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div
                  className={`${item.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    
      </>
    );
}


AdminDashboard.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
