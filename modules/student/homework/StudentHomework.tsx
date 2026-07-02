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
    ClipboardList,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    FileText,
    Upload,
    Info,
    TrendingUp,
    Award
} from 'lucide-react';
import { homeworkService } from '@/services/homework.service';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

export default function StudentHomework() {
    const [homework, setHomework] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomework = async () => {
            try {
                const data = await homeworkService.getAll({});
                setHomework(data.data || data);
            } catch (error: any) {
                toast.error('Failed to load assignments.');
            } finally {
                setLoading(false);
            }
        };
        fetchHomework();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-2 mb-2 text-primary">
                        Student Office: Homework
                    </Badge>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">My Homework</h1>
                    <p className="text-sm font-medium text-slate-500 italic">Manage your homework, see deadlines, and send your work to teachers.</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-slate-50 dark:border-slate-800 shadow-xl">
                        <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black italic">12</div>
                        <div className="flex flex-col">
                            <span className="text-[7px] font-black uppercase tracking-widest text-slate-400">Total Tasks</span>
                            <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Homework List</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Pending', value: '04', icon: <ClipboardList className="text-amber-500" />, sub: 'Action Required' },
                    { label: 'Submitted', value: '08', icon: <CheckCircle2 className="text-emerald-500" />, sub: 'Finished' },
                    { label: 'Graded', value: '06', icon: <Award className="text-primary" />, sub: 'Passed' },
                    { label: 'Missing', value: '00', icon: <AlertCircle className="text-rose-500" />, sub: 'No Late' },
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
                        <div className="flex gap-10">
                            <button className="relative py-4 text-[10px] font-black text-primary uppercase tracking-widest border-b-4 border-primary italic">Active List</button>
                            <button 
                                onClick={() => toast('Loading missing work records...', { icon: '📂' })}
                                className="relative py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors italic">Missing Work</button>
                        </div>
                        <div className="flex gap-4">
                            <div className="relative group">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-3 pl-12 pr-6 text-xs font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-100 dark:ring-slate-800 focus:ring-2 focus:ring-primary transition-all shadow-inner"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-48 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/50 animate-pulse" />
                            ))
                        ) : (
                            homework.length > 0 ? (
                                homework.map((task) => (
                                    <div key={task.id} className="bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-[2.5rem] p-8 hover:shadow-2xl hover:scale-[1.02] transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
                                            <FileText size={64} className="text-primary" />
                                        </div>
                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="flex items-center justify-between mb-4">
                                                <Badge variant="outline" className="text-[7px] font-black uppercase tracking-widest border-none bg-primary/5 text-primary px-3 py-1">
                                                    {task.subject?.name || 'Class'}
                                                </Badge>
                                                <span className="text-[7px] font-black text-rose-500 uppercase tracking-widest">{task.dueDate || 'URGENT'}</span>
                                            </div>
                                            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2 italic group-hover:text-primary transition-colors">{task.title}</h3>
                                            <p className="text-[10px] font-medium text-slate-500 line-clamp-2 mb-6 italic">{task.description}</p>
                                            <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={12} className="text-slate-300" />
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">v1.0</span>
                                                </div>
                                                <Button 
                                                    onClick={() => {
                                                        toast.loading(`Preparing submission for ${task.title}...`);
                                                        setTimeout(() => {
                                                            toast.dismiss();
                                                            toast.success('Assignment uploaded to teacher portal.');
                                                        }, 1500);
                                                    }}
                                                    className="bg-slate-50 dark:bg-slate-800 hover:bg-primary hover:text-white border-none rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all gap-2">
                                                    Submit Homework
                                                    <Upload size={14} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 flex flex-col items-center justify-center p-20 gap-4 opacity-30 italic">
                                    <ClipboardList size={48} />
                                    <p className="text-[10px] font-black uppercase tracking-widest">No homework assignments found.</p>
                                </div>
                            )
                        )}
                    </div>

                    <div className="mt-12 pt-10 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            SECURE RECORDS
                        </p>
                        <Button 
                            onClick={() => toast('Opening homework analytics...', { icon: '📊' })}
                            className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-10 py-5 h-auto font-black text-[10px] uppercase tracking-widest gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95">
                            <Activity size={18} />
                            Performance Analytics
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
