import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '@/components/layouts/AdminLayout';
import { attendanceService } from '@/services/attendance.service';
import {
  Users,
  UserCheck,
  UserX,
  Calendar,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Briefcase,
  FileText,
  Sparkles,
  ChevronRight,
  GraduationCap,
  Layers,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AttendanceDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const result = await attendanceService.getOverview();
      setData(result);
    } catch (err: any) {
      toast.error('Failed to load live attendance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const overview = data?.overview || {};
  const studentPresent = overview.studentPresence ?? 0;
  const staffPresent = overview.staffPresence ?? 100;
  const totalAbsences = overview.absences ?? 0;
  const totalStudents = overview.totalStudents ?? 0;
  const todayPresent = overview.todayPresent ?? 0;
  const totalTeachers = overview.totalTeachers ?? 0;
  const totalClasses = overview.totalClasses ?? 0;

  const weeklyTrend = data?.weeklyTrend || [];
  const activeDays = weeklyTrend.filter((e: any) => e.total > 0 || e.percentage > 0);
  const avgWeekly = activeDays.length > 0
    ? Math.round(activeDays.reduce((acc: number, d: any) => acc + (d.percentage || 0), 0) / activeDays.length)
    : studentPresent;

  const classBreakdown = data?.classBreakdown || [];
  const recentRecords = data?.recentRecords || [];

  return (
    <>
      <Head>
        <title>Attendance | School ERP</title>
      </Head>

      <div className="space-y-8 animate-in fade-in duration-500 pb-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black tracking-widest uppercase bg-primary/10 text-primary px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                Daily Attendance Monitoring
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Attendance</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Track and manage daily student and staff presence across all classes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => fetchStats()}
              title="Refresh Data"
              className="p-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
            </button>
            <Link
              href="/admin/attendance/students"
              className="px-5 py-2.5 bg-primary hover:bg-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <UserCheck size={16} />
              Take Attendance
            </Link>
            <Link
              href="/admin/attendance/teachers"
              className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-2"
            >
              <Briefcase size={16} />
              Staff Attendance
            </Link>
            <Link
              href="/admin/attendance/reports"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-2"
            >
              <FileText size={16} />
              Reports
            </Link>
          </div>
        </div>

        {/* Primary Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Student Presence */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-primary group-hover:scale-105 transition-transform">
                <Users size={22} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50">
                {todayPresent}/{totalStudents} Present
              </span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Student Attendance</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {loading ? '...' : `${studentPresent}%`}
                </h3>
                <span className="text-xs font-semibold text-slate-500">Today</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(studentPresent, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Staff Presence */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 group-hover:scale-105 transition-transform">
                <Briefcase size={22} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50">
                {totalTeachers} On Duty
              </span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Staff Attendance</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {loading ? '...' : `${staffPresent}%`}
                </h3>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">All Active</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(staffPresent, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Total Absences */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 group-hover:scale-105 transition-transform">
                <UserX size={22} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                totalAbsences === 0
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-200/50'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border-rose-200/50'
              }`}>
                {totalAbsences === 0 ? 'Zero Absences' : `${totalAbsences} Absent Today`}
              </span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Absences</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {loading ? '...' : totalAbsences}
                </h3>
                <span className="text-xs font-semibold text-slate-500">Students</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-medium">
                {totalAbsences > 0 ? 'Parent notification sent' : 'Full student presence recorded'}
              </p>
            </div>
          </div>

          {/* Classes Monitored */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 group-hover:scale-105 transition-transform">
                <Layers size={22} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/50">
                {classBreakdown.length} Active Batches
              </span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Classes Monitored</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {loading ? '...' : totalClasses}
                </h3>
                <span className="text-xs font-semibold text-slate-500">Total Classes</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-medium">
                {classBreakdown.length} classes with enrolled students
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid: Weekly Attendance & Class Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Weekly Attendance Trends (Left - 8 cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-primary">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Weekly Attendance Trends</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Daily attendance rate across the last 7 days</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold border border-emerald-200/50">
                    <Sparkles size={13} />
                    <span>Weekly Avg: {avgWeekly}%</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg font-black uppercase tracking-wider">
                    Last 7 Days
                  </span>
                </div>
              </div>

              {/* Chart Bars */}
              <div className="h-64 flex items-end gap-3 sm:gap-5 px-2 pt-10">
                {weeklyTrend.map((entry: any, i: number) => {
                  const isZero = entry.percentage === 0;
                  const isWeekend = entry.isWeekend;

                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative">
                      {/* Tooltip */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] py-1.5 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-20 font-bold shadow-xl flex flex-col items-center border border-slate-700">
                        <span>{entry.percentage}% Present</span>
                        {entry.total > 0 && (
                          <span className="text-[9px] font-medium text-slate-300">
                            {entry.present}/{entry.total} Students
                          </span>
                        )}
                      </div>

                      {/* Top Percentage Label */}
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

                      {/* Bar Track */}
                      <div className="w-full relative bg-slate-100 dark:bg-slate-800/80 rounded-t-xl h-44 overflow-hidden border border-slate-100 dark:border-slate-800/50">
                        <div
                          className={`absolute bottom-0 w-full rounded-t-xl transition-all duration-700 ease-out ${
                            entry.isToday
                              ? 'bg-gradient-to-t from-primary via-indigo-500 to-indigo-400 shadow-lg shadow-primary/20'
                              : entry.percentage >= 90
                              ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:from-indigo-500 group-hover:to-indigo-300'
                              : entry.percentage > 0
                              ? 'bg-gradient-to-t from-amber-500 to-amber-400'
                              : 'bg-transparent'
                          }`}
                          style={{ height: `${Math.max(entry.percentage, isZero ? 0 : 6)}%` }}
                        />
                      </div>

                      {/* Labels */}
                      <div className="flex flex-col items-center">
                        <span className={`text-xs font-black uppercase tracking-tight ${
                          entry.isToday ? 'text-primary font-black' : 'text-slate-600 dark:text-slate-300'
                        }`}>
                          {entry.day}
                        </span>
                        {entry.date && (
                          <span className="text-[9px] text-slate-400 font-bold">
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
              </div>
            </div>

            {/* Footer Legend */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full bg-primary" />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Regular Classes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Target ≥ 90%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Sunday / Holiday</span>
                </div>
              </div>

              <Link
                href="/admin/attendance/students"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-indigo-700 transition-colors"
              >
                <span>Record Attendance</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Class Breakdown (Right - 4 cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Class-Wise Attendance</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active enrolled classes</p>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-600 dark:text-slate-300">
                  Today
                </span>
              </div>

              <div className="space-y-5 pt-6">
                {classBreakdown.map((item: any, idx: number) => {
                  const isHigh = item.percentage >= 90;
                  const isModerate = item.percentage >= 60 && item.percentage < 90;

                  return (
                    <div key={item.classId || idx} className="space-y-2 group">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                            {item.className}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            ({item.presentCount}/{item.totalStudents} present)
                          </span>
                        </div>
                        <span className={`font-black text-xs ${
                          isHigh
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : isModerate
                            ? 'text-amber-500'
                            : 'text-rose-500'
                        }`}>
                          {item.percentage}%
                        </span>
                      </div>

                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            isHigh
                              ? 'bg-emerald-500'
                              : isModerate
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                {classBreakdown.length === 0 && (
                  <p className="text-xs text-slate-400 italic text-center py-8">
                    No student classes found.
                  </p>
                )}
              </div>
            </div>

            <Link
              href="/admin/attendance/reports"
              className="w-full mt-6 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-primary border border-slate-200 dark:border-slate-700/80 rounded-xl transition-all hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2"
            >
              <span>View Full Class Reports</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Live Attendance Activity Log Table */}
        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Student Attendance Records</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Live verification logs recorded by class teachers and verified by administration.
              </p>
            </div>
            <Link
              href="/admin/attendance/reports"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-indigo-700"
            >
              <span>Export Attendance Log</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-black">
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Class & Section</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {recentRecords.map((record: any) => (
                  <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                      <div className="size-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
                        {record.studentName.charAt(0)}
                      </div>
                      <span>{record.studentName}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                      {record.rollNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {record.className}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(record.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        record.status === 'PRESENT'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50'
                          : record.status === 'ABSENT'
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/50'
                          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/50'
                      }`}>
                        {record.status === 'PRESENT' && <CheckCircle2 size={11} />}
                        {record.status === 'ABSENT' && <UserX size={11} />}
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {recentRecords.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                      No attendance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

AttendanceDashboard.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
