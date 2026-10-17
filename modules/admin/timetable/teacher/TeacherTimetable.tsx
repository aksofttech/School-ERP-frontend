import React, { useState, useEffect, useMemo } from 'react';
import {
    Clock,
    Plus,
    Calendar,
    Printer,
    Edit3,
    Trash2,
    X,
    Users,
    Layers,
    MapPin,
    Check,
    RefreshCw,
    UserCheck,
    ChevronDown
} from 'lucide-react';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import { UserRole } from '@/utils/types';
import { timetableService } from '@/services/timetable.service';
import { teachersService } from '@/services/teachers.service';
import { useClasses } from '@/hooks/useClasses';
import { useSubjects } from '@/hooks/useSubjects';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
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
    const [teachers, setTeachers] = useState<any[]>([]);
    const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
    const [timetableData, setTimetableData] = useState<Record<string, any[]> | null>(null);
    const [loadingTimetable, setLoadingTimetable] = useState(false);

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

    // Fetch teachers on mount
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const res = await teachersService.getAll({ limit: 50 });
                const list = res.data || [];
                setTeachers(list);
                if (list.length > 0) {
                    const rajesh = list.find((t: any) =>
                        t.user?.email === 'rajesh.sharma@vidyamandir.edu.in' ||
                        `${t.user?.firstName} ${t.user?.lastName}`.toLowerCase().includes('rajesh')
                    );
                    setSelectedTeacherId(rajesh ? rajesh.id : list[0].id);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchTeachers();
    }, []);

    // Fetch timetable when selected teacher changes
    const fetchTimetable = async (teacherId: string) => {
        if (!teacherId) return;
        setLoadingTimetable(true);
        try {
            const data = await timetableService.getByTeacher(teacherId);
            setTimetableData(data.timetable || {});
        } catch (error: any) {
            console.error('Failed to load teacher timetable:', error);
            toast.error('Failed to load timetable for selected teacher.');
        } finally {
            setLoadingTimetable(false);
        }
    };

    useEffect(() => {
        if (selectedTeacherId) {
            fetchTimetable(selectedTeacherId);
        }
    }, [selectedTeacherId]);

    // Set default class & subject for form
    useEffect(() => {
        if (classes.length > 0 && !formData.classId) {
            setFormData(prev => ({ ...prev, classId: classes[0].id }));
        }
        if (subjects.length > 0 && !formData.subjectId) {
            setFormData(prev => ({ ...prev, subjectId: subjects[0].id }));
        }
    }, [classes, subjects, formData.classId, formData.subjectId]);

    const toMinutes = (timeStr: string) => {
        if (!timeStr) return 0;
        const [h, m] = timeStr.split(':').map(Number);
        return (h || 0) * 60 + (m || 0);
    };

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

    const handleOpenCreate = (day: string, slot?: PeriodSlot) => {
        setEditingEntry(null);
        const selectedSlot = slot || STANDARD_PERIODS[0];
        setFormData({
            day,
            periodSlot: `${selectedSlot.startTime}-${selectedSlot.endTime}`,
            startTime: selectedSlot.startTime,
            endTime: selectedSlot.endTime,
            classId: classes[0]?.id || '',
            subjectId: subjects[0]?.id || '',
            room: 'Room 101',
        });
        setIsModalOpen(true);
    };

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

    const handleSlotPresetChange = (preset: string) => {
        const [start, end] = preset.split('-');
        setFormData(prev => ({
            ...prev,
            periodSlot: preset,
            startTime: start,
            endTime: end
        }));
    };

    const handleSubmitPeriod = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTeacherId || !formData.classId || !formData.subjectId) {
            toast.error('Please fill in all required fields.');
            return;
        }

        setSubmitting(true);
        try {
            if (editingEntry) {
                await timetableService.update(editingEntry.id, {
                    classId: formData.classId,
                    subjectId: formData.subjectId,
                    teacherId: selectedTeacherId,
                    day: formData.day,
                    startTime: formData.startTime,
                    endTime: formData.endTime,
                    room: formData.room,
                });
                toast.success('Period updated successfully!');
            } else {
                await timetableService.create({
                    classId: formData.classId,
                    subjectId: formData.subjectId,
                    teacherId: selectedTeacherId,
                    day: formData.day,
                    startTime: formData.startTime,
                    endTime: formData.endTime,
                    room: formData.room,
                });
                toast.success('Lecture period added successfully!');
            }

            setIsModalOpen(false);
            fetchTimetable(selectedTeacherId);
        } catch (error: any) {
            console.error('Save period error:', error);
            toast.error(error.message || 'Failed to save timetable period.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeletePeriod = async () => {
        if (!editingEntry) return;
        if (!confirm('Are you sure you want to delete this period from the schedule?')) return;

        setDeletingId(editingEntry.id);
        try {
            await timetableService.delete(editingEntry.id);
            toast.success('Period removed.');
            setIsModalOpen(false);
            fetchTimetable(selectedTeacherId);
        } catch (error: any) {
            console.error('Delete error:', error);
            toast.error('Failed to remove period.');
        } finally {
            setDeletingId(null);
        }
    };

    const selectedTeacher = useMemo(() => {
        return teachers.find(t => t.id === selectedTeacherId);
    }, [teachers, selectedTeacherId]);

    const totalLecturesCount = useMemo(() => {
        if (!timetableData) return 0;
        return Object.values(timetableData).reduce((sum, list) => sum + (list?.length || 0), 0);
    }, [timetableData]);

    const getClassColorStyle = (className: string) => {
        const name = (className || '').toLowerCase();
        if (name.includes('10')) return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20';
        if (name.includes('9')) return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20';
        if (name.includes('8')) return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';
        if (name.includes('11')) return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
        if (name.includes('12')) return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
        return 'bg-primary/10 text-primary border-primary/20';
    };

    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[UserRole.SCHOOL_ADMIN]}>
                <div className="space-y-8 animate-in fade-in duration-500 pb-16">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                                    <Calendar size={13} />
                                    Staff Timetable Management
                                </span>
                                <span className="text-xs text-slate-400 font-medium">• Academic Year 2026-27</span>
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                Teacher Timetable Manager
                            </h1>
                            <p className="text-sm font-medium text-slate-500 mt-1">
                                Select any staff member to view and edit their weekly lecture schedule.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            {/* Teacher Selector Dropdown */}
                            <div className="relative min-w-[240px]">
                                <select
                                    value={selectedTeacherId}
                                    onChange={(e) => setSelectedTeacherId(e.target.value)}
                                    className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/40 outline-none appearance-none cursor-pointer shadow-sm pr-10"
                                >
                                    {teachers.map(t => (
                                        <option key={t.id} value={t.id}>
                                            {t.user?.firstName} {t.user?.lastName} ({t.user?.email || 'Teacher'})
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>

                            <Button
                                onClick={() => handleOpenCreate('MONDAY', STANDARD_PERIODS[0])}
                                disabled={!selectedTeacherId}
                                className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 py-3.5 h-auto font-black text-xs uppercase tracking-wider gap-2 shadow-xl shadow-primary/25 transition-all hover:shadow-primary/40 active:scale-95"
                            >
                                <Plus size={18} />
                                Add Period
                            </Button>
                        </div>
                    </div>

                    {/* Teacher Info Card */}
                    {selectedTeacher && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Teacher</p>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5 truncate">
                                    {selectedTeacher.user?.firstName} {selectedTeacher.user?.lastName}
                                </h3>
                                <p className="text-[11px] text-slate-400 font-medium truncate">{selectedTeacher.user?.email}</p>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Periods</p>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                    {totalLecturesCount}
                                </h3>
                                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">Assigned per week</p>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Daily Average</p>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                    {Math.round(totalLecturesCount / 6) || 0} Lectures
                                </h3>
                                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Mon - Sat</p>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Admin Status</p>
                                <h3 className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-1">
                                    Full Edit Access
                                </h3>
                                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Click cells to edit</p>
                            </div>
                        </div>
                    )}

                    {/* Weekly Timetable Matrix */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden p-6 md:p-8">
                        {loadingTimetable ? (
                            <div className="space-y-4">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <Skeleton key={i} className="h-20 rounded-2xl" />
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
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
                                        {STANDARD_PERIODS.map((slot) => (
                                            <tr key={slot.startTime} className="group hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors">
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
                                                                            {className || 'Class'}
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
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Schedule / Edit Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                            <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
                                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/70 dark:bg-slate-800/50">
                                    <div>
                                        <h2 className="text-xl font-black text-slate-900 dark:text-white">
                                            {editingEntry ? 'Edit Teacher Period' : 'Add Period to Teacher Schedule'}
                                        </h2>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Teacher: {selectedTeacher?.user?.firstName} {selectedTeacher?.user?.lastName}
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

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Class *</label>
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

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Room / Location *</label>
                                        <input
                                            type="text"
                                            value={formData.room}
                                            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                                            placeholder="e.g. Room 101, Room 201"
                                            required
                                            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                        />
                                    </div>

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
            </RoleGuard>
        </AuthGuard>
    );
}

TeacherTimetable.getLayout = function getLayout(page: React.ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
