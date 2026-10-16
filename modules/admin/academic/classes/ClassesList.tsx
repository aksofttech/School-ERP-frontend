import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Activity,
  Layers,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  BookOpen,
  UserCheck,
  Building,
  LayoutGrid,
  List,
  Sparkles,
  Calendar,
  X,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useClasses } from '@/hooks/useClasses';
import { classesService } from '@/services/classes.service';
import AdminLayout from '@/components/layouts/AdminLayout';
import Skeleton from '@/components/ui/Skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';
import { toast } from 'react-hot-toast';

const classSchema = z.object({
  name: z.string().min(1, 'Class name is required (e.g. Class 1st, Class Nursery)'),
  numericName: z.number().optional(),
});

type ClassFormValues = z.infer<typeof classSchema>;

function getGradeWeight(name: string): number {
  const lower = (name || '').toLowerCase().replace('class', '').trim();
  if (lower.includes('nursery')) return 1;
  if (lower.includes('lkg') || lower.includes('l.k.g')) return 2;
  if (lower.includes('ukg') || lower.includes('u.k.g') || lower.includes('kg')) return 3;
  if (lower.includes('prep')) return 4;
  const numMatch = lower.match(/\d+/);
  if (numMatch) {
    return 10 + parseInt(numMatch[0], 10);
  }
  return 999;
}

function getClassCategory(name: string): { label: string; badgeClass: string; level: 'kindergarten' | 'primary' | 'middle' | 'secondary' } {
  const lower = (name || '').toLowerCase();
  if (lower.includes('nursery') || lower.includes('lkg') || lower.includes('ukg') || lower.includes('kg')) {
    return {
      label: 'Kindergarten',
      badgeClass: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/50',
      level: 'kindergarten',
    };
  }
  const match = lower.match(/\d+/);
  if (match) {
    const num = parseInt(match[0], 10);
    if (num <= 5) {
      return {
        label: 'Primary',
        badgeClass: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200/50',
        level: 'primary',
      };
    }
    if (num <= 8) {
      return {
        label: 'Middle School',
        badgeClass: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200/50',
        level: 'middle',
      };
    }
    return {
      label: num <= 10 ? 'Secondary' : 'Senior Secondary',
      badgeClass: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200/50',
      level: 'secondary',
    };
  }
  return {
    label: 'Standard',
    badgeClass: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200',
    level: 'primary',
  };
}

