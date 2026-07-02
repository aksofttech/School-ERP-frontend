import React from 'react';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import { classesService } from '@/services/classes.service';
import { teachersService } from '@/services/teachers.service';
import { Class, Teacher } from '@/utils/types';
import Skeleton from '@/components/ui/Skeleton';
import {
    Search,
    MoreVertical,
    Layers,
    ArrowRight,
    ShieldCheck,
    Briefcase,
    AlertCircle,
    UserCheck,
    ChevronRight,
    UserPlus
} from 'lucide-react';

export default function ClassTeachers() {
    const router = useRouter();
    const [classes, setClasses] = useState<Class[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [classesData, teachersData] = await Promise.all([
                    classesService.getAll(),
                    teachersService.getAll()
                ]);
                setClasses(classesData || []);
                setTeachers(teachersData.data || []);
                if (classesData && classesData.length > 0) {
                    setSelectedClassId(classesData[0].id);
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load school data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const selectedClass = classes.find(c => c.id === selectedClassId);
    const filteredTeachers = teachers.filter(t =>
        `${t.firstName} ${t.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (error) {
        return (
      <>
        
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Error</h2>
                    <p className="text-slate-500 max-w-sm italic">{error}</p>
                </div>
            
      </>
    );
    }

    return (
        <AdminLayout title="Assign Teachers">
            <Head>
                <title>Class Teachers - EduCore</title>
            </Head>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-primary mb-1">
                        <UserCheck size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Teacher Selection</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Class Teachers</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium italic">Assign class teachers to manage specific classes and students.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 h-[calc(100vh-280px)]">
                {/* Class Selection Sidebar */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] flex flex-col overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Class List</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                        {loading ? (
                            [1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 rounded-2xl" />)
                        ) : classes.map(cls => (
                            <button
                                key={cls.id}
                                onClick={() => setSelectedClassId(cls.id)}
                                className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all group ${selectedClassId === cls.id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 translate-x-1'
                                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <div className="flex flex-col items-start text-left">
                                    <span className={`text-[10px] font-black uppercase tracking-tight mb-1 ${selectedClassId === cls.id ? 'text-white/60' : 'text-slate-400'}`}>
                                        {cls.grade || 'General'}
                                    </span>
                                    <p className="text-sm font-bold truncate leading-none">{cls.name}</p>
                                </div>
                                <ChevronRight size={16} className={selectedClassId === cls.id ? 'text-white' : 'text-slate-300 group-hover:translate-x-1 transition-transform'} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Teachers Deployment Area */}
                <div className="lg:col-span-3 flex flex-col gap-8 h-full">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden shrink-0">
                        {/* Background Accent */}
                        <div className="absolute top-0 right-0 size-64 bg-primary/5 rounded-full blur-3xl" />

                        <div className="flex justify-between items-center relative z-10">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">
                                    {selectedClass?.name || 'Loading Classes...'}
                                </h2>
                                <p className="text-slate-500 text-sm font-medium italic">Class Teacher: <span className="text-primary font-bold not-italic">Sarah Jenkins</span></p>
                            </div>
                            <div className="relative group w-64">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={14} />
                                <input
                                    type="text"
                                    placeholder="Search teachers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl py-3 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                        {loading ? (
                            [1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-44 rounded-[2rem]" />)
                        ) : filteredTeachers.map(teacher => (
                            <div key={teacher.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group relative overflow-hidden flex flex-col">
                                {/* Deployment Status Indicator */}
                                <div className="absolute top-6 right-6">
                                    <div className="size-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all">
                                        <UserPlus size={18} />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="size-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 font-black text-xl overflow-hidden">
                                        {/* Avatar or Initials */}
                                        {teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900 dark:text-white leading-none mb-1 group-hover:text-primary transition-colors">
                                            {teacher.firstName} {teacher.lastName}
                                        </h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{teacher.designation || 'Teacher'}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <Briefcase size={14} className="text-slate-400" />
                                        <span className="text-[10px] font-bold uppercase tracking-tight">{teacher.department || 'General Department'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <ShieldCheck size={14} className="text-slate-400" />
                                        <span className="text-[10px] font-bold uppercase tracking-tight">Teacher ID: {teacher.employeeId}</span>
                                    </div>
                                </div>

                                <button className="mt-auto w-full py-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-primary hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2">
                                    Assign to Class
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}


ClassTeachers.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
