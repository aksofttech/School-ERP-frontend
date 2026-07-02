import { useState, useEffect } from 'react';
import {
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
    Trophy,
    Award,
    TrendingDown,
    ShieldCheck,
    CheckCircle2,
    FileText,
    User,
    GraduationCap
} from 'lucide-react';
import { examsService } from '@/services/exams.service';
import { studentsService } from '@/services/students.service';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

export default function TeacherGrades() {
    const [exams, setExams] = useState<any[]>([]);
    const [selectedExamId, setSelectedExamId] = useState<string>('');
    const [selectedExam, setSelectedExam] = useState<any>(null);
    const [students, setStudents] = useState<any[]>([]);
    const [marks, setMarks] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const response = await examsService.getExams();
            setExams(response.data || []);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load exam data.');
        }
    };

    const handleExamChange = async (examId: string) => {
        setSelectedExamId(examId);
        if (!examId) {
            setStudents([]);
            setMarks({});
            setSelectedExam(null);
            return;
        }

        setLoading(true);
        try {
            const exam = await examsService.getExamById(examId);
            setSelectedExam(exam);

            // Fetch students of the class
            const studentsList = await studentsService.getByClass(exam.classId);
            setStudents(studentsList);

            // Fetch existing marks
            const existingResults = await examsService.getExamResults(examId);

            // Map existing marks
            const currentMarks: Record<string, number> = {};
            if (existingResults && existingResults.results) {
                existingResults.results.forEach((r: any) => {
                    currentMarks[r.studentId] = r.marks;
                });
            }
            setMarks(currentMarks);

        } catch (error) {
            console.error(error);
            toast.error('Failed to load grade list.');
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkChange = (studentId: string, value: string) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return;
        setMarks(prev => ({ ...prev, [studentId]: numValue }));
    };

    const handleSave = async () => {
        if (!selectedExamId) return;
        setSaving(true);
        try {
            const payload = Object.entries(marks).map(([studentId, mark]) => ({
                studentId,
                marks: mark
            }));

            await examsService.saveMarks(selectedExamId, payload);
            toast.success('Grades saved successfully.');
        } catch (error) {
            console.error(error);
            toast.error('Failed to save changes.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-2 mb-2 text-primary">
                        Teacher Office: Grades
                    </Badge>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Mark Grades</h1>
                    <p className="text-sm font-medium text-slate-500 italic">Enter marks for your students and save the results.</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-primary outline-none"
                        value={selectedExamId}
                        onChange={(e) => handleExamChange(e.target.value)}
                    >
                        <option value="">Select Exam...</option>
                        {exams.map(exam => (
                            <option key={exam.id} value={exam.id}>{exam.name} ({new Date(exam.date).toLocaleDateString()})</option>
                        ))}
                    </select>

                    <Button
                        onClick={handleSave}
                        disabled={!selectedExamId || saving}
                        className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-10 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {saving ? (
                            <Activity className="animate-spin" size={18} />
                        ) : (
                            <Trophy size={18} />
                        )}
                        Save Results
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-100 dark:border-slate-800 pb-8">
                        <div className="flex gap-10">
                            <button className="relative py-4 text-[10px] font-black text-primary uppercase tracking-widest border-b-4 border-primary">Grade List</button>
                            <button className="relative py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Result Reports</button>
                        </div>
                        <div className="flex items-center gap-4">
                            {selectedExam && (
                                <Badge variant="outline" className="px-4 py-2 border-primary/20 bg-primary/5 text-primary">
                                    MAX MARKS: {selectedExam.totalMarks}
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className="rounded-[2.5rem] border-2 border-slate-50 dark:border-slate-800 overflow-hidden shadow-xl">
                        {!selectedExamId ? (
                            <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-4">
                                <BookOpen size={48} className="opacity-20" />
                                <p className="text-xs font-bold uppercase tracking-widest">Choose an exam to enter marks</p>
                            </div>
                        ) : loading ? (
                            <div className="p-12 space-y-4">
                                <Skeleton className="h-12 w-full rounded-xl" />
                                <Skeleton className="h-12 w-full rounded-xl" />
                                <Skeleton className="h-12 w-full rounded-xl" />
                            </div>
                        ) : (
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b-2 border-slate-100 dark:border-slate-800">
                                        <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Student Name</th>
                                        <th className="px-10 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Marks</th>
                                        <th className="px-10 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Percentage</th>
                                        <th className="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {students.map((student) => {
                                        const currentMark = marks[student.id] || 0;
                                        const percentage = selectedExam ? (currentMark / selectedExam.totalMarks) * 100 : 0;

                                        return (
                                            <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                                <td className="px-10 py-6 text-left">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-black text-[10px]">
                                                            {(student.user?.firstName || 'S').substring(0, 2)}
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{student.user?.firstName} {student.user?.lastName}</p>
                                                            <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest italic">ID: {student.admissionNo || student.id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6 text-center">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={selectedExam?.totalMarks}
                                                        value={marks[student.id] || ''}
                                                        onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                                        className="w-24 h-12 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl text-center text-xs font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all outline-none"
                                                        placeholder="-"
                                                    />
                                                </td>
                                                <td className="px-10 py-6 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full transition-all duration-500 ${percentage >= 40 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                                                style={{ width: `${Math.min(percentage, 100)}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-[10px] font-black text-slate-400">{percentage.toFixed(0)}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6 text-right">
                                                    {marks[student.id] !== undefined ? (
                                                        <CheckCircle2 size={18} className="text-emerald-500 ml-auto" />
                                                    ) : (
                                                        <div className="size-4 rounded-full border-2 border-slate-200 ml-auto"></div>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
