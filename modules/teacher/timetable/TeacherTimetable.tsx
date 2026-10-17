import { useState, useEffect, useMemo } from 'react';
import {
    Clock,
    Plus,
    Calendar,
    Printer,
    Edit3,
    Trash2,
    X,
    CheckCircle2,
    Users,
    BookOpen,
    Layers,
    Sparkles,
    Check,
    AlertCircle,
    ChevronRight,
    MapPin,
    GraduationCap,
    RefreshCw
} from 'lucide-react';
import { timetableService } from '@/services/timetable.service';
import { useClasses } from '@/hooks/useClasses';
import { useSubjects } from '@/hooks/useSubjects';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

interface PeriodSlot {
    periodNum: number;
    name: string;
    startTime: string;
    endTime: string;
    displayTime: string;
}

const STANDARD_PERIODS: PeriodSlot[] = [
    { periodNum: 1, name: 'Period 1', startTime: '08:30', endTime: '09:15', displayTime: '08:30 - 09:15 AM' },
    { periodNum: 2, name: 'Period 2', startTime: '09:15', endTime: '10:00', displayTime: '09:15 - 10:00 AM' },
    { periodNum: 3, name: 'Period 3', startTime: '10:15', endTime: '11:00', displayTime: '10:15 - 11:00 AM' },
    { periodNum: 4, name: 'Period 4', startTime: '11:00', endTime: '11:45', displayTime: '11:00 - 11:45 AM' },
    { periodNum: 5, name: 'Period 5', startTime: '12:30', endTime: '13:15', displayTime: '12:30 - 01:15 PM' },
    { periodNum: 6, name: 'Period 6', startTime: '13:15', endTime: '14:00', displayTime: '01:15 - 02:00 PM' },
];

const DAYS_OF_WEEK = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

