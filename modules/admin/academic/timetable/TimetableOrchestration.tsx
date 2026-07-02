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
    Layout
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

export default function TimetableOrchestration() {
    const { classes, loading: classesLoading } = useClasses();
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [timetable, setTimetable] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'grid' | 'config'>('grid');

    const fetchTimetable = async (classId: string) => {
        setLoading(true);
        try {
            const data = await timetableService.getByClass(classId);
            setTimetable(data.data || data);
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch timetable matrix');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedClass) fetchTimetable(selectedClass);
    }, [selectedClass]);

    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM'];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Academic Orchestration: Timetable</h1>
                    <p className="text-sm font-medium text-slate-500 italic">Configure temporal nodes, faculty deployment schedules, and institutional rhythm.</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all appearance-none min-w-[240px] shadow-sm"
                    >
                        <option value="">Select Target Class...</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <Button
                        className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20"
                    >
                        <Plus size={18} />
                        Commit Schedule Node
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-10">
                    {!selectedClass ? (
                        <div className="py-24 text-center">
                            <div className="flex flex-col items-center gap-6">
                                <div className="size-24 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-200 shadow-inner">
                                    <Clock size={48} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Select Academic Node</h3>
                                    <p className="text-slate-500 italic max-w-sm">Please select a class from the registry to retrieve the temporal orchestration matrix.</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-10 animate-in zoom-in-95 duration-500">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-8">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                        <Activity size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Temporal Matrix: {classes.find(c => c.id === selectedClass)?.name}</h2>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Synchronized Schedule Protocol</p>
                                    </div>
                                </div>
                                <div className="flex p-1 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                    <button className="px-6 py-3 bg-white dark:bg-slate-900 text-primary rounded-xl shadow-sm text-[10px] font-black uppercase tracking-widest">Grid View</button>
                                    <button className="px-6 py-3 text-slate-400 hover:text-slate-600 transition-colors text-[10px] font-black uppercase tracking-widest">Timeline</button>
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
                                                        <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase">{slot}</p>
                                                    </div>
                                                </td>
                                                {days.map(day => (
                                                    <td key={`${day}-${slot}`} className="px-4 py-4 group/cell">
                                                        <div className="h-full min-h-[100px] border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl p-5 flex flex-col justify-center items-center gap-3 group-hover/cell:border-primary/30 group-hover/cell:bg-primary/5 transition-all cursor-pointer relative overflow-hidden group/item">
                                                            {/* Mock data for visualization */}
                                                            {Math.random() > 0.3 ? (
                                                                <div className="text-center space-y-2 relative z-10 w-full animate-in fade-in zoom-in-95 duration-500">
                                                                    <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-widest mb-1 px-3">
                                                                        PHY-402
                                                                    </Badge>
                                                                    <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase truncate">Mathematics</p>
                                                                    <div className="flex items-center justify-center gap-2">
                                                                        <div className="size-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[8px] font-black">SJ</div>
                                                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight italic">S. Jenkins</p>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="size-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-200 group-hover/cell:text-primary transition-colors">
                                                                    <Plus size={20} />
                                                                </div>
                                                            )}
                                                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/item:opacity-100 transition-opacity blur-2xl -z-10"></div>
                                                        </div>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="pt-8 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <div className="size-3 rounded-full bg-primary shadow-sm shadow-primary/40"></div>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Core Assets</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="size-3 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/40"></div>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Elective Nodes</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="size-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/40"></div>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Practical Synergy</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button variant="secondary" className="text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary/5 rounded-xl flex items-center gap-2 h-auto px-6 py-3">
                                        <ShieldCheck size={16} />
                                        Validate Constraints
                                    </Button>
                                    <Button variant="secondary" className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:bg-indigo-500/5 rounded-xl flex items-center gap-2 h-auto px-6 py-3">
                                        <Zap size={16} />
                                        AI Auto-Orchestrate
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
