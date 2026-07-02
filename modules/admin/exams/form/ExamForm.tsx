import React from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { Calendar as CalendarIcon, Target, Award, Layers } from 'lucide-react';
import Button from '@/components/ui/Button';
import { classesService } from '@/services/classes.service';
import { examsService } from '@/services/exams.service';
import { Exam, Class } from '@/utils/types';
import AdminLayout from '@/components/layouts/AdminLayout';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import { USER_ROLES } from '@/utils/role-config';
import Head from 'next/head';

const examSchema = z.object({
    name: z.string().min(3, 'Exam name must be at least 3 characters'),
    type: z.enum(['UNIT_TEST', 'MID_TERM', 'FINAL']),
    date: z.string().min(1, 'Date is required'),
    classId: z.string().min(1, 'Class is required'),
    totalMarks: z.number().min(1, 'Total marks must be at least 1'),
    passingMarks: z.number().min(1, 'Passing marks must be at least 1'),
});

type ExamFormData = z.infer<typeof examSchema>;

interface ExamFormProps {
    initialData?: Exam;
}

export default function ExamForm({ initialData }: ExamFormProps) {
    const router = useRouter();
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(false);
    const isEdit = !!initialData;

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<ExamFormData>({
        resolver: zodResolver(examSchema),
        defaultValues: initialData ? {
            name: initialData.name,
            type: initialData.type as any,
            date: new Date(initialData.date).toISOString().split('T')[0],
            classId: initialData.classId,
            totalMarks: (initialData as any).totalMarks || 100,
            passingMarks: (initialData as any).passingMarks || 33,
        } : {
            totalMarks: 100,
            passingMarks: 33,
        }
    });

    useEffect(() => {
        classesService.getAll().then(setClasses).catch(() => toast.error('Failed to load classes'));
    }, []);

    const onSubmit = async (data: ExamFormData) => {
        setLoading(true);
        try {
            if (isEdit) {
                await examsService.updateExam(initialData.id, data);
                toast.success('Examination cycle updated.');
            } else {
                await examsService.createExam(data);
                toast.success('New examination cycle initialized.');
            }
            router.push('/admin/exams');
        } catch (error: any) {
            toast.error(error.message || 'Failed to save examination protocol');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SCHOOL_ADMIN, USER_ROLES.SUPER_ADMIN]}>
                <>

                    <Head>
                        <title>{isEdit ? 'Update Exam' : 'New Exam'} | School ERP</title>
                    </Head>
                    <div className="py-8 animate-in fade-in duration-500">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Basic Info */}
                                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <Target size={20} />
                                        </div>
                                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Core Configuration</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Exam Protocol Name</label>
                                            <input
                                                {...register('name')}
                                                placeholder="e.g. Mid-Term - Mathematics"
                                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary transition-all shadow-sm"
                                            />
                                            {errors.name && <p className="text-[10px] text-rose-500 font-bold mt-2 ml-1 uppercase">{errors.name.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Assessment Type</label>
                                            <select
                                                {...register('type')}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary transition-all shadow-sm appearance-none"
                                            >
                                                <option value="UNIT_TEST">UNIT TEST</option>
                                                <option value="MID_TERM">MID TERM</option>
                                                <option value="FINAL">FINAL ASSESSMENT</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Target Class Cohort</label>
                                            <select
                                                {...register('classId')}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary transition-all shadow-sm appearance-none"
                                            >
                                                <option value="">Select Class...</option>
                                                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                            {errors.classId && <p className="text-[10px] text-rose-500 font-bold mt-2 ml-1 uppercase">{errors.classId.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Performance Metrics */}
                                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                            <Award size={20} />
                                        </div>
                                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Benchmarking</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Execution Date</label>
                                            <div className="relative">
                                                <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    type="date"
                                                    {...register('date')}
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary transition-all shadow-sm"
                                                />
                                            </div>
                                            {errors.date && <p className="text-[10px] text-rose-500 font-bold mt-2 ml-1 uppercase">{errors.date.message}</p>}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Max Marks</label>
                                                <input
                                                    type="number"
                                                    {...register('totalMarks', { valueAsNumber: true })}
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary transition-all shadow-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Passing Floor</label>
                                                <input
                                                    type="number"
                                                    {...register('passingMarks', { valueAsNumber: true })}
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary transition-all shadow-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    className="rounded-2xl px-8 py-6 h-auto font-black text-xs uppercase tracking-widest"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    loading={loading}
                                    className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-12 py-6 h-auto font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20"
                                >
                                    {isEdit ? 'Update Protocol' : 'Initialize Protocol'}
                                </Button>
                            </div>
                        </form>
                    </div>
                
</>
            </RoleGuard>
        </AuthGuard>
    );
}


ExamForm.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
