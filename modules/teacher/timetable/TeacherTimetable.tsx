import { useState, useEffect } from 'react';
import {
    Clock,
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
    BookOpen,
    User,
    ArrowRight,
    TrendingUp,
    AlertCircle,
    Layout,
    Printer,
    Download,
    Share2
} from 'lucide-react';
import { useClasses } from '@/hooks/useClasses';
import { timetableService } from '@/services/timetable.service';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';
import { toast } from 'react-hot-toast';

export default function TeacherTimetable() {
    const [timetableData, setTimetableData] = useState<Record<string, any[]> | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                const data = await timetableService.getMyTimetable();
                setTimetableData(data.timetable);
            } catch (error: any) {
                console.error(error);
                toast.error('Failed to load your timetable.');
            } finally {
                setLoading(false);
            }
        };
        fetchTimetable();
    }, []);

    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];
    const displayTimeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM'];

    const getEntryForSlot = (day: string, slotTime: string) => {
        if (!timetableData || !timetableData[day]) return null;
        // Simple matching for now, assuming slots are exact or we check overlap
        // API returns HH:mm objects.
        return timetableData[day].find((entry: any) => entry.startTime.startsWith(slotTime) || entry.startTime === slotTime);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-2 mb-2 text-primary">
                        Teacher Office: Timetable
                    </Badge>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Personal Schedule</h1>
                    <p className="text-sm font-medium text-slate-500 italic">Manage your classes and teaching schedule.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        onClick={() => window.print()}
                        className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-slate-900/5 transition-all active:scale-95 text-slate-600 dark:text-slate-400"
                    >
                        <Printer size={18} />
                        Print Timetable
                    </Button>
                    <Button
                        className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-10 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20"
                    >
                        <Zap size={18} />
                        Auto-Fill Schedule
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-10 space-y-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-8">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Semester: Q1 2024</h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Schedule</p>
                            </div>
                        </div>
                        <div className="flex p-1 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                            <button className="px-6 py-3 bg-white dark:bg-slate-900 text-primary rounded-xl shadow-sm text-[10px] font-black uppercase tracking-widest">Grid View</button>
                            <button className="px-6 py-3 text-slate-400 hover:text-slate-600 transition-colors text-[10px] font-black uppercase tracking-widest">List View</button>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-[2rem] border-2 border-slate-50 dark:border-slate-800 shadow-xl no-scrollbar">
                        <table className="w-full border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                                    <th className="px-8 py-6 border-r-2 border-slate-50 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Time \ Day</th>
                                    {days.map(day => (
                                        <th key={day} className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{day}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-slate-50 dark:divide-slate-800">
                                {timeSlots.map((slot, i) => (
                                    <tr key={slot} className="group">
                                        <td className="px-8 py-10 border-r-2 border-slate-50 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-800/20">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                    <Clock size={16} />
                                                </div>
                                                <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase">{displayTimeSlots[i]}</p>
                                            </div>
                                        </td>
                                        {days.map(day => {
                                            const entry = getEntryForSlot(day, slot);
                                            return (
                                                <td key={`${day}-${slot}`} className="px-4 py-4 group/cell">
                                                    <div className={`h-full min-h-[120px] border-2 border-dashed ${entry ? 'border-primary/20 bg-primary/5' : 'border-slate-100 dark:border-slate-800'} rounded-3xl p-6 flex flex-col justify-center items-center gap-3 group-hover/cell:border-primary/30 group-hover/cell:bg-primary/5 transition-all cursor-pointer relative overflow-hidden group/item`}>
                                                        {entry ? (
                                                            <div className="text-center space-y-3 relative z-10 w-full animate-in fade-in zoom-in-95 duration-500">
                                                                <Badge variant="outline" className="bg-white/50 dark:bg-slate-900/50 text-primary border-primary/20 text-[8px] font-black uppercase tracking-widest px-3">
                                                                    {entry.class?.name} | {entry.room || 'NO ROOM'}
                                                                </Badge>
                                                                <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">{entry.subject?.name}</p>
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <Activity size={12} className="text-emerald-500" />
                                                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">{entry.subject?.code}</p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-2 text-slate-200 group-hover/cell:text-primary transition-colors">
                                                                <Plus size={20} />
                                                                <span className="text-[8px] font-black uppercase">Vacant</span>
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/item:opacity-100 transition-opacity blur-2xl -z-10"></div>
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="pt-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex flex-wrap items-center gap-8">
                            <div className="flex items-center gap-3">
                                <ShieldCheck size={20} className="text-emerald-500" />
                                <div className="text-left">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status</p>
                                    <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">Verified Schedule</p>
                                </div>
                            </div>
                            <div className="h-10 w-px bg-slate-100 dark:bg-slate-800 hidden md:block"></div>
                            <div className="flex items-center gap-3">
                                <TrendingUp size={20} className="text-primary" />
                                <div className="text-left">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Engagement</p>
                                    <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">Active</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="secondary" className="bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl p-4 text-slate-400 hover:text-primary transition-all">
                                <Download size={20} />
                            </Button>
                            <Button variant="secondary" className="bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl p-4 text-slate-400 hover:text-primary transition-all">
                                <Share2 size={20} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
