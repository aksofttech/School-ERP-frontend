import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AdminLayout from '@/components/layouts/AdminLayout';
import { subjectsService } from '@/services/subjects.service';
import { subjectSchema, SubjectSchema } from '@/utils/validation';
import {
    Plus,
    ArrowLeft,
    BookOpen,
    Database,
    ShieldCheck,
    AlertCircle,
    Save,
    Trash2,
    Hash,
    Info
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AddSubject() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SubjectSchema>({
        resolver: zodResolver(subjectSchema),
        defaultValues: {
            credits: 0
        }
    });

    const onSubmit = async (data: SubjectSchema) => {
        try {
            await subjectsService.create(data);
            toast.success('Curriculum entity successfully registered');
            router.push('/admin/subjects');
        } catch (err: any) {
            toast.error(err.message || 'Institutional registration failure');
        }
    };

    return (
      <>
        
            <Head>
                <title>Initialize Subject - EduCore</title>
            </Head>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-primary mb-1 text-[10px] font-black uppercase tracking-[0.2em]">
                        <Plus size={14} />
                        Institutional Expansion
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Initialize Subject</h1>
                    <p className="text-slate-500 font-medium italic">Register a new curriculum entity into the institutional repository.</p>
                </div>
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                >
                    <ArrowLeft size={18} />
                    Repository Home
                </button>
            </div>

            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Core Configuration */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 size-64 bg-primary/5 rounded-full blur-[80px]" />
                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                    <BookOpen size={24} />
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Entity Definition</h3>
                                    <p className="text-xl font-black text-slate-900 dark:text-white leading-none">Curriculum Profile</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Subject Nomenclature</label>
                                    <div className="relative group">
                                        <BookOpen size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                                        <input
                                            {...register('name')}
                                            placeholder="e.g. Advanced Meta-Physics"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl py-5 pl-16 pr-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                    {errors.name && <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest pl-4">{errors.name.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Academic Code</label>
                                    <div className="relative group">
                                        <Hash size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                                        <input
                                            {...register('code')}
                                            placeholder="e.g. PHYS-402"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl py-5 pl-16 pr-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/20 transition-all uppercase font-mono"
                                        />
                                    </div>
                                    {errors.code && <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest pl-4">{errors.code.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Credit weighting</label>
                                    <div className="relative group">
                                        <Database size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="number"
                                            {...register('credits', { valueAsNumber: true })}
                                            placeholder="4.0"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl py-5 pl-16 pr-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                    {errors.credits && <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest pl-4">{errors.credits.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Institutional Description</label>
                                <div className="relative group">
                                    <Info size={18} className="absolute left-6 top-6 text-slate-300 group-focus-within:text-primary transition-colors" />
                                    <textarea
                                        {...register('description')}
                                        placeholder="Comprehensive overview of learning objectives and curriculum scope..."
                                        rows={4}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-[2rem] py-5 pl-16 pr-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/20 transition-all resize-none italic"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Protocols */}
                    <div className="flex items-center justify-between p-10 bg-slate-900 dark:bg-primary/10 rounded-[3rem] shadow-2xl shadow-primary/20 border border-primary/20 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 size-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <h3 className="text-white text-xl font-black uppercase tracking-[0.2em] mb-1">Finalize Deployment</h3>
                            <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Commit subject entity to institutional database</p>
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="relative z-10 px-12 py-5 bg-white text-slate-900 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3 shadow-xl"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="size-4 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Commit Matrix
                                    <Save size={16} />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        
      </>
    );
}


AddSubject.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
