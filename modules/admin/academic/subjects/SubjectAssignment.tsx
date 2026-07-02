import React from 'react';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import { classesService } from '@/services/classes.service';
import { subjectsService } from '@/services/subjects.service';
import { teachersService } from '@/services/teachers.service';
import { Class, Subject, Teacher } from '@/utils/types';
import Skeleton from '@/components/ui/Skeleton';
import {
    Plus,
    Search,
    MoreVertical,
    BookOpen,
    UserCheck,
    Layers,
    ArrowRight,
    ShieldCheck,
    Briefcase,
    AlertCircle,
    Link,
    ChevronRight,
    Database,
    Users
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SubjectAssignment() {
    const router = useRouter();
    const [classes, setClasses] = useState<Class[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [subjectId, setSubjectId] = useState('');
    const [teacherId, setTeacherId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [classesData, subjectsData, teachersData] = await Promise.all([
                    classesService.getAll(),
                    subjectsService.getAll(),
                    teachersService.getAll()
                ]);
                setClasses(classesData || []);
                setSubjects(subjectsData || []);
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

    const handleAssign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClassId || !subjectId || !teacherId) {
            toast.error('Please fill in all fields before proceeding');
            return;
        }

        setAssigning(true);
        try {
            await subjectsService.assign({
                classId: selectedClassId,
                subjectId,
                teacherId
            });
            toast.success('Success: Subject assigned successfully.');
            setSubjectId('');
            setTeacherId('');
        } catch (err: any) {
            toast.error(err.message || 'Failed to assign subject');
        } finally {
            setAssigning(false);
        }
    };

    if (error) {
        return (
      <>
        
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                    <div className="p-4 rounded-full bg-rose-500/10 text-rose-500">
                        <AlertCircle size={48} />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Error</h2>
                    <p className="text-slate-500 max-w-sm italic">{error}</p>
                </div>
            
      </>
    );
    }

    return (
        <AdminLayout title="Subject Assignment">
            <Head>
                <title>Assign Subjects - EduCore</title>
            </Head>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-primary mb-1">
                        <Link size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Manage Subjects</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Assign Subjects</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium italic">Assign subjects to specific classes and assign teachers to those subjects.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Sector Registry Selection (Left) */}
                <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] flex flex-col overflow-hidden shadow-sm h-[calc(100vh-280px)]">
                    <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <div>
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Class List</h3>
                            <p className="text-lg font-black text-slate-900 dark:text-white leading-none">Select a Class</p>
                        </div>
                        <div className="size-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300">
                            <Layers size={18} />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-3 no-scrollbar">
                        {loading ? (
                            [1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-16 rounded-3xl" />)
                        ) : classes.map(cls => (
                            <button
                                key={cls.id}
                                onClick={() => setSelectedClassId(cls.id)}
                                className={`w-full p-5 rounded-[2rem] flex items-center justify-between transition-all group ${selectedClassId === cls.id
                                        ? 'bg-primary text-white shadow-2xl shadow-primary/30 translate-x-2'
                                        : 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <div className="flex flex-col items-start text-left">
                                    <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${selectedClassId === cls.id ? 'text-white/60' : 'text-slate-400'}`}>
                                        {cls.grade || 'Grade'}
                                    </span>
                                    <p className="text-sm font-bold truncate leading-none">{cls.name}</p>
                                </div>
                                <ChevronRight size={18} className={selectedClassId === cls.id ? 'text-white' : 'text-slate-300 group-hover:translate-x-1 transition-transform'} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Configuration Matrix (Right) */}
                <div className="lg:col-span-8 space-y-8">
                    <form onSubmit={handleAssign} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
                        {/* Background Accent */}
                        <div className="absolute top-0 right-0 size-80 bg-primary/5 rounded-full blur-[100px]" />

                        <div className="relative z-10 flex flex-col gap-10">
                            <div className="flex items-center gap-6">
                                <div className="size-16 rounded-[1.5rem] bg-primary/10 text-primary flex items-center justify-center">
                                    <Database size={32} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">Assign Subject</h2>
                                    <p className="text-slate-500 text-sm font-medium italic">Assign a teacher to a subject for the selected class.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <BookOpen size={12} />
                                        Select Subject
                                    </label>
                                    <select
                                        value={subjectId}
                                        onChange={(e) => setSubjectId(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl py-5 px-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/20 transition-all appearance-none"
                                    >
                                        <option value="" disabled>Choose Subject</option>
                                        {subjects.map(sub => (
                                            <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Users size={12} />
                                        Select Teacher
                                    </label>
                                    <select
                                        value={teacherId}
                                        onChange={(e) => setTeacherId(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl py-5 px-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/20 transition-all appearance-none"
                                    >
                                        <option value="" disabled>Choose Teacher</option>
                                        {teachers.map(teacher => (
                                            <option key={teacher.id} value={teacher.id}>{teacher.firstName} {teacher.lastName} ({teacher.employeeId})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 mt-4">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="px-10 py-5 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={assigning}
                                    className="px-10 py-5 bg-primary text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3"
                                >
                                    {assigning ? (
                                        <>
                                            <div className="size-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            Assigning...
                                        </>
                                    ) : (
                                        <>
                                            Confirm Assignment
                                            <ArrowRight size={16} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Active Deployment Summary */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800 p-10 flex flex-col items-center text-center space-y-6">
                        <div className="size-20 rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-300">
                            <UserCheck size={32} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Current Assignments</h4>
                            <p className="text-slate-500 text-sm font-medium italic">View and manage subjects and teachers already assigned to this class.</p>
                        </div>
                        <button className="px-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-primary hover:border-primary transition-all">
                            View Current Assignments
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}


SubjectAssignment.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
