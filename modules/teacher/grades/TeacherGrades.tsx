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
    ChevronDown
} from 'lucide-react';
import { examsService } from '@/services/exams.service';
import { studentsService } from '@/services/students.service';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

export default function TeacherGrades() {
    const router = useRouter();
    const { examId: initialExamId } = router.query;

    const [exams, setExams] = useState<any[]>([]);
    const [selectedExamId, setSelectedExamId] = useState<string>('');
    const [selectedExam, setSelectedExam] = useState<any>(null);
    const [students, setStudents] = useState<any[]>([]);
    const [marks, setMarks] = useState<Record<string, number>>({});
    const [loadingExams, setLoadingExams] = useState(true);
    const [loadingData, setLoadingData] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        setLoadingExams(true);
        try {
            const response = await examsService.getExams();
            const list = Array.isArray(response) ? response : (response?.data || []);
            setExams(list);

            // Pre-select exam from query parameter or first exam
            if (initialExamId && typeof initialExamId === 'string') {
                setSelectedExamId(initialExamId);
                loadExamDetails(initialExamId, list);
            } else if (list.length > 0) {
                setSelectedExamId(list[0].id);
                loadExamDetails(list[0].id, list);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load examinations list.');
        } finally {
            setLoadingExams(false);
        }
    };

    const loadExamDetails = async (examId: string, examList?: any[]) => {
        if (!examId) {
            setSelectedExam(null);
            setStudents([]);
            setMarks({});
            return;
        }

        setLoadingData(true);
        try {
            // Find exam object from list or fetch
            const currentList = examList || exams;
            let current = currentList.find(e => e.id === examId);
            if (!current) {
                current = await examsService.getExamById(examId);
            }
            setSelectedExam(current);

            // Fetch students of the class
            if (current?.classId) {
                const studentsList = await studentsService.getByClass(current.classId);
                setStudents(Array.isArray(studentsList) ? studentsList : []);
            }

            // Fetch existing marks via /marks/exam/:examId
            const marksMap: Record<string, number> = {};
            try {
                const existingMarks = await examsService.getMarks(examId);
                const markList = Array.isArray(existingMarks) ? existingMarks : (existingMarks?.data || []);
                markList.forEach((r: any) => {
                    if (r.studentId && r.marks !== undefined) {
                        marksMap[r.studentId] = r.marks;
                    }
                });
            } catch (err) {
                // If marks don't exist yet, that's completely fine
            }
            setMarks(marksMap);

        } catch (error: any) {
            console.error(error);
            toast.error('Failed to load exam student roster.');
            setStudents([]);
        } finally {
            setLoadingData(false);
        }
    };

    const handleExamChange = (examId: string) => {
        setSelectedExamId(examId);
        loadExamDetails(examId);
    };

    const handleMarkChange = (studentId: string, val: string) => {
        if (val === '') {
            setMarks(prev => {
                const next = { ...prev };
                delete next[studentId];
                return next;
            });
            return;
        }

        const num = parseFloat(val);
        if (isNaN(num)) return;

        const maxMarks = selectedExam?.totalMarks || 100;
        const clamped = Math.min(maxMarks, Math.max(0, num));
        setMarks(prev => ({ ...prev, [studentId]: clamped }));
    };

    const handleFillPassing = () => {
        if (!selectedExam) return;
        const passMark = selectedExam.passingMarks || 40;
        const updated = { ...marks };
        students.forEach(s => {
            if (updated[s.id] === undefined) {
                updated[s.id] = passMark;
            }
        });
        setMarks(updated);
        toast.success(`Populated unfilled students with passing mark (${passMark})`);
    };

    const handleSave = async () => {
        if (!selectedExamId) return;

        const enteredCount = Object.keys(marks).length;
        if (enteredCount === 0) {
            toast.error('Please enter marks for at least one student before saving.');
            return;
        }

        setSaving(true);
        try {
            const payload = Object.entries(marks).map(([studentId, mark]) => ({
                studentId,
                marks: Number(mark)
            }));

            await examsService.saveMarks(selectedExamId, payload);
            toast.success(`Successfully saved marks for ${payload.length} students!`);
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Failed to save student marks.');
        } finally {
            setSaving(false);
        }
    };

    // Filter students by name or admission number
    const filteredStudents = useMemo(() => {
        return students.filter(st => {
            const fullName = `${st.user?.firstName || ''} ${st.user?.lastName || ''}`.toLowerCase();
            const admission = (st.admissionNo || '').toLowerCase();
            const query = searchQuery.toLowerCase();
            return fullName.includes(query) || admission.includes(query);
        });
    }, [students, searchQuery]);

    // Live Statistics computed from entered marks
    const stats = useMemo(() => {
        const markValues = Object.values(marks);
        const totalEntered = markValues.length;
        if (totalEntered === 0) {
            return { average: 0, highest: 0, lowest: 0, passRate: 0, totalEntered: 0 };
        }

        const sum = markValues.reduce((acc, m) => acc + m, 0);
        const avg = sum / totalEntered;
        const highest = Math.max(...markValues);
        const lowest = Math.min(...markValues);

        const passMark = selectedExam?.passingMarks || 40;
        const passedCount = markValues.filter(m => m >= passMark).length;
        const passRate = (passedCount / totalEntered) * 100;

        return {
            average: Math.round(avg),
            highest,
            lowest,
            passRate: Math.round(passRate),
            totalEntered
        };
    }, [marks, selectedExam]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Page Header */}
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
                        Select an examination, enter student evaluation marks, and commit results to official school records.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Exam Dropdown Selector */}
                    <div className="relative min-w-[240px]">
                        <select
                            value={selectedExamId}
                            onChange={(e) => handleExamChange(e.target.value)}
                            disabled={loadingExams}
                            className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/40 outline-none appearance-none cursor-pointer shadow-sm pr-10"
                        >
                            <option value="">Choose an Examination...</option>
                            {exams.map(exam => (
                                <option key={exam.id} value={exam.id}>
                                    {exam.class?.name || 'Class'} • {exam.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    <Button
                        onClick={handleSave}
                        disabled={!selectedExamId || saving || loadingData}
                        className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 py-3.5 h-auto font-black text-xs uppercase tracking-wider gap-2 shadow-xl shadow-primary/25 transition-all hover:shadow-primary/40 active:scale-95 disabled:opacity-50"
                    >
                        {saving ? (
                            <Activity className="animate-spin" size={17} />
                        ) : (
                            <Save size={17} />
                        )}
                        <span>{saving ? 'Saving Records...' : 'Save Marks'}</span>
                    </Button>
                </div>
            </div>

            {/* Quick Stats Banner if Exam Selected */}
            {selectedExam && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Class Average</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                                {stats.average}
                                <span className="text-xs text-slate-400 font-semibold ml-1">/ {selectedExam.totalMarks || 100}</span>
                            </h3>
                        </div>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                            Highest: {stats.highest}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pass Rate</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                                {stats.passRate}%
                            </h3>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                            Pass threshold: {selectedExam.passingMarks || 40} marks
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Students Graded</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                                {stats.totalEntered}
                                <span className="text-xs text-slate-400 font-semibold ml-1">/ {students.length}</span>
                            </h3>
                        </div>
                        <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">
                            {students.length - stats.totalEntered === 0 ? '✓ Complete Roster' : `${students.length - stats.totalEntered} Pending`}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Examination Info</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <h3 className="text-base font-black text-slate-900 dark:text-white truncate">
                                {selectedExam.class?.name || 'Class'}
                            </h3>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate">
                            {new Date(selectedExam.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                </div>
            )}

            {/* Main Table Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                            <Award size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 dark:text-white">
                                {selectedExam ? `${selectedExam.class?.name || 'Class'} Student Roster` : 'Student Evaluation Sheet'}
                            </h2>
                            <p className="text-xs text-slate-400">
                                {selectedExam ? `Maximum Marks: ${selectedExam.totalMarks || 100} • Minimum Pass: ${selectedExam.passingMarks || 40}` : 'Select an exam above to begin marks entry'}
                            </p>
                        </div>
                    </div>

                    {selectedExam && (
                        <div className="flex items-center gap-3">
                            <div className="relative min-w-[220px]">
                                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by student name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                />
                            </div>

                            <button
                                onClick={handleFillPassing}
                                className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all whitespace-nowrap"
                            >
                                Fill Passing ({selectedExam.passingMarks || 40})
                            </button>
                        </div>
                    )}
                </div>

                <div className="p-6 md:p-8">
                    {!selectedExamId ? (
                        <div className="py-20 text-center">
                            <div className="size-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
                                <BookOpen size={28} />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">No exam selected</h3>
                            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                                Please select an examination from the dropdown menu at the top right to view students and input marks.
                            </p>
                        </div>
                    ) : loadingData ? (
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full rounded-2xl" />
                            ))}
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="py-16 text-center">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">No students found in this class</p>
                            <p className="text-xs text-slate-400 mt-1">Check if students are enrolled in this class.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">#</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Student Name</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">Marks Input</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">Percentage</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Evaluation Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredStudents.map((student, idx) => {
                                        const currentMark = marks[student.id];
                                        const hasMark = currentMark !== undefined;
                                        const maxMarks = selectedExam.totalMarks || 100;
                                        const passMarks = selectedExam.passingMarks || 40;
                                        const percentage = hasMark ? Math.round((currentMark / maxMarks) * 100) : 0;
                                        const isPassed = hasMark && currentMark >= passMarks;

                                        return (
                                            <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4 text-xs font-bold text-slate-400">
                                                    {idx + 1}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                                                            {(student.user?.firstName || 'S')[0]}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-900 dark:text-white">
                                                                {student.user?.firstName} {student.user?.lastName}
                                                            </p>
                                                            <p className="text-[10px] font-medium text-slate-400">
                                                                Roll / Adm: {student.admissionNo || `STU-${1000 + idx}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 text-center">
                                                    <div className="inline-flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max={maxMarks}
                                                            value={hasMark ? currentMark : ''}
                                                            placeholder="—"
                                                            onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                                            className="w-20 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl py-2 px-3 text-center text-xs font-black text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                        />
                                                        <span className="text-xs text-slate-400 font-semibold">/ {maxMarks}</span>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 text-center">
                                                    {hasMark ? (
                                                        <div className="flex items-center justify-center gap-2.5">
                                                            <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full transition-all duration-300 ${isPassed ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs font-black text-slate-700 dark:text-slate-300 w-10 text-right">
                                                                {percentage}%
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">Not entered</span>
                                                    )}
                                                </td>

                                                <td className="px-6 py-4 text-right">
                                                    {hasMark ? (
                                                        isPassed ? (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                                <CheckCircle2 size={12} />
                                                                Passed
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                                                                <XCircle size={12} />
                                                                Needs Improvement
                                                            </span>
                                                        )
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-400">
                                                            Pending
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
