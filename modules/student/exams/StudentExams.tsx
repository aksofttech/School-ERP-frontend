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
    FileText,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    Timer,
    GraduationCap
} from 'lucide-react';
import { examsService } from '@/services/exams.service';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

export default function StudentExams() {
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const data = await examsService.getExams({});
                setExams(data.data || data);
            } catch (error: any) {
                toast.error('Failed to load exam data.');
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-2 mb-2 text-primary">
                        Student Office: Exams
                    </Badge>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">My Exams</h1>
                    <p className="text-sm font-medium text-slate-500 italic">Check your exam dates, status, and results.</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-slate-50 dark:border-slate-800 shadow-xl">
                        <div className="size-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black">03</div>
                        <div className="flex flex-col">
                            <span className="text-[7px] font-black uppercase tracking-widest text-slate-400">Upcoming</span>
                            <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase">Critical</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Exams', value: '12', icon: <FileText className="text-primary" />, sub: 'Current Term' },
                    { label: 'Completed', value: '09', icon: <CheckCircle2 className="text-emerald-500" />, sub: 'Passed' },
                    { label: 'Pending', value: '03', icon: <Timer className="text-amber-500" />, sub: 'Upcoming' },
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
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Exam Schedule</h2>
                        <div className="flex gap-4">
                            <div className="relative group">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search Exam..."
                                    className="bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-3 pl-12 pr-6 text-xs font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-100 dark:ring-slate-800 focus:ring-2 focus:ring-primary transition-all shadow-inner"
                                />
                            </div>
                            <Button 
                                onClick={() => toast('Advanced filter synchronization is in progress...', { icon: '⏳' })}
                                variant="secondary" className="bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-slate-400 hover:text-primary transition-all">
                                <Filter size={18} />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-40 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/50 animate-pulse" />
                            ))
                        ) : (
                            exams.length > 0 ? (
                                exams.map((exam) => (
                                    <div key={exam.id} className="relative group overflow-hidden bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 hover:border-primary/30 transition-all hover:shadow-2xl hover:-translate-y-1">
                                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <GraduationCap size={80} className="text-primary" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="flex items-start justify-between mb-6">
                                                <div>
                                                    <Badge variant="outline" className="text-[7px] font-black uppercase tracking-widest border-none bg-primary/5 text-primary px-3 py-1 mb-2">
                                                        {exam.subject?.name || 'CORE_SUBJECT'}
                                                    </Badge>
                                                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">{exam.name}</h3>
                                                </div>
                                                <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700">
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">OCT</span>
                                                    <span className="text-lg font-black text-slate-900 dark:text-white">24</span>
                                                </div>
                                            </div>

                                            <div className="space-y-3 mb-6">
                                                <div className="flex items-center gap-3 text-slate-500">
                                                    <Clock size={14} className="text-slate-400" />
                                                    <span className="text-[10px] font-bold uppercase tracking-wide">09:00 AM - 11:00 AM</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-slate-500">
                                                    <Zap size={14} className="text-slate-400" />
                                                    <span className="text-[10px] font-bold uppercase tracking-wide">Room 302 • Hall A</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                                                <Badge variant="outline" className="text-[7px] font-black uppercase tracking-widest border-none bg-emerald-500/5 text-emerald-600 px-3 py-1">
                                                    SCHEDULED
                                                </Badge>
                                                <Button 
                                                    onClick={() => toast(`Viewing details for ${exam.name}`, { icon: '📄' })}
                                                    variant="ghost" className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors gap-1">
                                                    View Details
                                                    <ArrowRight size={12} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 flex flex-col items-center justify-center p-20 gap-4 opacity-30 italic">
                                    <GraduationCap size={48} />
                                    <p className="text-[10px] font-black uppercase tracking-widest">No exams scheduled at this time.</p>
                                </div>
                            )
                        )}
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            SECURE RECORDS
                        </p>
                        <Button 
                            onClick={() => toast('Loading your performance analytics...', { icon: '📊' })}
                            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl px-8 py-4 h-auto font-black text-[9px] uppercase tracking-widest gap-2 hover:opacity-90 transition-all">
                            <Activity size={16} />
                            Performance Analytics
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
