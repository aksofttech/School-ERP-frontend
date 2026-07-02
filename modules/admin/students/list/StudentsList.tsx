import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '@/components/layouts/AdminLayout';
import DataTable, { Column } from '@/components/ui/DataTable';
import { useStudents } from '@/hooks/useStudents';
import { Student } from '@/utils/types';
import {
  UserPlus,
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  MoreHorizontal,
  GraduationCap,
  ChevronDown
} from 'lucide-react';
import { useClasses } from '@/hooks/useClasses';

export default function StudentsList() {
  const router = useRouter();
  const {
    students,
    total,
    loading,
    error,
    params,
    setPage,
    setSearch,
    setFilter,
    toggleSort,
    deleteStudent
  } = useStudents();
  const { classes } = useClasses();

  // Get sections for the selected class
  const selectedClass = classes.find(c => c.id === params.classId);
  const availableSections = selectedClass?.sections || [];

  const handleClassChange = (classId: string) => {
    setFilter({ classId: classId || undefined, sectionId: undefined });
  };

  const handleSectionChange = (sectionId: string) => {
    setFilter({ sectionId: sectionId || undefined });
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete student ${name}?`)) {
      const success = await deleteStudent(id);
      if (success) {
        alert('Student deleted successfully');
      } else {
        alert('Failed to delete student');
      }
    }
  };

  const columns: Column<Student>[] = [
    {
      header: 'Student',
      accessor: (student) => (
        <Link href={`/admin/students/${student.id}`} className="flex items-center gap-4 group cursor-pointer">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-primary/10 to-primary/5 text-primary flex items-center justify-center font-black border border-primary/10 group-hover:scale-110 transition-transform duration-300">
            {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight group-hover:text-primary transition-colors">
              {student.firstName} {student.lastName}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              {student.email}
            </span>
          </div>
        </Link>
      ),
    },
    {
      header: 'ID / Roll',
      accessor: (student) => (
        <span className="font-mono text-xs font-black text-slate-500 tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
          {student.rollNumber || 'N/A'}
        </span>
      ),
    },
    {
      header: 'Class',
      accessor: (student) => (
        <span className="text-sm font-bold text-slate-600 dark:text-slate-400 italic">
          {student.class?.name || 'Unassigned'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (student) => (
        <div className="flex">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${student.status === 'ACTIVE'
              ? 'bg-emerald-500/10 text-emerald-500'
              : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
            }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${student.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
            {student.status || 'INACTIVE'}
          </span>
        </div>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      accessor: (student) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/admin/students/${student.id}`}
            className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
          >
            <Eye size={18} />
          </Link>
          <Link
            href={`/admin/students/edit/${student.id}`}
            className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/5 rounded-lg transition-all"
          >
            <Edit3 size={18} />
          </Link>
          <button 
            onClick={() => handleDelete(student.id, `${student.firstName} ${student.lastName}`)}
            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 rounded-lg transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
      <>
        
      <Head>
        <title>Student List - EduCore</title>
      </Head>

      <div className="space-y-8">
        {/* Error Display */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 text-rose-600">
            <div className="size-10 bg-rose-100 rounded-xl flex items-center justify-center animate-pulse">
              <span className="font-black">!</span>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest">Failed to load</p>
              <p className="text-sm font-medium italic">{error}</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="ml-auto px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-black hover:bg-rose-700 transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary">
              <GraduationCap size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Student List</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Students</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium italic">List of all students currently in the school.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Class Filter */}
            <div className="relative">
              <select
                value={params.classId || ''}
                onChange={(e) => handleClassChange(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl text-sm font-black text-slate-700 dark:text-slate-300 outline-none focus:border-primary transition-all cursor-pointer hover:border-primary/30 min-w-[140px]"
              >
                <option value="">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>

            {/* Section Filter */}
            <div className="relative">
              <select
                value={params.sectionId || ''}
                onChange={(e) => handleSectionChange(e.target.value)}
                disabled={!params.classId}
                className={`appearance-none pl-4 pr-10 py-3 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl text-sm font-black text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500 transition-all cursor-pointer hover:border-indigo-500/30 min-w-[140px] ${!params.classId ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''}`}
              >
                <option value="">All Sections</option>
                {availableSections.map((sec) => (
                  <option key={sec.id} value={sec.id}>{sec.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
            <Link href="/admin/students/add" className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-black shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:scale-95 transition-all">
              <UserPlus size={18} />
              Add Student
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative w-full lg:w-96 group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                <Search size={18} className="text-slate-400" />
              </span>
              <input
                type="text"
                placeholder="Search by name or ID..."
                className="w-full pl-11 pr-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto ml-auto">
              <button 
                onClick={() => alert('Filter system coming soon!')}
                className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-bold text-slate-500 hover:text-primary transition-all active:scale-95"
              >
                <Filter size={18} />
                Filters
              </button>
              <button 
                onClick={() => alert('More options coming soon!')}
                className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-primary transition-all active:scale-95"
              >
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={students}
          isLoading={loading}
          pagination={{
            total,
            page: params.page || 1,
            limit: params.limit || 10,
            onPageChange: (page) => setPage(page),
          }}
          emptyMessage="No students found."
        />
      </div>
    
      </>
    );
}


StudentsList.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
