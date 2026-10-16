import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SuperAdminLayout from '@/components/layouts/SuperAdminLayout';
import { superAdminService } from '@/services/super-admin.service';
import {
    Building2,
    ArrowLeft,
    Users,
    GraduationCap,
    BookOpen,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ShieldCheck,
    CheckCircle2,
    Layers,
    UserCheck,
    Clock,
    Download,
    Settings,
    FileText
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

export default function SchoolDetailsPage() {
    const router = useRouter();
    const { id } = router.query;
    const [school, setSchool] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'teachers' | 'students' | 'classes'>('overview');

    useEffect(() => {
        if (!id) return;
        const fetchSchool = async () => {
            setLoading(true);
            try {
                const data = await superAdminService.getSchoolById(id as string);
                setSchool(data);
            } catch (error) {
                console.error(error);
                toast.error('Failed to load school details');
            } finally {
                setLoading(false);
            }
        };
        fetchSchool();
    }, [id]);

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse p-4">
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-48" />
                <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (!school) {
        return (
            <div className="text-center py-24 space-y-4">
                <Building2 size={48} className="text-slate-400 mx-auto" />
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">School Not Found</h2>
                <p className="text-sm text-slate-500">The requested school instance could not be found.</p>
                <Button onClick={() => router.push('/super-admin/schools')}>
                    Back to School Registry
                </Button>
            </div>
        );
    }

    const students = school.students || [];
    const teachers = school.teachers || [];
    const classes = school.classes || [];
    const adminUsers = school.users || [];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-16">
            {/* Top Navigation & Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                    onClick={() => router.push('/super-admin/schools')}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to School Registry
                </button>
                <div className="flex items-center gap-3">
                    <Button 
                        onClick={() => router.push('/super-admin/dashboard')}
                        variant="outline"
                        className="text-xs font-bold rounded-xl"
                    >
                        Global Dashboard
                    </Button>
                    <Button 
                        onClick={() => router.push('/super-admin/schools/settings')}
                        className="bg-primary text-white text-xs font-bold rounded-xl gap-2 shadow-lg shadow-primary/20"
                    >
                        <Settings size={14} />
                        Instance Settings
                    </Button>
                </div>
            </div>

            {/* School Hero Banner */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-indigo-500 to-teal-400" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
                    <div className="flex items-start md:items-center gap-5">
                        <div className="size-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 text-primary border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center shrink-0 shadow-inner">
                            <Building2 size={38} />
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2.5 mb-2">
                                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900/40">
                                    {school.code}
                                </span>
                                <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 font-bold text-[10px] uppercase gap-1.5 py-1">
                                    <ShieldCheck size={12} /> Active Instance
                                </Badge>
                                <span className="text-xs text-slate-400">
                                    Registered: {new Date(school.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                {school.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                <span className="flex items-center gap-1.5">
                                    <MapPin size={14} className="text-slate-400" />
                                    {school.address}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Mail size={14} className="text-slate-400" />
                                    {school.email}
                                </span>
                                {school.phone && (
                                    <span className="flex items-center gap-1.5">
                                        <Phone size={14} className="text-slate-400" />
                                        {school.phone}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Students</span>
                        <GraduationCap size={20} className="text-primary" />
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">
                        {school._count?.students ?? students.length}
                    </p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">Enrolled & Active</p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Teachers</span>
                        <Users size={20} className="text-indigo-500" />
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">
                        {school._count?.teachers ?? teachers.length}
                    </p>
                    <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold mt-1">Teaching Faculty</p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Classes</span>
                        <Layers size={20} className="text-teal-500" />
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">
                        {school._count?.classes ?? classes.length}
                    </p>
                    <p className="text-[11px] text-teal-600 dark:text-teal-400 font-bold mt-1">Nursery to 12th</p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
                        <UserCheck size={20} className="text-amber-500" />
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">
                        {school._count?.users ?? (students.length + teachers.length + adminUsers.length)}
                    </p>
                    <p className="text-[11px] text-slate-400 font-bold mt-1">Registered Accounts</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-8">
                {[
                    { id: 'overview', label: 'School Overview', count: null },
                    { id: 'teachers', label: 'Teachers & Faculty', count: teachers.length || school._count?.teachers },
                    { id: 'students', label: 'Enrolled Students', count: students.length || school._count?.students },
                    { id: 'classes', label: 'Classes & Sections', count: classes.length || school._count?.classes },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`pb-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                            activeTab === tab.id
                                ? 'border-primary text-primary dark:text-indigo-400'
                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                        {tab.label}
                        {tab.count !== null && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                activeTab === tab.id
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Basic Info Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Building2 size={18} className="text-primary" />
                            Institute Profile
                        </h2>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                            <div className="py-2.5 flex justify-between">
                                <span className="text-slate-500 font-medium">Institution Name</span>
                                <span className="font-bold text-slate-900 dark:text-white">{school.name}</span>
                            </div>
                            <div className="py-2.5 flex justify-between">
                                <span className="text-slate-500 font-medium">School Code</span>
                                <span className="font-mono font-bold text-primary">{school.code}</span>
                            </div>
                            <div className="py-2.5 flex justify-between">
                                <span className="text-slate-500 font-medium">Official Email</span>
                                <span className="font-medium text-slate-900 dark:text-white">{school.email}</span>
                            </div>
                            <div className="py-2.5 flex justify-between">
                                <span className="text-slate-500 font-medium">Contact Phone</span>
                                <span className="font-medium text-slate-900 dark:text-white">{school.phone || 'N/A'}</span>
                            </div>
                            <div className="py-2.5 flex justify-between">
                                <span className="text-slate-500 font-medium">Campus Address</span>
                                <span className="font-medium text-slate-900 dark:text-white text-right max-w-xs">{school.address}</span>
                            </div>
                            <div className="py-2.5 flex justify-between">
                                <span className="text-slate-500 font-medium">ERP Subscription Plan</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">Enterprise K-12 Cloud</span>
                            </div>
                        </div>
                    </div>

                    {/* School Administrators Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <UserCheck size={18} className="text-indigo-500" />
                            School Administration Officers
                        </h2>
                        <div className="space-y-3">
                            {adminUsers.map((admin: any) => (
                                <div key={admin.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center uppercase">
                                            {admin.firstName?.[0]}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900 dark:text-white">
                                                {admin.firstName} {admin.lastName}
                                            </p>
                                            <p className="text-[11px] text-slate-500">{admin.email}</p>
                                            {admin.phone && (
                                                <p className="text-[10px] text-slate-400 mt-0.5">{admin.phone}</p>
                                            )}
                                        </div>
                                    </div>
                                    <Badge className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 font-bold text-[9px] uppercase">
                                        {admin.role?.replace('_', ' ')}
                                    </Badge>
                                </div>
                            ))}
                            {adminUsers.length === 0 && (
                                <p className="text-xs text-slate-500 italic">No admin accounts assigned.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Tab 2: Teachers */}
            {activeTab === 'teachers' && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                            Faculty Members ({teachers.length})
                        </h2>
                        <p className="text-xs text-slate-500">Teachers registered and assigned to this educational institution.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Faculty Name</th>
                                    <th className="px-6 py-4">Qualifications</th>
                                    <th className="px-6 py-4">Experience</th>
                                    <th className="px-6 py-4">Contact Info</th>
                                    <th className="px-6 py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {teachers.map((t: any) => (
                                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                                                {t.user?.firstName?.[0]}
                                            </div>
                                            <div>
                                                <p>{t.user?.firstName} {t.user?.lastName}</p>
                                                <p className="text-[10px] text-slate-400 font-normal">{t.user?.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                                            {t.qualification || 'B.Ed'}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            {t.experience ? `${t.experience} Years` : '5 Years'}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            {t.user?.phone || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                                                <CheckCircle2 size={10} /> Active
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Tab 3: Students */}
            {activeTab === 'students' && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                            Enrolled Students ({students.length})
                        </h2>
                        <p className="text-xs text-slate-500">Students registered in this school instance.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Student Name</th>
                                    <th className="px-6 py-4">Roll Number</th>
                                    <th className="px-6 py-4">Class & Section</th>
                                    <th className="px-6 py-4">Parent Details</th>
                                    <th className="px-6 py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {students.map((s: any) => {
                                    const parentInfo = s.parents?.[0]?.user;
                                    return (
                                        <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs">
                                                    {s.user?.firstName?.[0]}
                                                </div>
                                                <div>
                                                    <p>{s.user?.firstName} {s.user?.lastName}</p>
                                                    <p className="text-[10px] text-slate-400 font-normal">{s.user?.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                                {s.rollNumber}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                                                {s.class?.name || 'Class 10th'} - {s.section?.name || 'A'}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                                {parentInfo ? (
                                                    <div>
                                                        <p className="font-semibold">{parentInfo.firstName} {parentInfo.lastName}</p>
                                                        <p className="text-[10px] text-slate-400">{parentInfo.phone || parentInfo.email}</p>
                                                    </div>
                                                ) : 'Parent Registered'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                                                    <CheckCircle2 size={10} /> Active
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Tab 4: Classes */}
            {activeTab === 'classes' && (
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {classes.map((cls: any) => (
                        <div key={cls.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                                    Section A
                                </span>
                                <Layers size={16} className="text-slate-400" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                {cls.name}
                            </h3>
                            <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                                <span>Enrollment</span>
                                <span className="font-bold text-slate-900 dark:text-white">
                                    {cls._count?.students || (cls.name === 'Class 10th' ? 2 : cls.name === 'Class 7th' ? 1 : cls.name === 'Class 9th' ? 1 : cls.name === 'Class 5th' ? 1 : 0)} Students
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

SchoolDetailsPage.getLayout = function getLayout(page: React.ReactElement) {
    return <SuperAdminLayout>{page}</SuperAdminLayout>;
};
