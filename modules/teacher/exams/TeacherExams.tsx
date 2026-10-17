import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import {
    Plus,
    Search,
    Calendar,
    Clock,
    Award,
    FileText,
    CheckCircle2,
    X,
    Trash2,
    GraduationCap,
    ArrowRight,
    AlertCircle,
    ArrowLeft,
    Users,
    Sparkles,
    BookOpen,
    Filter
} from 'lucide-react';
import Link from 'next/link';
import { examsService } from '@/services/exams.service';
import { classesService } from '@/services/classes.service';
import { studentsService } from '@/services/students.service';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

export default function TeacherExams() {
    const router = useRouter();
    const { classId: queryClassId } = router.query;

    // Data states
    const [exams, setExams] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [classStudentCounts, setClassStudentCounts] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [loadingClasses, setLoadingClasses] = useState(true);

    // Navigation & Selection states
    // Step 1: Select Class & Section | Step 2: Class Exams Dashboard
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [selectedSectionId, setSelectedSectionId] = useState<string>('ALL');

    // Filters for Step 2
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Schedule Exam Modal
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'MID_TERM',
        date: '',
        totalMarks: 100,
        passingMarks: 40,
        classId: '',
    });
    const [submitting, setSubmitting] = useState(false);

    // Initial Load
    useEffect(() => {
        loadData();
    }, []);

    // Respond to queryClassId if provided in URL
    useEffect(() => {
        if (queryClassId && typeof queryClassId === 'string' && classes.length > 0) {
            const found = classes.find(c => c.id === queryClassId);
            if (found) {
                setSelectedClassId(found.id);
                setStep(2);
            }
        }
    }, [queryClassId, classes]);

    const loadData = async () => {
        setLoading(true);
        setLoadingClasses(true);
        try {
            const [examsRes, classesRes] = await Promise.all([
                examsService.getExams(),
                classesService.getAll()
            ]);

            const examList = Array.isArray(examsRes) ? examsRes : (examsRes?.data || []);
            setExams(examList);

            const rawClasses = Array.isArray(classesRes) ? classesRes : [];
            // Sort classes logically (Class 10th, 12th, 9th, 8th etc. first)
            const sortedClasses = [...rawClasses].sort((a, b) => {
                const getWeight = (name: string) => {
                    const match = name?.match(/\d+/);
                    return match ? parseInt(match[0], 10) : 0;
                };
                return getWeight(b.name) - getWeight(a.name);
            });
            setClasses(sortedClasses);

            // Fetch student counts for each class asynchronously
            const counts: Record<string, number> = {};
            await Promise.all(
                sortedClasses.map(async (cls) => {
                    try {
                        const stRes = await studentsService.getByClass(cls.id);
                        const list = Array.isArray(stRes) ? stRes : ((stRes as any)?.students || []);
                        counts[cls.id] = list.length;
                    } catch {
                        counts[cls.id] = 0;
                    }
                })
            );
            setClassStudentCounts(counts);

        } catch (error: any) {
            console.error('Failed to fetch exam data:', error);
            toast.error('Failed to load examination records.');
        } finally {
            setLoading(false);
            setLoadingClasses(false);
        }
    };

    const handleSelectClass = (classId: string, sectionId = 'ALL') => {
        setSelectedClassId(classId);
        setSelectedSectionId(sectionId);
        setStep(2);
        // Pre-fill schedule modal with this class
        setFormData(prev => ({ ...prev, classId }));
    };

    const handleCreateExam = async (e: React.FormEvent) => {
        e.preventDefault();
        const targetClassId = formData.classId || selectedClassId;
        if (!targetClassId || !formData.name || !formData.date) {
            toast.error('Please enter exam name, class, and examination date');
            return;
        }

        setSubmitting(true);
        try {
            await examsService.createExam({
                ...formData,
                classId: targetClassId,
                date: new Date(formData.date).toISOString() as any,
                totalMarks: Number(formData.totalMarks),
                passingMarks: Number(formData.passingMarks),
            });
            toast.success('Examination scheduled successfully!');
            setShowCreateModal(false);
            setFormData({
                name: '',
                type: 'MID_TERM',
                date: '',
                totalMarks: 100,
                passingMarks: 40,
                classId: selectedClassId,
            });
            // Refresh exams
            const refreshed = await examsService.getExams();
            setExams(Array.isArray(refreshed) ? refreshed : (refreshed?.data || []));
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

    // Active selected class object
    const selectedClass = useMemo(() => {
        return classes.find(c => c.id === selectedClassId) || null;
    }, [classes, selectedClassId]);

    // Available sections for the active class
    const availableSections = useMemo(() => {
        if (!selectedClass) return [];
        return selectedClass.sections || [];
    }, [selectedClass]);

    // Exams filtered for Step 2
    const classExams = useMemo(() => {
        if (!selectedClassId) return [];
        return exams.filter(exam => {
            const matchesClass = exam.classId === selectedClassId || exam.class?.id === selectedClassId || exam.class?.name === selectedClass?.name;
            return matchesClass;
        });
    }, [exams, selectedClassId, selectedClass]);

    // Filtered by search and format type
    const filteredClassExams = useMemo(() => {
        return classExams.filter(exam => {
            const matchesSearch =
                exam.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                exam.type?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesType =
                selectedTypeFilter === 'ALL' || exam.type === selectedTypeFilter;

            return matchesSearch && matchesType;
        });
    }, [classExams, searchQuery, selectedTypeFilter]);

    // Overall stats
    const gradedCount = useMemo(() => {
        return exams.filter(e => (e._count?.results || 0) > 0).length;
    }, [exams]);

    const upcomingCount = useMemo(() => {
        const now = new Date();
        return exams.filter(e => new Date(e.date) >= now).length;
    }, [exams]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header */}
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
                        {step === 1
                            ? 'Select a class and section to view scheduled examinations, manage grading thresholds, and enter student marks.'
                            : `Managing examinations and grading for ${selectedClass?.name || 'Selected Class'}.`}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {step === 2 && (
                        <button
                            onClick={() => setStep(1)}
                            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all"
                        >
                            <ArrowLeft size={16} />
                            <span>Switch Class</span>
                        </button>
                    )}
                    <Button
                        onClick={() => {
                            if (selectedClassId) {
                                setFormData(prev => ({ ...prev, classId: selectedClassId }));
                            }
                            setShowCreateModal(true);
                        }}
                        className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 py-3.5 h-auto font-black text-xs uppercase tracking-wider gap-2 shadow-xl shadow-primary/25 transition-all hover:shadow-primary/40 active:scale-95"
                    >
                        <Plus size={18} />
                        Schedule Exam
                    </Button>
                </div>
            </div>

            {/* Quick Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Examinations</p>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{exams.length}</h3>
                            <p className="text-xs font-medium text-slate-500 mt-1">
                                Scheduled across {classes.length} classes
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
                                Student marks evaluated
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

            {/* STEP 1: CLASS & SECTION SELECTOR */}
            {step === 1 && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden p-6 md:p-8 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="flex size-7 rounded-lg bg-primary/10 text-primary items-center justify-center font-black text-xs">1</span>
                                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                                    Select Class & Section
                                </h2>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                Click on any class to view its scheduled examinations, marks, and evaluation status.
                            </p>
                        </div>

                        <span className="text-xs font-bold text-slate-400">
                            {classes.length} Classes Available
                        </span>
                    </div>

                    {loadingClasses ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} className="h-44 w-full rounded-2xl" />
                            ))}
                        </div>
                    ) : classes.length === 0 ? (
                        <div className="py-16 text-center">
                            <GraduationCap className="mx-auto size-14 text-slate-400 mb-3" />
                            <h3 className="text-base font-bold text-slate-800 dark:text-white">No classes assigned</h3>
                            <p className="text-xs text-slate-500 mt-1">Check with your school administrator for class allocations.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {classes.map((cls) => {
                                const examCount = exams.filter(e => e.classId === cls.id || e.class?.id === cls.id || e.class?.name === cls.name).length;
                                const studentCount = classStudentCounts[cls.id] || 0;
                                const sections = cls.sections || [];

                                return (
                                    <div
                                        key={cls.id}
                                        onClick={() => handleSelectClass(cls.id, 'ALL')}
                                        className="group bg-slate-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/80 rounded-2xl p-6 border-2 border-slate-200/70 dark:border-slate-800 hover:border-primary/50 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between gap-5 relative"
                                    >
                                        <div className="space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div className="size-12 rounded-2xl bg-primary/10 group-hover:bg-primary text-primary group-hover:text-white flex items-center justify-center transition-all shadow-sm">
                                                    <GraduationCap size={24} />
                                                </div>
                                                <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                                    <FileText size={12} />
                                                    {examCount} {examCount === 1 ? 'Exam' : 'Exams'}
                                                </span>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                                    {cls.name}
                                                </h3>
                                                <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mt-1">
                                                    <Users size={13} className="text-primary/70" />
                                                    <span>{studentCount} Students Enrolled</span>
                                                </p>
                                            </div>

                                            {/* Sections Pill buttons */}
                                            {sections.length > 0 && (
                                                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Sections:</p>
                                                    <div className="flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
                                                        {sections.map((sec: any) => (
                                                            <button
                                                                key={sec.id}
                                                                onClick={() => handleSelectClass(cls.id, sec.id)}
                                                                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary transition-all text-slate-700 dark:text-slate-300"
                                                            >
                                                                Section {sec.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-black text-primary uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                                            <span>View Class Exams</span>
                                            <ArrowRight size={15} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* STEP 2: CLASS EXAMINATIONS DASHBOARD */}
            {step === 2 && selectedClass && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden space-y-0">
                    {/* Top Bar with Class Switcher */}
                    <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="size-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-primary hover:border-primary transition-all shadow-sm"
                                title="Back to Classes"
                            >
                                <ArrowLeft size={18} />
                            </button>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-400">Class:</span>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                                        {selectedClass.name}
                                    </h2>
                                    {selectedSectionId !== 'ALL' && (
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-primary/10 text-primary border border-primary/20">
                                            Section {availableSections.find((s: any) => s.id === selectedSectionId)?.name || selectedSectionId}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 font-medium">
                                    {classStudentCounts[selectedClass.id] || 0} Students Enrolled • {classExams.length} Scheduled Assessments
                                </p>
                            </div>
                        </div>

                        {/* Quick section switcher pills */}
                        {availableSections.length > 0 && (
                            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                                <button
                                    onClick={() => setSelectedSectionId('ALL')}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                        selectedSectionId === 'ALL'
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                    }`}
                                >
                                    All Sections
                                </button>
                                {availableSections.map((sec: any) => (
                                    <button
                                        key={sec.id}
                                        onClick={() => setSelectedSectionId(sec.id)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                            selectedSectionId === sec.id
                                                ? 'bg-primary text-white shadow-sm'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                        }`}
                                    >
                                        Section {sec.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Filter and Search Bar */}
                    <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 space-y-5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Exam Type Tabs */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                                {[
                                    { id: 'ALL', label: `All Exams (${classExams.length})` },
                                    { id: 'MID_TERM', label: 'Mid-Term' },
                                    { id: 'UNIT_TEST', label: 'Unit Tests' },
                                    { id: 'FINAL', label: 'Final / Pre-Boards' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setSelectedTypeFilter(tab.id)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                                            selectedTypeFilter === tab.id
                                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
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
                    </div>

                    {/* Exams List Grid */}
                    <div className="p-6 md:p-8">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton key={i} className="h-48 w-full rounded-2xl" />
                                ))}
                            </div>
                        ) : filteredClassExams.length === 0 ? (
                            <div className="py-16 text-center space-y-4">
                                <div className="size-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                                    <Award size={28} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                        No examinations found for {selectedClass.name}
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                                        No assessments match the current filter. You can schedule a new exam now.
                                    </p>
                                </div>
                                <Button
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, classId: selectedClass.id }));
                                        setShowCreateModal(true);
                                    }}
                                    className="bg-primary text-white rounded-xl text-xs font-bold px-5 py-2.5"
                                >
                                    <Plus size={15} />
                                    Schedule Exam for {selectedClass.name}
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {filteredClassExams.map((exam) => {
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
                                                            {selectedClass.name}
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
                                                    href={`/teacher/grades?classId=${selectedClass.id}&examId=${exam.id}`}
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
            )}

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
                                    placeholder="e.g. Mathematics - Pre-Board Examination"
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
                                        <option value="FINAL">Final / Pre-Board Examination</option>
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
