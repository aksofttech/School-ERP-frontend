import React from 'react';
import { useState, useEffect } from 'react';
import {
    UserCheck,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Activity,
    Calendar,
    Layers,
    ShieldCheck,
    ChevronRight,
    Zap,
    Users,
    Clock,
    ArrowRight,
    CheckCircle2,
    XCircle,
    AlertCircle,
    LayoutDashboard
} from 'lucide-react';
import { attendanceService } from '@/services/attendance.service';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import AdminLayout from '@/components/layouts/AdminLayout';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import { USER_ROLES } from '@/utils/role-config';
import Head from 'next/head';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';
import { toast } from 'react-hot-toast';

export default function StaffAttendance() {
    const [attendance, setAttendance] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date().toISOString().substring(0, 10));

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const data = await attendanceService.getTeacherAttendance({ date });
            const registry = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
            setAttendance(registry);
        } catch (error: any) {
            toast.error(error.message || 'Failed to load attendance');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [date]);

    const onMark = async (staffId: string, status: string) => {
        try {
            await attendanceService.markTeacherAttendance({ teacherId: staffId, status, date });
            toast.success('Attendance marked successfully.');
            fetchAttendance();
        } catch (error: any) {
            toast.error(error.message || 'Failed to mark attendance');
        }
    };

    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SCHOOL_ADMIN, USER_ROLES.SUPER_ADMIN]}>
                <>

                    <Head>
                        <title>Staff Attendance | School ERP</title>
                    </Head>
                    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Attendance</h1>
                                <p className="text-sm font-medium text-slate-500 italic">Mark daily attendance for all employees.</p>
                            </div>
                <div className="flex items-center gap-3">
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                    />
                    <Button
                        className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20"
                    >
                        <Activity size={18} />
                        <span>Mark All</span>
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div className="relative group max-w-md w-full">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search name or ID..."
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-100 dark:ring-slate-800 focus:ring-2 focus:ring-primary transition-all"
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Present:</span>
                                <Badge color="emerald" className="bg-emerald-500/10 text-emerald-600 border-none text-[10px] font-black">128</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Absent:</span>
                                <Badge color="rose" className="bg-rose-500/10 text-rose-600 border-none text-[10px] font-black">04</Badge>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[2.5rem] border-2 border-slate-50 dark:border-slate-800 overflow-hidden shadow-xl">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b-2 border-slate-100 dark:border-slate-800">
                                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Staff Name</th>
                                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Department</th>
                                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-10 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i}>
                                            <td className="px-10 py-6"><Skeleton className="h-6 w-40" /></td>
                                            <td className="px-10 py-6"><Skeleton className="h-6 w-32" /></td>
                                            <td className="px-10 py-6"><Skeleton className="h-6 w-24" /></td>
                                            <td className="px-10 py-6"><Skeleton className="h-10 w-48 mx-auto rounded-xl" /></td>
                                        </tr>
                                    ))
                                ) : attendance.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center italic text-slate-400 text-xs font-black uppercase tracking-widest">No records found.</td>
                                    </tr>
                                ) : (
                                    (attendance || []).filter(att => att && (att.teacherId || att.id)).map((att) => (
                                        <tr key={att.id || att.teacherId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-10 py-6 text-left">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-black text-[10px]">
                                                        {String(att?.teacherName || '').substring(0, 2) || 'ST'}
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{att?.teacherName || 'Staff Member'}</p>
                                                        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest italic">ID: {att?.teacherId || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</td>
                                            <td className="px-10 py-6 text-left">
                                                <Badge
                                                    variant="outline"
                                                    className={`text-[8px] font-black uppercase tracking-widest border-lg ${att.status === 'PRESENT' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}
                                                >
                                                    {att.status || 'Not Marked'}
                                                </Badge>
                                            </td>
                                            <td className="px-10 py-6 text-center">
                                                 <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => onMark(att.teacherId, 'PRESENT')}
                                                        className="px-4 py-2 bg-emerald-500/5 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-emerald-500/20"
                                                    >
                                                        Present
                                                    </button>
                                                    <button
                                                        onClick={() => onMark(att.teacherId, 'ABSENT')}
                                                        className="px-4 py-2 bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-rose-500/20"
                                                    >
                                                        Absent
                                                    </button>
                                                    <button
                                                        onClick={() => onMark(att.teacherId, 'LEAVE')}
                                                        className="px-4 py-2 bg-amber-500/5 hover:bg-amber-500 text-amber-500 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-amber-500/20"
                                                    >
                                                        On Leave
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic font-bold">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            Attendance Records
                        </p>
                        <div className="flex items-center gap-4">
                            <Button variant="secondary" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary rounded-xl h-auto px-6 py-3">Report</Button>
                            <Button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl px-10 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-slate-900/10">Save</Button>
                        </div>
                    </div>
                </div>
            </div>
            </div>
                
</>
            </RoleGuard>
        </AuthGuard>
    );
}


StaffAttendance.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