export default function ClassesList() {
  const { classes, loading, refetch } = useClasses();
  const [activeTab, setActiveTab] = useState<'matrix' | 'create'>('matrix');
  const [filterLevel, setFilterLevel] = useState<'all' | 'primary' | 'middle' | 'secondary'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [registering, setRegistering] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const { register, handleSubmit, reset } = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
  });

  const onRegister = async (data: ClassFormValues) => {
    setRegistering(true);
    try {
      await classesService.create(data as any);
      toast.success('New class registered successfully.');
      reset();
      setActiveTab('matrix');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to register class');
    } finally {
      setRegistering(false);
    }
  };

  const handleOpenClassDetails = async (cls: any) => {
    setSelectedClass(cls);
    setLoadingDetails(true);
    try {
      const fullClass = await classesService.getById(cls.id);
      setSelectedClass(fullClass);
    } catch (e) {
      // keep basic class info
    } finally {
      setLoadingDetails(false);
    }
  };

  // Sort classes in natural pedagogical order (Nursery -> 12th)
  const sortedClasses = [...classes].sort((a, b) => getGradeWeight(a.name) - getGradeWeight(b.name));

  // Filter by search & level
  const filteredClasses = sortedClasses.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (filterLevel === 'all') return true;
    const cat = getClassCategory(c.name);
    if (filterLevel === 'primary') return cat.level === 'kindergarten' || cat.level === 'primary';
    if (filterLevel === 'middle') return cat.level === 'middle';
    if (filterLevel === 'secondary') return cat.level === 'secondary';
    return true;
  });

  // Real aggregate statistics
  const totalClassesCount = classes.length;
  const totalStudentsCount = classes.reduce((sum, c) => sum + (c._count?.students || 0), 0);
  const totalSectionsCount = classes.reduce((sum, c) => sum + (c.sections?.length || c._count?.sections || 1), 0);

  return (
    <>
      <Head>
        <title>Classes | School ERP</title>
      </Head>

      <div className="space-y-8 animate-in fade-in duration-500 pb-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black tracking-widest uppercase bg-primary/10 text-primary px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-primary" />
                Academic Structure
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Classes</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Manage school classes, section assignments, and live enrolled student strength.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/classes/sections"
              className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-2"
            >
              <Layers size={16} />
              Sections
            </Link>
            <Link
              href="/admin/classes/class-teachers"
              className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-2"
            >
              <UserCheck size={16} />
              Class Teachers
            </Link>
            <button
              onClick={() => setActiveTab(activeTab === 'create' ? 'matrix' : 'create')}
              className="px-5 py-2.5 bg-primary hover:bg-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Plus size={16} />
              <span>{activeTab === 'create' ? 'View Classes' : 'Add New Class'}</span>
            </button>
          </div>
        </div>

        {/* Real Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-primary">
                <Layers size={22} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-primary border border-indigo-200/50">
                Nursery - 12th
              </span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Classes</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {loading ? '...' : totalClassesCount}
                </h3>
                <span className="text-xs font-semibold text-slate-500">Classes</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-medium">All academic grade levels</p>
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
                <Users size={22} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 border border-blue-200/50">
                Live Enrolment
              </span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Enrolment</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {loading ? '...' : totalStudentsCount}
                </h3>
                <span className="text-xs font-semibold text-slate-500">Students</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-medium">Verified student registrations</p>
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
                <BookOpen size={22} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200/50">
                Active Sections
              </span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Sections</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {loading ? '...' : totalSectionsCount}
                </h3>
                <span className="text-xs font-semibold text-slate-500">Sections</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-medium">Assigned classrooms & batches</p>
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600">
                <ShieldCheck size={22} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 border border-purple-200/50">
                Active
              </span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Academic Year</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  2026-27
                </h3>
                <span className="text-xs font-semibold text-emerald-600">Term 1</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-medium">Regular session ongoing</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full lg:w-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              {[
                { id: 'all', label: 'All Classes', count: sortedClasses.length },
                { id: 'primary', label: 'Primary (Nur-5th)' },
                { id: 'middle', label: 'Middle (6th-8th)' },
                { id: 'secondary', label: 'Secondary (9th-12th)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterLevel(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    filterLevel === tab.id
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search & View Mode Switcher */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary text-xs font-medium text-slate-900 dark:text-white outline-none transition-all shadow-sm"
                  placeholder="Search classes..."
                />
              </div>

              <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  title="Table View"
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'table'
                      ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 flex-1 min-h-[450px]">
            {activeTab === 'create' ? (
              /* Create Class Form */
              <div className="max-w-lg mx-auto py-8 space-y-8 animate-in fade-in duration-300">
                <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="size-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                    <Plus size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add New Class</h2>
                    <p className="text-xs text-slate-500 font-medium">Create a new academic standard for this campus</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onRegister)} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Class Name</label>
                    <input
                      {...register('name')}
                      placeholder="e.g. Class 1st, Class Nursery, Senior Science..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Class Order Number (Optional)</label>
                    <input
                      type="number"
                      {...register('numericName', { valueAsNumber: true })}
                      placeholder="e.g. 1, 2, 10"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setActiveTab('matrix')}
                      className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={registering}
                      className="flex-[2] py-3 bg-primary hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2"
                    >
                      {registering ? <Activity size={16} className="animate-spin" /> : <Plus size={16} />}
                      Save Class
                    </button>
                  </div>
                </form>
              </div>
            ) : viewMode === 'grid' ? (
              /* Grid View of Classes */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-44 rounded-2xl" />
                  ))
                ) : filteredClasses.length === 0 ? (
                  <div className="col-span-full py-16 text-center text-slate-400">
                    <Building size={36} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-semibold">No classes match your filter.</p>
                  </div>
                ) : (
                  filteredClasses.map((item) => {
                    const category = getClassCategory(item.name);
                    const studentCount = item._count?.students || 0;
                    const sections = item.sections || [];

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleOpenClassDetails(item)}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-primary/50 hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer relative overflow-hidden"
                      >
                        {/* Top Category Badge & Menu */}
                        <div className="flex items-center justify-between mb-4">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${category.badgeClass}`}>
                            {category.label}
                          </span>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                className="size-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 flex items-center justify-center"
                              >
                                <MoreVertical size={16} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl">
                              <DropdownMenuItem
                                onClick={(e: any) => {
                                  e.stopPropagation();
                                  handleOpenClassDetails(item);
                                }}
                                className="flex items-center gap-2 p-2 rounded-lg text-xs font-semibold cursor-pointer"
                              >
                                <Users size={14} className="text-primary" />
                                <span>View Students</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e: any) => {
                                  e.stopPropagation();
                                  window.location.href = `/admin/attendance/students?classId=${item.id}`;
                                }}
                                className="flex items-center gap-2 p-2 rounded-lg text-xs font-semibold cursor-pointer"
                              >
                                <UserCheck size={14} className="text-emerald-500" />
                                <span>Take Attendance</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Class Title & Section Info */}
                        <div className="space-y-1 mb-5">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-xs text-slate-400 font-medium">
                            {sections.length > 0
                              ? `Section ${sections.map((s: any) => s.name).join(', ')}`
                              : 'Section A'}
                          </p>
                        </div>

                        {/* Enrolment Strength & Occupancy Bar */}
                        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-bold">
                              <Users size={14} className="text-primary" />
                              <span>{studentCount} Students</span>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-400">
                              Cap: 40
                            </span>
                          </div>

                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-primary h-full rounded-full transition-all duration-700"
                              style={{ width: `${Math.min((studentCount / 40) * 100, 100)}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between pt-1 text-[11px] font-bold text-primary group-hover:underline">
                            <span>Class Details</span>
                            <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              /* Table View of Classes */
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-black">
                      <th className="py-3 px-4">Class Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Sections</th>
                      <th className="py-3 px-4">Enrolled Students</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {filteredClasses.map((cls) => {
                      const category = getClassCategory(cls.name);
                      const studentCount = cls._count?.students || 0;
                      const sections = cls.sections || [];

                      return (
                        <tr
                          key={cls.id}
                          onClick={() => handleOpenClassDetails(cls)}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                        >
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                              <Building size={16} />
                            </div>
                            <span>{cls.name}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${category.badgeClass}`}>
                              {category.label}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                            {sections.length > 0 ? sections.map((s: any) => s.name).join(', ') : 'A'}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-white">
                                {studentCount}
                              </span>
                              <span className="text-[10px] text-slate-400">/ 40 seats</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200/50">
                              Active
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenClassDetails(cls);
                              }}
                              className="px-3 py-1 text-[11px] font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            >
                              View Details →
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30 dark:bg-slate-900/20 text-xs font-semibold text-slate-500">
            <p>
              Showing <span className="font-bold text-slate-900 dark:text-white">{filteredClasses.length} of {classes.length}</span> Classes
            </p>
            <div className="flex items-center gap-4">
              <span className="text-slate-400">Term: 2026-2027</span>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-sm"
              >
                Print Classes List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Class Details Modal */}
      {selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  Class Overview
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  {selectedClass.name}
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Section: {selectedClass.sections?.map((s: any) => s.name).join(', ') || 'A'}
                </p>
              </div>

              <button
                onClick={() => setSelectedClass(null)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Enrolled Strength</p>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {selectedClass.students?.length || selectedClass._count?.students || 0}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Students</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Active Sections</p>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {selectedClass.sections?.length || 1}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Assigned</p>
              </div>
            </div>

            {/* Enrolled Students List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Enrolled Students</h4>
                <span className="text-[11px] font-bold text-primary">
                  {selectedClass.students?.length || 0} Listed
                </span>
              </div>

              <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl">
                {selectedClass.students && selectedClass.students.length > 0 ? (
                  selectedClass.students.map((st: any) => (
                    <div key={st.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <div className="flex items-center gap-2">
                        <div className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                          {st.user?.firstName?.charAt(0) || 'S'}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {st.user?.firstName} {st.user?.lastName}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-400">
                        {st.rollNumber}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-center text-xs text-slate-400 italic">
                    {loadingDetails ? 'Loading students...' : 'No students enrolled in this class.'}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Link
                href={`/admin/attendance/students?classId=${selectedClass.id}`}
                className="flex-1 py-3 bg-primary hover:bg-indigo-700 text-white rounded-xl text-xs font-bold text-center shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-1.5"
              >
                <UserCheck size={15} />
                <span>Take Attendance</span>
              </Link>
              <button
                onClick={() => setSelectedClass(null)}
                className="px-5 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

ClassesList.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
