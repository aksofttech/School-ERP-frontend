import React from 'react';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useTeacher } from '@/hooks/useTeacher';
import { teachersService } from '@/services/teachers.service';
import { teacherSchema, TeacherSchema } from '@/utils/validation';
import Skeleton from '@/components/ui/Skeleton';
import {
    User,
    Briefcase,
    Save,
    ArrowLeft,
    ShieldCheck,
    AlertCircle,
    FileText,
    Mail,
    Phone,
    Calendar,
    MapPin,
    GraduationCap
} from 'lucide-react';

const tabs = [
    { id: 'personal', label: 'Personal Matrix', icon: User },
    { id: 'professional', label: 'Professional Protocol', icon: Briefcase },
    { id: 'credentials', label: 'Credentials & Archives', icon: FileText },
];

export default function EditTeacher() {
    const router = useRouter();
    const { id } = router.query;
    const { teacher, loading, error, refetch } = useTeacher(id);
    const [activeTab, setActiveTab] = useState('personal');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TeacherSchema>({
        resolver: zodResolver(teacherSchema),
    });

    useEffect(() => {
        if (teacher) {
            reset({
                firstName: teacher.firstName,
                lastName: teacher.lastName,
                email: teacher.email,
                phone: teacher.phone || '',
                department: teacher.department || '',
                designation: teacher.designation || '',
                joiningDate: teacher.dateOfJoining ? new Date(teacher.dateOfJoining).toISOString().split('T')[0] : '',
                qualification: teacher.qualification || '',
                address: teacher.address || '',
                gender: teacher.gender || 'OTHER' as any,
            });
        }
    }, [teacher, reset]);

    const onSubmit = async (data: TeacherSchema) => {
        if (!id || typeof id !== 'string') return;
        setIsSubmitting(true);
        setStatus(null);
        try {
            await teachersService.update(id, data);
            setStatus({ type: 'success', message: 'Faculty record successfully synchronized with the central repository.' });
            refetch();
            setTimeout(() => setStatus(null), 5000);
        } catch (err: any) {
            setStatus({ type: 'error', message: err.message || 'Synchronization sequence failed. Please check network protocols.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
      <>
        
                <div className="space-y-8 animate-pulse">
                    <Skeleton className="h-10 w-64 rounded-xl" />
                    <div className="flex gap-4">
                        <Skeleton className="h-12 w-48 rounded-2xl" />
                        <Skeleton className="h-12 w-48 rounded-2xl" />
                    </div>
                    <Skeleton className="h-[500px] w-full rounded-[2.5rem]" />
                </div>
            
      </>
    );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                <AlertCircle size={48} className="text-rose-500" />
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Protocol Header Failure</h2>
                <p className="text-slate-500 max-w-sm italic">{error}</p>
                <button onClick={() => router.back()} className="px-6 py-2 bg-primary text-white rounded-xl font-bold">Return to Directory</button>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Edit Faculty - {teacher?.firstName} - EduCore</title>
            </Head>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="flex flex-col gap-1">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-4 group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Return to Directory</span>
                    </button>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Edit Faculty Record</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium italic">Modifying parameters for verified teacher entity {teacher?.employeeId}.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        form="edit-teacher-form"
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? <Save className="animate-spin" size={18} /> : <Save size={18} />}
                        Synchronize Data
                    </button>
                </div>
            </div>

            {status && (
                <div className={`p-6 rounded-[2rem] border flex items-center gap-4 mb-10 animate-in fade-in slide-in-from-top-4 ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                    }`}>
                    {status.type === 'success' ? <ShieldCheck size={24} /> : <AlertCircle size={24} />}
                    <p className="text-sm font-bold tracking-tight">{status.message}</p>
                </div>
            )}

            {/* Main Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-3 space-y-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-4 px-6 py-5 rounded-[1.5rem] transition-all relative overflow-hidden group ${isActive
                                        ? 'bg-primary text-white shadow-xl shadow-primary/20 translate-x-2'
                                        : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:border-primary/30'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'animate-pulse' : 'group-hover:text-primary transition-colors'} />
                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">{tab.label}</span>
                                {isActive && <div className="absolute right-0 top-0 h-full w-1.5 bg-white/20" />}
                            </button>
                        );
                    })}
                </div>

                {/* Form Area */}
                <div className="lg:col-span-9">
                    <form id="edit-teacher-form" onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                        {activeTab === 'personal' && (
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 lg:p-12 shadow-sm space-y-10 animate-in fade-in slide-in-from-right-4">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Personal Matrix</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Foundational Entity Identity</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <FormField label="First Identifier" icon={User} error={errors.firstName?.message}>
                                        <input {...register('firstName')} className="form-input" placeholder="Sarah" />
                                    </FormField>
                                    <FormField label="Last Identifier" icon={User} error={errors.lastName?.message}>
                                        <input {...register('lastName')} className="form-input" placeholder="Davis" />
                                    </FormField>
                                    <FormField label="Digital Endpoint" icon={Mail} error={errors.email?.message}>
                                        <input {...register('email')} className="form-input" placeholder="davis@educore.edu" />
                                    </FormField>
                                    <FormField label="Signal Frequency" icon={Phone} error={errors.phone?.message}>
                                        <input {...register('phone')} className="form-input" placeholder="+1 (555) 000-0000" />
                                    </FormField>
                                    <FormField label="Gender Axis" icon={ShieldCheck} className="md:col-span-1">
                                        <select {...register('gender')} className="form-input">
                                            <option value="MALE">Male Vector</option>
                                            <option value="FEMALE">Female Vector</option>
                                            <option value="OTHER">Alternative Axis</option>
                                        </select>
                                    </FormField>
                                    <FormField label="Deployment Coordinates" icon={MapPin} className="md:col-span-2">
                                        <textarea {...register('address')} rows={3} className="form-input py-4 resize-none" placeholder="Primary residence address..." />
                                    </FormField>
                                </div>
                            </div>
                        )}

                        {activeTab === 'professional' && (
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 lg:p-12 shadow-sm space-y-10 animate-in fade-in slide-in-from-right-4">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
                                        <Briefcase size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Professional Protocol</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Institutional Deployment Parameters</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    <FormField label="Registry ID" icon={ShieldCheck} className="opacity-60 grayscale pointer-events-none">
                                        <input value={teacher?.employeeId} readOnly className="form-input bg-slate-50 dark:bg-slate-800" />
                                    </FormField>
                                    <FormField label="Departmental Matrix" icon={Briefcase} error={errors.department?.message}>
                                        <select {...register('department')} className="form-input">
                                            <option value="">Select Sector</option>
                                            <option value="Mathematics">Mathematics</option>
                                            <option value="Science">Science</option>
                                            <option value="Languages">Languages</option>
                                            <option value="Arts">Humanities & Arts</option>
                                        </select>
                                    </FormField>
                                    <FormField label="Current Designation" icon={ShieldCheck} error={errors.designation?.message}>
                                        <input {...register('designation')} className="form-input" placeholder="Senior Faculty" />
                                    </FormField>
                                    <FormField label="Protocol Initialized" icon={Calendar} error={errors.joiningDate?.message}>
                                        <input {...register('joiningDate')} type="date" className="form-input" />
                                    </FormField>
                                    <FormField label="Academic Clearance" icon={GraduationCap} error={errors.qualification?.message} className="md:col-span-2">
                                        <input {...register('qualification')} className="form-input" placeholder="M.Ed, B.Sc in Advanced Pedagogy" />
                                    </FormField>
                                </div>
                            </div>
                        )}

                        {activeTab === 'credentials' && (
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 lg:p-12 shadow-sm flex flex-col items-center justify-center min-h-[400px] text-center space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="size-24 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-200 shadow-xl">
                                    <FileText size={48} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-widest uppercase">Vault Restricted</h3>
                                    <p className="text-slate-500 italic max-w-sm">Extended credential archives and secure documentation for this entity are currently being migrated to the secondary security cluster.</p>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            <style jsx>{`
        .form-input {
          @apply w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all;
        }
      `}</style>
        </>
    );
}

function FormField({ label, icon: Icon, children, error, className = "" }: any) {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <div className="flex items-center gap-2 ml-2">
                <Icon size={14} className="text-slate-400" />
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
            </div>
            {children}
            {error && (
                <p className="text-[10px] font-bold text-rose-500 italic ml-2 mt-1 flex items-center gap-1">
                    <AlertCircle size={10} />
                    {error}
                </p>
            )}
        </div>
    );
}


EditTeacher.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
