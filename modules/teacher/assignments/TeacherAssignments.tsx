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
    Upload,
    CheckCircle2,
    AlertCircle,
    FileText,
    User,
    ShieldCheck,
    X
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { homeworkService } from '@/services/homework.service';
import { useClasses } from '@/hooks/useClasses';
import { useSubjects } from '@/hooks/useSubjects';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

const homeworkSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    classId: z.string().min(1, 'Class is required'),
    subjectId: z.string().min(1, 'Subject is required'),
    dueDate: z.string().min(1, 'Due date is required'),
});

type HomeworkFormValues = z.infer<typeof homeworkSchema>;

export default function TeacherAssignments() {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [creating, setCreating] = useState(false);

    const { classes } = useClasses();
    const { subjects } = useSubjects();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<HomeworkFormValues>({
        resolver: zodResolver(homeworkSchema),
    });

    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const data = await homeworkService.getHomework();
            setAssignments(data.data || data);
        } catch (error: any) {
            toast.error('Failed to load assignments.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    const onCreate = async (data: HomeworkFormValues) => {
        setCreating(true);
        try {
            await homeworkService.create(data);
            toast.success('Assignment created successfully.');
            setIsCreateModalOpen(false);
            reset();
            fetchAssignments();
        } catch (error: any) {
            toast.error(error.message || 'Failed to create assignment.');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12 relative">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-2 mb-2 text-primary">
                        Teacher Office: Assignments
                    </Badge>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Assignments</h1>
                    <p className="text-sm font-medium text-slate-500 italic">Create assignments, track student work, and give grades.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-10 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95"
                    >
                        <Plus size={18} />
                        New Assignment
                    </Button>
                </div>
            </div>

            {/* Creation Modal Overlay */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Create New Assignment</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">New Assignment Entry</p>
                            </div>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:bg-red-500 hover:text-white transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8">
                            <form onSubmit={handleSubmit(onCreate)} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Assignment Title</label>
                                    <input
                                        {...register('title')}
                                        placeholder="Experiment 404: Quantum Entanglement..."
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl py-4 px-6 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    />
                                    {errors.title && <span className="text-xs text-red-500 font-bold ml-1">{errors.title.message}</span>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Class</label>
                                        <select
                                            {...register('classId')}
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl py-4 px-6 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none uppercase"
                                        >
                                            <option value="">Select Class</option>
                                            {classes.map(cls => (
                                                <option key={cls.id} value={cls.id}>{cls.name}</option>
                                            ))}
                                        </select>
                                        {errors.classId && <span className="text-xs text-red-500 font-bold ml-1">{errors.classId.message}</span>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Subject Vector</label>
                                        <select
                                            {...register('subjectId')}
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl py-4 px-6 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none uppercase"
                                        >
                                            <option value="">Select Subject Vector</option>
                                            {subjects.map(sub => (
                                                <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
                                            ))}
                                        </select>
                                        {errors.subjectId && <span className="text-xs text-red-500 font-bold ml-1">{errors.subjectId.message}</span>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Mission Description</label>
                                    <textarea
                                        {...register('description')}
                                        rows={3}
                                        placeholder="Detailed instructions for the assignment..."
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl py-4 px-6 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Submission Deadline</label>
                                    <input
                                        type="date"
                                        {...register('dueDate')}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl py-4 px-6 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all uppercase"
                                    />
                                    {errors.dueDate && <span className="text-xs text-red-500 font-bold ml-1">{errors.dueDate.message}</span>}
                                </div>

                                <div className="pt-4 flex justify-end gap-4">
                                    <Button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        variant="ghost"
                                        className="text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                                    >
                                        Abort
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={creating}
                                        className="bg-primary text-white font-black uppercase tracking-widest text-xs px-8 py-4 rounded-xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-1 transition-all"
                                    >
                                        {creating ? 'Creating...' : 'Create Assignment'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-100 dark:border-slate-800 pb-8">
                        <div className="flex gap-10">
                            <button className="relative py-4 text-[10px] font-black text-primary uppercase tracking-widest border-b-4 border-primary">Active Tasks</button>
                            <button className="relative py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Digital Archive</button>
                            <button className="relative py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Evaluation Suite</button>
                        </div>
                        <div className="flex gap-4">
                            <div className="relative group min-w-[300px]">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-3 pl-12 pr-6 text-xs font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-100 dark:ring-slate-800 focus:ring-2 focus:ring-primary transition-all shadow-inner"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-32 bg-slate-50 dark:bg-slate-800 rounded-[2rem] animate-pulse"></div>
                            ))
                        ) : (
                            assignments.map((task) => (
                                <div key={task.id} className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-slate-50 dark:border-slate-800 p-8 hover:border-primary/30 hover:shadow-2xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer overflow-hidden relative">
                                    <div className="absolute left-0 top-0 w-2 h-full bg-primary/20 group-hover:bg-primary transition-all"></div>

                                    <div className="flex items-center gap-6 flex-1">
                                        <div className="size-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                            <ClipboardList size={28} />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">{task.title}</h4>
                                                <Badge variant="outline" className="text-[7px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 border-none">ACTIVE</Badge>
                                            </div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{task.class?.name || 'Standard Cluster'} • {task.subject?.name || 'Academic Core'}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-10">
                                        <div className="flex flex-col items-center">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Due Date</p>
                                            <div className="flex items-center gap-2">
                                                <Clock size={12} className="text-primary" />
                                                <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase">{new Date(task.dueDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Response Ratio</p>
                                            <div className="flex items-center gap-2">
                                                <Activity size={12} className="text-emerald-500" />
                                                <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase">24 / 32 Students</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 pl-6 border-l-2 border-slate-50 dark:border-slate-800">
                                            <Button variant="secondary" className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-slate-400 hover:text-primary transition-all">
                                                <Upload size={18} />
                                            </Button>
                                            <Button variant="secondary" className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-slate-400 hover:text-primary transition-all">
                                                <MoreVertical size={18} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="mt-12 flex items-center justify-between px-4">
                        <div className="flex items-center gap-2 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                            <ShieldCheck size={14} />
                            SECURE RECORDS
                        </div>
                        <button className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all hover:translate-x-1">
                            View History
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
