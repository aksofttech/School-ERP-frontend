import React, { useState, useMemo } from 'react';
import {
  FileText,
  Plus,
  Search,
  MoreVertical,
  Calendar,
  Target,
  Users,
  Clock,
  Layers,
  BookOpen,
  ArrowUpDown,
  Edit2,
  Trash2,
  CheckCircle2,
  Filter,
  RefreshCw,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useExams } from '@/hooks/useExams';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/DropdownMenu';
import AdminLayout from '@/components/layouts/AdminLayout';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import { USER_ROLES } from '@/utils/role-config';
import Head from 'next/head';

// Helper to determine natural class rank (Nursery -> 12th)
const getClassRank = (name?: string): number => {
  if (!name) return 999;
  const n = name.toLowerCase().replace('class', '').trim();
  if (n.includes('nur')) return 0;
  if (n.includes('lkg')) return 1;
  if (n.includes('ukg')) return 2;
  const num = parseInt(n.replace(/[^0-9]/g, ''), 10);
  return isNaN(num) ? 99 : num + 2;
};

export default function ExamList() {
  const { user } = useAuth();
  const rolePath = user?.role === 'TEACHER' ? 'teacher' : 'admin';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'class' | 'subject' | 'date'>('class');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { exams, loading, refetch, deleteExam } = useExams();

  // Extract unique classes from exams
  const availableClasses = useMemo(() => {
    const map = new Map<string, string>();
    exams.forEach((e: any) => {
      if (e.class?.id && e.class?.name) {
        map.set(e.class.id, e.class.name);
      }
    });
    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => getClassRank(a.name) - getClassRank(b.name));
  }, [exams]);

  // Filtered and Sorted Exams
  const sortedExams = useMemo(() => {
    let result = [...exams];

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        (e: any) =>
          e.name?.toLowerCase().includes(q) ||
          e.class?.name?.toLowerCase().includes(q) ||
          e.type?.toLowerCase().includes(q)
      );
    }

    // Class filter
    if (selectedClass !== 'all') {
      result = result.filter((e: any) => e.classId === selectedClass || e.class?.id === selectedClass);
    }

    // Type filter
    if (selectedType !== 'all') {
      result = result.filter((e: any) => e.type === selectedType);
    }

    // Sorting
    result.sort((a: any, b: any) => {
      let comparison = 0;
      if (sortBy === 'class') {
        const rankA = getClassRank(a.class?.name);
        const rankB = getClassRank(b.class?.name);
        comparison = rankA - rankB;
        if (comparison === 0) {
          comparison = (a.name || '').localeCompare(b.name || '');
        }
      } else if (sortBy === 'subject') {
        comparison = (a.name || '').localeCompare(b.name || '');
        if (comparison === 0) {
          comparison = getClassRank(a.class?.name) - getClassRank(b.class?.name);
        }
      } else if (sortBy === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [exams, searchTerm, selectedClass, selectedType, sortBy, sortOrder]);

  // Aggregate stats
  const stats = useMemo(() => {
    const total = exams.length;
    const midTerms = exams.filter((e: any) => e.type === 'MID_TERM').length;
    const unitTests = exams.filter((e: any) => e.type === 'UNIT_TEST').length;
    const finals = exams.filter((e: any) => e.type === 'FINAL').length;
    const classCount = new Set(exams.map((e: any) => e.classId)).size;
    return { total, midTerms, unitTests, finals, classCount };
  }, [exams]);

  const toggleSort = (field: 'class' | 'subject' | 'date') => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
        <>
          <Head>
            <title>Exams & Assessments | Vikas ERP</title>
          </Head>

          <div className="space-y-8 animate-in fade-in duration-500 pt-6 pb-16">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-2">
                  <Award size={14} />
                  Academic Assessments & Evaluations
                </div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Exams Management
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Schedule, organize, and view academic examinations sorted by class and subject.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => refetch()}
                  className="p-3 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  title="Refresh Exams"
                >
                  <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                </button>
                <Link href={`/${rolePath}/exams/create`}>
                  <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl px-5 py-2.5 font-bold text-sm shadow-lg shadow-primary/20 flex items-center gap-2">
                    <Plus size={18} />
                    Schedule Exam
                  </Button>
                </Link>
              </div>
            </div>

            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Total Exams
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                    <Target size={18} />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {stats.total} Scheduled
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Across {stats.classCount} Classes
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">
                    Mid-Term Exams
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
                    <Calendar size={18} />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {stats.midTerms} Exams
                </div>
                <div className="text-xs text-indigo-500 font-semibold mt-1">
                  Major Term Assessment
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    Unit Tests
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 size={18} />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {stats.unitTests} Tests
                </div>
                <div className="text-xs text-emerald-600 font-semibold mt-1">
                  Continuous Evaluation
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                    Final / Pre-Board
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                    <Award size={18} />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {stats.finals} Exams
                </div>
                <div className="text-xs text-purple-600 font-semibold mt-1">
                  Senior Board Evaluations
                </div>
              </div>
            </div>

            {/* Main Exam Table Container */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
              {/* Controls Toolbar */}
              <div className="p-6 border-b border-slate-200/80 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search exam name, subject, or class..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 dark:text-slate-200"
                  />
                </div>

                {/* Filters & Sorting */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Class Filter */}
                  <div className="flex items-center gap-2">
                    <Layers size={16} className="text-slate-400" />
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="all">All Classes</option>
                      {availableClasses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Type Filter */}
                  <div className="flex items-center gap-2">
                    <Filter size={16} className="text-slate-400" />
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="all">All Assessment Types</option>
                      <option value="MID_TERM">Mid-Term Exams</option>
                      <option value="UNIT_TEST">Unit Tests</option>
                      <option value="FINAL">Final Examinations</option>
                    </select>
                  </div>

                  {/* Sort Mode Button */}
                  <button
                    onClick={() => toggleSort('class')}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                      sortBy === 'class'
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <ArrowUpDown size={14} />
                    Class {sortBy === 'class' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                  </button>

                  <button
                    onClick={() => toggleSort('subject')}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                      sortBy === 'subject'
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <BookOpen size={14} />
                    Subject {sortBy === 'subject' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                      <th className="py-4 px-6">Class</th>
                      <th className="py-4 px-6">Subject & Exam Name</th>
                      <th className="py-4 px-6">Assessment Type</th>
                      <th className="py-4 px-6">Scheduled Date</th>
                      <th className="py-4 px-6">Marks (Total / Pass)</th>
                      <th className="py-4 px-6 text-center">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}>
                          <td className="px-6 py-5"><Skeleton className="h-5 w-24 rounded-lg" /></td>
                          <td className="px-6 py-5"><Skeleton className="h-5 w-48 rounded-lg" /></td>
                          <td className="px-6 py-5"><Skeleton className="h-5 w-24 rounded-lg" /></td>
                          <td className="px-6 py-5"><Skeleton className="h-5 w-28 rounded-lg" /></td>
                          <td className="px-6 py-5"><Skeleton className="h-5 w-20 rounded-lg" /></td>
                          <td className="px-6 py-5"><Skeleton className="h-5 w-16 mx-auto rounded-lg" /></td>
                          <td className="px-6 py-5 text-right"><Skeleton className="h-8 w-16 ml-auto rounded-lg" /></td>
                        </tr>
                      ))
                    ) : sortedExams.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-16 text-center text-slate-400">
                          <FileText size={40} className="mx-auto mb-3 opacity-30" />
                          <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
                            No examinations match the criteria
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            Try resetting your filters or schedule a new exam.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      sortedExams.map((exam: any) => {
                        const typeBadgeColor =
                          exam.type === 'FINAL'
                            ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800'
                            : exam.type === 'MID_TERM'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';

                        const formattedDate = new Date(exam.date).toLocaleDateString('en-IN', {
                          weekday: 'short',
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        });

                        return (
                          <tr
                            key={exam.id}
                            className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                          >
                            {/* Class Column */}
                            <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200/80 dark:border-slate-700">
                                <Layers size={13} className="text-primary" />
                                {exam.class?.name || 'Class N/A'}
                              </span>
                            </td>

                            {/* Subject & Exam Name */}
                            <td className="py-4 px-6">
                              <div className="font-bold text-slate-900 dark:text-white text-sm">
                                {exam.name}
                              </div>
                              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                                ID: {exam.id.slice(0, 8)}
                              </div>
                            </td>

                            {/* Assessment Type */}
                            <td className="py-4 px-6">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${typeBadgeColor}`}
                              >
                                {exam.type?.replace('_', ' ')}
                              </span>
                            </td>

                            {/* Date */}
                            <td className="py-4 px-6 text-xs font-medium text-slate-700 dark:text-slate-300">
                              <div className="flex items-center gap-1.5">
                                <Calendar size={13} className="text-slate-400" />
                                {formattedDate}
                              </div>
                            </td>

                            {/* Marks */}
                            <td className="py-4 px-6">
                              <div className="text-xs">
                                <span className="font-black text-slate-900 dark:text-white text-sm">
                                  {exam.totalMarks}
                                </span>
                                <span className="text-slate-400 mx-1">/</span>
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                  Pass: {exam.passingMarks}
                                </span>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-4 px-6 text-center">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                                <Clock size={11} />
                                Scheduled
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-6 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    className="size-8 p-0 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                                  >
                                    <MoreVertical size={16} className="text-slate-500" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl">
                                  <DropdownMenuItem asChild>
                                    <Link
                                      href={`/${rolePath}/exams/marks/${exam.id}`}
                                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold cursor-pointer"
                                    >
                                      <CheckCircle2 size={15} className="text-emerald-500" />
                                      Enter Marks
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link
                                      href={`/${rolePath}/exams/results/${exam.id}`}
                                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold cursor-pointer"
                                    >
                                      <Target size={15} className="text-indigo-500" />
                                      View Results
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link
                                      href={`/${rolePath}/exams/edit/${exam.id}`}
                                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold cursor-pointer"
                                    >
                                      <Edit2 size={15} className="text-primary" />
                                      Edit Exam
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="my-1" />
                                  <DropdownMenuItem
                                    onClick={() => deleteExam(exam.id)}
                                    className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold cursor-pointer text-rose-500 focus:text-rose-600 focus:bg-rose-50"
                                  >
                                    <Trash2 size={15} />
                                    Delete Exam
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      </RoleGuard>
    </AuthGuard>
  );
}

ExamList.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
