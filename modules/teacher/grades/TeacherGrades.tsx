import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import {
    Search,
    BookOpen,
    Trophy,
    Award,
    CheckCircle2,
    XCircle,
    Activity,
    Save,
    TrendingUp,
    Users,
    AlertCircle,
    Sparkles,
    Calendar,
    ChevronDown,
    ArrowLeft,
    ArrowRight,
    GraduationCap,
    Clock,
    FileText,
    Check,
    RotateCcw
} from 'lucide-react';
import { examsService } from '@/services/exams.service';
import { studentsService } from '@/services/students.service';
import { classesService } from '@/services/classes.service';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

export default function TeacherGrades() {
    const router = useRouter();
    const { classId: queryClassId, examId: queryExamId } = router.query;

    // Navigation Step:
    // 1: Select Class & Section
    // 2: Student Roster of selected class
    // 3: Marks Entry for selected student across all tests
    const [step, setStep] = useState<1 | 2 | 3>(1);

    // Selected Entities
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [selectedSectionId, setSelectedSectionId] = useState<string>('ALL');
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    // Data lists
    const [classes, setClasses] = useState<any[]>([]);
    const [exams, setExams] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [classStudentCounts, setClassStudentCounts] = useState<Record<string, number>>({});

    // Marks maps:
    // studentMarksMap: Record<examId, number> for the selected student
    const [studentMarksMap, setStudentMarksMap] = useState<Record<string, number>>({});
    // allExamMarks: Record<examId, Record<studentId, number>> for fast lookup of progress
    const [allExamMarks, setAllExamMarks] = useState<Record<string, Record<string, number>>>({});

    // View Mode in Step 2: 'STUDENT_WISE' | 'BATCH_EXAM'
    const [viewMode, setViewMode] = useState<'STUDENT_WISE' | 'BATCH_EXAM'>('STUDENT_WISE');
    const [batchExamId, setBatchExamId] = useState<string>('');
    const [batchMarks, setBatchMarks] = useState<Record<string, number>>({});

    // Loading and saving states
    const [loadingClasses, setLoadingClasses] = useState(true);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch Classes and Exams on mount
    useEffect(() => {
        loadInitialData();
    }, []);

    // Respond to URL query parameters
    useEffect(() => {
        if (queryClassId && typeof queryClassId === 'string' && classes.length > 0) {
            const cls = classes.find(c => c.id === queryClassId);
            if (cls) {
                setSelectedClassId(cls.id);
                loadClassStudentsAndExams(cls.id);
                if (queryExamId && typeof queryExamId === 'string') {
                    setBatchExamId(queryExamId);
                    setViewMode('BATCH_EXAM');
                }
                setStep(2);
            }
        } else if (queryExamId && typeof queryExamId === 'string' && exams.length > 0) {
            const targetExam = exams.find(e => e.id === queryExamId);
            if (targetExam?.classId) {
                setSelectedClassId(targetExam.classId);
                loadClassStudentsAndExams(targetExam.classId);
                setBatchExamId(targetExam.id);
                setViewMode('BATCH_EXAM');
                setStep(2);
            }
        }
    }, [queryClassId, queryExamId, classes, exams]);

    const loadInitialData = async () => {
        setLoadingClasses(true);
        try {
            const [classesRes, examsRes] = await Promise.all([
                classesService.getAll(),
                examsService.getExams()
            ]);

            const rawClasses = Array.isArray(classesRes) ? classesRes : [];
            const sortedClasses = [...rawClasses].sort((a, b) => {
                const getWeight = (name: string) => {
                    const match = name?.match(/\d+/);
                    return match ? parseInt(match[0], 10) : 0;
                };
                return getWeight(b.name) - getWeight(a.name);
            });
            setClasses(sortedClasses);

            const examList = Array.isArray(examsRes) ? examsRes : (examsRes?.data || []);
            setExams(examList);

            // Fetch student counts for each class
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

        } catch (error) {
            console.error('Failed to load initial grades data:', error);
            toast.error('Failed to load classes.');
        } finally {
            setLoadingClasses(false);
        }
    };

    // Load students and exam marks when class is chosen
    const loadClassStudentsAndExams = async (classId: string) => {
        setLoadingStudents(true);
        try {
            const studentsRes = await studentsService.getByClass(classId);
            const studentList: any[] = Array.isArray(studentsRes)
                ? studentsRes
                : ((studentsRes as any)?.students || (studentsRes as any)?.data || []);

            setStudents(studentList);

            // Find all exams for this class
            const currentClassObj = classes.find(c => c.id === classId);
            const classExamList = exams.filter(e => e.classId === classId || e.class?.id === classId || e.class?.name === currentClassObj?.name);

            if (classExamList.length > 0 && !batchExamId) {
                setBatchExamId(classExamList[0].id);
            }

            // Pre-load all exam results for these exams into allExamMarks
            const allMarksTemp: Record<string, Record<string, number>> = {};
            await Promise.all(
                classExamList.map(async (ex) => {
                    try {
                        const res = await examsService.getMarks(ex.id);
                        const marksArr = Array.isArray(res) ? res : (res?.data || []);
                        allMarksTemp[ex.id] = {};
                        marksArr.forEach((m: any) => {
                            if (m.studentId && m.marks !== undefined) {
                                allMarksTemp[ex.id][m.studentId] = m.marks;
                            }
                        });
                    } catch {
                        allMarksTemp[ex.id] = {};
                    }
                })
            );
            setAllExamMarks(allMarksTemp);

            // Prepopulate batch marks if first exam selected
            if (classExamList.length > 0) {
                const firstId = classExamList[0].id;
                setBatchMarks(allMarksTemp[firstId] || {});
            }

        } catch (error) {
            console.error('Failed to load student roster:', error);
            toast.error('Failed to load class roster.');
            setStudents([]);
        } finally {
            setLoadingStudents(false);
        }
    };

    // Handle Class Selection
    const handleSelectClass = (classId: string, sectionId = 'ALL') => {
        setSelectedClassId(classId);
        setSelectedSectionId(sectionId);
        loadClassStudentsAndExams(classId);
        setStep(2);
    };

    // Handle Student Selection (Advances to Step 3)
    const handleSelectStudent = (student: any) => {
        setSelectedStudent(student);
        const stId = student.id || student._id;

        // Build marks map for this student from allExamMarks
        const stMarks: Record<string, number> = {};
        Object.entries(allExamMarks).forEach(([examId, marksByStudent]) => {
            if (marksByStudent[stId] !== undefined) {
                stMarks[examId] = marksByStudent[stId];
            }
        });
        setStudentMarksMap(stMarks);
        setStep(3);
    };

    // Active Selected Class Object
    const selectedClass = useMemo(() => {
        return classes.find(c => c.id === selectedClassId) || null;
    }, [classes, selectedClassId]);

    // Available sections for active class
    const availableSections = useMemo(() => {
        return selectedClass?.sections || [];
    }, [selectedClass]);

    // Filter students by section and search query
    const filteredStudents = useMemo(() => {
        return students.filter(st => {
            const matchesSection =
                selectedSectionId === 'ALL' ||
                st.sectionId === selectedSectionId ||
                st.section?.id === selectedSectionId;

            const fullName = `${st.user?.firstName || st.firstName || ''} ${st.user?.lastName || st.lastName || ''}`.toLowerCase();
            const roll = String(st.rollNumber || '').toLowerCase();
            const admission = (st.admissionNo || '').toLowerCase();
            const query = searchQuery.toLowerCase();

            const matchesSearch = fullName.includes(query) || roll.includes(query) || admission.includes(query);

            return matchesSection && matchesSearch;
        });
    }, [students, selectedSectionId, searchQuery]);

    // Exams for selected class
    const selectedClassExams = useMemo(() => {
        if (!selectedClassId) return [];
        return exams.filter(e => e.classId === selectedClassId || e.class?.id === selectedClassId || e.class?.name === selectedClass?.name);
    }, [exams, selectedClassId, selectedClass]);

    // Selected batch exam object
    const selectedBatchExam = useMemo(() => {
        return selectedClassExams.find(e => e.id === batchExamId) || null;
    }, [selectedClassExams, batchExamId]);

    // Handle student mark change in Step 3
    const handleStudentMarkChange = (examId: string, val: string, maxMarks: number) => {
        if (val === '') {
            setStudentMarksMap(prev => {
                const next = { ...prev };
                delete next[examId];
                return next;
            });
            return;
        }

        const num = parseFloat(val);
        if (isNaN(num)) return;

        const clamped = Math.min(maxMarks, Math.max(0, num));
        setStudentMarksMap(prev => ({ ...prev, [examId]: clamped }));
    };

    // Save marks for single exam or all exams for selected student in Step 3
    const handleSaveStudentMarks = async (specificExamId?: string) => {
        if (!selectedStudent) return;
        const studentId = selectedStudent.id || selectedStudent._id;

        const targetExamIds = specificExamId ? [specificExamId] : selectedClassExams.map(e => e.id);
        const examsToSave = targetExamIds.filter(eId => studentMarksMap[eId] !== undefined);

        if (examsToSave.length === 0) {
            toast.error('Please enter marks before saving.');
            return;
        }

        setSaving(true);
        try {
            await Promise.all(
                examsToSave.map(eId =>
                    examsService.saveMarks(eId, [{
                        studentId,
                        marks: Number(studentMarksMap[eId])
                    }])
                )
            );

            // Update allExamMarks state
            setAllExamMarks(prev => {
                const updated = { ...prev };
                examsToSave.forEach(eId => {
                    if (!updated[eId]) updated[eId] = {};
                    updated[eId][studentId] = Number(studentMarksMap[eId]);
                });
                return updated;
            });

            toast.success(`Marks successfully saved for ${selectedStudent.user?.firstName || 'student'}!`);
        } catch (error: any) {
            console.error('Failed to save student marks:', error);
            toast.error(error.message || 'Failed to save marks.');
        } finally {
            setSaving(false);
        }
    };

    // Handle Batch Marks Change in Batch Mode
    const handleBatchExamChange = (examId: string) => {
        setBatchExamId(examId);
        setBatchMarks(allExamMarks[examId] || {});
    };

    const handleBatchMarkChange = (studentId: string, val: string) => {
        if (val === '') {
            setBatchMarks(prev => {
                const next = { ...prev };
                delete next[studentId];
                return next;
            });
            return;
        }

        const num = parseFloat(val);
        if (isNaN(num)) return;

        const maxMarks = selectedBatchExam?.totalMarks || 100;
        const clamped = Math.min(maxMarks, Math.max(0, num));
        setBatchMarks(prev => ({ ...prev, [studentId]: clamped }));
    };

    const handleSaveBatchMarks = async () => {
        if (!batchExamId) return;
        const enteredCount = Object.keys(batchMarks).length;
        if (enteredCount === 0) {
            toast.error('Please enter marks for at least one student before saving.');
            return;
        }

        setSaving(true);
        try {
            const payload = Object.entries(batchMarks).map(([studentId, marks]) => ({
                studentId,
                marks: Number(marks)
            }));

            await examsService.saveMarks(batchExamId, payload);

            // Update allExamMarks
            setAllExamMarks(prev => ({
                ...prev,
                [batchExamId]: { ...batchMarks }
            }));

            toast.success(`Successfully saved marks for ${payload.length} students!`);
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Failed to save student marks.');
        } finally {
            setSaving(false);
        }
    };

    // Batch Statistics
    const batchStats = useMemo(() => {
        const markValues = Object.values(batchMarks);
        const totalEntered = markValues.length;
        if (totalEntered === 0) {
            return { average: 0, highest: 0, lowest: 0, passRate: 0, totalEntered: 0 };
        }

        const sum = markValues.reduce((acc, m) => acc + m, 0);
        const avg = sum / totalEntered;
        const highest = Math.max(...markValues);
        const lowest = Math.min(...markValues);

        const passMark = selectedBatchExam?.passingMarks || 40;
        const passedCount = markValues.filter(m => m >= passMark).length;
        const passRate = (passedCount / totalEntered) * 100;

        return {
            average: Math.round(avg),
            highest,
            lowest,
            passRate: Math.round(passRate),
            totalEntered
        };
    }, [batchMarks, selectedBatchExam]);

    // Student performance summary in Step 3
    const studentPerformance = useMemo(() => {
        if (!selectedStudent) return { gradedCount: 0, totalTests: 0, averagePct: 0, passedCount: 0 };
        const totalTests = selectedClassExams.length;
        let gradedCount = 0;
        let sumPct = 0;
        let passedCount = 0;

        selectedClassExams.forEach(ex => {
            const mark = studentMarksMap[ex.id];
            if (mark !== undefined) {
                gradedCount++;
                const max = ex.totalMarks || 100;
                const pass = ex.passingMarks || 40;
                const pct = (mark / max) * 100;
                sumPct += pct;
                if (mark >= pass) passedCount++;
            }
        });

        const averagePct = gradedCount > 0 ? Math.round(sumPct / gradedCount) : 0;
        return { gradedCount, totalTests, averagePct, passedCount };
    }, [selectedStudent, selectedClassExams, studentMarksMap]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                            <Trophy size={13} />
                            Gradebook & Evaluation
                        </span>
                        <span className="text-xs text-slate-400 font-medium">• Academic Year 2026-27</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Student Marks Entry
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">
                        {step === 1 && 'Step 1: Select a class and section to open the student roster.'}
                        {step === 2 && `Step 2: Select a student from ${selectedClass?.name || 'class'} to enter their test marks.`}
                        {step === 3 && `Step 3: Entering examination marks for ${selectedStudent?.user?.firstName || 'student'} ${selectedStudent?.user?.lastName || ''}.`}
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
                    {step === 3 && (
                        <button
                            onClick={() => setStep(2)}
                            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all"
                        >
                            <ArrowLeft size={16} />
                            <span>Back to Student Roster</span>
                        </button>
                    )}
                    {step === 3 && (
                        <Button
                            onClick={() => handleSaveStudentMarks()}
                            disabled={saving}
                            className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 py-3.5 h-auto font-black text-xs uppercase tracking-wider gap-2 shadow-xl shadow-primary/25 transition-all hover:shadow-primary/40 active:scale-95"
                        >
                            {saving ? <Activity className="animate-spin" size={17} /> : <Save size={17} />}
                            <span>{saving ? 'Saving...' : 'Save All Test Marks'}</span>
                        </Button>
                    )}
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
                                Choose a class to load its students and enter individual examination marks.
                            </p>
                        </div>

                        <span className="text-xs font-bold text-slate-400">
                            {classes.length} Teaching Classes
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
                            <h3 className="text-base font-bold text-slate-800 dark:text-white">No classes available</h3>
                            <p className="text-xs text-slate-500 mt-1">Check class allocations with your school administrator.</p>
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
                                                    <Award size={12} />
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
                                            <span>Open Student Roster</span>
                                            <ArrowRight size={15} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* STEP 2: STUDENT ROSTER OF SELECTED CLASS */}
            {step === 2 && selectedClass && (
                <div className="space-y-6">
                    {/* Header Banner */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setStep(1)}
                                    className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-primary hover:border-primary transition-all"
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
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                                        {filteredStudents.length} Students • {selectedClassExams.length} Scheduled Examinations
                                    </p>
                                </div>
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200/70 dark:border-slate-700">
                                <button
                                    onClick={() => setViewMode('STUDENT_WISE')}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                        viewMode === 'STUDENT_WISE'
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                    }`}
                                >
                                    Student-wise Entry
                                </button>
                                <button
                                    onClick={() => setViewMode('BATCH_EXAM')}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                        viewMode === 'BATCH_EXAM'
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                    }`}
                                >
                                    Batch Class Entry
                                </button>
                            </div>
                        </div>

                        {/* Search and Section Filter */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="relative flex-1 max-w-md">
                                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by student name or roll number..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                />
                            </div>

                            {/* Section Switcher Pills */}
                            {availableSections.length > 0 && (
                                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                                    <button
                                        onClick={() => setSelectedSectionId('ALL')}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                            selectedSectionId === 'ALL'
                                                ? 'bg-primary text-white'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
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
                                                    ? 'bg-primary text-white'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                                            }`}
                                        >
                                            Section {sec.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* MODE 1: STUDENT-WISE VIEW (USER'S REQUESTED FLOW) */}
                        {viewMode === 'STUDENT_WISE' && (
                            <div className="pt-2">
                                <div className="mb-4 flex items-center justify-between">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Click a student to view and enter their marks for all scheduled tests:
                                    </p>
                                    <span className="text-xs font-bold text-primary">
                                        {filteredStudents.length} Students Listed
                                    </span>
                                </div>

                                {loadingStudents ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Array.from({ length: 6 }).map((_, i) => (
                                            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
                                        ))}
                                    </div>
                                ) : filteredStudents.length === 0 ? (
                                    <div className="py-16 text-center">
                                        <Users className="mx-auto size-12 text-slate-400 mb-2" />
                                        <h3 className="text-sm font-bold text-slate-800 dark:text-white">No students found</h3>
                                        <p className="text-xs text-slate-500 mt-1">No enrolled students in this class section.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {filteredStudents.map((student) => {
                                            const stId = student.id || student._id;
                                            const firstName = student.user?.firstName || student.firstName || 'Student';
                                            const lastName = student.user?.lastName || student.lastName || '';
                                            const fullName = `${firstName} ${lastName}`.trim();
                                            const rollNo = student.rollNumber || '—';

                                            // Calculate how many exams have been graded for this student
                                            let gradedExamsCount = 0;
                                            selectedClassExams.forEach(ex => {
                                                if (allExamMarks[ex.id] && allExamMarks[ex.id][stId] !== undefined) {
                                                    gradedExamsCount++;
                                                }
                                            });

                                            const totalExams = selectedClassExams.length;
                                            const isComplete = totalExams > 0 && gradedExamsCount === totalExams;

                                            return (
                                                <div
                                                    key={stId}
                                                    onClick={() => handleSelectStudent(student)}
                                                    className="group bg-slate-50/70 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 p-5 rounded-2xl border-2 border-slate-200/70 dark:border-slate-800 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between gap-4"
                                                >
                                                    <div className="flex items-start gap-3.5">
                                                        <div className="size-11 rounded-2xl bg-primary/10 border border-primary/20 text-primary group-hover:bg-primary group-hover:text-white flex items-center justify-center font-black text-sm uppercase transition-colors shrink-0">
                                                            {firstName.charAt(0)}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center justify-between gap-1">
                                                                <h4 className="text-sm font-black text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">
                                                                    {fullName}
                                                                </h4>
                                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
                                                                    Roll #{rollNo}
                                                                </span>
                                                            </div>
                                                            <p className="text-[11px] text-slate-500 font-semibold truncate mt-0.5">
                                                                Admission: {student.admissionNo || 'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                                                        <div className="flex items-center gap-1.5">
                                                            {isComplete ? (
                                                                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                                                    <CheckCircle2 size={13} />
                                                                    All {totalExams} Tests Graded
                                                                </span>
                                                            ) : gradedExamsCount > 0 ? (
                                                                <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                                                                    <Sparkles size={13} />
                                                                    {gradedExamsCount}/{totalExams} Tests Graded
                                                                </span>
                                                            ) : (
                                                                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                                                                    <AlertCircle size={13} />
                                                                    Pending Evaluation
                                                                </span>
                                                            )}
                                                        </div>

                                                        <span className="text-[11px] font-black text-primary uppercase tracking-wider group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                                                            Enter Marks <ArrowRight size={13} />
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* MODE 2: BATCH EXAM VIEW */}
                        {viewMode === 'BATCH_EXAM' && (
                            <div className="space-y-6 pt-2">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Choose Examination to Grade:</label>
                                        <div className="relative min-w-[280px]">
                                            <select
                                                value={batchExamId}
                                                onChange={(e) => handleBatchExamChange(e.target.value)}
                                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer appearance-none pr-8"
                                            >
                                                {selectedClassExams.map(ex => (
                                                    <option key={ex.id} value={ex.id}>
                                                        {ex.name} (Max: {ex.totalMarks || 100})
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    {selectedBatchExam && (
                                        <div className="flex items-center gap-4 text-xs font-bold">
                                            <div className="text-slate-500">
                                                Passing Threshold: <span className="text-slate-900 dark:text-white">{selectedBatchExam.passingMarks || 40} Marks</span>
                                            </div>
                                            <Button
                                                onClick={handleSaveBatchMarks}
                                                disabled={saving}
                                                className="bg-primary hover:bg-primary/90 text-white rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-wider"
                                            >
                                                {saving ? 'Saving...' : 'Save Exam Marks'}
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Batch Table */}
                                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                                            <tr>
                                                <th className="p-4">Roll #</th>
                                                <th className="p-4">Student Name</th>
                                                <th className="p-4">Admission No</th>
                                                <th className="p-4">Marks (Out of {selectedBatchExam?.totalMarks || 100})</th>
                                                <th className="p-4">Percentage</th>
                                                <th className="p-4 text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {filteredStudents.map((st) => {
                                                const stId = st.id || st._id;
                                                const fullName = `${st.user?.firstName || st.firstName || ''} ${st.user?.lastName || st.lastName || ''}`.trim();
                                                const mark = batchMarks[stId];
                                                const maxMarks = selectedBatchExam?.totalMarks || 100;
                                                const passMarks = selectedBatchExam?.passingMarks || 40;
                                                const pct = mark !== undefined ? Math.round((mark / maxMarks) * 100) : null;
                                                const isPass = mark !== undefined && mark >= passMarks;

                                                return (
                                                    <tr key={stId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                                        <td className="p-4 font-bold text-slate-700 dark:text-slate-300">
                                                            #{st.rollNumber || '—'}
                                                        </td>
                                                        <td className="p-4 font-bold text-slate-900 dark:text-white">
                                                            {fullName}
                                                        </td>
                                                        <td className="p-4 text-slate-500 font-medium">
                                                            {st.admissionNo || 'N/A'}
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    max={maxMarks}
                                                                    value={mark !== undefined ? mark : ''}
                                                                    onChange={(e) => handleBatchMarkChange(stId, e.target.value)}
                                                                    placeholder="0"
                                                                    className="w-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-1.5 px-3 text-xs font-black text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 text-center"
                                                                />
                                                                <span className="text-slate-400 font-semibold">/ {maxMarks}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 font-bold text-slate-700 dark:text-slate-300">
                                                            {pct !== null ? `${pct}%` : '—'}
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            {mark !== undefined ? (
                                                                isPass ? (
                                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                                                        <Check size={12} /> Passed
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                                                        Needs Revision
                                                                    </span>
                                                                )
                                                            ) : (
                                                                <span className="text-[11px] font-semibold text-slate-400">
                                                                    Unmarked
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* STEP 3: SELECTED STUDENT TEST MARKS ENTRY ("us student k kis test m marks entry kare") */}
            {step === 3 && selectedStudent && selectedClass && (
                <div className="space-y-6">
                    {/* Student Profile Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-4">
                                <div className="size-16 rounded-3xl bg-primary/10 border-2 border-primary/20 text-primary flex items-center justify-center font-black text-2xl uppercase shadow-inner">
                                    {(selectedStudent.user?.firstName || selectedStudent.firstName || 'S').charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                                            {selectedStudent.user?.firstName || selectedStudent.firstName} {selectedStudent.user?.lastName || selectedStudent.lastName || ''}
                                        </h2>
                                        <span className="px-3 py-1 rounded-full text-xs font-black bg-primary/10 text-primary border border-primary/20">
                                            Roll #{selectedStudent.rollNumber || '—'}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 mt-1">
                                        <span>Class: <strong className="text-slate-800 dark:text-white">{selectedClass.name}</strong></span>
                                        <span>•</span>
                                        <span>Admission No: <strong className="text-slate-800 dark:text-white">{selectedStudent.admissionNo || 'N/A'}</strong></span>
                                        <span>•</span>
                                        <span>Email: <strong className="text-slate-800 dark:text-white">{selectedStudent.user?.email || 'N/A'}</strong></span>
                                    </div>
                                </div>
                            </div>

                            {/* Summary Performance Metrics */}
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-50 dark:bg-slate-800/60 px-4 py-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tests Evaluated</p>
                                    <p className="text-lg font-black text-slate-900 dark:text-white">
                                        {studentPerformance.gradedCount} / {studentPerformance.totalTests}
                                    </p>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-800/60 px-4 py-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Score</p>
                                    <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                                        {studentPerformance.averagePct}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Test Selection and Marks Entry List */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                                        Available Examinations & Tests
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Enter or update evaluation marks for each test for this student.
                                    </p>
                                </div>

                                <Button
                                    onClick={() => handleSaveStudentMarks()}
                                    disabled={saving}
                                    className="bg-primary hover:bg-primary/90 text-white rounded-xl px-5 py-2.5 text-xs font-bold gap-2"
                                >
                                    {saving ? <Activity className="animate-spin" size={14} /> : <Save size={14} />}
                                    <span>Save All Changes</span>
                                </Button>
                            </div>

                            {selectedClassExams.length === 0 ? (
                                <div className="py-12 text-center">
                                    <FileText className="mx-auto size-12 text-slate-400 mb-2" />
                                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">No examinations scheduled</h4>
                                    <p className="text-xs text-slate-500 mt-1">Please schedule an exam in the Exams module first.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {selectedClassExams.map((exam) => {
                                        const examId = exam.id;
                                        const currentMark = studentMarksMap[examId];
                                        const maxMarks = exam.totalMarks || 100;
                                        const passMarks = exam.passingMarks || 40;
                                        const isGraded = currentMark !== undefined;
                                        const pct = isGraded ? Math.round((currentMark / maxMarks) * 100) : null;
                                        const isPass = isGraded && currentMark >= passMarks;

                                        let typeLabel = 'MID TERM';
                                        if (exam.type === 'UNIT_TEST') typeLabel = 'UNIT TEST';
                                        else if (exam.type === 'FINAL') typeLabel = 'FINAL / PRE-BOARD';

                                        const dateObj = new Date(exam.date);

                                        return (
                                            <div
                                                key={examId}
                                                className="bg-slate-50/70 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 p-5 rounded-2xl border-2 border-slate-200/70 dark:border-slate-800 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                                            >
                                                {/* Exam Information */}
                                                <div className="space-y-1.5 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                                            {typeLabel}
                                                        </span>
                                                        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                                                            <Calendar size={13} />
                                                            {dateObj.toLocaleDateString('en-IN', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>

                                                    <h4 className="text-base font-black text-slate-900 dark:text-white">
                                                        {exam.name}
                                                    </h4>

                                                    <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                                                        <span>Maximum Marks: <strong className="text-slate-800 dark:text-white">{maxMarks}</strong></span>
                                                        <span>•</span>
                                                        <span>Passing Threshold: <strong className="text-slate-800 dark:text-white">{passMarks}</strong></span>
                                                    </div>
                                                </div>

                                                {/* Marks Input and Live Calculation */}
                                                <div className="flex flex-wrap items-center gap-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                            Marks Obtained:
                                                        </label>
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max={maxMarks}
                                                                value={currentMark !== undefined ? currentMark : ''}
                                                                onChange={(e) => handleStudentMarkChange(examId, e.target.value, maxMarks)}
                                                                placeholder="Enter mark"
                                                                className="w-28 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl py-2 px-3 text-sm font-black text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 text-center"
                                                            />
                                                            <span className="text-xs font-bold text-slate-400">
                                                                / {maxMarks}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Status Badge */}
                                                    <div className="min-w-[110px] text-center">
                                                        {isGraded ? (
                                                            <div className="space-y-0.5">
                                                                <span className={`inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full ${
                                                                    isPass
                                                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                                                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                                                }`}>
                                                                    {isPass ? <Check size={13} /> : <AlertCircle size={13} />}
                                                                    {isPass ? 'Passed' : 'Failed'} ({pct}%)
                                                                </span>
                                                                <p className="text-[10px] font-semibold text-slate-400">
                                                                    {isPass ? 'Above pass mark' : 'Below pass mark'}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <span className="inline-flex items-center text-xs font-bold px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                                                                Not Graded
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Quick Actions */}
                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            onClick={() => handleStudentMarkChange(examId, String(passMarks), maxMarks)}
                                                            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary text-slate-700 dark:text-slate-300"
                                                            title="Fill Passing Mark"
                                                        >
                                                            Pass ({passMarks})
                                                        </button>
                                                        <Button
                                                            onClick={() => handleSaveStudentMarks(examId)}
                                                            disabled={saving || currentMark === undefined}
                                                            className="bg-primary hover:bg-primary/90 text-white rounded-xl px-3 py-1.5 text-xs font-bold"
                                                        >
                                                            Save
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
