import React from 'react';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useClasses } from '@/hooks/useClasses';
import { useStudents } from '@/hooks/useStudents';
import { studentsService } from '@/services/students.service';
import Skeleton from '@/components/ui/Skeleton';
import {
  Bolt,
  ChevronsDownUp,
  ChevronsUpDown,
  CheckCircle2,
  AlertCircle,
  Users,
  ChevronRight,
  ShieldCheck,
  Zap,
  Clock,
  Search
} from 'lucide-react';

export default function StudentPromotion() {
  const router = useRouter();
  const { classes, loading: classesLoading } = useClasses();

  const [sourceClassId, setSourceClassId] = useState('');
  const [targetClassId, setTargetClassId] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isPromoting, setIsPromoting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Fetch students for the source class
  const { students, loading: studentsLoading, setFilter } = useStudents({ page: 1, limit: 100 });

  useEffect(() => {
    if (sourceClassId) {
      setFilter({ classId: sourceClassId });
    }
  }, [sourceClassId, setFilter]);

  const handleSelectAll = () => {
    if (selectedStudentIds.length === students.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(students.map(s => s.id));
    }
  };

  const handleSelectStudent = (id: string) => {
    setSelectedStudentIds(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const executePromotion = async () => {
    if (!selectedStudentIds.length || !targetClassId) return;

    setIsPromoting(true);
    setStatus(null);
    try {
      await studentsService.promote({
        studentIds: selectedStudentIds,
        targetClassId
      });
      setStatus({ type: 'success', message: 'Promotion protocol executed successfully across selected entities.' });
      setTimeout(() => router.push('/admin/students'), 2000);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Promotion sequence failed during data commit.' });
    } finally {
      setIsPromoting(false);
    }
  };

  return (
      <>
        
      <Head>
        <title>Promotion Protocol - EduCore</title>
      </Head>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Zap size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Academic Transition Engine</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Promotion Protocol</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic">Executing mass entity transition across academic hierarchies.</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={executePromotion}
            disabled={isPromoting || !selectedStudentIds.length || !targetClassId}
            className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isPromoting ? <Bolt className="animate-spin" size={18} /> : <Zap size={18} />}
            {isPromoting ? 'Executing...' : 'Commence Protocol'}
          </button>
        </div>
      </div>

      {status && (
        <div className={`p-6 rounded-[2rem] mb-10 border flex items-center gap-4 animate-in fade-in slide-in-from-top-4 ${status.type === 'success'
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
          : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
          }`}>
          {status.type === 'success' ? <ShieldCheck size={24} /> : <AlertCircle size={24} />}
          <p className="font-bold text-sm tracking-tight">{status.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Source Deck */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-10 lg:p-12 shadow-sm relative overflow-hidden h-full">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[4rem]" />
          <div className="flex items-center gap-4 mb-10 relative z-10">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <ChevronsDownUp size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Source Matrix</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Origin Unit Parameters</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Origin Class (Source)</label>
              <select
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-[1.25rem] text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                value={sourceClassId}
                onChange={(e) => setSourceClassId(e.target.value)}
              >
                <option value="">Select Origin Unit</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-3 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <Clock size={16} className="text-slate-400" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-relaxed">
                Selection will load verified entities for protocol transition.
              </p>
            </div>
          </div>
        </div>

        {/* Target Deck */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-10 lg:p-12 shadow-sm relative overflow-hidden h-full">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-bl-[4rem]" />
          <div className="flex items-center gap-4 mb-10 relative z-10">
            <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-500">
              <ChevronsUpDown size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Terminal Matrix</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Destination Unit Parameters</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Destination Class (Target)</label>
              <select
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-[1.25rem] text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                value={targetClassId}
                onChange={(e) => setTargetClassId(e.target.value)}
              >
                <option value="">Select Terminal Unit</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-3 p-5 rounded-2xl bg-sky-500/5 border border-sky-500/10">
              <ShieldCheck size={16} className="text-sky-500" />
              <p className="text-[10px] font-black uppercase tracking-widest text-sky-500 leading-relaxed">
                Destination protocol validated for selected academic hierarchy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {sourceClassId && (
        <div className="mt-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 lg:p-12 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Verified Entities</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Selection for Hierarchy Shift</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSelectAll}
                  className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-primary hover:text-white transition-all"
                >
                  {selectedStudentIds.length === students.length ? 'Deselect Total' : 'Select Total Volume'}
                </button>
                <div className="px-5 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/10">
                  {selectedStudentIds.length} Targeted
                </div>
              </div>
            </div>

            {studentsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students.map(student => (
                  <button
                    key={student.id}
                    onClick={() => handleSelectStudent(student.id)}
                    className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all text-left ${selectedStudentIds.includes(student.id)
                      ? 'bg-primary/5 border-primary shadow-xl shadow-primary/5'
                      : 'bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800 hover:border-primary/30'
                      }`}
                  >
                    <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-400 shadow-sm">
                      {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-black text-slate-900 dark:text-white truncate">{student.firstName} {student.lastName}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{student.admissionNumber}</p>
                    </div>
                    <div className={`size-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedStudentIds.includes(student.id)
                      ? 'bg-primary border-primary text-white'
                      : 'border-slate-200 dark:border-slate-700'
                      }`}>
                      {selectedStudentIds.includes(student.id) && <CheckCircle2 size={14} />}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!studentsLoading && students.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="size-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-200 mb-6">
                  <ChevronsDownUp size={40} />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-widest uppercase">Null Entity Cluster</h3>
                <p className="text-slate-500 italic text-sm mt-2">No students verified within the selected source unit matrices.</p>
              </div>
            )}
          </div>
        </div>
      )}
    
      </>
    );
}


StudentPromotion.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
