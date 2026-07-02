import React from 'react';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useTeachers } from '@/hooks/useTeachers';
import { teachersService } from '@/services/teachers.service';
import Skeleton from '@/components/ui/Skeleton';
import {
    Users,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit3,
    Trash2,
    Mail,
    Phone,
    ArrowRight,
    ShieldCheck,
    AlertCircle,
    Clock,
    Briefcase
} from 'lucide-react';

export default function TeachersList() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const {
        teachers,
        loading,
        error,
        total,
        params,
        setPage,
        setSearch,
        setFilter,
        refetch
    } = useTeachers();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        const timeoutId = setTimeout(() => setSearch(e.target.value), 500);
        return () => clearTimeout(timeoutId);
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to terminate the contract and remove record for ${name}?`)) {
            try {
                await teachersService.delete(id);
                refetch();
            } catch (err: any) {
                alert(err.message || 'Failed to remove teacher record.');
            }
        }
    };

    return (
      <>
        
            <Head>
                <title>Teachers List - EduCore</title>
            </Head>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-primary mb-1">
                        <ShieldCheck size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Manage Teachers</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Teachers List</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium italic">Full list of all teachers in the school.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => router.push('/admin/teachers/add')}
                        className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add New Teacher
                    </button>
                </div>
            </div>

            {/* Utilities & Search */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
                <div className="lg:col-span-8 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 flex items-center shadow-sm">
                        <div className="h-10 w-10 flex items-center justify-center text-slate-400">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search teacher by name or department..."
                            className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 px-2"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="flex bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 shadow-sm">
                        <select
                            onChange={(e) => setFilter({ status: e.target.value })}
                            className="bg-transparent border-none outline-none text-xs font-black uppercase tracking-widest text-slate-500 px-4 cursor-pointer"
                        >
                            <option value="">Status Filter</option>
                            <option value="ACTIVE">Verified Active</option>
                            <option value="INACTIVE">Protocol Suspended</option>
                        </select>
                    </div>
                </div>
                <div className="lg:col-span-4 bg-slate-900 text-white rounded-[2rem] p-6 flex items-center justify-between shadow-xl shadow-slate-900/10">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Total Teachers</p>
                        <h4 className="text-2xl font-black tracking-tight">{total} Teachers</h4>
                    </div>
                    <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center">
                        <Users size={24} />
                    </div>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="p-10 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-4 mb-10 animate-in fade-in zoom-in">
                    <AlertCircle size={48} />
                    <div className="space-y-1">
                        <h3 className="text-xl font-black uppercase tracking-widest">Failed to load data</h3>
                        <p className="font-bold italic">{error}</p>
                    </div>
                    <button onClick={() => refetch()} className="px-6 py-2 bg-rose-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest">Try Again</button>
                </div>
            )}

            {/* Results Grid - Using a Table for Teachers but with Premium Styling */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto overflow-y-hidden custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Teacher Name</th>
                                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Department</th>
                                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Contact</th>
                                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-right">Settings</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i}>
                                        <td className="px-8 py-6"><Skeleton className="h-12 w-48 rounded-xl" /></td>
                                        <td className="px-8 py-6"><Skeleton className="h-12 w-40 rounded-xl" /></td>
                                        <td className="px-8 py-6"><Skeleton className="h-12 w-48 rounded-xl" /></td>
                                        <td className="px-8 py-6"><Skeleton className="h-10 w-24 rounded-full" /></td>
                                        <td className="px-8 py-6"><Skeleton className="h-10 w-24 rounded-xl ml-auto" /></td>
                                    </tr>
                                ))
                            ) : (
                                teachers.map((teacher) => (
                                    <tr key={teacher.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="size-14 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 flex items-center justify-center font-black text-slate-400 text-lg group-hover:border-primary transition-colors shadow-sm overflow-hidden">
                                                    {teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 dark:text-white text-base leading-tight">
                                                        {teacher.firstName} {teacher.lastName}
                                                    </p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                                        ID: {teacher.id.slice(0, 8)}...
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold text-sm">
                                                    <Briefcase size={12} className="text-primary" />
                                                    {teacher.department || 'Not Assigned'}
                                                </div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                                                    {teacher.designation || 'Teacher'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary transition-colors cursor-pointer">
                                                    <Mail size={12} />
                                                    {teacher.email || 'No email set'}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <Phone size={12} />
                                                    {teacher.phone || 'No phone set'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-left-2`}>
                                                <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                Verified Active
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => router.push(`/admin/teachers/edit/${teacher.id}`)}
                                                    className="size-11 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-sm"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(teacher.id, `${teacher.firstName} ${teacher.lastName}`)}
                                                    className="size-11 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => router.push(`/admin/teachers/profile/${teacher.id}`)}
                                                    className="size-11 rounded-xl bg-slate-900 text-white hover:bg-primary transition-all flex items-center justify-center shadow-xl shadow-slate-900/10"
                                                >
                                                    <ArrowRight size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Dynamic Pagination */}
                <div className="px-8 py-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
                        Showing {teachers.length} of {total} teachers.
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            disabled={params.page === 1}
                            onClick={() => setPage(params.page! - 1)}
                            className="px-6 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-black uppercase tracking-widest text-slate-500 disabled:opacity-30 hover:bg-primary hover:text-white transition-all"
                        >
                            Back
                        </button>
                        <div className="size-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-black shadow-lg shadow-slate-900/10">
                            {params.page}
                        </div>
                        <button
                            disabled={params.page! * params.limit! >= total}
                            onClick={() => setPage(params.page! + 1)}
                            className="px-6 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-black uppercase tracking-widest text-slate-500 disabled:opacity-30 hover:bg-primary hover:text-white transition-all"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {!loading && teachers.length === 0 && (
                <div className="mt-10 p-20 bg-slate-50 dark:bg-slate-800/10 rounded-[3rem] border-4 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="size-24 rounded-[2.5rem] bg-white dark:bg-slate-800 flex items-center justify-center text-slate-200 shadow-xl shadow-primary/5">
                        <Search size={48} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-widest uppercase">No Teachers Found</h3>
                        <p className="text-slate-500 italic max-w-sm">We couldn't find any teachers matching your current search filters.</p>
                    </div>
                    <button
                        onClick={() => { setSearch(''); setSearchTerm(''); }}
                        className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        
      </>
    );
}


TeachersList.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
