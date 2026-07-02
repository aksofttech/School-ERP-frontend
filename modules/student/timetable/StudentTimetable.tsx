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
    Printer,
    ShieldCheck,
    CheckCircle2,
    Info,
    Layers,
    Layout,
    MapPin
} from 'lucide-react';
import { timetableService } from '@/services/timetable.service';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

export default function StudentTimetable() {
    const [timetable, setTimetable] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                const data = await timetableService.getMyTimetable();
                setTimetable(data.data || data);
            } catch (error: any) {
                toast.error('Failed to load your timetable.');
            } finally {
                setLoading(false);
            }
        };
        fetchTimetable();
    }, []);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM'];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-2 mb-2 text-primary">
                        Student Office: Timetable
                    </Badge>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">My Timetable</h1>
                    <p className="text-sm font-medium text-slate-500 italic">View your class schedule and subjects.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-8 py-6 h-auto font-black text-[10px] uppercase tracking-widest gap-2 text-slate-400 hover:text-primary transition-all shadow-xl">
                        <Printer size={18} />
                        Download PDF
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-10">
                    <div className="flex items-center justify-between mb-10 border-b border-slate-100 dark:border-slate-800 pb-8">
                        <div className="flex gap-10">
                            <button className="relative py-4 text-[10px] font-black text-primary uppercase tracking-widest border-b-4 border-primary italic">Full View</button>
                            <button className="relative py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors italic">Daily View</button>
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-none px-4 py-2 font-black text-[10px] flex items-center gap-2">
                                <Clock size={14} className="animate-pulse" />
                                CURRENT_TIME: 09:42 AM
                            </Badge>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-[2.5rem] border-2 border-slate-50 dark:border-slate-800 shadow-xl">
                        <table className="w-full border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b-2 border-slate-100 dark:border-slate-800">
                                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-r border-slate-100 dark:border-slate-800">Time</th>
                                    {days.map(day => (
                                        <th key={day} className="px-10 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{day}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {timeSlots.map((time, i) => (
                                    <tr key={time} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors group">
                                        <td className="px-10 py-10 text-left border-r border-slate-100 dark:border-slate-800">
                                            <p className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{time}</p>
                                            <div className="h-0.5 w-8 bg-primary/20 mt-1"></div>
                                        </td>
                                        {days.map(day => (
                                            <td key={day} className="px-4 py-4 relative group">
                                                {/* Real data would go here, mock for structure */}
                                                {i === 1 && day === 'Tuesday' ? (
                                                    <div className="p-6 rounded-[2rem] bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 animate-in zoom-in duration-300 relative overflow-hidden group/item cursor-pointer">
                                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/item:opacity-30 transition-opacity">
                                                            <Layers size={40} />
                                                        </div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">Mathematics</p>
                                                        <h4 className="text-[12px] font-black uppercase mb-4 tracking-tight leading-none italic">Advanced Calculus Class</h4>
                                                        <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest">
                                                            <MapPin size={10} />
                                                            Room 302
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="absolute inset-4 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-slate-800/50 group-hover:border-primary/20 transition-all opacity-0 group-hover:opacity-100"></div>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            VERIFIED SCHEDULE
                        </p>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <span className="size-3 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50"></span>
                                <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Classes</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="size-3 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700"></span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Free Time</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
