import { useState, useEffect, useMemo } from 'react';
import {
    Plus,
    Search,
    Calendar,
    Clock,
    Award,
    TrendingUp,
    FileText,
    CheckCircle2,
    X,
    Trash2,
    GraduationCap,
    ArrowRight,
    AlertCircle,
    ClipboardList,
    Filter
} from 'lucide-react';
import Link from 'next/link';
import { examsService } from '@/services/exams.service';
import { classesService } from '@/services/classes.service';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

export default function TeacherExams() {
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [classes, setClasses] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClassFilter, setSelectedClassFilter] = useState('ALL');
    const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
    const [deletingId, setDeletingId] = useState<string | null>(null);

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
        setLoading(true);
        try {
            const data = await examsService.getExams();
            const list = Array.isArray(data) ? data : (data.data || []);
            setExams(list);
        } catch (error: any) {
            console.error(error);
            toast.error('Failed to load exam data.');
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const data = await classesService.getAll();
            setClasses(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateExam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.classId || !formData.name || !formData.date) {
            toast.error('Please fill in exam name, class, and examination date');
            return;
        }

        setSubmitting(true);
        try {
            await examsService.createExam({
                ...formData,
                date: new Date(formData.date).toISOString() as any,
                totalMarks: Number(formData.totalMarks),
                passingMarks: Number(formData.passingMarks),
            });
            toast.success('Examination scheduled successfully!');
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
            toast.error(error.message || 'Failed to schedule exam.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteExam = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this examination? All entered marks will also be removed.')) return;
        setDeletingId(id);
        try {
            await examsService.deleteExam(id);
            toast.success('Exam removed successfully.');
            setExams(prev => prev.filter(ex => ex.id !== id));
        } catch (error: any) {
            console.error(error);
            toast.error('Failed to delete exam.');
        } finally {
            setDeletingId(null);
        }
    };

    // Filtered Exams
    const filteredExams = useMemo(() => {
        return exams.filter(exam => {
            const matchesSearch = 
                exam.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                exam.class?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                exam.type?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesClass = 
                selectedClassFilter === 'ALL' || exam.classId === selectedClassFilter || exam.class?.name === selectedClassFilter;

            const matchesType = 
                selectedTypeFilter === 'ALL' || exam.type === selectedTypeFilter;

            return matchesSearch && matchesClass && matchesType;
        });
    }, [exams, searchQuery, selectedClassFilter, selectedTypeFilter]);

    // Available classes from exams or school classes
    const availableClasses = useMemo(() => {
        const map = new Map<string, string>();
        exams.forEach(e => {
            if (e.class?.id && e.class?.name) {
                map.set(e.class.id, e.class.name);
            }
        });
        classes.forEach(c => {
            if (c.id && c.name) {
                map.set(c.id, c.name);
            }
        });
        return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
    }, [exams, classes]);

    // Statistics
    const gradedCount = useMemo(() => {
        return exams.filter(e => (e._count?.results || 0) > 0).length;
    }, [exams]);

    const upcomingCount = useMemo(() => {
        const now = new Date();
        return exams.filter(e => new Date(e.date) >= now).length;
    }, [exams]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                            <Award size={13} />
                            Academic Assessments
                        </span>
                        <span className="text-xs text-slate-400 font-medium">• Academic Year 2026-27</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Exams & Assessments
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">
                        View scheduled examinations, configure passing thresholds, and enter student marks.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 py-3.5 h-auto font-black text-xs uppercase tracking-wider gap-2 shadow-xl shadow-primary/25 transition-all hover:shadow-primary/40 active:scale-95"
                    >
                        <Plus size={18} />
                        Schedule Exam
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Examinations</p>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{exams.length}</h3>
                            <p className="text-xs font-medium text-slate-500 mt-1">
                                Scheduled throughout term
                            </p>
                        </div>
                        <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                            <FileText size={26} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Graded Exams</p>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{gradedCount}</h3>
                            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                                <CheckCircle2 size={13} />
                                Student marks published
                            </p>
                        </div>
                        <div className="size-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                            <Award size={26} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Schedule</p>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{upcomingCount}</h3>
                            <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-1 flex items-center gap-1">
                                <Clock size={13} />
                                Pending or in-progress
                            </p>
                        </div>
                        <div className="size-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                            <Calendar size={26} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
                {/* Search and Filters */}
                <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 space-y-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Class pills */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                            <button
                                onClick={() => setSelectedClassFilter('ALL')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                                    selectedClassFilter === 'ALL'
                                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                                }`}
                            >
                                All Classes ({exams.length})
                            </button>
                            {availableClasses.map(cls => {
                                const count = exams.filter(e => e.classId === cls.id || e.class?.name === cls.name).length;
                                return (
                                    <button
                                        key={cls.id}
                                        onClick={() => setSelectedClassFilter(cls.id)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                                            selectedClassFilter === cls.id
                                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                                        }`}
                                    >
                                        {cls.name} ({count})
                                    </button>
                                );
                            })}
                        </div>

                        {/* Search input */}
                        <div className="relative min-w-[260px] md:w-72">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search exams..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                            />
                        </div>
                    </div>

                    {/* Exam Type Tabs */}
                    <div className="flex items-center gap-6 text-xs font-bold pt-2 border-t border-slate-100 dark:border-slate-800/60">
                        <button
                            onClick={() => setSelectedTypeFilter('ALL')}
                            className={`pb-2 border-b-2 transition-all ${
                                selectedTypeFilter === 'ALL'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            All Exam Formats ({exams.length})
                        </button>
                        <button
                            onClick={() => setSelectedTypeFilter('MID_TERM')}
                            className={`pb-2 border-b-2 transition-all ${
                                selectedTypeFilter === 'MID_TERM'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            Mid-Term Examinations
                        </button>
                        <button
                            onClick={() => setSelectedTypeFilter('UNIT_TEST')}
                            className={`pb-2 border-b-2 transition-all ${
                                selectedTypeFilter === 'UNIT_TEST'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            Unit Tests
                        </button>
                        <button
                            onClick={() => setSelectedTypeFilter('FINAL')}
                            className={`pb-2 border-b-2 transition-all ${
                                selectedTypeFilter === 'FINAL'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            Final / Pre-Boards
                        </button>
                    </div>
                </div>

                {/* Exam Grid */}
                <div className="p-6 md:p-8">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-48 w-full rounded-2xl" />
                            ))}
                        </div>
                    ) : filteredExams.length === 0 ? (
                        <div className="py-16 text-center">
                            <div className="size-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
                                <Award size={28} />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">No examinations found</h3>
                            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                                No exams match your criteria. You can create a new assessment using the "Schedule Exam" button.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {filteredExams.map((exam) => {
                                const hasResults = (exam._count?.results || 0) > 0;
                                const dateObj = new Date(exam.date);

                                let typeLabel = 'MID TERM';
                                if (exam.type === 'UNIT_TEST') typeLabel = 'UNIT TEST';
                                else if (exam.type === 'FINAL') typeLabel = 'FINAL / PRE-BOARD';

                                return (
                                    <div
                                        key={exam.id}
                                        className="group bg-slate-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/80 rounded-2xl p-6 border border-slate-200/70 dark:border-slate-800 hover:border-primary/40 hover:shadow-xl transition-all flex flex-col justify-between gap-5 relative"
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary">
                                                        {exam.class?.name || 'Class 10th'}
                                                    </span>
                                                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                                        {typeLabel}
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={(e) => handleDeleteExam(exam.id, e)}
                                                    disabled={deletingId === exam.id}
                                                    title="Delete exam"
                                                    className="size-8 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>

                                            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                                {exam.name}
                                            </h3>

                                            <div className="grid grid-cols-2 gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-primary/70" />
                                                    <span>{dateObj.toLocaleDateString('en-IN', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock size={14} className="text-primary/70" />
                                                    <span>09:00 AM - 12:00 PM</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                                                <span>Max Marks: <strong className="text-slate-900 dark:text-white">{exam.totalMarks || 100}</strong></span>
                                                <span>•</span>
                                                <span>Passing: <strong className="text-slate-900 dark:text-white">{exam.passingMarks || 40}</strong></span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                            {hasResults ? (
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                                    <CheckCircle2 size={14} />
                                                    <span>{exam._count.results} Students Graded</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                                                    <AlertCircle size={14} />
                                                    <span>Pending Marks Entry</span>
                                                </div>
                                            )}

                                            <Link
                                                href={`/teacher/grades?examId=${exam.id}`}
                                                className="inline-flex items-center gap-1.5 text-xs font-black text-primary hover:text-primary/80 transition-all uppercase tracking-wider group-hover:translate-x-0.5"
                                            >
                                                <span>Enter Marks</span>
                                                <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Schedule Exam Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/70 dark:bg-slate-800/50">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white">Schedule New Examination</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Define exam name, format, and passing criteria</p>
                            </div>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="size-9 rounded-full bg-slate-200/70 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:bg-rose-500 hover:text-white transition-all"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateExam} className="p-6 md:p-8 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Exam Title *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Mathematics - Mid Term Examination"
                                    required
                                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Class *</label>
                                    <select
                                        value={formData.classId}
                                        onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                                        required
                                        className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer"
                                    >
                                        <option value="">Select Class</option>
                                        {classes.map(cls => (
                                            <option key={cls.id} value={cls.id}>{cls.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Examination Type *</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer"
                                    >
                                        <option value="MID_TERM">Mid-Term Examination</option>
                                        <option value="UNIT_TEST">Unit Test</option>
                                        <option value="FINAL">Final Examination</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Exam Date *</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Total Marks</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.totalMarks}
                                        onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) || 100 })}
                                        className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Passing Marks</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.passingMarks}
                                        onChange={(e) => setFormData({ ...formData, passingMarks: parseInt(e.target.value) || 40 })}
                                        className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="pt-3 flex justify-end gap-3">
                                <Button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    variant="ghost"
                                    className="text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs px-5"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-primary hover:bg-primary/90 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-primary/20 transition-all"
                                >
                                    {submitting ? 'Scheduling...' : 'Save & Schedule Exam'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
