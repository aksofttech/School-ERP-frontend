import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Plus,
  Search,
  Filter,
  Calendar,
  Layers,
  BookOpen,
  User,
  Edit2,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Building,
  GraduationCap,
  X,
  AlertCircle
} from 'lucide-react';
import { timetableService } from '@/services/timetable.service';
import { teachersService } from '@/services/teachers.service';
import { subjectsService } from '@/services/subjects.service';
import { classesService } from '@/services/classes.service';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

const DAYS = [
  { key: 'MONDAY', label: 'Monday' },
  { key: 'TUESDAY', label: 'Tuesday' },
  { key: 'WEDNESDAY', label: 'Wednesday' },
  { key: 'THURSDAY', label: 'Thursday' },
  { key: 'FRIDAY', label: 'Friday' },
  { key: 'SATURDAY', label: 'Saturday' },
];

export default function TimetableOrchestration() {
  const [viewMode, setViewMode] = useState<'teacher' | 'class'>('teacher');
  const [teachers, setTeachers] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [activeDay, setActiveDay] = useState<string>('MONDAY');

  const [timetableData, setTimetableData] = useState<any>({
    grouped: {},
    entries: [],
    totalEntries: 0,
  });
  const [loading, setLoading] = useState(false);

  // Edit / Add Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Modal form fields
  const [formDay, setFormDay] = useState('MONDAY');
  const [formStartTime, setFormStartTime] = useState('08:30');
  const [formEndTime, setFormEndTime] = useState('09:15');
  const [formClassId, setFormClassId] = useState('');
  const [formSubjectId, setFormSubjectId] = useState('');
  const [formTeacherId, setFormTeacherId] = useState('');
  const [formRoom, setFormRoom] = useState('Room 101');

  // Load teachers, classes, and subjects on mount
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [teachersRes, classesRes, subjectsRes] = await Promise.all([
          teachersService.getAll({ page: 1, limit: 50 }),
          classesService.getAll(),
          subjectsService.getAll(),
        ]);

        const teacherList = teachersRes.data || [];
        setTeachers(teacherList);
        if (teacherList.length > 0 && !selectedTeacherId) {
          setSelectedTeacherId(teacherList[0].id);
        }

        const classList = Array.isArray(classesRes) ? classesRes : ((classesRes as any).data || []);
        setClasses(classList);
        if (classList.length > 0 && !selectedClassId) {
          setSelectedClassId(classList[0].id);
        }

        setSubjects(subjectsRes || []);
      } catch (err) {
        console.error('Failed to load timetable metadata:', err);
      }
    };

    loadMetadata();
  }, []);

  // Fetch timetable whenever selection changes
  const fetchSchedule = async () => {
    if (viewMode === 'teacher') {
      if (!selectedTeacherId) return;
      try {
        setLoading(true);
        const res: any = await timetableService.getByTeacher(selectedTeacherId);
        setTimetableData({
          grouped: res?.timetable || {},
          entries: res?.entries || [],
          totalEntries: res?.totalEntries || (res?.entries ? res.entries.length : 0),
          teacher: res?.teacher,
        });
      } catch (err: any) {
        console.error('Error fetching teacher timetable:', err);
        toast.error('Unable to load teacher timetable');
      } finally {
        setLoading(false);
      }
    } else {
      if (!selectedClassId) return;
      try {
        setLoading(true);
        const res: any = await timetableService.getByClass(selectedClassId);
        setTimetableData({
          grouped: res?.timetable || {},
          entries: res?.entries || [],
          totalEntries: res?.totalEntries || (res?.entries ? res.entries.length : 0),
          class: res?.class,
        });
      } catch (err: any) {
        console.error('Error fetching class timetable:', err);
        toast.error('Unable to load class timetable');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [viewMode, selectedTeacherId, selectedClassId]);

  // Selected teacher info
  const currentTeacher = useMemo(() => {
    return teachers.find((t) => t.id === selectedTeacherId);
  }, [teachers, selectedTeacherId]);

  // Selected class info
  const currentClass = useMemo(() => {
    return classes.find((c) => c.id === selectedClassId);
  }, [classes, selectedClassId]);

  // Open modal for editing a slot
  const handleOpenEdit = (slot: any) => {
    setEditingSlot(slot);
    setFormDay(slot.day);
    setFormStartTime(slot.startTime);
    setFormEndTime(slot.endTime);
    setFormClassId(slot.classId || slot.class?.id || '');
    setFormSubjectId(slot.subjectId || slot.subject?.id || '');
    setFormTeacherId(slot.teacherId || slot.teacher?.id || selectedTeacherId);
    setFormRoom(slot.room || 'Room 101');
    setModalOpen(true);
  };

  // Open modal for creating a new slot
  const handleOpenCreate = () => {
    setEditingSlot(null);
    setFormDay(activeDay);
    setFormStartTime('08:30');
    setFormEndTime('09:15');
    setFormClassId(classes[0]?.id || '');
    setFormSubjectId(subjects[0]?.id || '');
    setFormTeacherId(selectedTeacherId || teachers[0]?.id || '');
    setFormRoom('Room 101');
    setModalOpen(true);
  };

  // Handle save (edit or create)
  const handleSaveSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formClassId || !formSubjectId || !formTeacherId) {
      toast.error('Please fill all required schedule details');
      return;
    }

    try {
      setSubmitting(true);
      if (editingSlot?.id) {
        // Update existing slot
        await timetableService.update(editingSlot.id, {
          day: formDay,
          startTime: formStartTime,
          endTime: formEndTime,
          classId: formClassId,
          subjectId: formSubjectId,
          teacherId: formTeacherId,
          room: formRoom,
        });
        toast.success('Lecture schedule updated successfully!');
      } else {
        // Create new slot
        await timetableService.create({
          day: formDay,
          startTime: formStartTime,
          endTime: formEndTime,
          classId: formClassId,
          subjectId: formSubjectId,
          teacherId: formTeacherId,
          room: formRoom,
        });
        toast.success('New lecture slot added to timetable!');
      }

      setModalOpen(false);
      await fetchSchedule();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save timetable slot');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete slot
  const handleDeleteSlot = async (slotId: string) => {
    if (!confirm('Are you sure you want to remove this lecture slot from the timetable?')) {
      return;
    }
    try {
      await timetableService.delete(slotId);
      toast.success('Lecture slot removed');
      await fetchSchedule();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete slot');
    }
  };

  // Current day's slots
  const activeDaySlots = useMemo(() => {
    const list = timetableData.grouped?.[activeDay] || [];
    return [...list].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [timetableData, activeDay]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pt-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-2">
            <Clock size={14} />
            Institutional Scheduling & Timetable
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Staff Timetable
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            View each staff member&apos;s weekly lecture schedule across classes, and edit slot allocations in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('teacher')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'teacher'
                  ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <User size={14} />
              By Staff
            </button>
            <button
              onClick={() => setViewMode('class')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'class'
                  ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers size={14} />
              By Class
            </button>
          </div>

          <Button
            onClick={handleOpenCreate}
            className="bg-primary hover:bg-primary/90 text-white rounded-xl px-5 py-2.5 font-bold text-sm shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            <Plus size={18} />
            Add Lecture Slot
          </Button>
        </div>
      </div>

      {/* Selector & Staff Information Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Dropdown Selector */}
          <div className="flex-1 max-w-md">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              {viewMode === 'teacher' ? 'Select Staff Member' : 'Select Target Class'}
            </label>
            {viewMode === 'teacher' ? (
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name || `${t.firstName || ''} ${t.lastName || ''}`.trim()} ({t.qualification || 'Teacher'})
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-6 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-4 lg:pt-0 lg:pl-8">
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Total Weekly Periods
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {timetableData.totalEntries || 0} Lectures
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Active Days
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                6 Days (Mon - Sat)
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Daily Average
              </div>
              <div className="text-2xl font-black text-primary mt-0.5">
                {Math.round((timetableData.totalEntries || 0) / 6)} / Day
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Schedule Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Days Tabs Header */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-2 overflow-x-auto">
          {DAYS.map((d) => {
            const count = (timetableData.grouped?.[d.key] || []).length;
            const isActive = activeDay === d.key;
            return (
              <button
                key={d.key}
                onClick={() => setActiveDay(d.key)}
                className={`px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{d.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Periods List for Active Day */}
        <div className="p-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
              <RefreshCw size={32} className="animate-spin text-primary" />
              <p className="text-sm font-medium">Loading schedule...</p>
            </div>
          ) : activeDaySlots.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Clock size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
                No lectures scheduled for {DAYS.find((d) => d.key === activeDay)?.label}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Click &quot;Add Lecture Slot&quot; to assign a class and subject for this day.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeDaySlots.map((slot: any, index: number) => {
                const className = slot.class?.name || 'Class N/A';
                const subjectName = slot.subject?.name || 'Subject N/A';
                const teacherName = slot.teacher?.user
                  ? `${slot.teacher.user.firstName} ${slot.teacher.user.lastName}`
                  : 'Teacher Assigned';

                return (
                  <div
                    key={slot.id}
                    className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-primary/40 hover:shadow-md transition-all group flex flex-col justify-between gap-4"
                  >
                    <div>
                      {/* Top Bar: Period # and Time */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-xs font-black text-primary uppercase tracking-wider">
                          Period {index + 1}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                          <Clock size={12} className="text-slate-400" />
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>

                      {/* Main Info */}
                      <div className="mt-3">
                        <div className="inline-block px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs mb-1.5 border border-indigo-200/60 dark:border-indigo-800/60">
                          {className}
                        </div>
                        <h4 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                          {subjectName}
                        </h4>
                        {viewMode === 'class' && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                            <User size={13} className="text-slate-400" />
                            <span>{teacherName}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                          <Building size={13} className="text-slate-400" />
                          <span>{slot.room || 'General Classroom'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        45 Min Lecture
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(slot)}
                          className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          title="Edit Lecture Slot"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteSlot(slot.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                          title="Delete Lecture Slot"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* EDIT / CREATE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  {editingSlot ? <Edit2 size={20} /> : <Plus size={20} />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {editingSlot ? 'Edit Lecture Schedule' : 'Add New Lecture Slot'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Assign teacher, class, subject, and time slot
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveSlot} className="space-y-4">
              {/* Day of Week */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Day of Week *
                </label>
                <select
                  value={formDay}
                  onChange={(e) => setFormDay(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                >
                  {DAYS.map((d) => (
                    <option key={d.key} value={d.key}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Slots */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Start Time (HH:mm) *
                  </label>
                  <input
                    type="time"
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    End Time (HH:mm) *
                  </label>
                  <input
                    type="time"
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              {/* Teacher / Staff */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Assigned Staff / Teacher *
                </label>
                <select
                  value={formTeacherId}
                  onChange={(e) => setFormTeacherId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name || `${t.firstName || ''} ${t.lastName || ''}`.trim()} ({t.qualification || 'Teacher'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Class & Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Class *
                  </label>
                  <select
                    value={formClassId}
                    onChange={(e) => setFormClassId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Subject *
                  </label>
                  <select
                    value={formSubjectId}
                    onChange={(e) => setFormSubjectId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Classroom / Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Classroom / Location
                </label>
                <input
                  type="text"
                  value={formRoom}
                  onChange={(e) => setFormRoom(e.target.value)}
                  placeholder="e.g. Room 101, Science Lab, Sports Ground"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  className="w-1/2 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      {editingSlot ? 'Update Slot' : 'Create Slot'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
