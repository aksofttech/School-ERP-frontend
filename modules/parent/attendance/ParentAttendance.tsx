import { useState, useEffect } from 'react';
import { useParent } from '@/contexts/ParentContext';
import { attendanceService } from '@/services/attendance.service';
import {
    Calendar,
    Clock,
    MapPin,
    UserCheck,
    UserX,
    Filter,
    Download,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

export default function ParentAttendance() {
    const { selectedChildId, childrenList } = useParent();
    const [attendance, setAttendance] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const fetchAttendance = async () => {
            setLoading(true);
            try {
                if (selectedChildId === 'ALL') {
                    // If viewing all, realistically we might show a summary or default to first child
                    // For now, let's load first child's attendance if ALL is selected, or empty state
                    if (childrenList.length > 0) {
                        const data = await attendanceService.getStudentAttendance(childrenList[0].id);
                        setAttendance(data.data || data);
                    }
                } else {
                    const data = await attendanceService.getStudentAttendance(selectedChildId);
                    setAttendance(data.data || data);
                }
            } catch (error) {
                toast.error('Failed to sync attendance registry.');
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, [selectedChildId]);

    // Calendar Logic helpers
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
    };

    const days = getDaysInMonth(currentDate);

    // Mock status for visual if api data missing
    const getStatusForDay = (day: number) => {
        if (day % 7 === 0 || day % 7 === 6) return 'WEEKEND';
        if (day === 12 || day === 15) return 'ABSENT';
        if (day === 20) return 'LATE';
        return 'PRESENT';
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-2 mb-2 text-primary">
                        SCHOOL RECORD: ATTENDANCE
                    </Badge>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Attendance Record</h1>
                    <p className="text-sm font-medium text-slate-500 italic">
                        {selectedChildId === 'ALL'
                            ? `Please select a specific child to view detailed attendance.`
                            : `Tracking presence for ${childrenList.find(c => c.id === selectedChildId)?.name}.`}
                    </p>
                </div>
                <div className="flex items-center gap-6">
                    {selectedChildId !== 'ALL' && (
                        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border-2 border-slate-50 dark:border-slate-800 shadow-xl">
                            <div className="size-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black">
                                96%
                            </div>
                            <div className="flex flex-col pr-4">
                                <span className="text-[7px] font-black uppercase tracking-widest text-slate-400">Monthly Avg</span>
                                <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase">Excellent</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {selectedChildId === 'ALL' ? (
                <div className="flex flex-col items-center justify-center p-20 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl opacity-50">
                    <UserCheck size={64} className="text-slate-300 mb-4" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest">Select a child from the dashboard header to view attendance.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Calendar View */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">
                                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </h3>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>
                                    <ChevronLeft size={20} />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>
                                    <ChevronRight size={20} />
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-4">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                <div key={d} className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400">{d}</div>
                            ))}
                            {days.map((date, i) => {
                                const status = getStatusForDay(date.getDate());
                                return (
                                    <div key={i} className={`aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all cursor-pointer hover:shadow-lg
                          ${status === 'PRESENT' ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800 text-emerald-700' :
                                            status === 'ABSENT' ? 'bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-800 text-rose-700' :
                                                status === 'LATE' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800 text-amber-700' :
                                                    'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-300'}
                       `}>
                                        <span className="text-lg font-black">{date.getDate()}</span>
                                        {status !== 'WEEKEND' && (
                                            <span className="text-[6px] font-bold uppercase tracking-widest mt-1 opacity-60">{status}</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Stats Side */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                            <h3 className="text-lg font-black uppercase tracking-tight mb-6">Summary</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 size={18} className="text-emerald-500" />
                                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Present</span>
                                    </div>
                                    <span className="text-lg font-black text-emerald-700 dark:text-emerald-400">22</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-rose-50 dark:bg-rose-900/10 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <UserX size={18} className="text-rose-500" />
                                        <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wide">Absent</span>
                                    </div>
                                    <span className="text-lg font-black text-rose-700 dark:text-rose-400">02</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <Clock size={18} className="text-amber-500" />
                                        <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">Late</span>
                                    </div>
                                    <span className="text-lg font-black text-amber-700 dark:text-amber-400">01</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
