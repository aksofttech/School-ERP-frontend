import { useState, useEffect, useMemo } from 'react';
import {
    Plus,
    Search,
    Calendar,
    Clock,
    BookOpen,
    Trash2,
    Pencil,
    CheckCircle2,
    AlertCircle,
    X,
    FolderKanban,
    Users,
    Sparkles,
    FileText,
    ArrowUpRight,
    ArrowLeft,
    ArrowRight,
    GraduationCap,
    CalendarDays,
    Filter,
    Layers,
    Check
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { homeworkService } from '@/services/homework.service';
import { classesService } from '@/services/classes.service';
import { useClasses } from '@/hooks/useClasses';
import { useSubjects } from '@/hooks/useSubjects';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

const homeworkSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(5, 'Please provide instructions for the students'),
    classId: z.string().min(1, 'Please select a target class'),
    subjectId: z.string().min(1, 'Please select a subject'),
    dueDate: z.string().min(1, 'Submission due date is required'),
});

type HomeworkFormValues = z.infer<typeof homeworkSchema>;

// Format YYYY-MM-DD
const formatDateString = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function TeacherAssignments() {
    // 2-Step Flow: Step 1 = Class & Section Selection, Step 2 = Class Homework Manager
    const [step, setStep] = useState<1 | 2>(1);

    // Assignments state
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Selected Class & Section state
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [selectedSectionId, setSelectedSectionId] = useState<string>('ALL');
    const [availableSections, setAvailableSections] = useState<any[]>([]);
    const [loadingSections, setLoadingSections] = useState(false);

    // Date Filtering & Actions
    // todayStr e.g. "2026-10-17"
    const todayStr = useMemo(() => formatDateString(new Date()), []);
    const [filterDate, setFilterDate] = useState<string>(''); // specific date chosen via calendar or 'today'
    const [dateMode, setDateMode] = useState<'ALL' | 'TODAY' | 'CUSTOM'>('ALL');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'PAST'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'DUE_DATE' | 'CREATED_DATE'>('DUE_DATE');

    // Modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingHomework, setEditingHomework] = useState<any | null>(null);
    const [selectedDetail, setSelectedDetail] = useState<any | null>(null);
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const { classes, loading: loadingClasses } = useClasses();
    const { subjects } = useSubjects();

    // Create Form
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm<HomeworkFormValues>({
        resolver: zodResolver(homeworkSchema),
    });

    // Edit Form state
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        classId: '',
        subjectId: '',
        dueDate: '',
    });

    // Fetch all assignments for current teacher
    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const res = await homeworkService.getHomework();
            const list = Array.isArray(res) ? res : (res?.data || []);
            setAssignments(list);
        } catch (error: any) {
            console.error('Failed to load homework assignments:', error);
            toast.error('Failed to load assignments.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    // Pick initial default class once classes are loaded
    useEffect(() => {
        if (classes.length > 0 && !selectedClassId) {
            // Prefer Class 10th or senior classes
            const preferred =
                classes.find(c => c.name === 'Class 10th') ||
                classes.find(c => c.name?.includes('10')) ||
                classes[0];
            if (preferred) {
                setSelectedClassId(preferred.id);
            }
        }
    }, [classes, selectedClassId]);

    // When selected class changes, load sections for it
    useEffect(() => {
        if (!selectedClassId) {
            setAvailableSections([]);
            setSelectedSectionId('ALL');
            return;
        }

        const selectedClassObj = classes.find(c => c.id === selectedClassId);
        if (selectedClassObj?.sections && Array.isArray(selectedClassObj.sections) && selectedClassObj.sections.length > 0) {
            setAvailableSections(selectedClassObj.sections);
            return;
        }

        const fetchSections = async () => {
            setLoadingSections(true);
            try {
                const res = await classesService.getSections(selectedClassId);
                const secs = Array.isArray(res) ? res : ((res as any)?.data || []);
                setAvailableSections(secs);
            } catch (err) {
                console.error('Failed to fetch sections:', err);
                setAvailableSections([]);
            } finally {
                setLoadingSections(false);
            }
        };
        fetchSections();
    }, [selectedClassId, classes]);

    // Set default subject and class when opening create modal
    const openCreateModal = (presetDate?: string) => {
        if (selectedClassId) {
            setValue('classId', selectedClassId);
        }
        if (subjects && subjects.length > 0) {
            const math = subjects.find(s => s.name.toLowerCase().includes('math')) || subjects[0];
            setValue('subjectId', math.id);
        }
        // If preset date is passed (e.g. today or tomorrow)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const defaultDue = presetDate || formatDateString(tomorrow);
        setValue('dueDate', defaultDue);
        setValue('title', '');
        setValue('description', '');
        setIsCreateModalOpen(true);
    };

    // Open Edit modal
    const handleOpenEdit = (task: any, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setEditingHomework(task);
        const dueDateFormatted = task.dueDate ? formatDateString(new Date(task.dueDate)) : todayStr;
        setEditForm({
            title: task.title || '',
            description: task.description || '',
            classId: task.classId || task.class?.id || '',
            subjectId: task.subjectId || task.subject?.id || '',
            dueDate: dueDateFormatted,
        });
    };

    // Handle Create Submit
    const onCreate = async (data: HomeworkFormValues) => {
        setCreating(true);
        try {
            await homeworkService.create(data);
            toast.success('Homework assignment posted successfully!');
            setIsCreateModalOpen(false);
            reset();
            await fetchAssignments();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Failed to create assignment.');
        } finally {
            setCreating(false);
        }
    };

    // Handle Update Submit
    const onUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingHomework) return;
        if (!editForm.title.trim()) {
            toast.error('Title is required');
            return;
        }
        if (!editForm.dueDate) {
            toast.error('Due date is required');
            return;
        }

        setUpdating(true);
        try {
            await homeworkService.update(editingHomework.id, {
                title: editForm.title,
                description: editForm.description,
                subjectId: editForm.subjectId || undefined,
                dueDate: editForm.dueDate,
            });
            toast.success('Homework assignment updated successfully!');
            setEditingHomework(null);
            await fetchAssignments();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Failed to update assignment.');
        } finally {
            setUpdating(false);
        }
    };

    // Handle Delete
    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to remove this homework assignment?')) return;
        setDeletingId(id);
        try {
            await homeworkService.delete(id);
            toast.success('Assignment deleted successfully.');
            setAssignments(prev => prev.filter(a => a.id !== id));
            if (selectedDetail?.id === id) {
                setSelectedDetail(null);
            }
            if (editingHomework?.id === id) {
                setEditingHomework(null);
            }
        } catch (error: any) {
            console.error(error);
            toast.error('Failed to delete assignment.');
        } finally {
            setDeletingId(null);
        }
    };

    // Currently selected class object
    const currentClass = useMemo(() => {
        return classes.find(c => c.id === selectedClassId) || null;
    }, [classes, selectedClassId]);

    // Assignments filtered for Step 2
    const filteredAssignments = useMemo(() => {
        const now = new Date();
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        return assignments.filter(item => {
            // Class filter: In step 2, strictly filter by selectedClassId
            const matchesClass = !selectedClassId || item.class?.id === selectedClassId || item.classId === selectedClassId;
            if (!matchesClass) return false;

            // Search query filter
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchesSearch =
                    item.title?.toLowerCase().includes(q) ||
                    item.description?.toLowerCase().includes(q) ||
                    item.subject?.name?.toLowerCase().includes(q);
                if (!matchesSearch) return false;
            }

            // Date filtering
            const dueDateObj = new Date(item.dueDate);
            const dueDateStr = formatDateString(dueDateObj);
            const createdAtStr = item.createdAt ? formatDateString(new Date(item.createdAt)) : '';

            if (dateMode === 'TODAY') {
                // Matches either created today or due today
                const isToday = dueDateStr === todayStr || createdAtStr === todayStr;
                if (!isToday) return false;
            } else if (dateMode === 'CUSTOM' && filterDate) {
                // Matches either due on filterDate or assigned on filterDate
                const matchesDate = dueDateStr === filterDate || createdAtStr === filterDate;
                if (!matchesDate) return false;
            }

            // Status filter
            const isPast = dueDateObj < startOfToday;
            if (statusFilter === 'ACTIVE' && isPast) return false;
            if (statusFilter === 'PAST' && !isPast) return false;

            return true;
        }).sort((a, b) => {
            if (sortBy === 'DUE_DATE') {
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            } else {
                return new Date(b.createdAt || b.dueDate).getTime() - new Date(a.createdAt || a.dueDate).getTime();
            }
        });
    }, [assignments, selectedClassId, searchQuery, dateMode, filterDate, todayStr, statusFilter, sortBy]);

    // Overall stats
    const activeCount = useMemo(() => {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        return assignments.filter(a => new Date(a.dueDate) >= startOfToday).length;
    }, [assignments]);

    // Homework count per class for cards in Step 1
    const classStatsMap = useMemo(() => {
        const map: Record<string, number> = {};
        assignments.forEach(a => {
            const cid = a.class?.id || a.classId;
            if (cid) {
                map[cid] = (map[cid] || 0) + 1;
            }
        });
        return map;
    }, [assignments]);

    // Today's assignments count for current class
    const todayCountForCurrentClass = useMemo(() => {
        return assignments.filter(a => {
            const matchesClass = !selectedClassId || a.class?.id === selectedClassId || a.classId === selectedClassId;
            if (!matchesClass) return false;
            const dueStr = formatDateString(new Date(a.dueDate));
            const createdStr = a.createdAt ? formatDateString(new Date(a.createdAt)) : '';
            return dueStr === todayStr || createdStr === todayStr;
        }).length;
    }, [assignments, selectedClassId, todayStr]);

    // Sort classes so active teaching batches (10th, 9th, 8th, 11th, 12th) & those with assignments appear first
    const sortedClasses = useMemo(() => {
        return [...classes].sort((a, b) => {
            const countA = classStatsMap[a.id] || 0;
            const countB = classStatsMap[b.id] || 0;
            if (countA > 0 && countB === 0) return -1;
            if (countB > 0 && countA === 0) return 1;

            const getPriority = (name: string) => {
                if (name.includes('10')) return 1;
                if (name.includes('9')) return 2;
                if (name.includes('8')) return 3;
                if (name.includes('11')) return 4;
                if (name.includes('12')) return 5;
                if (name.includes('7')) return 6;
                if (name.includes('6')) return 7;
                if (name.includes('5')) return 8;
                if (name.includes('4')) return 9;
                if (name.includes('3')) return 10;
                if (name.includes('2')) return 11;
                if (name.includes('1st')) return 12;
                return 20;
            };
            return getPriority(a.name) - getPriority(b.name);
        });
    }, [classes, classStatsMap]);

    // Direct navigation when clicking on a class card: "in pr click karne pr hi aage jana chiye"
    const handleSelectClass = (cls: any, sectionId: string = 'ALL') => {
        setSelectedClassId(cls.id);
        setSelectedSectionId(sectionId);
        setStep(2);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-16">
            {/* Top Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                            <BookOpen size={13} />
                            Faculty Curriculum Suite
                        </span>
                        <span className="text-xs text-slate-400 font-medium">• Academic Year 2026-27</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Homework & Assignments
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">
                        Select a Class & Section to manage homework, assign daily tasks, and filter by calendar date.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {step === 2 && (
                        <Button
                            onClick={() => setStep(1)}
                            variant="outline"
                            className="rounded-2xl px-4 py-3 h-auto font-bold text-xs gap-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <ArrowLeft size={16} />
                            Change Class
                        </Button>
                    )}
                    <Button
                        onClick={() => openCreateModal()}
                        className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 py-3.5 h-auto font-black text-xs uppercase tracking-wider gap-2 shadow-xl shadow-primary/25 transition-all hover:shadow-primary/40 active:scale-95"
                    >
                        <Plus size={18} />
                        Create Assignment
                    </Button>
                </div>
            </div>

            {/* Quick KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Homework</p>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{activeCount}</h3>
                            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                                <Sparkles size={12} />
                                Ongoing submissions open
                            </p>
                        </div>
                        <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                            <FolderKanban size={26} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Tasks Assigned</p>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{assignments.length}</h3>
                            <p className="text-xs font-medium text-slate-500 mt-1">
                                Across all teaching batches
                            </p>
                        </div>
                        <div className="size-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                            <FileText size={26} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Classes</p>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                                {Object.keys(classStatsMap).length || classes.length}
                            </h3>
                            <p className="text-xs font-medium text-slate-500 mt-1">
                                Secondary & Senior Wings
                            </p>
                        </div>
                        <div className="size-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                            <Users size={26} />
                        </div>
                    </div>
                </div>
            </div>

            {/* STEP 1: CLASS & SECTION SELECTOR */}
            {step === 1 && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden p-6 md:p-8 space-y-6">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
                        <div className="flex items-center gap-2.5">
                            <span className="size-8 rounded-xl bg-primary text-white flex items-center justify-center font-black text-xs">
                                1
                            </span>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                    Select Class & Section
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Choose a class to manage homework tasks, view student submissions, and assign coursework.
                                </p>
                            </div>
                        </div>
                    </div>

                    {loadingClasses ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} className="h-44 w-full rounded-2xl" />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {sortedClasses.map((cls) => {
                                    const isSelected = selectedClassId === cls.id;
                                    const hwCount = classStatsMap[cls.id] || 0;

                                    return (
                                        <div
                                            key={cls.id}
                                            onClick={() => handleSelectClass(cls, 'ALL')}
                                            className="rounded-2xl p-5 border cursor-pointer transition-all relative flex flex-col justify-between group bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-700/60 hover:border-primary hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.99]"
                                        >
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="size-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-primary font-black shadow-sm group-hover:scale-105 transition-transform">
                                                        <GraduationCap size={22} />
                                                    </div>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                                                            hwCount > 0
                                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                                                        }`}
                                                    >
                                                        {hwCount} {hwCount === 1 ? 'Assignment' : 'Assignments'}
                                                    </span>
                                                </div>

                                                <div>
                                                    <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors flex items-center justify-between">
                                                        {cls.name}
                                                        <span className="text-[11px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-primary">
                                                            Open Dashboard <ArrowRight size={13} />
                                                        </span>
                                                    </h3>
                                                    <p className="text-xs text-slate-500 mt-0.5">
                                                        CBSE Secondary Curriculum
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Direct Section and Action Bar */}
                                            <div className="mt-5 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                                                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                                    <span className="text-[11px] font-bold text-slate-400 mr-1">Section:</span>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSelectClass(cls, 'ALL');
                                                        }}
                                                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-primary hover:text-white transition-colors"
                                                    >
                                                        All
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSelectClass(cls, 'SEC_A');
                                                        }}
                                                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                                                    >
                                                        Sec A
                                                    </button>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleSelectClass(cls, 'ALL')}
                                                    className="text-xs font-black text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                                                >
                                                    View Homework
                                                    <ArrowRight size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* STEP 2: CLASS HOMEWORK DASHBOARD */}
            {step === 2 && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in duration-300">
                    {/* Sticky/Sub-header with active class indicator & quick switcher */}
                    <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 space-y-6">
                        {/* Class and Section Info Bar */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setStep(1)}
                                    title="Go back to class selection"
                                    className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-all"
                                >
                                    <ArrowLeft size={18} />
                                </button>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                            {currentClass?.name || 'Class 10th'}
                                        </h2>
                                        <span className="px-3 py-1 rounded-full text-xs font-black bg-primary/10 text-primary border border-primary/20">
                                            {selectedSectionId === 'ALL' ? 'All Sections' : 'Section A'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                                        Showing {filteredAssignments.length} homework task{filteredAssignments.length === 1 ? '' : 's'} for this class
                                    </p>
                                </div>
                            </div>

                            {/* Quick Switch Class Pills */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1">
                                    Teaching Classes:
                                </span>
                                {sortedClasses.map(cls => {
                                    const isCurrent = cls.id === selectedClassId;
                                    const count = classStatsMap[cls.id] || 0;
                                    return (
                                        <button
                                            key={cls.id}
                                            onClick={() => {
                                                setSelectedClassId(cls.id);
                                                setDateMode('ALL');
                                                setFilterDate('');
                                            }}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                                                isCurrent
                                                    ? 'bg-primary text-white shadow-sm'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                            }`}
                                        >
                                            {cls.name} ({count})
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* DATE CONTROLS TOOLBAR */}
                        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-3">
                                {/* All Dates Button */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDateMode('ALL');
                                        setFilterDate('');
                                    }}
                                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                        dateMode === 'ALL'
                                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                    }`}
                                >
                                    All Dates
                                </button>

                                {/* Due Today Button */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDateMode('TODAY');
                                        setFilterDate(todayStr);
                                    }}
                                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                                        dateMode === 'TODAY'
                                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary/50'
                                    }`}
                                >
                                    <Clock size={14} className={dateMode === 'TODAY' ? 'text-white' : 'text-primary'} />
                                    Due Today
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${dateMode === 'TODAY' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                                        {todayCountForCurrentClass}
                                    </span>
                                </button>

                                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

                                {/* Calendar Date Picker */}
                                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <CalendarDays size={16} className="text-primary" />
                                    <label htmlFor="calendarDateInput" className="text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer whitespace-nowrap">
                                        Calendar Date:
                                    </label>
                                    <input
                                        id="calendarDateInput"
                                        type="date"
                                        value={filterDate}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setFilterDate(val);
                                            if (val) {
                                                setDateMode(val === todayStr ? 'TODAY' : 'CUSTOM');
                                            } else {
                                                setDateMode('ALL');
                                            }
                                        }}
                                        className="bg-transparent text-xs font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
                                    />
                                    {filterDate && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setDateMode('ALL');
                                                setFilterDate('');
                                            }}
                                            title="Clear date filter"
                                            className="size-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-colors"
                                        >
                                            <X size={12} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Active Date Filter Tag */}
                            {dateMode !== 'ALL' && (
                                <div className="flex items-center gap-2 self-start md:self-auto">
                                    <span className="text-xs font-bold text-slate-400">
                                        Active Filter:
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-primary/10 text-primary border border-primary/20">
                                        <Calendar size={12} />
                                        {dateMode === 'TODAY' ? `Today (${todayStr})` : filterDate}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setDateMode('ALL');
                                                setFilterDate('');
                                            }}
                                            className="hover:text-rose-500 ml-0.5"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Search and Status Filters */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                            {/* Status Tabs */}
                            <div className="flex items-center gap-5 text-xs font-bold">
                                <button
                                    onClick={() => setStatusFilter('ALL')}
                                    className={`pb-2 border-b-2 transition-all ${
                                        statusFilter === 'ALL'
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    All Tasks ({filteredAssignments.length})
                                </button>
                                <button
                                    onClick={() => setStatusFilter('ACTIVE')}
                                    className={`pb-2 border-b-2 transition-all ${
                                        statusFilter === 'ACTIVE'
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    Active & Upcoming
                                </button>
                                <button
                                    onClick={() => setStatusFilter('PAST')}
                                    className={`pb-2 border-b-2 transition-all ${
                                        statusFilter === 'PAST'
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    Past Due
                                </button>
                            </div>

                            {/* Search Box & Sort */}
                            <div className="flex items-center gap-3">
                                <div className="relative w-full sm:w-64">
                                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search title, chapter..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                    />
                                </div>

                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2 px-3 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                                >
                                    <option value="DUE_DATE">Sort: Due Date</option>
                                    <option value="CREATED_DATE">Sort: Newest</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Homework Cards List */}
                    <div className="p-6 md:p-8">
                        {loading ? (
                            <div className="space-y-4">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <Skeleton key={i} className="h-32 w-full rounded-2xl" />
                                ))}
                            </div>
                        ) : filteredAssignments.length === 0 ? (
                            <div className="py-16 text-center">
                                <div className="size-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
                                    <BookOpen size={28} />
                                </div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    No homework assignments found
                                </h3>
                                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                                    {dateMode !== 'ALL' || searchQuery || statusFilter !== 'ALL'
                                        ? 'No homework matches the selected date or search filter. Try clearing filters or post new homework.'
                                        : `No homework assignments have been posted for ${currentClass?.name || 'this class'} yet.`}
                                </p>
                                <div className="mt-5 flex justify-center gap-3">
                                    {dateMode !== 'ALL' && (
                                        <Button
                                            onClick={() => {
                                                setDateMode('ALL');
                                                setFilterDate('');
                                            }}
                                            variant="outline"
                                            className="text-xs font-bold rounded-xl"
                                        >
                                            Show All Dates
                                        </Button>
                                    )}
                                    <Button
                                        onClick={() => openCreateModal(dateMode === 'TODAY' ? todayStr : filterDate || undefined)}
                                        className="bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl gap-1.5"
                                    >
                                        <Plus size={16} />
                                        Post Homework for {currentClass?.name}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {filteredAssignments.map((task) => {
                                    const dueDateObj = new Date(task.dueDate);
                                    const now = new Date();
                                    const isPastDue = dueDateObj < now;
                                    const diffDays = Math.ceil((dueDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                                    const isDueToday = formatDateString(dueDateObj) === todayStr;

                                    let dueBadgeLabel = `Due in ${diffDays} day${diffDays === 1 ? '' : 's'}`;
                                    let dueBadgeStyle = 'bg-primary/10 text-primary border-primary/20';

                                    if (isPastDue) {
                                        dueBadgeLabel = 'Past Due';
                                        dueBadgeStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700';
                                    } else if (isDueToday) {
                                        dueBadgeLabel = 'Due Today';
                                        dueBadgeStyle = 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
                                    } else if (diffDays <= 1) {
                                        dueBadgeLabel = 'Due Tomorrow';
                                        dueBadgeStyle = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
                                    }

                                    return (
                                        <div
                                            key={task.id}
                                            onClick={() => setSelectedDetail(task)}
                                            className="group bg-slate-50/60 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/80 rounded-2xl p-6 border border-slate-200/70 dark:border-slate-800 hover:border-primary/40 hover:shadow-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 cursor-pointer relative"
                                        >
                                            <div className="space-y-2.5 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary">
                                                        {task.class?.name || currentClass?.name || 'Class 10th'}
                                                    </span>
                                                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                                        {task.subject?.name || 'Mathematics'}
                                                    </span>
                                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${dueBadgeStyle}`}>
                                                        {dueBadgeLabel}
                                                    </span>
                                                    {task.createdAt && (
                                                        <span className="text-[11px] text-slate-400 font-medium">
                                                            Assigned: {new Date(task.createdAt).toLocaleDateString('en-IN', {
                                                                day: '2-digit',
                                                                month: 'short'
                                                            })}
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                                    {task.title}
                                                </h3>

                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                                    {task.description || 'No detailed instructions provided.'}
                                                </p>
                                            </div>

                                            {/* Due Date & Action Buttons */}
                                            <div className="flex items-center justify-between md:justify-end gap-5 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                                                <div className="text-left md:text-right">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                        Submission Date
                                                    </p>
                                                    <p className="text-xs font-black text-slate-900 dark:text-white flex items-center md:justify-end gap-1.5 mt-0.5">
                                                        <Calendar size={13} className="text-primary" />
                                                        {dueDateObj.toLocaleDateString('en-IN', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {/* Edit Button ("edit karenge") */}
                                                    <button
                                                        onClick={(e) => handleOpenEdit(task, e)}
                                                        title="Edit assignment"
                                                        className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary hover:bg-primary/10 flex items-center justify-center transition-all"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>

                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={(e) => handleDelete(task.id, e)}
                                                        disabled={deletingId === task.id}
                                                        title="Delete assignment"
                                                        className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center justify-center transition-all disabled:opacity-50"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>

                                                    {/* View Detail Arrow */}
                                                    <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                                        <ArrowUpRight size={18} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* CREATE ASSIGNMENT MODAL ("home work teacher dalenge") */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/70 dark:bg-slate-800/50">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white">Create New Homework</h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Assign homework to {currentClass?.name || 'Class'} students
                                </p>
                            </div>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="size-9 rounded-full bg-slate-200/70 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:bg-rose-500 hover:text-white transition-all"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 md:p-8 overflow-y-auto">
                            <form onSubmit={handleSubmit(onCreate)} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                        Homework Title *
                                    </label>
                                    <input
                                        {...register('title')}
                                        placeholder="e.g. Chapter 4: Quadratic Equations - Exercise 4.2"
                                        className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                    />
                                    {errors.title && <span className="text-xs text-rose-500 font-medium">{errors.title.message}</span>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Target Class *
                                        </label>
                                        <select
                                            {...register('classId')}
                                            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer"
                                        >
                                            <option value="">Select Target Class</option>
                                            {classes.map(cls => (
                                                <option key={cls.id} value={cls.id}>{cls.name}</option>
                                            ))}
                                        </select>
                                        {errors.classId && <span className="text-xs text-rose-500 font-medium">{errors.classId.message}</span>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Subject *
                                        </label>
                                        <select
                                            {...register('subjectId')}
                                            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer"
                                        >
                                            <option value="">Select Subject</option>
                                            {subjects.map(sub => (
                                                <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
                                            ))}
                                        </select>
                                        {errors.subjectId && <span className="text-xs text-rose-500 font-medium">{errors.subjectId.message}</span>}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                        Submission Due Date *
                                    </label>
                                    <input
                                        type="date"
                                        {...register('dueDate')}
                                        min={todayStr}
                                        className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer"
                                    />
                                    {errors.dueDate && <span className="text-xs text-rose-500 font-medium">{errors.dueDate.message}</span>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                        Instructions / Homework Questions *
                                    </label>
                                    <textarea
                                        {...register('description')}
                                        rows={4}
                                        placeholder="Detailed instructions for students, e.g. Solve Q1-Q12 from NCERT book in homework notebooks..."
                                        className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none"
                                    />
                                    {errors.description && <span className="text-xs text-rose-500 font-medium">{errors.description.message}</span>}
                                </div>

                                <div className="pt-3 flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        variant="ghost"
                                        className="text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs px-5"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={creating}
                                        className="bg-primary hover:bg-primary/90 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-primary/20 transition-all"
                                    >
                                        {creating ? 'Posting Assignment...' : 'Post Assignment'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT ASSIGNMENT MODAL ("and edit karenge") */}
            {editingHomework && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/70 dark:bg-slate-800/50">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white">Edit Homework Assignment</h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Modify title, questions, subject, or submission deadline
                                </p>
                            </div>
                            <button
                                onClick={() => setEditingHomework(null)}
                                className="size-9 rounded-full bg-slate-200/70 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:bg-rose-500 hover:text-white transition-all"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 md:p-8 overflow-y-auto">
                            <form onSubmit={onUpdate} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                        Assignment Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.title}
                                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                        placeholder="Assignment Title"
                                        className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Subject *
                                        </label>
                                        <select
                                            value={editForm.subjectId}
                                            onChange={(e) => setEditForm({ ...editForm, subjectId: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer"
                                        >
                                            <option value="">Select Subject</option>
                                            {subjects.map(sub => (
                                                <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Submission Due Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={editForm.dueDate}
                                            onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                        Instructions / Homework Questions *
                                    </label>
                                    <textarea
                                        rows={5}
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        placeholder="Detailed instructions..."
                                        className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none"
                                    />
                                </div>

                                <div className="pt-3 flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        onClick={() => setEditingHomework(null)}
                                        variant="ghost"
                                        className="text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs px-5"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={updating}
                                        className="bg-primary hover:bg-primary/90 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-primary/20 transition-all"
                                    >
                                        {updating ? 'Saving Changes...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* DETAIL VIEW MODAL */}
            {selectedDetail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/70 dark:bg-slate-800/50">
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary">
                                    {selectedDetail.class?.name || currentClass?.name}
                                </span>
                                <span className="px-3 py-1 rounded-lg text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                    {selectedDetail.subject?.name}
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedDetail(null)}
                                className="size-9 rounded-full bg-slate-200/70 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:bg-slate-300 transition-all"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 md:p-8 space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {selectedDetail.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium mt-2">
                                    <span className="flex items-center gap-1.5">
                                        <Clock size={13} className="text-primary" />
                                        Due Date: {new Date(selectedDetail.dueDate).toLocaleDateString('en-IN', {
                                            weekday: 'short',
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </span>
                                    {selectedDetail.createdAt && (
                                        <span className="flex items-center gap-1.5">
                                            <Calendar size={13} className="text-slate-400" />
                                            Assigned: {new Date(selectedDetail.createdAt).toLocaleDateString('en-IN', {
                                                day: '2-digit',
                                                month: 'short'
                                            })}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                    Instructions & Problem Set
                                </p>
                                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                    {selectedDetail.description || 'No detailed instructions.'}
                                </p>
                            </div>

                            <div className="pt-2 flex justify-between items-center">
                                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                                    <CheckCircle2 size={16} />
                                    Submissions accepted in classroom
                                </span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        onClick={(e) => {
                                            const task = selectedDetail;
                                            setSelectedDetail(null);
                                            handleOpenEdit(task, e);
                                        }}
                                        variant="outline"
                                        className="text-xs font-bold px-4 py-2 rounded-xl border-slate-300 dark:border-slate-700 gap-1.5"
                                    >
                                        <Pencil size={14} />
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => setSelectedDetail(null)}
                                        className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs px-5 py-2 rounded-xl"
                                    >
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
