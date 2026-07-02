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
    TrendingUp,
    AlertCircle,
    FileText,
    Award,
    ShieldCheck,
    CheckCircle2,
    X,
} from 'lucide-react';
import { examsService } from '@/services/exams.service';
import { classesService } from '@/services/classes.service';
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

export default function TeacherExams() {
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [classes, setClasses] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        type: 'MID_TERM',
        date: '',
        totalMarks: 100,
        passingMarks: 40,
        classId: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchExams();
        fetchClasses();
    }, []);

    const fetchExams = async () => {
        try {
            const data = await examsService.getExams();
            setExams(data.data || data);
        } catch (error: any) {
            toast.error('Failed to load exam data.');
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const data = await classesService.getAll();
            setClasses(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateExam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.classId || !formData.name || !formData.date) {
            toast.error('Please fill all required fields');
            return;
        }

        setSubmitting(true);
        try {
            await examsService.createExam({
                ...formData,
                date: new Date(formData.date).toISOString(),
            });
            toast.success('Exam created successfully');
            setShowCreateModal(false);
            fetchExams();
            setFormData({
                name: '',
                type: 'MID_TERM',
                date: '',
                totalMarks: 100,
                passingMarks: 40,
                classId: '',
            });
        } catch (error: any) {
            console.error(error);
            toast.error('Failed to create exam');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12 relative">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-2 mb-2 text-primary">
                        Teacher Office: Exams
                    </Badge>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Exam List</h1>
                    <p className="text-sm font-medium text-slate-500 italic">Manage exam dates, rules, and results.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-10 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95"
                    >
                        <Plus size={18} />
                        Deploy Assessment
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Pending Assessments', value: exams.filter(e => new Date(e.date) > new Date()).length.toString(), icon: <Clock className="text-amber-500" />, trend: 'CRITICAL' },
                    { label: 'Evaluation Ratio', value: '94.2%', icon: <Activity className="text-emerald-500" />, trend: 'OPTIMAL' },
                    { label: 'Total Exams', value: exams.length.toString(), icon: <TrendingUp className="text-primary" />, trend: '+2.4%' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl relative group overflow-hidden">
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{stat.value}</h3>
                            </div>
                            <div className="size-16 rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                                {stat.icon}
                            </div>
                        </div>
                        <div className="mt-6 flex items-center gap-2">
                            <Badge variant="outline" className="text-[7px] font-black uppercase tracking-widest border-none p-0 opacity-40 group-hover:opacity-100 transition-opacity">{stat.trend}</Badge>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-100 dark:border-slate-800 pb-8">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Examination Spectrum</h2>
                        <div className="flex gap-4">
                            <div className="relative group min-w-[300px]">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search Exams..."
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-3 pl-12 pr-6 text-xs font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-100 dark:ring-slate-800 focus:ring-2 focus:ring-primary transition-all shadow-inner"
                                />
                            </div>
                            <Button variant="secondary" className="bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-slate-400 hover:text-primary transition-all">
                                <Filter size={18} />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-44 bg-slate-50 dark:bg-slate-800 rounded-[2rem] animate-pulse"></div>
                            ))
                        ) : (
                            exams.map((exam) => (
                                <div key={exam.id} className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-slate-50 dark:border-slate-800 p-8 hover:border-primary/30 hover:shadow-2xl transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer">
                                    <div className="absolute -top-10 -right-10 size-40 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>

                                    <div className="relative z-10 flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <FileText size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{exam.name}</h4>
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{exam.class?.name || 'Academic Unit'}</p>
                                            </div>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={`text-[7px] font-black uppercase tracking-widest border-lg px-2 py-1 ${!exam.type ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}`}
                                        >
                                            {exam.type || 'EXAM'}
                                        </Badge>
                                    </div>

                                    <div className="relative z-10 grid grid-cols-2 gap-6 mb-8">
                                        <div className="flex items-center gap-3">
                                            <Calendar size={14} className="text-slate-300" />
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{new Date(exam.date).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock size={14} className="text-slate-300" />
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">09:00 - 12:00</p>
                                        </div>
                                    </div>

                                    <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 size={14} className="text-emerald-500" />
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Exam Status: ACTIVE</span>
                                        </div>
                                        <a href="/teacher/grades" className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all group-hover:translate-x-1">
                                            Enter Marks
                                            <ArrowRight size={14} />
                                        </a>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="mt-12 flex items-center justify-center">
                        <Button variant="secondary" className="bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-10 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 text-slate-400 hover:text-primary transition-all group">
                            Access Past Exams
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Create Exam Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Deploy Assessment</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-rose-500 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateExam} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Exam Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl py-3 px-4 text-xs font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-100 dark:ring-slate-800 focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="e.g. Mid Term Mathematics"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl py-3 px-4 text-xs font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-100 dark:ring-slate-800 focus:ring-2 focus:ring-primary transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl py-3 px-4 text-xs font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-100 dark:ring-slate-800 focus:ring-2 focus:ring-primary transition-all appearance-none"
                                    >
                                        <option value="MID_TERM">Mid Term</option>
                                        <option value="FINAL">Final</option>
                                        <option value="assignment">Assignment</option>
                                        <option value="quiz">Quiz</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class</label>
                                <select
                                    required
                                    value={formData.classId}
                                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl py-3 px-4 text-xs font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-100 dark:ring-slate-800 focus:ring-2 focus:ring-primary transition-all appearance-none"
                                >
                                    <option value="">Select Class...</option>
                                    {classes.map(cls => (
                                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Marks</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.totalMarks}
                                        onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) })}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl py-3 px-4 text-xs font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-100 dark:ring-slate-800 focus:ring-2 focus:ring-primary transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Passing Marks</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.passingMarks}
                                        onChange={(e) => setFormData({ ...formData, passingMarks: parseInt(e.target.value) })}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl py-3 px-4 text-xs font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-100 dark:ring-slate-800 focus:ring-2 focus:ring-primary transition-all"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-4 h-auto font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20"
                            >
                                {submitting ? <Activity className="animate-spin mr-2" /> : <Zap className="mr-2" size={16} />}
                                Create Exam
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
