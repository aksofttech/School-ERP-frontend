import React from 'react';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import { teachersService } from '@/services/teachers.service';
import { attendanceService } from '@/services/attendance.service';
import { Teacher } from '@/utils/types';
import Skeleton from '@/components/ui/Skeleton';
import {
  Plus,
  Search,
  MoreVertical,
  UserCheck,
  Calendar,
  ShieldCheck,
  Briefcase,
  AlertCircle,
  Hash,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  UserX,
  Database,
  Users,
  Award,
  Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export default function TeacherAttendance() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [attendanceDate, setAttendanceDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({});

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await teachersService.getAll();
        const teacherList = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        setTeachers(teacherList);

        // Initialize attendance map (Defensive)
        const initialMap: Record<string, AttendanceStatus> = {};
        teacherList.filter((t: any) => t && t.id).forEach((teacher: Teacher) => {
          initialMap[teacher.id] = 'PRESENT';
        });
        setAttendanceMap(initialMap);
      } catch (err: any) {
        console.error('Faculty sync error:', err);
        toast.error('Faculty resource synchronization failed');
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const handleStatusChange = (teacherId: string, status: AttendanceStatus) => {
    setAttendanceMap(prev => ({ ...prev, [teacherId]: status }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const newMap: Record<string, AttendanceStatus> = {};
    teachers.forEach(teacher => {
      newMap[teacher.id] = status;
    });
    setAttendanceMap(newMap);
    toast.success(`Broadcasting ${status} status to all faculty deployments`);
  };

  const handleSaveAttendance = async () => {
    if (Object.keys(attendanceMap).length === 0) {
      toast.error('Faculty deployment data required');
      return;
    }

    setSaving(true);
    try {
      const attendanceData = Object.entries(attendanceMap).map(([teacherId, status]) => ({
        teacherId,
        status,
        date: attendanceDate
      }));

      await attendanceService.markTeacherAttendance({
        date: attendanceDate,
        records: attendanceData
      });

      toast.success('Faculty attendance payload successfully synchronized');
    } catch (err: any) {
      toast.error(err.message || 'Institutional transmission failure');
    } finally {
      setSaving(false);
    }
  };

  const filteredTeachers = (teachers || []).filter(t => t && t.id).filter(t =>
    `${t?.firstName || ''} ${t?.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t?.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <>
        
      <Head>
        <title>Teacher Attendance - EduCore</title>
      </Head>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-primary mb-1">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Institutional Deployment</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Faculty Tracking</h1>
          <p className="text-slate-500 font-medium italic">Synchronize daily attendance protocols for institutional faculty resources.</p>
        </div>

        <div className="flex gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-3 flex items-center gap-4 shadow-sm">
            <Calendar size={18} className="text-primary" />
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="bg-transparent border-none outline-none text-sm font-black text-slate-900 dark:text-white"
            />
          </div>
          <button
            onClick={handleSaveAttendance}
            disabled={saving || teachers.length === 0}
            className="px-10 py-4 bg-primary text-white rounded-[1.5rem] font-black text-sm shadow-2xl shadow-primary/30 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? 'Synchronizing...' : 'Commit Registry'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Quick Protocols & Search (Left) */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-8 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-6">Search Parameters</h3>

            <div className="relative group mb-8">
              <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Identify faculty resource..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl py-5 pl-16 pr-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="space-y-4">
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-primary shadow-sm">
                  <Zap size={20} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Active Deployments</p>
                  <p className="text-2xl font-black text-primary leading-none mt-1">{teachers.length}</p>
                </div>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-emerald-500 shadow-sm">
                  <Award size={20} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Verified Status</p>
                  <p className="text-2xl font-black text-emerald-500 leading-none mt-1">100%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bulk Protocols */}
          <div className="bg-slate-900 dark:bg-primary/10 rounded-[3rem] p-8 border border-primary/20 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 size-32 bg-primary/20 rounded-full blur-3xl" />
            <div className="relative z-10 space-y-6">
              <div>
                <h3 className="text-white text-lg font-black uppercase tracking-widest mb-1">Global Protocols</h3>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Broadcast status markers across faculty deployments</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleMarkAll('PRESENT')}
                  className="p-4 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-2xl flex items-center justify-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-widest transition-all"
                >
                  <CheckCircle2 size={14} />
                  All Present
                </button>
                <button
                  onClick={() => handleMarkAll('ABSENT')}
                  className="p-4 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 rounded-2xl flex items-center justify-center gap-2 text-rose-400 font-black text-[10px] uppercase tracking-widest transition-all"
                >
                  <XCircle size={14} />
                  All Absent
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Faculty Matrix (Right) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] shadow-sm overflow-hidden flex flex-col h-[calc(100vh-280px)]">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Deployment Matrix</h3>
              <p className="text-lg font-black text-slate-900 dark:text-white leading-none">Verified Faculty Registry</p>
            </div>
            <div className="size-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-primary shadow-sm border border-slate-100 dark:border-slate-700">
              <Users size={20} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {loading ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3, 4, 5, 6].map(i => <Skeleton className="h-24 rounded-[2rem]" />)}
              </div>
            ) : filteredTeachers.length > 0 ? (
              <div className="divide-y divide-slate-50 dark:divide-slate-800">
                {(filteredTeachers || []).filter(t => t && t.id).map((teacher, idx) => (
                  <div key={teacher.id} className="p-8 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-6">
                      <span className="text-xs font-black text-slate-100 dark:text-slate-800 italic group-hover:text-primary transition-colors">#{idx + 1}</span>
                      <div className="size-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all overflow-hidden">
                        {teacher?.profilePicture ? (
                          <img src={teacher.profilePicture} className="size-full object-cover" alt="" />
                        ) : (
                          <span className="font-black">
                            {String(teacher?.firstName || '').charAt(0)}
                            {String(teacher?.lastName || '').charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <p className="text-lg font-black text-slate-900 dark:text-white leading-none mb-1 group-hover:text-primary transition-colors">
                          {teacher?.firstName} {teacher?.lastName}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{teacher?.designation || 'Faculty Resource'}</p>
                          <span className="size-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{teacher?.employeeId || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex p-2 bg-slate-50 dark:bg-slate-800 rounded-3xl gap-1 border border-slate-200 dark:border-slate-700 shadow-inner">
                      <StatusButton
                        active={attendanceMap[teacher.id] === 'PRESENT'}
                        onClick={() => handleStatusChange(teacher.id, 'PRESENT')}
                        color="emerald"
                        icon={CheckCircle2}
                        label="P"
                      />
                      <StatusButton
                        active={attendanceMap[teacher.id] === 'ABSENT'}
                        onClick={() => handleStatusChange(teacher.id, 'ABSENT')}
                        color="rose"
                        icon={XCircle}
                        label="A"
                      />
                      <StatusButton
                        active={attendanceMap[teacher.id] === 'LATE'}
                        onClick={() => handleStatusChange(teacher.id, 'LATE')}
                        color="amber"
                        icon={Clock}
                        label="L"
                      />
                      <StatusButton
                        active={attendanceMap[teacher.id] === 'EXCUSED'}
                        onClick={() => handleStatusChange(teacher.id, 'EXCUSED')}
                        color="blue"
                        icon={UserX}
                        label="E"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-20 flex flex-col items-center text-center space-y-8">
                <div className="size-32 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-200">
                  <Database size={64} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none">Registry Empty</h3>
                  <p className="text-slate-500 text-sm font-medium italic max-w-sm">No institutional faculty resources discovered for the selected deployment synchronization criteria.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    
      </>
    );
}

function StatusButton({ active, onClick, color, icon: Icon, label }: any) {
  const activeStyles: any = {
    emerald: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30',
    rose: 'bg-rose-500 text-white shadow-lg shadow-rose-500/30',
    amber: 'bg-amber-500 text-white shadow-lg shadow-amber-500/30',
    blue: 'bg-primary text-white shadow-lg shadow-primary/30'
  };

  return (
    <button
      onClick={onClick}
      className={`size-12 rounded-2xl flex flex-col items-center justify-center transition-all ${active ? activeStyles[color] : 'bg-transparent text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:text-slate-500'
        }`}
    >
      <Icon size={16} />
      <span className="text-[10px] font-black uppercase leading-none mt-1">{label}</span>
    </button>
  );
}


TeacherAttendance.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
