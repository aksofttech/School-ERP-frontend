import React from 'react';
import { useState } from 'react';
import {
    FileText,
    Plus,
    Search,
    MoreVertical,
    Calendar,
    Target,
    Users,
    Clock,
    ExternalLink,
    Edit2,
    Trash2,
    CheckCircle2
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

export default function ExamList() {
    const { user } = useAuth();
    const rolePath = user?.role === 'TEACHER' ? 'teacher' : 'admin';
    const [searchTerm, setSearchTerm] = useState('');
    const { exams, loading, pagination, params, setParams, deleteExam } = useExams({
        page: 1,
        limit: 10,
        status: 'ACTIVE'
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setParams({ ...params, search: searchTerm, page: 1 });
    };

    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
                <>

                    <Head>
                        <title>Exams | School ERP</title>
                    </Head>
                    <div className="space-y-8 animate-in fade-in duration-500 pt-8 pb-12">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-1">Exams</h1>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic text-primary">Schedule and manage school exams</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link href={`/${rolePath}/exams/create`}>
                                    <Button className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20">
                                        <Plus size={18} />
                                        New Exam
                                    </Button>
                                </Link>
                            </div>
                        </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50 dark:bg-slate-900/50">
                    <form onSubmit={handleSearch} className="relative group max-w-md w-full">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search exam by name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary transition-all shadow-sm"
                        />
                    </form>

                        <div className="flex items-center gap-4">
                            <Badge variant="outline" className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2">
                                Active: {exams.length}
                            </Badge>
                        </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Exam Name</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Exam Date</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Marks</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-6 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-8 py-8"><Skeleton className="h-4 w-48 rounded-lg" /></td>
                                        <td className="px-8 py-8"><Skeleton className="h-4 w-32 rounded-lg" /></td>
                                        <td className="px-8 py-8"><Skeleton className="h-4 w-20 rounded-lg" /></td>
                                        <td className="px-8 py-8"><Skeleton className="h-4 w-24 rounded-lg" /></td>
                                        <td className="px-8 py-8 text-right"><Skeleton className="size-8 ml-auto rounded-lg" /></td>
                                    </tr>
                                ))
                            ) : exams.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="size-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                                                <FileText size={32} />
                                            </div>
                                            <div>
                                                <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">No Exams Found</p>
                                                <p className="text-sm font-medium text-slate-500 italic">Schedule a new exam to begin.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                exams.map((exam) => (
                                    <tr key={exam.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                    <Target size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">{exam.name}</p>
                                                    <p className="text-[10px] font-medium text-slate-500 italic font-mono uppercase">EX-ID: {exam.id.substring(0, 8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <Calendar size={12} className="text-primary" />
                                                    {new Date(exam.date).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic opacity-60">
                                                    <Clock size={12} className="text-indigo-500" />
                                                    Exam Phase
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Total: {exam.totalMarks}</p>
                                                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest italic">Pass: {exam.passingMarks}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <Badge variant="outline" className="border-emerald-500/20 text-emerald-500 bg-emerald-500/5 font-black text-[9px] uppercase tracking-widest rounded-lg">
                                                ACTIVE
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-8 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="secondary" size="sm" className="size-10 rounded-xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all">
                                                        <MoreVertical size={18} className="text-slate-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/${rolePath}/exams/edit/${exam.id}`} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
                                                            <Edit2 size={16} className="text-primary" />
                                                            <span className="text-xs font-black uppercase tracking-widest">Edit Exam</span>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/${rolePath}/exams/marks/${exam.id}`} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
                                                            <CheckCircle2 size={16} className="text-emerald-500" />
                                                            <span className="text-xs font-black uppercase tracking-widest">Enter Marks</span>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/${rolePath}/exams/results/${exam.id}`} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
                                                            <Target size={16} className="text-indigo-500" />
                                                            <span className="text-xs font-black uppercase tracking-widest">View Results</span>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="my-2" />
                                                    <DropdownMenuItem
                                                        onClick={() => deleteExam(exam.id)}
                                                        className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-rose-500 focus:text-rose-600 focus:bg-rose-50"
                                                    >
                                                        <Trash2 size={16} />
                                                        <span className="text-xs font-black uppercase tracking-widest">Delete Exam</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
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
