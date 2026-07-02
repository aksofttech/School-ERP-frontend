import { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    Activity,
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
    ArrowRight,
    ShieldCheck,
    ChevronRight,
    TrendingUp,
    AlertCircle,
    History,
    Save,
    Download
} from 'lucide-react';
import { attendanceService } from '@/services/attendance.service';
import { classesService } from '@/services/classes.service';
import { studentsService } from '@/services/students.service';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

export default function TeacherAttendance() {
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date().toISOString().substring(0, 10));

    // Fetch classes on mount
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                // Using classesService to get available classes
                const data = await classesService.getAll();
                const safeData = Array.isArray(data) ? data : [];
                setClasses(safeData);
                if (safeData.length > 0) {
                    setSelectedClassId(safeData.at(0)?.id || '');
                }
            } catch (error) {
                console.error(error);
                toast.error('Failed to load classes.');
            }
        };
        fetchClasses();
    }, []);

    useEffect(() => {
        if (!selectedClassId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [studentsModule, attendanceModule] = await Promise.all([
                    import('@/services/students.service'),
                    import('@/services/attendance.service')
                ]);

                const [studentsResponse, attendanceResponse] = await Promise.all([
                    studentsModule.studentsService.getByClass(selectedClassId),
                    attendanceModule.attendanceService.getStudentAttendance({ classId: selectedClassId, date })
                ]);

                // Handle student list (backend might return array or object with data)
                const studentList = Array.isArray(studentsResponse) ? studentsResponse : (studentsResponse as any)?.data || [];

                // Handle attendance records
                const attendanceRecords = Array.isArray(attendanceResponse?.data) ? attendanceResponse.data : [];
                const attendanceMap = new Map<string, string>(
                    attendanceRecords
                        .filter(r => r && r.studentId)
                        .map((r: any) => [String(r.studentId), String(r.status)] as [string, string])
                );

                // Merge: Master list + Attendance Status (Filter Boolean to be safe)
                const mergedData = studentList
                    .filter((s: any) => s && (s.id || s._id))
                    .map((student: any) => {
                        const id = student?.id || student?._id;
                        return {
                            ...student,
                            id,
                            name: `${student?.firstName || ''} ${student?.lastName || ''}`.trim() || 'Unknown Student',
                            status: attendanceMap.get(id) || 'PRESENT',
                            studentId: student?.admissionNumber || student?.rollNumber || id
                        };
                    });

                setStudents(mergedData || []);
            } catch (error: any) {
                console.error('Attendance sync error:', error);
                setStudents([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [date, selectedClassId]);

    const onMark = (id: string, status: string) => {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    };

    const onSave = async () => {
        try {
            await attendanceService.markBulkAttendance({
                classId: selectedClassId,
                date,
                students: students.map(s => ({ studentId: s.id, status: s.status }))
            });
            toast.success('Attendance records synchronized.');
        } catch (error: any) {
            console.error('Save attendance error:', error);
            toast.error('Failed to sync attendance records.');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-2 mb-2 text-primary">
                        Teacher Office: Student Attendance
                    </Badge>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Mark Attendance</h1>
                    <p className="text-sm font-medium text-slate-500 italic">Mark which students are present today and save the records.</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-4 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                    >
                        {classes.length === 0 && <option>Loading...</option>}
                        {(classes || []).filter(Boolean).map(c => (
                            <option key={c?.id} value={c?.id}>{c?.name}</option>
                        ))}
                    </select>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                    />
                    <Button
                        onClick={onSave}
                        className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-10 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95"
                    >
                        <Save size={18} />
                        Save Attendance
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div className="relative group max-w-md w-full">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search Student Name or ID..."
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-100 dark:ring-slate-800 focus:ring-2 focus:ring-primary transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="size-2 rounded-full bg-emerald-500"></div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Present:00</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="size-2 rounded-full bg-rose-500"></div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Absent:00</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[2.5rem] border-2 border-slate-50 dark:border-slate-800 overflow-hidden shadow-xl">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800 border-b-2 border-slate-100 dark:border-slate-800">
                                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Student Name</th>
                                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-10 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i}>
                                            <td className="px-10 py-6"><Skeleton className="h-4 w-48" /></td>
                                            <td className="px-10 py-6"><Skeleton className="h-4 w-24" /></td>
                                            <td className="px-10 py-6"><Skeleton className="h-10 w-64 mx-auto rounded-xl" /></td>
                                        </tr>
                                    ))
                                ) : (
                                    (students || []).filter(s => s && s.id).map((student) => (
                                        <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                                            <td className="px-10 py-6 text-left">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-black text-[10px]">
                                                        {String(student?.name || '').substring(0, 2) || 'ST'}
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{student?.name}</p>
                                                        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest italic">ID: {student?.studentId || student?.rollNumber}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-left">
                                                <Badge
                                                    variant="outline"
                                                    className={`text-[8px] font-black uppercase tracking-widest border-lg ${student.status === 'PRESENT' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}
                                                >
                                                    {student.status || 'Not Marked'}
                                                </Badge>
                                            </td>
                                            <td className="px-10 py-6 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => onMark(student.id, 'PRESENT')}
                                                        className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${student.status === 'PRESENT' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-emerald-500'}`}
                                                    >
                                                        Present
                                                    </button>
                                                    <button
                                                        onClick={() => onMark(student.id, 'ABSENT')}
                                                        className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${student.status === 'ABSENT' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500'}`}
                                                    >
                                                        Absent
                                                    </button>
                                                    <button
                                                        onClick={() => onMark(student.id, 'LATE')}
                                                        className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${student.status === 'LATE' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-amber-500'}`}
                                                    >
                                                        Late
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            All Records Verified
                        </p>
                        <div className="flex items-center gap-4">
                            <Button variant="secondary" className="bg-slate-50 dark:bg-slate-800 border-none rounded-[2rem] px-8 py-4 h-auto font-black text-[10px] uppercase tracking-widest gap-2 text-slate-400 hover:text-primary transition-all">
                                <History size={16} />
                                Attendance History
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
