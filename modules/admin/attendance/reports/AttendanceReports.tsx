import React from 'react';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import { attendanceService } from '@/services/attendance.service';
import Skeleton from '@/components/ui/Skeleton';
import {
  BarChart3,
  PieChart as PieIcon,
  Activity,
  Filter,
  Download,
  Calendar,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  UserX,
  Database,
  Users,
  Search
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format, subDays } from 'date-fns';

export default function AttendanceReports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reports, setReports] = useState<any>(null);

  const [dateRange, setDateRange] = useState({
    start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const data = await attendanceService.getReports(dateRange);
        setReports(data || null);
      } catch (err: any) {
        setError(err.message || 'Strategic analytics synchronization failed');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [dateRange]);

  if (error) {
    return (
      <>
        
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
          <div className="p-4 rounded-full bg-rose-500/10 text-rose-500">
            <AlertCircle size={48} />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Analytics Failure</h2>
          <p className="text-slate-500 max-w-sm italic">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-primary text-white rounded-xl font-bold uppercase text-[10px] tracking-widest">Retry Protocols</button>
        </div>
      
      </>
    );
  }

  return (
    <AdminLayout title="Strategic Analytics">
      <Head>
        <title>Attendance Intelligence - EduCore</title>
      </Head>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Activity size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Institutional Oversight</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Deployment Intelligence</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic">High-fidelity analytics on institutional movements and registry synchronization.</p>
        </div>

        <div className="flex gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-3 flex items-center gap-4 shadow-sm">
            <Calendar size={18} className="text-primary" />
            <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="bg-transparent border-none outline-none"
              />
              <span className="text-slate-300">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="bg-transparent border-none outline-none"
              />
            </div>
          </div>
          <button className="h-14 px-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white text-sm font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm flex items-center gap-2">
            <Download size={18} />
            Export Matrix
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        <MetricCard
          label="Average Attendance"
          value={loading ? '...' : '94.2%'}
          trend="+1.2% versus previous cycle"
          icon={TrendingUp}
          color="blue"
        />
        <MetricCard
          label="Total Disruptions"
          value={loading ? '...' : '142'}
          trend="Strategic decrease identified"
          icon={XCircle}
          color="rose"
        />
        <MetricCard
          label="Engagement Index"
          value={loading ? '...' : '8.4/10'}
          trend="High institutional stability"
          icon={ShieldCheck}
          color="emerald"
        />
        <MetricCard
          label="Active Protocols"
          value={loading ? '...' : '2,482'}
          trend="99.9% data integrity"
          icon={Database}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Engagement Matrix (Left) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 size-80 bg-primary/5 rounded-full blur-[100px]" />
          <div className="relative z-10 space-y-10">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-2 text-[10px]">Strategic Visualization</h3>
                <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Institutional Flow Analytics</p>
              </div>
              <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <BarChart3 size={24} />
              </div>
            </div>

            <div className="h-80 flex items-end justify-between gap-4 px-4">
              {[65, 80, 45, 90, 70, 85, 95, 60, 75, 55, 80, 92].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                  <div className="w-full relative">
                    <div
                      style={{ height: `${height}%` }}
                      className="bg-slate-100 dark:bg-slate-800 rounded-2xl w-full group-hover:bg-primary transition-all duration-500 relative"
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {height}%
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">C-{i + 1}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-8 pt-10 border-t border-slate-50 dark:border-slate-800">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Primary Sector</p>
                <p className="text-lg font-black text-slate-900 dark:text-white">Science Faculty</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Peak Engagement</p>
                <p className="text-lg font-black text-primary">09:15 AM</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Stability Score</p>
                <p className="text-lg font-black text-emerald-500">EXCELLENT</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sector Integrity (Right) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] shadow-sm flex flex-col h-full overflow-hidden">
          <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1 text-[10px]">Sector Registry</h3>
              <p className="text-lg font-black text-slate-900 dark:text-white leading-none">Registry Integrity</p>
            </div>
            <div className="size-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-primary shadow-sm border border-slate-100 dark:border-slate-700">
              <PieIcon size={20} />
            </div>
          </div>

          <div className="p-10 flex-1 flex flex-col justify-center space-y-10">
            <div className="relative size-48 mx-auto">
              <svg className="size-full" viewBox="0 0 36 36">
                <path className="text-slate-100 dark:text-slate-800" strokeDasharray="100, 100" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="currentColor"></path>
                <path className="text-primary" strokeDasharray="75, 100" strokeWidth="4" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="currentColor"></path>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">75%</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Verified</span>
              </div>
            </div>

            <div className="space-y-4">
              <IntegrityMetric color="bg-primary" label="Standard Protocols" value="1,842" percentage="75%" />
              <IntegrityMetric color="bg-rose-500" label="Critical Disruptions" value="482" percentage="20%" />
              <IntegrityMetric color="bg-amber-500" label="Pending Sync" value="158" percentage="5%" />
            </div>

            <button className="w-full py-5 bg-slate-50 dark:bg-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] rounded-3xl hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary transition-all flex items-center justify-center gap-2">
              Access Full Matrix
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function MetricCard({ label, value, trend, icon: Icon, color }: any) {
  const colorMap: any = {
    blue: 'text-primary bg-primary/10',
    rose: 'text-rose-500 bg-rose-500/10',
    emerald: 'text-emerald-500 bg-emerald-500/10',
    purple: 'text-purple-600 bg-purple-600/10'
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 flex flex-col gap-6 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all">
      <div className="flex justify-between items-start">
        <div className={`p-4 rounded-2xl ${colorMap[color]}`}>
          <Icon size={24} />
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2 italic px-1">{label}</p>
        <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h4>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{trend}</p>
      </div>
    </div>
  );
}

function IntegrityMetric({ color, label, value, percentage }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`size-3 rounded-full ${color}`} />
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none">{label}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{value} assets</span>
        </div>
      </div>
      <span className="text-xs font-black text-slate-900 dark:text-white">{percentage}</span>
    </div>
  );
}


AttendanceReports.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