export default function TeacherTimetable() {
    const [timetableData, setTimetableData] = useState<Record<string, any[]> | null>(null);
    const [rawEntries, setRawEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'GRID' | 'DAY'>('GRID');
    const [selectedDay, setSelectedDay] = useState<string>('MONDAY');

    // Add / Edit Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<any | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const { classes } = useClasses();
    const { subjects } = useSubjects();

    // Form fields
    const [formData, setFormData] = useState({
        day: 'MONDAY',
        periodSlot: '08:30-09:15',
        startTime: '08:30',
        endTime: '09:15',
        classId: '',
        subjectId: '',
        room: 'Room 101',
    });

    const fetchTimetable = async () => {
        setLoading(true);
        try {
            const data = await timetableService.getMyTimetable();
            setTimetableData(data.timetable || {});
            setRawEntries(data.entries || []);
        } catch (error: any) {
            console.error('Failed to load timetable:', error);
            toast.error('Failed to load timetable schedule.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTimetable();
    }, []);

    // Set default day to today if Mon-Sat
    useEffect(() => {
        const currentDayIndex = new Date().getDay(); // 0 is Sunday
        if (currentDayIndex >= 1 && currentDayIndex <= 6) {
            setSelectedDay(DAYS_OF_WEEK[currentDayIndex - 1]);
        }
    }, []);

    // Set default class & subject for form
    useEffect(() => {
        if (classes.length > 0 && !formData.classId) {
            const defaultClass = classes.find(c => c.name === 'Class 10th') || classes[0];
            setFormData(prev => ({ ...prev, classId: defaultClass.id }));
        }
        if (subjects.length > 0 && !formData.subjectId) {
            const math = subjects.find(s => s.name.toLowerCase().includes('math')) || subjects[0];
            setFormData(prev => ({ ...prev, subjectId: math.id }));
        }
    }, [classes, subjects, formData.classId, formData.subjectId]);

    // Convert HH:mm to minutes for comparison
    const toMinutes = (timeStr: string) => {
        if (!timeStr) return 0;
        const [h, m] = timeStr.split(':').map(Number);
        return (h || 0) * 60 + (m || 0);
    };

    // Find timetable entry matching slot
    const getEntryForSlot = (day: string, slot: PeriodSlot) => {
        if (!timetableData || !timetableData[day]) return null;
        const slotStartMin = toMinutes(slot.startTime);
        const slotEndMin = toMinutes(slot.endTime);

        return timetableData[day].find((entry: any) => {
            const entryStartMin = toMinutes(entry.startTime);
            return (
                entry.startTime === slot.startTime ||
                (entryStartMin >= slotStartMin && entryStartMin < slotEndMin)
            );
        });
    };

    // Open Modal for New Entry
    const handleOpenCreate = (day: string, slot?: PeriodSlot) => {
        setEditingEntry(null);
        const selectedSlot = slot || STANDARD_PERIODS[0];
        setFormData({
            day,
            periodSlot: `${selectedSlot.startTime}-${selectedSlot.endTime}`,
            startTime: selectedSlot.startTime,
            endTime: selectedSlot.endTime,
            classId: classes[0]?.id || '',
            subjectId: subjects.find(s => s.name.toLowerCase().includes('math'))?.id || subjects[0]?.id || '',
            room: 'Room 101',
        });
        setIsModalOpen(true);
    };

    // Open Modal for Edit
    const handleOpenEdit = (entry: any, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setEditingEntry(entry);
        setFormData({
            day: entry.day,
            periodSlot: `${entry.startTime}-${entry.endTime}`,
            startTime: entry.startTime,
            endTime: entry.endTime,
            classId: entry.classId || entry.class?.id || '',
            subjectId: entry.subjectId || entry.subject?.id || '',
            room: entry.room || 'Room 101',
        });
        setIsModalOpen(true);
    };

    // Handle Period Slot Change
    const handleSlotPresetChange = (preset: string) => {
        const [start, end] = preset.split('-');
        setFormData(prev => ({
            ...prev,
            periodSlot: preset,
            startTime: start,
            endTime: end
        }));
    };

    // Save or Update Entry
    const handleSubmitPeriod = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.classId || !formData.subjectId || !formData.startTime || !formData.endTime) {
            toast.error('Please fill in all required fields.');
            return;
        }

        setSubmitting(true);
        try {
            if (editingEntry) {
                // Update
                await timetableService.update(editingEntry.id, {
                    classId: formData.classId,
                    subjectId: formData.subjectId,
                    day: formData.day,
                    startTime: formData.startTime,
                    endTime: formData.endTime,
                    room: formData.room,
                });
                toast.success('Timetable period updated successfully!');
            } else {
                // Create
                await timetableService.create({
                    classId: formData.classId,
                    subjectId: formData.subjectId,
                    day: formData.day,
                    startTime: formData.startTime,
                    endTime: formData.endTime,
                    room: formData.room,
                });
                toast.success('New period added to your timetable!');
            }

            setIsModalOpen(false);
            fetchTimetable();
        } catch (error: any) {
            console.error('Save period error:', error);
            toast.error(error.message || 'Failed to save timetable period.');
        } finally {
            setSubmitting(false);
        }
    };

    // Delete Period
    const handleDeletePeriod = async () => {
        if (!editingEntry) return;
        if (!confirm('Are you sure you want to remove this lecture from your timetable?')) return;

        setDeletingId(editingEntry.id);
        try {
            await timetableService.delete(editingEntry.id);
            toast.success('Period removed from schedule.');
            setIsModalOpen(false);
            fetchTimetable();
        } catch (error: any) {
            console.error('Delete period error:', error);
            toast.error('Failed to remove period.');
        } finally {
            setDeletingId(null);
        }
    };

    // Helper for class badge color
    const getClassColorStyle = (className: string) => {
        const name = (className || '').toLowerCase();
        if (name.includes('10')) {
            return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20';
        } else if (name.includes('9')) {
            return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20';
        } else if (name.includes('8')) {
            return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';
        } else if (name.includes('11')) {
            return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
        } else if (name.includes('12')) {
            return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
        }
        return 'bg-primary/10 text-primary border-primary/20';
    };

    // Total lectures calculation
    const totalLecturesCount = useMemo(() => {
        if (!timetableData) return 0;
        return Object.values(timetableData).reduce((sum, list) => sum + (list?.length || 0), 0);
    }, [timetableData]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-16">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                            <Calendar size={13} />
                            Faculty Academic Timetable
                        </span>
                        <span className="text-xs text-slate-400 font-medium">• Academic Year 2026-27</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Teaching Schedule & Timetable
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">
                        View weekly teaching periods, classroom assignments, and update period schedules.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        variant="secondary"
                        onClick={() => window.print()}
                        className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3 h-auto font-black text-xs uppercase tracking-wider gap-2 shadow-sm transition-all active:scale-95 text-slate-700 dark:text-slate-300"
                    >
                        <Printer size={16} />
                        Print Timetable
                    </Button>
                    <Button
                        onClick={() => handleOpenCreate('MONDAY', STANDARD_PERIODS[0])}
                        className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 py-3.5 h-auto font-black text-xs uppercase tracking-wider gap-2 shadow-xl shadow-primary/25 transition-all hover:shadow-primary/40 active:scale-95"
                    >
                        <Plus size={18} />
                        Add Lecture Period
                    </Button>
                </div>
            </div>

            {/* Quick KPI Workload Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Weekly Workload</p>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                        {totalLecturesCount}
                        <span className="text-xs text-slate-400 font-semibold ml-1.5">Periods / Week</span>
                    </h3>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                        Active teaching load
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Daily Average</p>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                        {Math.round(totalLecturesCount / 6) || 5}
                        <span className="text-xs text-slate-400 font-semibold ml-1.5">Lectures / Day</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">Across 6 Working Days</p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Senior Batches</p>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                        5 Classes
                    </h3>
                    <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                        8th, 9th, 10th, 11th, 12th
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Teaching Subject</p>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                        Mathematics
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">Senior Faculty</p>
                </div>
            </div>

            {/* Main Timetable Container */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
                {/* Header Controls: View Mode & Day Tabs */}
                <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                            <Layers size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 dark:text-white">
                                {viewMode === 'GRID' ? 'Weekly Lecture Matrix' : `${selectedDay} Teaching Roster`}
                            </h2>
                            <p className="text-xs text-slate-400">
                                Click on any lecture card to edit details or click vacant slots to add a new period.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* View Switcher */}
                        <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center">
                            <button
                                type="button"
                                onClick={() => setViewMode('GRID')}
                                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                                    viewMode === 'GRID'
                                        ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                                }`}
                            >
                                Weekly Grid
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('DAY')}
                                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                                    viewMode === 'DAY'
                                        ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                                }`}
                            >
                                Day View
                            </button>
                        </div>
                    </div>
                </div>

                {/* Day Selector Tabs if DAY view */}
                {viewMode === 'DAY' && (
                    <div className="px-6 md:px-8 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar bg-slate-50/50 dark:bg-slate-800/30">
                        {DAYS_OF_WEEK.map((day) => {
                            const count = timetableData?.[day]?.length || 0;
                            const isCurrent = selectedDay === day;
                            return (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => setSelectedDay(day)}
                                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                                        isCurrent
                                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                                    }`}
                                >
                                    <span>{day}</span>
                                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                        isCurrent ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                                    }`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* ======================================================== */}
                {/* 1. WEEKLY MATRIX (GRID VIEW)                             */}
                {/* ======================================================== */}
                {viewMode === 'GRID' && (
                    <div className="overflow-x-auto p-6 md:p-8">
                        <table className="w-full border-collapse min-w-[900px]">
                            <thead>
                                <tr>
                                    <th className="p-3 text-[10px] font-black text-slate-400 uppercase tracking-wider text-left w-36 bg-slate-50/70 dark:bg-slate-800/50 rounded-l-xl">
                                        Period \ Day
                                    </th>
                                    {DAYS_OF_WEEK.map((day, idx) => (
                                        <th
                                            key={day}
                                            className={`p-3 text-[11px] font-black uppercase tracking-wider text-center ${
                                                idx === DAYS_OF_WEEK.length - 1 ? 'rounded-r-xl' : ''
                                            } bg-slate-50/70 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300`}
                                        >
                                            {day}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {STANDARD_PERIODS.map((slot, sIdx) => {
                                    // Visual break dividers after Period 2 and Period 4
                                    const showRecess = sIdx === 2; // Before Period 3
                                    const showLunch = sIdx === 4;  // Before Period 5

                                    return (
                                        <tr key={slot.startTime} className="group hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors">
                                            {/* Period Time Header */}
                                            <td className="p-3 align-top border-r border-slate-100 dark:border-slate-800">
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                        {slot.name}
                                                    </span>
                                                    <p className="text-xs font-black text-slate-900 dark:text-white mt-1">
                                                        {slot.startTime}
                                                    </p>
                                                    <p className="text-[10px] font-medium text-slate-400">
                                                        to {slot.endTime}
                                                    </p>
                                                </div>
                                            </td>

                                            {/* 6 Day Columns */}
                                            {DAYS_OF_WEEK.map((day) => {
                                                const entry = getEntryForSlot(day, slot);
                                                const className = entry?.className || entry?.class?.name || (typeof entry?.class === 'string' ? entry?.class : '');
                                                const subjectName = entry?.subjectName || entry?.subject?.name || (typeof entry?.subject === 'string' ? entry?.subject : 'Mathematics');
                                                const room = entry?.room || 'Room 101';

                                                return (
                                                    <td key={`${day}-${slot.startTime}`} className="p-2 align-top">
                                                        {entry ? (
                                                            <div
                                                                onClick={(e) => handleOpenEdit(entry, e)}
                                                                className="group/card rounded-2xl p-3.5 border transition-all cursor-pointer bg-white dark:bg-slate-800 hover:shadow-lg hover:border-primary/50 relative overflow-hidden space-y-2 border-slate-200/80 dark:border-slate-700/70"
                                                            >
                                                                <div className="flex items-start justify-between gap-1.5">
                                                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${getClassColorStyle(className)}`}>
                                                                        {className || 'Class 10th'}
                                                                    </span>
                                                                    <div className="size-6 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-400 group-hover/card:text-primary group-hover/card:bg-primary/10 flex items-center justify-center transition-all opacity-0 group-hover/card:opacity-100">
                                                                        <Edit3 size={12} />
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <h4 className="text-xs font-black text-slate-900 dark:text-white group-hover/card:text-primary transition-colors">
                                                                        {subjectName}
                                                                    </h4>
                                                                    <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-0.5">
                                                                        <MapPin size={10} className="text-slate-400" />
                                                                        {room}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                onClick={() => handleOpenCreate(day, slot)}
                                                                className="h-24 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800/80 hover:border-primary/40 hover:bg-primary/5 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group/empty text-slate-300 dark:text-slate-700 hover:text-primary"
                                                            >
                                                                <Plus size={16} className="group-hover/empty:scale-125 transition-transform" />
                                                                <span className="text-[9px] font-bold uppercase tracking-wider">Vacant</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ======================================================== */}
                {/* 2. DAY-BY-DAY VIEW                                       */}
                {/* ======================================================== */}
                {viewMode === 'DAY' && (
                    <div className="p-6 md:p-8 space-y-4">
                        {loading ? (
                            <div className="space-y-3">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton key={i} className="h-24 rounded-2xl" />
                                ))}
                            </div>
                        ) : (
                            STANDARD_PERIODS.map((slot) => {
                                const entry = getEntryForSlot(selectedDay, slot);
                                const className = entry?.className || entry?.class?.name || (typeof entry?.class === 'string' ? entry?.class : '');
                                const subjectName = entry?.subjectName || entry?.subject?.name || (typeof entry?.subject === 'string' ? entry?.subject : 'Mathematics');
                                const room = entry?.room || 'Room 101';

                                return (
                                    <div
                                        key={slot.startTime}
                                        onClick={() => entry ? handleOpenEdit(entry) : handleOpenCreate(selectedDay, slot)}
                                        className={`rounded-2xl p-5 border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                                            entry
                                                ? 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:shadow-md'
                                                : 'border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary/40 hover:bg-primary/5'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                                <Clock size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                                        {slot.name}
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-400">
                                                        {slot.displayTime}
                                                    </span>
                                                </div>
                                                <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                                                    {entry ? `${subjectName} • ${className}` : 'Vacant Slot (No Lecture Assigned)'}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {entry ? (
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${getClassColorStyle(className)}`}>
                                                        {room}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        onClick={(e) => handleOpenEdit(entry, e)}
                                                        className="text-primary hover:bg-primary/10 text-xs font-bold rounded-xl px-4 py-2"
                                                    >
                                                        <Edit3 size={14} className="mr-1.5" />
                                                        Edit
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => handleOpenCreate(selectedDay, slot)}
                                                    className="text-primary hover:bg-primary/10 text-xs font-bold rounded-xl px-4 py-2"
                                                >
                                                    <Plus size={15} className="mr-1.5" />
                                                    Schedule Lecture
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>

            {/* ======================================================== */}
            {/* ADD / EDIT TIMETABLE MODAL (TEACHER & ADMIN CAN EDIT)    */}
            {/* ======================================================== */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/70 dark:bg-slate-800/50">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                                    {editingEntry ? 'Edit Lecture Schedule' : 'Schedule New Period'}
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {editingEntry ? 'Update class, room, or period timing' : 'Assign teaching lecture to your weekly timetable'}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="size-9 rounded-full bg-slate-200/70 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:bg-rose-500 hover:text-white transition-all"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitPeriod} className="p-6 md:p-8 space-y-5">
                            {/* Day and Preset Period Selection */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Day of Week *</label>
                                    <select
                                        value={formData.day}
                                        onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer"
                                    >
                                        {DAYS_OF_WEEK.map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Period Slot *</label>
                                    <select
                                        value={formData.periodSlot}
                                        onChange={(e) => handleSlotPresetChange(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer"
                                    >
                                        {STANDARD_PERIODS.map(p => (
                                            <option key={p.startTime} value={`${p.startTime}-${p.endTime}`}>
                                                {p.name} ({p.displayTime})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Class and Subject Dropdowns */}
                            <div className="grid grid-cols-2 gap-4">
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
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Subject *</label>
                                    <select
                                        value={formData.subjectId}
                                        onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                                        required
                                        className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer"
                                    >
                                        <option value="">Select Subject</option>
                                        {subjects.map(sub => (
                                            <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Classroom / Location */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Classroom / Room No. *</label>
                                <input
                                    type="text"
                                    value={formData.room}
                                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                                    placeholder="e.g. Room 101, Room 202, Math Lab"
                                    required
                                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                                <div>
                                    {editingEntry && (
                                        <button
                                            type="button"
                                            onClick={handleDeletePeriod}
                                            disabled={deletingId === editingEntry.id}
                                            className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all flex items-center gap-1.5"
                                        >
                                            <Trash2 size={15} />
                                            <span>Delete Period</span>
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <Button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        variant="ghost"
                                        className="text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs px-5"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={submitting}
                                        className="bg-primary hover:bg-primary/90 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                                    >
                                        {submitting ? (
                                            <RefreshCw className="animate-spin" size={15} />
                                        ) : (
                                            <Check size={15} />
                                        )}
                                        <span>{submitting ? 'Saving...' : editingEntry ? 'Update Period' : 'Add Period'}</span>
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
