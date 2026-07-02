import React from 'react';
import { useState, useEffect } from 'react';
import Head from 'next/head';
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
    Target,
    Zap,
    History
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useClasses } from '@/hooks/useClasses';
import { classesService } from '@/services/classes.service';
import AdminLayout from '@/components/layouts/AdminLayout';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';
import { toast } from 'react-hot-toast';

const classSchema = z.object({
    name: z.string().min(1, 'Class name is required'),
    numericName: z.number().min(1, 'Class number is required'),
});

type ClassFormValues = z.infer<typeof classSchema>;

export default function ClassesList() {
    const { classes, loading, refetch } = useClasses();
    const [activeTab, setActiveTab] = useState<'matrix' | 'create'>('matrix');
    const [registering, setRegistering] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { register, handleSubmit, reset } = useForm<ClassFormValues>({
        resolver: zodResolver(classSchema),
    });

    const onRegister = async (data: ClassFormValues) => {
        setRegistering(true);
        try {
            await classesService.create(data);
            toast.success('Success: New class added.');
            reset();
            setActiveTab('matrix');
            refetch();
        } catch (error: any) {
            toast.error(error.message || 'Failed to register class');
        } finally {
            setRegistering(false);
        }
    };

    const filteredClasses = classes.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.numericName && c.numericName.toString().includes(searchTerm))
    );

    return (
      <>
        
            <Head>
                <title>Classes List - EduCore</title>
            </Head>

            <div className="flex-1 flex flex-col gap-10 animate-in fade-in duration-700 pb-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-primary mb-1">
                            <LayoutGrid size={18} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">School Structure</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase tracking-tighter">Classes List</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium italic">
                            Manage classes, sections, and student information.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-[1.5rem] hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
                            <History size={20} />
                        </button>
                        <button 
                            onClick={() => setActiveTab('create')}
                            className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-primary/30 hover:-translate-y-1 active:scale-95"
                        >
                            <Plus size={18} />
                            <span>Add New Class</span>
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Classes', value: `${classes.length || 0}`, icon: Layers, color: 'text-primary', bg: 'bg-primary/5', trend: 'In School' },
                        { label: 'Total Enrolment', value: '1,840', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/5', trend: '+4% Growth' },
                        { label: 'Curriculum', value: 'National', icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-500/5', trend: 'Verified' },
                        { label: 'Status', value: 'Prime', icon: Activity, color: 'text-amber-500', bg: 'bg-amber-500/5', trend: 'Active' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden relative group hover:border-primary/50 transition-all">
                            <div className="absolute top-0 right-0 size-24 bg-slate-50 dark:bg-slate-800 rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-all duration-700" />
                            <div className="relative z-10 flex flex-col gap-6">
                                <div className={`size-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">{stat.value}</h3>
                                    <div className="flex items-center gap-1">
                                        <div className="size-1 rounded-full bg-primary" />
                                        <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none italic">{stat.trend}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden min-h-[600px]">
                    {/* Toolbar */}
                    <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row gap-8 justify-between items-center bg-slate-50/30 dark:bg-slate-900/30">
                        <div className="flex items-center gap-12 overflow-x-auto no-scrollbar w-full sm:w-auto">
                            {['All Classes', 'Sections', 'Previous Years'].map((tab) => (
                                <button key={tab} className={`relative py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${tab === 'All Classes' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}>
                                    {tab}
                                    {tab === 'All Classes' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full transition-all duration-500" />}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-4 w-full sm:w-auto">
                            <div className="relative group w-full sm:w-72">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <input 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white dark:bg-slate-800 border-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-primary text-xs font-bold text-slate-900 dark:text-white outline-none transition-all shadow-sm" 
                                    placeholder="Search for a class..." 
                                />
                            </div>
                            <button className="h-14 px-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-sm">
                                <Filter size={16} className="text-primary" />
                                <span className="hidden sm:inline">Advanced Search</span>
                            </button>
                        </div>
                    </div>

                    {/* View Port */}
                    <div className="p-10 flex-1 relative min-h-[500px]">
                        {activeTab === 'create' ? (
                            <div className="max-w-xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700 py-12">
                                <div className="flex items-center gap-6 mb-10">
                                    <div className="size-16 rounded-[1.5rem] bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/20">
                                        <Plus size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Add New Class</h2>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Class Information</p>
                                    </div>
                                </div>
                                <form onSubmit={handleSubmit(onRegister, (errors) => {
                                    console.error('Form validation errors:', errors);
                                    toast.error('Please correctly fill all form fields.', { icon: '⚠️' });
                                })} className="space-y-10">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Class Name</label>
                                        <input
                                            {...register('name')}
                                            placeholder="e.g. Science Stream Alpha..."
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-5 px-8 text-sm font-bold text-slate-900 dark:text-white ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Class Number (Order)</label>
                                        <input
                                            type="number"
                                            {...register('numericName', { valueAsNumber: true })}
                                            placeholder="10"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-5 px-8 text-sm font-bold text-slate-900 dark:text-white ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                                        />
                                    </div>
                                    <div className="flex gap-4 pt-10">
                                        <button 
                                            type="button"
                                            onClick={() => setActiveTab('matrix')}
                                            className="flex-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-50 active:scale-95 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit"
                                            disabled={registering}
                                            className="flex-[2] bg-primary text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/30 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3"
                                        >
                                            {registering ? <Activity size={18} className="animate-spin" /> : <Zap size={18} />}
                                            Create Class
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {loading ? (
                                    Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-[2.5rem]" />)
                                ) : filteredClasses.map((item) => (
                                    <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-xl transition-all hover:border-primary hover:-translate-y-2 group overflow-hidden relative">
                                        <div className="absolute top-0 right-0 size-20 bg-slate-50 dark:bg-slate-800 rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-all duration-700" />
                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-10">
                                                <div className="size-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform">
                                                    <Building size={24} />
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button className="size-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary transition-all">
                                                            <MoreVertical size={20} />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl">
                                                        <DropdownMenuItem className="p-3 rounded-xl cursor-pointer flex items-center gap-3">
                                                            <UserCheck size={16} className="text-primary" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Assign Teacher</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="p-3 rounded-xl cursor-pointer flex items-center gap-3">
                                                            <BookOpen size={16} className="text-primary" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Subjects & Books</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Class {item.numericName}</p>
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter truncate">{item.name}</h3>
                                            </div>
                                            <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center gap-4">
                                                <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                                    <Users size={12} className="text-primary" />
                                                    <span>120 Students</span>
                                                </div>
                                                <div className="ml-auto flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                                    <span className="text-[8px] font-black uppercase text-primary tracking-widest leading-none italic">View Details</span>
                                                    <ChevronRight size={14} className="text-primary" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer Stats */}
                    <div className="p-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between mt-auto bg-slate-50/20 dark:bg-slate-900/20">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                            Total <span className="text-slate-900 dark:text-white">{filteredClasses.length} Classes</span> in current term
                        </p>
                        <div className="flex gap-3">
                            <button className="h-10 px-6 rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm">
                                Download List
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        
      </>
    );
}


ClassesList.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
