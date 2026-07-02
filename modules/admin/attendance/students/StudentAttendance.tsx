import React from 'react';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import { classesService } from '@/services/classes.service';
import { studentsService } from '@/services/students.service';
import { attendanceService } from '@/services/attendance.service';
import { Class, Section, Student } from '@/utils/types';
import Skeleton from '@/components/ui/Skeleton';
import {
  Plus,
  Search,
  MoreVertical,
  UserCheck,
  Layers,
  Calendar,
  ShieldCheck,
  Briefcase,
  AlertCircle,
  Hash,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  UserX,
  Database,
  Users
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export default function StudentAttendance() {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [attendanceDate, setAttendanceDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({});

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await classesService.getAll();
        setClasses(data || []);
        if (data && data.length > 0) {
          setSelectedClassId(data[0].id);
        }
      } catch (err: any) {
        toast.error('Failed to load classes');
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (!selectedClassId) return;
    const fetchSections = async () => {
      try {
        const data = await classesService.getSections(selectedClassId);
        setSections(data || []);
        if (data && data.length > 0) {
          setSelectedSectionId(data[0].id);
        } else {
          setSelectedSectionId('');
        }
      } catch (err: any) {
        toast.error('Failed to load cohorts');
      }
    };
    fetchSections();
  }, [selectedClassId]);

  useEffect(() => {
    if (!selectedSectionId) {
      setStudents([]);
      return;
    }
    const fetchStudents = async () => {
      setLoadingStudents(true);
      try {
        // Use getByClass instead of getAll to match backend route
        const data: any = await studentsService.getByClass(selectedClassId);
        // Backend might return array directly or wrapped in data property
        const studentList = Array.isArray(data) ? data : (data.data || []);

        // Filter by section if needed, although backend class fetch might include section filtering or return all
        // Ideally backend supports /students/class/:classId?sectionId=... but the user prompt specificied /students/class/:classId
        // We will filter client side if the result contains all students in class, or just accept the list.
        // Assuming the list is correct for now.

        // If we strictly need to filter by sectionId and the API returns all class students:
        const filteredStudents = selectedSectionId
          ? studentList.filter((s: Student) => s.sectionId === selectedSectionId)
          : studentList;

        setStudents(filteredStudents);

        // Initialize attendance map
        const initialMap: Record<string, AttendanceStatus> = {};
        filteredStudents.forEach((student: Student) => {
          initialMap[student.id] = 'PRESENT';
        });
        setAttendanceMap(initialMap);
      } catch (err: any) {
        console.error(err);
        toast.error('Failed to load students');
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, [selectedSectionId]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap(prev => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const newMap: Record<string, AttendanceStatus> = {};
    students.forEach(student => {
      newMap[student.id] = status;
    });
    setAttendanceMap(newMap);
    toast.success(`Marked all students as ${status.toLowerCase()}`);
  };

  const handleSaveAttendance = async () => {
    if (!selectedSectionId || Object.keys(attendanceMap).length === 0) {
      toast.error('Please select class and cohort');
      return;
    }

    setSaving(true);
    try {
      const attendanceData = Object.entries(attendanceMap).map(([studentId, status]) => ({
        studentId,
        status,
        date: attendanceDate,
        classId: selectedClassId,
        sectionId: selectedSectionId
      }));

      await attendanceService.markStudentAttendance({
        date: attendanceDate,
        classId: selectedClassId,
        sectionId: selectedSectionId,
        records: attendanceData
      });

      toast.success('Attendance saved successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  return (
      <>
        
      <Head>
        <title>Student Attendance - EduCore</title>
      </Head>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Daily Attendance</h1>
          <p className="text-slate-500 font-medium italic">Manage daily attendance for students by class and cohort.</p>
        </div>

        <div className="flex gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-3 flex items-center gap-4 shadow-sm">
            <Calendar size={18} className="text-primary" />
            <div className="flex flex-col">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Date</label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-black text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <button
            onClick={handleSaveAttendance}
            disabled={saving || students.length === 0}
            className="px-10 py-4 bg-primary text-white rounded-[1.5rem] font-black text-sm shadow-2xl shadow-primary/30 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sector Selection Matrix (Left) */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-8 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-6">Select Class & Cohort</h3>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Class</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl py-5 px-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/20 transition-all appearance-none"
                >
                  <option value="" disabled>Select Class</option>
                  {classes.map(cls => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Cohort</label>
                <select
                  value={selectedSectionId}
                  onChange={(e) => setSelectedSectionId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl py-5 px-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/20 transition-all appearance-none"
                  disabled={!selectedClassId}
                >
                  <option value="" disabled>Select Cohort</option>
                  {sections.map(sec => <option key={sec.id} value={sec.id}>{sec.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Bulk Protocols */}
          <div className="bg-slate-900 dark:bg-primary/10 rounded-[3rem] p-8 border border-primary/20 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 size-32 bg-primary/20 rounded-full blur-3xl" />
            <div className="relative z-10 space-y-6">
              <div>
                <h3 className="text-white text-lg font-black uppercase tracking-widest mb-1">Mark All Students</h3>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Quickly mark all students as present or absent</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleMarkAll('PRESENT')}
                  className="p-4 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-2xl flex items-center justify-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-widest transition-all"
                >
                  <CheckCircle2 size={14} />
                  Mark All Present
                </button>
                <button
                  onClick={() => handleMarkAll('ABSENT')}
                  className="p-4 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 rounded-2xl flex items-center justify-center gap-2 text-rose-400 font-black text-[10px] uppercase tracking-widest transition-all"
                >
                  <XCircle size={14} />
                  Mark All Absent
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Registry Table (Right) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] shadow-sm overflow-hidden flex flex-col h-[calc(100vh-280px)]">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Student List</h3>
              <p className="text-lg font-black text-slate-900 dark:text-white leading-none">Students</p>
            </div>
            <div className="size-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm border border-slate-100 dark:border-slate-700">
              <Users size={20} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {loadingStudents ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-20 rounded-[2rem]" />)}
              </div>
            ) : students.length > 0 ? (
              <div className="divide-y divide-slate-50 dark:divide-slate-800">
                {students.map((student, idx) => (
                  <div key={student.id} className="p-8 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-6">
                      <span className="text-xs font-black text-slate-200 dark:text-slate-800 italic group-hover:text-primary transition-colors">#{idx + 1}</span>
                      <div className="flex flex-col">
                        <p className="text-lg font-black text-slate-900 dark:text-white leading-none mb-1 group-hover:text-primary transition-colors">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{student.rollNumber || student.id}</p>
                      </div>
                    </div>

                    <div className="flex p-2 bg-slate-50 dark:bg-slate-800 rounded-3xl gap-1 border border-slate-200 dark:border-slate-700 shadow-inner">
                      <StatusButton
                        active={attendanceMap[student.id] === 'PRESENT'}
                        onClick={() => handleStatusChange(student.id, 'PRESENT')}
                        color="emerald"
                        icon={CheckCircle2}
                        label="P"
                      />
                      <StatusButton
                        active={attendanceMap[student.id] === 'ABSENT'}
                        onClick={() => handleStatusChange(student.id, 'ABSENT')}
                        color="rose"
                        icon={XCircle}
                        label="A"
                      />
                      <StatusButton
                        active={attendanceMap[student.id] === 'LATE'}
                        onClick={() => handleStatusChange(student.id, 'LATE')}
                        color="amber"
                        icon={Clock}
                        label="L"
                      />
                      <StatusButton
                        active={attendanceMap[student.id] === 'EXCUSED'}
                        onClick={() => handleStatusChange(student.id, 'EXCUSED')}
                        color="blue"
                        icon={UserX}
                        label="E"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-20 flex flex-col items-center text-center space-y-8">
                <div className="size-32 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-200">
                  <Database size={64} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none">No Students Found</h3>
                  <p className="text-slate-500 text-sm font-medium italic max-w-sm">Select a Class and Cohort to view students.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    
      </>
    );
}

function StatusButton({ active, onClick, color, icon: Icon, label }: any) {
  const activeStyles: any = {
    emerald: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30',
    rose: 'bg-rose-500 text-white shadow-lg shadow-rose-500/30',
    amber: 'bg-amber-500 text-white shadow-lg shadow-amber-500/30',
    blue: 'bg-primary text-white shadow-lg shadow-primary/30'
  };

  return (
    <button
      onClick={onClick}
      className={`size-12 rounded-2xl flex flex-col items-center justify-center transition-all ${active ? activeStyles[color] : 'bg-transparent text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:text-slate-500'
        }`}
    >
      <Icon size={16} />
      <span className="text-[10px] font-black uppercase leading-none mt-1">{label}</span>
    </button>
  );
}


StudentAttendance.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
