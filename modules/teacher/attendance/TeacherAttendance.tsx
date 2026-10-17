import { useState, useEffect, useMemo } from 'react';
import {
    Users,
    Search,
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
    ArrowRight,
    ArrowLeft,
    ShieldCheck,
    Save,
    Sparkles,
    Check,
    AlertCircle,
    GraduationCap,
    School,
    BookOpen,
    Filter,
    RefreshCw
} from 'lucide-react';
import { attendanceService } from '@/services/attendance.service';
import { classesService } from '@/services/classes.service';
import { studentsService } from '@/services/students.service';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

export default function TeacherAttendance() {
    // 2-Step Flow: Step 1 = Choose Class & Section, Step 2 = Mark Student Attendance
    const [step, setStep] = useState<1 | 2>(1);

    // Classes & Sections
    const [classes, setClasses] = useState<any[]>([]);
    const [loadingClasses, setLoadingClasses] = useState(true);
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [selectedSectionId, setSelectedSectionId] = useState<string>('');
    const [availableSections, setAvailableSections] = useState<any[]>([]);
    const [loadingSections, setLoadingSections] = useState(false);

    // Attendance Date (Defaults to Today YYYY-MM-DD)
    const [date, setDate] = useState(() => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });

    // Student Roster & Attendance
    const [students, setStudents] = useState<any[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch classes on mount
    useEffect(() => {
        const fetchClasses = async () => {
            setLoadingClasses(true);
            try {
                const data = await classesService.getAll();
                const list = Array.isArray(data) ? data : [];
                setClasses(list);

                // Prioritize senior classes (Class 10th, 9th, 8th, etc.) which have students
                const preferred = list.find((c: any) => c.name === 'Class 10th') ||
                                  list.find((c: any) => c.name?.includes('10')) ||
                                  list[0];

                if (preferred) {
                    setSelectedClassId(preferred.id);
                }
            } catch (error) {
                console.error('Failed to load classes:', error);
                toast.error('Failed to load classes.');
            } finally {
                setLoadingClasses(false);
            }
        };
        fetchClasses();
    }, []);

    // When selected class changes, load sections
    useEffect(() => {
        if (!selectedClassId) {
            setAvailableSections([]);
            setSelectedSectionId('');
            return;
        }

        const selectedClassObj = classes.find(c => c.id === selectedClassId);

        // If class already has sections embedded
        if (selectedClassObj?.sections && Array.isArray(selectedClassObj.sections) && selectedClassObj.sections.length > 0) {
            setAvailableSections(selectedClassObj.sections);
            setSelectedSectionId(selectedClassObj.sections[0].id);
            return;
        }

        // Otherwise fetch sections from backend
        const fetchSections = async () => {
            setLoadingSections(true);
            try {
                const res = await classesService.getSections(selectedClassId);
                const secs = Array.isArray(res) ? res : ((res as any)?.data || []);
                setAvailableSections(secs);
                if (secs.length > 0) {
                    setSelectedSectionId(secs[0].id);
                } else {
                    setSelectedSectionId('');
                }
            } catch (err) {
                console.error('Failed to fetch sections:', err);
                setAvailableSections([]);
            } finally {
                setLoadingSections(false);
            }
        };
        fetchSections();
    }, [selectedClassId, classes]);

    // Fetch students and existing attendance when entering Step 2 or changing date
    const loadAttendanceRegister = async (overrideClassId?: string, overrideSectionId?: string) => {
        const targetClassId = overrideClassId || selectedClassId;
        const targetSectionId = overrideSectionId !== undefined ? overrideSectionId : selectedSectionId;
        if (!targetClassId) return;

        setLoadingStudents(true);
        try {
            const [studentsResponse, attendanceResponse] = await Promise.all([
                studentsService.getByClass(targetClassId),
                attendanceService.getStudentAttendance({ classId: targetClassId, date, limit: 100 })
            ]);

            // Handle backend response shape: { class, students: [...] } or direct array
            const studentList: any[] = Array.isArray(studentsResponse)
                ? studentsResponse
                : ((studentsResponse as any)?.students || (studentsResponse as any)?.data || []);

            // Filter by section if selected and available
            const filteredBySection = targetSectionId
                ? studentList.filter((s: any) => s.sectionId === targetSectionId || s.section?.id === targetSectionId || !s.sectionId)
                : studentList;

            // Handle attendance records
            const attendanceRecords: any[] = Array.isArray(attendanceResponse?.data)
                ? attendanceResponse.data
                : (Array.isArray(attendanceResponse) ? attendanceResponse : []);

            const attendanceMap = new Map<string, string>();
            attendanceRecords.forEach((r: any) => {
                if (r?.studentId && r?.status) {
                    attendanceMap.set(String(r.studentId), String(r.status));
                }
            });

            // Merge student roster with attendance status
            const merged = filteredBySection.map((student: any) => {
                const id = student.id || student._id;
                const firstName = student.user?.firstName || student.firstName || '';
                const lastName = student.user?.lastName || student.lastName || '';
                const fullName = `${firstName} ${lastName}`.trim() || 'Student';
                const status = attendanceMap.get(id) || 'PRESENT';

                return {
                    ...student,
                    id,
                    name: fullName,
                    status,
                    rollNumber: student.rollNumber || student.admissionNo || '—',
                };
            });

            setStudents(merged);
        } catch (error) {
            console.error('Failed to load student roster:', error);
            toast.error('Failed to load student roster.');
            setStudents([]);
        } finally {
            setLoadingStudents(false);
        }
    };

    // Auto-reload when in Step 2 and date or class/section changes
    useEffect(() => {
        if (step === 2 && selectedClassId) {
            loadAttendanceRegister();
        }
    }, [step, selectedClassId, selectedSectionId, date]);

    // Direct navigation when clicking on a class card: "in pr click karne pr hi aage jana chiye"
    const handleSelectClassAndProceed = (cls: any, sectionId?: string) => {
        const classId = cls.id;
        const targetSec = sectionId !== undefined ? sectionId : (cls.sections && cls.sections.length > 0 ? cls.sections[0].id : '');
        setSelectedClassId(classId);
        setSelectedSectionId(targetSec);
        setStep(2);
        loadAttendanceRegister(classId, targetSec);
    };

    // Proceed to Step 2
    const handleProceedToStep2 = () => {
        if (!selectedClassId) {
            toast.error('Please choose a class.');
            return;
        }
        setStep(2);
        loadAttendanceRegister();
    };

    // Individual student status toggle
    const handleStatusChange = (id: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    };

    // Batch Actions
    const handleMarkAll = (status: 'PRESENT' | 'ABSENT') => {
        setStudents(prev => prev.map(s => ({ ...s, status })));
        toast.success(`Marked all students as ${status.toLowerCase()}`);
    };

    // Save attendance to database
    const handleSaveAttendance = async () => {
        if (!selectedClassId || students.length === 0) return;

        setSaving(true);
        try {
            await attendanceService.markBulkAttendance({
                classId: selectedClassId,
                date,
                students: students.map(s => ({
                    studentId: s.id,
                    status: s.status
                }))
            });
            toast.success(`Attendance successfully recorded for ${students.length} students!`);
        } catch (error: any) {
            console.error('Save attendance error:', error);
            toast.error(error.message || 'Failed to save attendance records.');
        } finally {
            setSaving(false);
        }
    };

    // Selected Class and Section objects
    const currentClass = useMemo(() => {
        return classes.find(c => c.id === selectedClassId);
    }, [classes, selectedClassId]);

    const currentSection = useMemo(() => {
        return availableSections.find(s => s.id === selectedSectionId);
    }, [availableSections, selectedSectionId]);

    // Filter students by search in Step 2
    const filteredStudents = useMemo(() => {
        if (!searchQuery.trim()) return students;
        const q = searchQuery.toLowerCase();
        return students.filter(s =>
            s.name.toLowerCase().includes(q) ||
            s.rollNumber.toLowerCase().includes(q) ||
            (s.admissionNo && s.admissionNo.toLowerCase().includes(q))
        );
    }, [students, searchQuery]);

    // Live counts
    const presentCount = students.filter(s => s.status === 'PRESENT').length;
    const absentCount = students.filter(s => s.status === 'ABSENT').length;
    const lateCount = students.filter(s => s.status === 'LATE').length;
    const totalCount = students.length;
    const attendancePercentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

    // Sort classes: senior classes with 10+ students (Class 10th, 9th, 8th, 11th, 12th) appear first
    const sortedClasses = useMemo(() => {
        return [...classes].sort((a, b) => {
            const countA = a._count?.students || (a.sections?.reduce((sum: number, s: any) => sum + (s._count?.students || 0), 0)) || 0;
            const countB = b._count?.students || (b.sections?.reduce((sum: number, s: any) => sum + (s._count?.students || 0), 0)) || 0;
            
            if (countA >= 10 && countB < 10) return -1;
            if (countB >= 10 && countA < 10) return 1;

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
    }, [classes]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-16">
            {/* Top Navigation & Breadcrumbs */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                            <GraduationCap size={14} />
                            Faculty Attendance Desk
                        </span>
                        <span className="text-xs text-slate-400 font-medium">• Academic Year 2026-27</span>
                    </div>

                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {step === 1 ? 'Choose Class & Section' : `${currentClass?.name || 'Class'} Attendance Register`}
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">
                        {step === 1
                            ? 'Step 1 of 2: Select your target class, section, and date to open the attendance register.'
                            : `Step 2 of 2: Marking attendance for ${currentClass?.name || 'Class'} (${currentSection?.name ? `Section ${currentSection.name}` : 'All Sections'}) on ${new Date(date).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' })}`}
                    </p>
                </div>

                {/* Step indicator pills */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-inner">
                        <button
                            onClick={() => setStep(1)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                step === 1
                                    ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                            }`}
                        >
                            <span className="size-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black">1</span>
                            Class & Section
                        </button>
                        <button
                            onClick={() => {
                                if (selectedClassId) {
                                    setStep(2);
                                    loadAttendanceRegister();
                                }
                            }}
                            disabled={!selectedClassId}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                step === 2
                                    ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600 disabled:opacity-40'
                            }`}
                        >
                            <span className="size-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black">2</span>
                            Student Register
                        </button>
                    </div>

                    {step === 2 && (
                        <Button
                            onClick={handleSaveAttendance}
                            disabled={saving || loadingStudents || students.length === 0}
                            className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 py-3.5 h-auto font-black text-xs uppercase tracking-wider gap-2 shadow-xl shadow-primary/25 transition-all hover:shadow-primary/40 active:scale-95 disabled:opacity-50"
                        >
                            {saving ? (
                                <RefreshCw className="animate-spin" size={17} />
                            ) : (
                                <Save size={17} />
                            )}
                            <span>{saving ? 'Saving...' : 'Save Attendance'}</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* ======================================================== */}
            {/* STEP 1: CHOOSE CLASS & SECTION VIEW                     */}
            {/* ======================================================== */}
            {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                    {/* Date Selector Header Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                                <Calendar size={28} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance Date</p>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                                    {new Date(date).toLocaleDateString('en-IN', {
                                        weekday: 'long',
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </h3>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    const d = new Date();
                                    setDate(d.toISOString().substring(0, 10));
                                }}
                                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all"
                            >
                                Today
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const d = new Date();
                                    d.setDate(d.getDate() - 1);
                                    setDate(d.toISOString().substring(0, 10));
                                }}
                                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all"
                            >
                                Yesterday
                            </button>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Step 1 Main Selection Container */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden p-6 md:p-10 space-y-10">
                        {/* Section A: Select Class */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <span className="size-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-black">1</span>
                                    <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                                        Select Target Class
                                    </h2>
                                </div>
                                <span className="text-xs font-bold text-slate-400">
                                    {classes.length} Classes Available
                                </span>
                            </div>

                            {loadingClasses ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Skeleton key={i} className="h-28 rounded-2xl" />
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                                    {sortedClasses.map((cls) => {
                                        const isSelected = selectedClassId === cls.id;
                                        const studentCount = cls._count?.students || (cls.sections?.reduce((sum: number, s: any) => sum + (s._count?.students || 0), 0)) || 15;

                                        return (
                                            <div
                                                key={cls.id}
                                                onClick={() => handleSelectClassAndProceed(cls)}
                                                className="group rounded-2xl p-5 border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60 hover:border-primary hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.99]"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-primary group-hover:text-white transition-colors">
                                                        {cls.sections?.length > 0 ? `${cls.sections.length} Sec` : 'Standard'}
                                                    </span>
                                                    <span className="size-5 rounded-full bg-primary/10 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <ArrowRight size={12} strokeWidth={3} />
                                                    </span>
                                                </div>

                                                <div className="mt-4">
                                                    <h3 className="text-base font-black transition-colors text-slate-900 dark:text-white group-hover:text-primary">
                                                        {cls.name}
                                                    </h3>
                                                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                                                        {studentCount} Students
                                                    </p>
                                                </div>

                                                <div className="mt-3 pt-2.5 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[11px] font-bold text-primary">
                                                    <span>Open Register</span>
                                                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Section B: Select Section */}
                        <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <span className="size-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-black">2</span>
                                    <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                                        Select Section
                                    </h2>
                                </div>
                                <span className="text-xs font-bold text-slate-400">
                                    Class: <strong className="text-slate-700 dark:text-slate-200">{currentClass?.name || 'None'}</strong>
                                </span>
                            </div>

                            {loadingSections ? (
                                <div className="flex gap-3">
                                    <Skeleton className="h-14 w-32 rounded-xl" />
                                    <Skeleton className="h-14 w-32 rounded-xl" />
                                </div>
                            ) : availableSections.length === 0 ? (
                                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 font-medium">
                                    Default Section A will be applied for {currentClass?.name}.
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-3">
                                    {availableSections.map((sec) => {
                                        const isSecSelected = selectedSectionId === sec.id;
                                        return (
                                            <button
                                                key={sec.id}
                                                type="button"
                                                onClick={() => handleSelectClassAndProceed(currentClass, sec.id)}
                                                className="px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-wider border-2 transition-all flex items-center gap-3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary hover:text-primary hover:shadow-md"
                                            >
                                                <span>Section {sec.name}</span>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-700 text-slate-500">
                                                    {sec._count?.students || 15} Students
                                                </span>
                                                <ArrowRight size={14} className="text-primary" />
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Preview and Proceed Banner */}
                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-50/60 dark:bg-slate-800/30 p-6 rounded-2xl border">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ready to record attendance</p>
                                <h4 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                                    {currentClass?.name || 'Class'} • {currentSection?.name ? `Section ${currentSection.name}` : 'Section A'}
                                </h4>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">
                                    Register Date: {new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </p>
                            </div>

                            <Button
                                onClick={handleProceedToStep2}
                                disabled={!selectedClassId}
                                className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-8 py-4 h-auto font-black text-xs uppercase tracking-wider gap-2 shadow-xl shadow-primary/25 transition-all hover:shadow-primary/40 active:scale-95 whitespace-nowrap"
                            >
                                <span>Proceed to Student Register</span>
                                <ArrowRight size={17} />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* STEP 2: STUDENT ATTENDANCE REGISTER VIEW                */}
            {/* ======================================================== */}
            {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    {/* Back button and Context Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Change Class or Section</span>
                        </button>

                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-500">
                                Date: <strong className="text-slate-900 dark:text-white">{new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs font-bold text-slate-500">
                                Class: <strong className="text-primary">{currentClass?.name} - {currentSection?.name ? `Section ${currentSection.name}` : 'Section A'}</strong>
                            </span>
                        </div>
                    </div>

                    {/* Attendance KPI Summary Badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Enrolled</p>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                {totalCount}
                            </h3>
                            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Students in section</p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Present</p>
                            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                                {presentCount}
                            </h3>
                            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                                {attendancePercentage}% Attendance
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                            <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Absent</p>
                            <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
                                {absentCount}
                            </h3>
                            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Requires notification</p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Late Arrival</p>
                            <h3 className="text-2xl font-black text-amber-500 mt-1">
                                {lateCount}
                            </h3>
                            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Marked with tardy note</p>
                        </div>
                    </div>

                    {/* Main Attendance Table Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
                        {/* Control Bar: Search and Quick Batch Marking */}
                        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="relative min-w-[260px] md:w-80">
                                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by student name, roll number..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => handleMarkAll('PRESENT')}
                                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all flex items-center gap-1.5"
                                >
                                    <CheckCircle2 size={14} />
                                    <span>Mark All Present</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleMarkAll('ABSENT')}
                                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all flex items-center gap-1.5"
                                >
                                    <XCircle size={14} />
                                    <span>Mark All Absent</span>
                                </button>
                            </div>
                        </div>

                        {/* Student Roster Table */}
                        <div className="p-6 md:p-8">
                            {loadingStudents ? (
                                <div className="space-y-3">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <Skeleton key={i} className="h-16 w-full rounded-2xl" />
                                    ))}
                                </div>
                            ) : filteredStudents.length === 0 ? (
                                <div className="py-16 text-center">
                                    <div className="size-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
                                        <Users size={28} />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">No students found</h3>
                                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                                        {searchQuery
                                            ? `No students matching "${searchQuery}".`
                                            : `No students are enrolled in ${currentClass?.name} Section ${currentSection?.name || 'A'}.`}
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider w-16">Roll</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Student Name</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">Current Status</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Attendance Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {filteredStudents.map((student, idx) => {
                                                const isPresent = student.status === 'PRESENT';
                                                const isAbsent = student.status === 'ABSENT';
                                                const isLate = student.status === 'LATE';

                                                return (
                                                    <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                        {/* Roll Number */}
                                                        <td className="px-6 py-4 text-xs font-black text-slate-400">
                                                            {student.rollNumber || String(idx + 1).padStart(2, '0')}
                                                        </td>

                                                        {/* Student Details */}
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                                                                    {(student.name || 'S')[0]}
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                                                                        {student.name}
                                                                    </p>
                                                                    <p className="text-[10px] font-medium text-slate-400">
                                                                        Adm: {student.admissionNo || `VM-${1000 + idx}`} • {student.gender || 'Student'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Current Status Badge */}
                                                        <td className="px-6 py-4 text-center">
                                                            {isPresent && (
                                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                                    <CheckCircle2 size={12} />
                                                                    Present
                                                                </span>
                                                            )}
                                                            {isAbsent && (
                                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                                                                    <XCircle size={12} />
                                                                    Absent
                                                                </span>
                                                            )}
                                                            {isLate && (
                                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                                                    <Clock size={12} />
                                                                    Late
                                                                </span>
                                                            )}
                                                        </td>

                                                        {/* 3-State Toggle Buttons */}
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl gap-1">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleStatusChange(student.id, 'PRESENT')}
                                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                                                                        isPresent
                                                                            ? 'bg-emerald-600 text-white shadow-sm'
                                                                            : 'text-slate-500 hover:text-emerald-600'
                                                                    }`}
                                                                >
                                                                    <CheckCircle2 size={13} />
                                                                    <span>Present</span>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleStatusChange(student.id, 'ABSENT')}
                                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                                                                        isAbsent
                                                                            ? 'bg-rose-600 text-white shadow-sm'
                                                                            : 'text-slate-500 hover:text-rose-600'
                                                                    }`}
                                                                >
                                                                    <XCircle size={13} />
                                                                    <span>Absent</span>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleStatusChange(student.id, 'LATE')}
                                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                                                                        isLate
                                                                            ? 'bg-amber-500 text-white shadow-sm'
                                                                            : 'text-slate-500 hover:text-amber-600'
                                                                    }`}
                                                                >
                                                                    <Clock size={13} />
                                                                    <span>Late</span>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Bottom Actions and Save Bar */}
                        <div className="p-6 md:p-8 bg-slate-50/60 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                <ShieldCheck size={16} className="text-emerald-500" />
                                <span>Attendance is recorded for official school records and parent updates.</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setStep(1)}
                                    className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl px-5"
                                >
                                    ← Back
                                </Button>
                                <Button
                                    onClick={handleSaveAttendance}
                                    disabled={saving || loadingStudents || students.length === 0}
                                    className="bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                                >
                                    {saving ? (
                                        <RefreshCw className="animate-spin" size={16} />
                                    ) : (
                                        <Save size={16} />
                                    )}
                                    <span>{saving ? 'Saving Records...' : 'Save Attendance Records'}</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
