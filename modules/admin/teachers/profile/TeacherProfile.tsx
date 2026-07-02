import React from 'react';
import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useTeacher } from '@/hooks/useTeacher';
import Skeleton from '@/components/ui/Skeleton';
import {
    Fingerprint,
    Briefcase,
    GraduationCap,
    FileText,
    Printer,
    Edit3,
    Mail,
    Phone,
    Calendar,
    MapPin,
    AlertCircle,
    Activity,
    Award,
    Clock,
    ShieldCheck,
    BookOpen
} from 'lucide-react';

const tabs = [
    { id: 'identity', label: 'Identity Matrix', icon: Fingerprint },
    { id: 'professional', label: 'Faculty Protocol', icon: Briefcase },
    { id: 'academic', label: 'Academic Clearance', icon: GraduationCap },
    { id: 'archives', label: 'System Archives', icon: FileText },
];

export default function TeacherProfile() {
    const router = useRouter();
    const { id } = router.query;
    const { teacher, loading, error, refetch } = useTeacher(id);
    const [activeTab, setActiveTab] = useState('identity');

    if (loading) {
        return (
      <>
        
                <div className="space-y-8 animate-pulse">
                    <div className="flex flex-col md:flex-row gap-8">
                        <Skeleton className="size-48 rounded-[2.5rem]" />
                        <div className="flex-1 space-y-4 pt-4">
                            <Skeleton className="h-10 w-64 rounded-xl" />
                            <Skeleton className="h-6 w-48 rounded-lg" />
                            <div className="flex gap-2">
                                <Skeleton className="h-8 w-24 rounded-full" />
                                <Skeleton className="h-8 w-24 rounded-full" />
                            </div>
                        </div>
                    </div>
                    <Skeleton className="h-16 w-full rounded-2xl" />
                    <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
                </div>
            
      </>
    );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                <div className="p-4 rounded-full bg-rose-500/10 text-rose-500">
                    <AlertCircle size={48} />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Protocol Failure</h2>
                <p className="text-slate-500 max-w-sm italic">{error}</p>
                <button onClick={() => refetch()} className="px-6 py-2 bg-primary text-white rounded-xl font-bold uppercase text-[10px] tracking-widest">Retry Synchronization</button>
            </div>
        );
    }

    const name = `${teacher?.firstName} ${teacher?.lastName}`;

    return (
        <>
            <Head>
                <title>Faculty Profile - {name} - EduCore</title>
            </Head>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-primary mb-1">
                        <ShieldCheck size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Faculty Record</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Faculty Profile</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium italic">Comprehensive institutional data overview for faculty entity {teacher?.employeeId}.</p>
                </div>
                <div className="flex gap-4">
                    <button className="h-14 w-14 rounded-2xl bg-white dark:bg-slate-900 text-slate-500 hover:text-primary transition-all active:scale-95 flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-sm">
                        <Printer size={20} />
                    </button>
                    <button
                        onClick={() => router.push(`/admin/teachers/edit/${teacher?.id}`)}
                        className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Edit3 size={18} />
                        Modify Protocol
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Left Column: Faculty Identity Card */}
                <div className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-10 flex flex-col items-center text-center shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/5 to-indigo-500/5"></div>

                        <div className="relative mb-6">
                            <div className="size-32 rounded-[2.5rem] border-4 border-white dark:border-slate-900 overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-2xl relative z-10 font-black text-4xl flex items-center justify-center text-slate-300">
                                {teacher?.firstName?.charAt(0)}{teacher?.lastName?.charAt(0)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 size-8 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-2xl z-20 shadow-lg" />
                        </div>

                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1 leading-tight">{name}</h2>
                        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-6">{teacher?.employeeId}</p>

                        <div className="flex flex-wrap justify-center gap-2 mb-8">
                            <span className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-wider">{teacher?.department || 'Unassigned'}</span>
                            <span className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-wider border border-emerald-500/20">{teacher?.status}</span>
                        </div>

                        <div className="w-full grid grid-cols-2 gap-4 pt-8 border-t border-slate-100 dark:border-slate-800">
                            <div className="text-left">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contract Status</p>
                                <div className="flex items-center gap-2 text-emerald-500">
                                    <Activity size={12} className="animate-pulse" />
                                    <span className="text-xs font-black uppercase">Verified</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Clearance</p>
                                <div className="flex items-center justify-end gap-1 text-slate-900 dark:text-white">
                                    <ShieldCheck size={12} className="text-amber-500" />
                                    <span className="text-sm font-black text-slate-900 dark:text-white">Level 4</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Tabbed Content */}
                <div className="lg:col-span-8 xl:col-span-9 space-y-10">
                    {/* Tabs Container */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-2 shadow-sm overflow-x-auto no-scrollbar">
                        <div className="flex gap-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] whitespace-nowrap transition-all ${isActive
                                            ? 'bg-primary text-white shadow-xl shadow-primary/20 translate-y-[-2px]'
                                            : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                            }`}
                                    >
                                        <Icon size={16} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="page-transition min-h-[500px]">
                        {activeTab === 'identity' && (
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 lg:p-12 shadow-sm space-y-12 animate-in fade-in slide-in-from-right-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                        <Fingerprint size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Identity Matrix</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Foundational Entity Parameters</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
                                    <Metric icon={Mail} label="Digital Endpoint" value={teacher?.email || 'N/A'} isPrimary />
                                    <Metric icon={Phone} label="Signal Frequency" value={teacher?.phone || 'N/A'} />
                                    <Metric icon={Clock} label="Registry Status" value={teacher?.status || 'N/A'} />
                                    <Metric icon={Calendar} label="Temporal Origin" value={teacher?.dateOfJoining ? new Date(teacher.dateOfJoining).toLocaleDateString() : 'N/A'} />
                                    <Metric icon={MapPin} label="Deployment Coordinates" value={teacher?.address || 'N/A'} className="md:col-span-2" />
                                </div>
                            </div>
                        )}

                        {activeTab === 'professional' && (
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 lg:p-12 shadow-sm space-y-12 animate-in fade-in slide-in-from-right-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
                                        <Briefcase size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Faculty Protocol</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Institutional Deployment Matrix</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 space-y-6">
                                        <div className="flex items-center gap-2">
                                            <div className="size-8 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center text-primary shadow-sm">
                                                <Briefcase size={16} />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sector Assignment</span>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-2xl font-black text-slate-900 dark:text-white">{teacher?.department || 'Unassigned'}</p>
                                            <p className="text-xs font-bold text-slate-400 italic">{teacher?.designation || 'Faculty Member'}</p>
                                        </div>
                                    </div>

                                    <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 space-y-6">
                                        <div className="flex items-center gap-2">
                                            <div className="size-8 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center text-indigo-500 shadow-sm">
                                                <BookOpen size={16} />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Specializations</span>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-2xl font-black text-slate-900 dark:text-white">{teacher?.specialization || 'General Pedagogy'}</p>
                                            <p className="text-xs font-bold text-slate-400 italic">Verified expertise fields.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'academic' && (
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 lg:p-12 shadow-sm space-y-12 animate-in fade-in slide-in-from-right-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                                        <GraduationCap size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Academic Clearance</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Verified Educational Credentials</p>
                                    </div>
                                </div>

                                <div className="p-10 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                                    <Metric icon={GraduationCap} label="Highest Authorized Credential" value={teacher?.qualification || 'Pending Verification'} isPrimary />
                                </div>
                            </div>
                        )}

                        {activeTab === 'archives' && (
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 lg:p-12 shadow-sm flex flex-col items-center justify-center min-h-[400px] text-center space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="size-24 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-200 shadow-xl shadow-primary/5">
                                    <FileText size={48} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-widest uppercase">System Archives Restricted</h3>
                                    <p className="text-slate-500 italic max-w-sm">Institutional documents and archived dossiers for this entity are currently locked. Upgrade to Level 5 clearance for access.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

function Metric({ icon: Icon, label, value, isPrimary, className = "" }: any) {
    return (
        <div className={`space-y-3 ${className}`}>
            <div className="flex items-center gap-2">
                <Icon size={14} className="text-slate-400" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
            </div>
            <p className={`text-sm font-black break-all ${isPrimary ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{value}</p>
        </div>
    );
}


TeacherProfile.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
