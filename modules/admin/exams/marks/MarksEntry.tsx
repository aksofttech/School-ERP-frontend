import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import {
    Save,
    ChevronLeft,
    Users,
    ClipboardCheck,
    AlertCircle,
    GraduationCap,
    Clock,
    Target
} from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { examsService } from '@/services/exams.service';
import { studentsService } from '@/services/students.service';
import { Exam, Student } from '@/utils/types';
import Skeleton from '@/components/ui/Skeleton';

interface MarkEntry {
    studentId: string;
    marks: number;
}

export default function MarksEntry() {
    const router = useRouter();
    const { id } = router.query;
    const [exam, setExam] = useState<Exam | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [marks, setMarks] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (id) {
            initData();
        }
    }, [id]);

    const initData = async () => {
        setLoading(true);
        try {
            const examData = await examsService.getExamById(id as string);
            setExam(examData);

            const [studentsData, marksData] = await Promise.all([
                studentsService.getByClass(examData.classId),
                examsService.getMarks(id as string)
            ]);

            setStudents(studentsData);

            // Initialize marks from existing data
            const marksMap: Record<string, number> = {};
            (marksData.results || []).forEach((r: any) => {
                marksMap[r.studentId] = r.marks;
            });
            setMarks(marksMap);
        } catch (error: any) {
            toast.error('Failed to load assessment data');
            router.push('/admin/exams');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkChange = (studentId: string, value: string) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            const newMarks = { ...marks };
            delete newMarks[studentId];
            setMarks(newMarks);
            return;
        }

        if (numValue < 0 || numValue > (exam?.totalMarks || 100)) {
            toast.error(`Marks must be between 0 and ${exam?.totalMarks || 100}`);
            return;
        }

        setMarks({ ...marks, [studentId]: numValue });
    };

    const onSave = async () => {
        setSaving(true);
        try {
            const payload = Object.entries(marks).map(([studentId, marks]) => ({
                studentId,
                marks
            }));
            await examsService.saveMarks(id as string, payload);
            toast.success('Performance nodes synchronized successfully.');
            router.push('/admin/exams');
        } catch (error: any) {
            toast.error(error.message || 'Failed to synchronize marks');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <Skeleton className="h-20 w-full rounded-[2rem]" />
                <Skeleton className="h-96 w-full rounded-[2.5rem]" />
            </div>
        );
    }

    if (!exam) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/exams" className="size-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-primary transition-all shadow-sm">
                        <ChevronLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">Performance Registry</h1>
                        <p className="text-sm font-medium text-slate-500 italic">Centralized marks entry for {exam.name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-6 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Target size={16} className="text-primary" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Max Score: {exam.totalMarks}</span>
                        </div>
                        <div className="w-px h-4 bg-slate-200 dark:bg-slate-800" />
                        <div className="flex items-center gap-2">
                            <Users size={16} className="text-indigo-500" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cohort: {students.length}</span>
                        </div>
                    </div>
                    <Button
                        onClick={onSave}
                        loading={saving}
                        className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-10 py-6 h-auto font-black text-xs uppercase tracking-widest gap-3 shadow-xl shadow-primary/20"
                    >
                        <Save size={18} />
                        Sync Registry
                    </Button>
                </div>
            </div>

            {/* Students Grid */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                            <ClipboardCheck size={20} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Entry Matrix</h2>
                    </div>
                    <div className="flex items-center gap-2 text-rose-500 px-4 py-2 bg-rose-50 dark:bg-rose-500/10 rounded-xl border border-rose-100 dark:border-rose-500/20">
                        <AlertCircle size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Validate input precision before sync</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-24">Roll No</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Student Identity</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact Node</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-64">Achieved Marks</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-8 py-8">
                                        <span className="text-xs font-mono font-black text-primary bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
                                            {student.rollNumber || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                                                <GraduationCap size={22} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">{student.user.firstName} {student.user.lastName}</p>
                                                <p className="text-[10px] font-medium text-slate-500 italic uppercase">ID: {student.id.substring(0, 8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-xs font-bold text-slate-500 font-mono italic">
                                        {student.user.email}
                                    </td>
                                    <td className="px-8 py-8 text-right">
                                        <div className="flex items-center justify-end gap-3 group/input">
                                            <input
                                                type="number"
                                                min="0"
                                                max={exam.totalMarks}
                                                step="0.5"
                                                value={marks[student.id] !== undefined ? marks[student.id] : ''}
                                                onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                                className="w-32 bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-center font-black text-slate-900 dark:text-white outline-none ring-2 ring-slate-100 dark:ring-slate-800 focus:ring-primary transition-all shadow-sm"
                                                placeholder="---"
                                            />
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">/ {exam.totalMarks}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
