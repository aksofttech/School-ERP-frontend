import React, { useEffect } from 'react';
import {
  GraduationCap,
  Users,
  UserCheck,
  CreditCard,
  Download,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  Activity,
  Bus,
  Phone,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileText,
  MapPin,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import AdminLayout from '@/components/layouts/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import { useStats } from '@/hooks/useStats';
import { useTransport } from '@/hooks/useTransport';

function formatTimeAgo(dateInput: string | Date) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return `${mins}m ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  }
  const days = Math.floor(diffInSeconds / 86400);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getActivityMeta(action: string) {
  const act = (action || '').toLowerCase();
  if (act.includes('fee') || act.includes('payment') || act.includes('receipt') || act.includes('₹')) {
    return {
      icon: CreditCard,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/60',
      tag: 'Finance',
    };
  }
  if (act.includes('attendance') || act.includes('present') || act.includes('absent')) {
    return {
      icon: CheckCircle2,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/60',
      tag: 'Attendance',
    };
  }
  if (act.includes('vehicle') || act.includes('bus') || act.includes('transport') || act.includes('route')) {
    return {
      icon: Bus,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/60',
      tag: 'Logistics',
    };
  }
  if (act.includes('student') || act.includes('enrolled') || act.includes('admitted')) {
    return {
      icon: GraduationCap,
      iconColor: 'text-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/60',
      tag: 'Student',
    };
  }
  if (act.includes('notice') || act.includes('announcement') || act.includes('meeting') || act.includes('ptm')) {
    return {
      icon: AlertCircle,
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800/60',
      tag: 'Notice',
    };
  }
  return {
    icon: Activity,
    iconColor: 'text-primary',
    bgColor: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    tag: 'Academic',
  };
}

export default function AdminDashboard() {
  const { stats, loading } = useStats();
  const { vehicles, fetchVehicles } = useTransport();

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Combined vehicle list
  const activeVehicles = (stats?.vehicles && stats.vehicles.length > 0)
    ? stats.vehicles
    : (vehicles && vehicles.length > 0)
    ? vehicles
    : [];

  const totalVehiclesCount = stats?.statistics?.totalVehicles || activeVehicles.length || 0;
  const totalFleetCapacity = stats?.statistics?.totalCapacity || activeVehicles.reduce((acc: number, v: any) => acc + (v.capacity || 0), 0);

  // Weekly attendance calculations
  const attendanceHistory = stats?.attendanceHistory || [];
  const activeAttendanceDays = attendanceHistory.filter((e: any) => (e.total && e.total > 0) || e.percentage > 0);
  const avgWeeklyAttendance = activeAttendanceDays.length > 0
    ? Math.round(activeAttendanceDays.reduce((sum: number, e: any) => sum + (e.percentage || 0), 0) / activeAttendanceDays.length)
    : (stats?.statistics?.todayAttendance || 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black tracking-widest uppercase bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
              Live Campus Insights
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">School Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Overview of school activities and live operational statistics.</p>
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
          trend={stats?.statistics?.todayAttendance >= 90 ? '+5.4%' : 'Target 95%'}
          trendType={stats?.statistics?.todayAttendance >= 90 ? 'up' : 'neutral'}
          color="emerald"
        />
      </div>

      {/* Main Content Grid: Attendance & Recent Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Attendance Analytics */}
        <div className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/80 p-6 flex flex-col justify-between transition-all hover:shadow-md">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                  <Calendar size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Weekly Attendance</h2>
                  <p className="text-xs text-slate-400 font-medium">Daily student attendance breakdown for the last 7 days</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold border border-emerald-200/60 dark:border-emerald-800/40">
                  <Sparkles size={13} />
                  <span>Avg: {avgWeeklyAttendance}%</span>
                </div>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg font-black uppercase tracking-wider">
                  Last 7 Days
                </span>
              </div>
            </div>

            {/* Attendance Chart Bars */}
            <div className="h-64 flex items-end gap-3 sm:gap-4 px-2 pt-8">
              {attendanceHistory.map((entry: any, i: number) => {
                const isZero = entry.percentage === 0;
                const isWeekend = entry.day === 'Sun';

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2.5 group relative">
                    {/* Hover Tooltip */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] py-1.5 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-20 font-bold shadow-xl flex flex-col items-center border border-slate-700">
                      <span>{entry.percentage}% Present</span>
                      {entry.total > 0 && (
                        <span className="text-[9px] font-medium text-slate-300">
                          {entry.present}/{entry.total} Students
                        </span>
                      )}
                    </div>

                    {/* Percentage Tag above bar */}
                    <span className={`text-[11px] font-black leading-none ${
                      entry.isToday
                        ? 'text-primary'
                        : entry.percentage >= 90
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : entry.percentage > 0
                        ? 'text-slate-700 dark:text-slate-200'
                        : 'text-slate-400'
                    }`}>
                      {isZero ? (isWeekend ? 'Off' : '0%') : `${entry.percentage}%`}
                    </span>

                    {/* Bar Background Track */}
                    <div className="w-full relative bg-slate-100 dark:bg-slate-800/80 rounded-t-xl h-44 overflow-hidden border border-slate-100 dark:border-slate-800/50">
                      {/* Bar Fill with Gradient */}
                      <div
                        className={`absolute bottom-0 w-full rounded-t-xl transition-all duration-700 ease-out ${
                          entry.isToday
                            ? 'bg-gradient-to-t from-primary via-indigo-500 to-indigo-400 shadow-lg shadow-primary/30'
                            : entry.percentage >= 90
                            ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:from-indigo-500 group-hover:to-indigo-300'
                            : entry.percentage > 0
                            ? 'bg-gradient-to-t from-amber-500 to-amber-400'
                            : 'bg-transparent'
                        }`}
                        style={{ height: `${Math.max(entry.percentage, isZero ? 0 : 6)}%` }}
                      />
                    </div>

                    {/* Day & Date Labels */}
                    <div className="flex flex-col items-center">
                      <span className={`text-xs font-black uppercase tracking-tight ${
                        entry.isToday ? 'text-primary font-black' : 'text-slate-600 dark:text-slate-300'
                      }`}>
                        {entry.day}
                      </span>
                      {entry.date && (
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold">
                          {entry.date}
                        </span>
                      )}
                      {entry.isToday && (
                        <span className="inline-block size-1.5 rounded-full bg-primary mt-0.5 animate-ping" />
                      )}
                    </div>
                  </div>
                );
              })}

              {attendanceHistory.length === 0 && (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                  <Calendar size={32} className="text-slate-300" />
                  <p className="text-xs italic">No weekly attendance recorded yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Chart Footer Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-full bg-primary" />
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Regular Classes (Mon-Sat)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Target ≥ 90%</span>
              </div>
            </div>
            <Link
              href="/admin/attendance"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-indigo-700 transition-colors"
            >
              <span>Take Attendance</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Activity Log / Recent Updates */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/80 p-6 flex flex-col justify-between transition-all hover:shadow-md">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                  <Activity size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Recent Updates</h2>
                  <p className="text-xs text-slate-400 font-medium">Real-time school activities & events</p>
                </div>
              </div>
              <span className="size-2 rounded-full bg-purple-500 animate-ping" />
            </div>

            <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
              {(stats?.recentActivities || []).map((activity: any, i: number) => {
                const meta = getActivityMeta(activity.action);
                const IconComponent = meta.icon;

                return (
                  <div key={activity.id || i} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group">
                    <div className={`p-2 rounded-xl border ${meta.bgColor} shrink-0 mt-0.5`}>
                      <IconComponent size={15} className={meta.iconColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {meta.tag}
                        </span>
                        <span className="text-[11px] text-slate-400 font-semibold shrink-0">
                          {formatTimeAgo(activity.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-1 leading-snug line-clamp-2">
                        {activity.action}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-slate-400 font-medium">
                        <span className="font-bold text-slate-600 dark:text-slate-300">{activity.user}</span>
                        {activity.role && (
                          <>
                            <span>•</span>
                            <span className="uppercase text-[9px] font-bold text-slate-400">{activity.role}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {(!stats?.recentActivities || stats.recentActivities.length === 0) && (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Activity size={28} className="mx-auto text-slate-300" />
                  <p className="text-xs italic">No recent activities logged.</p>
                </div>
              )}
            </div>
          </div>

          <Link 
            href="/admin/audit"
            className="w-full mt-6 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary border border-slate-200 dark:border-slate-700/80 rounded-xl transition-all hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 group"
          >
            <span>View Full Audit Log</span>
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Transport & Vehicles Section */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/80 p-6 sm:p-8 transition-all hover:shadow-md space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Bus size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Transport & Vehicle Fleet</h2>
                <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-200/50">
                  {totalVehiclesCount} Active Fleet
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time transport overview, bus routes, driver assignments, and vehicle seating capacity.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/transport/vehicles"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <span>Manage Fleet</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Fleet KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Registered Buses</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{totalVehiclesCount}</h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">All verified for transit</p>
            </div>
            <div className="size-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-primary flex items-center justify-center">
              <Bus size={20} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Seating Capacity</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{totalFleetCapacity} Seats</h3>
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">Campus pickup coverage</p>
            </div>
            <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Fleet Operational Health</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">100% In Service</h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">Fitness & GPS checked</p>
            </div>
            <div className="size-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
          </div>
        </div>

        {/* Vehicles Grid Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Assigned Fleet Vehicles</h3>
            <span className="text-xs font-bold text-slate-500">Showing {activeVehicles.length} vehicles</span>
          </div>

          {activeVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeVehicles.map((vehicle: any, idx: number) => (
                <div
                  key={vehicle.id || idx}
                  className="p-5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all hover:shadow-md group flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                          {vehicle.number}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50">
                          Active
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {vehicle.model || 'School Bus'}
                      </p>
                    </div>
                    {vehicle.capacity && (
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                        {vehicle.capacity} Seats
                      </span>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-[10px]">
                        {vehicle.driver ? vehicle.driver.charAt(0) : 'D'}
                      </div>
                      <span className="font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[120px]">
                        {vehicle.driver || 'Assigned Driver'}
                      </span>
                    </div>
                    {vehicle.phone && (
                      <a
                        href={`tel:${vehicle.phone}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                        title="Contact Driver"
                      >
                        <Phone size={11} />
                        <span>{vehicle.phone}</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
              <Bus size={32} className="mx-auto text-slate-300" />
              <p className="text-xs font-semibold text-slate-400">No transport vehicles registered yet.</p>
              <Link
                href="/admin/transport/vehicles"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-sm hover:bg-indigo-700"
              >
                <Plus size={14} />
                <span>Add Vehicle</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

AdminDashboard.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
