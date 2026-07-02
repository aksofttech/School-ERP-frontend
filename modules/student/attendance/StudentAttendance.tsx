import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Activity,
    Calendar,
    Clock,
    ChevronRight,
    Zap,
    BookOpen,
    ArrowRight,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ShieldCheck,
    TrendingUp,
    History,
    Info
} from 'lucide-react';
import { attendanceService } from '@/services/attendance.service';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

export default function StudentAttendance() {
    const [attendance, setAttendance] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const data = await attendanceService.getStudentAttendance({});
                setAttendance(data.data || data);
            } catch (error: any) {
                toast.error('Failed to load attendance.');
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, []);

    const presentCount = attendance.filter(a => a.status === 'PRESENT').length;
    const absentCount = attendance.filter(a => a.status === 'ABSENT').length;
    const lateCount = attendance.filter(a => a.status === 'LATE').length;
    const total = attendance.length;
    const percentage = total > 0 ? Math.round((presentCount / total) * 100) : 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-2 mb-2 text-primary">
                        Student Office: Attendance
                    </Badge>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Attendance Record</h1>
                    <p className="text-sm font-medium text-slate-500 italic">Check your daily attendance and monthly reports.</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-slate-50 dark:border-slate-800 shadow-xl">
                        <div className="size-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black">{percentage}%</div>
                        <div className="flex flex-col">
                            <span className="text-[7px] font-black uppercase tracking-widest text-slate-400">Monthly Avg</span>
                            <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase">{percentage >= 75 ? 'Optimal' : percentage >= 50 ? 'Average' : 'Critical'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Present', value: presentCount.toString(), icon: <CheckCircle2 className="text-emerald-500" />, sub: 'Total Days' },
                    { label: 'Absent', value: absentCount.toString(), icon: <XCircle className="text-rose-500" />, sub: 'Total Missed' },
                    { label: 'Late', value: lateCount.toString(), icon: <Clock className="text-amber-500" />, sub: 'Total Late' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl relative group overflow-hidden">
                        <div className="relative z-10 flex items-center justify-between mb-6">
                            <div className="size-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                                {stat.icon}
                            </div>
                            <span className="text-[7px] font-black uppercase tracking-widest text-slate-300">{stat.sub}</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-100 dark:border-slate-800 pb-8">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Attendance List</h2>
                        <div className="flex gap-4">
                            <div className="relative group">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-3 pl-12 pr-6 text-xs font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-100 dark:ring-slate-800 focus:ring-2 focus:ring-primary transition-all shadow-inner"
                                />
                            </div>
                            <Button variant="secondary" className="bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-slate-400 hover:text-primary transition-all">
                                <Filter size={18} />
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-[2.5rem] border-2 border-slate-50 dark:border-slate-800 overflow-hidden shadow-xl">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b-2 border-slate-100 dark:border-slate-800">
                                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-10 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Subject</th>
                                    <th className="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i}>
                                            <td className="px-10 py-6"><Skeleton className="h-4 w-48" /></td>
                                            <td className="px-10 py-6"><Skeleton className="h-4 w-24" /></td>
                                            <td className="px-10 py-6 gap-2 flex justify-center"><Skeleton className="h-4 w-32" /></td>
                                            <td className="px-10 py-6 text-right"><Skeleton className="h-4 w-8 ml-auto" /></td>
                                        </tr>
                                    ))
                                ) : (
                                    attendance.length > 0 ? (
                                        attendance.map((node) => (
                                            <tr key={node.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                                <td className="px-10 py-6 text-left">
                                                    <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{new Date(node.date).toLocaleDateString()}</p>
                                                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{node.session || 'Morning'}</p>
                                                </td>
                                                <td className="px-10 py-6 text-left">
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-[8px] font-black uppercase tracking-widest border-none px-3 py-1 ${node.status === 'PRESENT' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}
                                                    >
                                                        {node.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-10 py-6 text-center">
                                                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">{node.subject?.name || 'Class'}</span>
                                                </td>
                                                <td className="px-10 py-6 text-right">
                                                    <button className="text-slate-300 hover:text-primary transition-colors">
                                                        <MoreVertical size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-10 py-12 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <Info size={32} className="text-slate-200" />
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">No attendance records found.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            SECURE RECORDS
                        </p>
                        <Button variant="secondary" className="bg-slate-50 dark:bg-slate-800 border-none rounded-[2rem] px-8 py-4 h-auto font-black text-[10px] uppercase tracking-widest gap-2 text-slate-400 hover:text-primary transition-all">
                            <History size={16} />
                            Past Records Archive
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
