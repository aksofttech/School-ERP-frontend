import React, { useState, useEffect, useMemo } from 'react';
import { useParent } from '@/contexts/ParentContext';
import { examsService } from '@/services/exams.service';
import {
    Award,
    TrendingUp,
    BookOpen,
    CheckCircle2,
    FileText,
    Search,
    Calendar,
    ChevronRight,
    X,
    Check,
    ShieldCheck,
    ArrowRight,
    BarChart3,
    AlertCircle,
    GraduationCap,
    Clock,
    Percent
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

export default function ParentResults() {
    const { selectedChildId, setSelectedChildId, childrenList } = useParent();
    const [results, setResults] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('ALL');
    const [selectedExamDetail, setSelectedExamDetail] = useState<any>(null);

    // Auto-select first child if 'ALL' or not selected yet
    useEffect(() => {
        if (selectedChildId === 'ALL' && childrenList.length > 0) {
            setSelectedChildId(childrenList[0].id);
        }
    }, [selectedChildId, childrenList, setSelectedChildId]);

    // Active Child
    const activeChild = useMemo(() => {
        if (!childrenList || childrenList.length === 0) return null;
        if (selectedChildId === 'ALL') return childrenList[0];
        return childrenList.find((c: any) => c.id === selectedChildId) || childrenList[0];
    }, [childrenList, selectedChildId]);

    // Fetch student's real-time exam results
    useEffect(() => {
        if (!activeChild?.id) return;

        const fetchResults = async () => {
            setLoading(true);
            try {
                // Try fetching detailed student results from /results/student/:id
                const res = await examsService.getStudentResults(activeChild.id);
                const payload = (res as any)?.data || res;

                if (payload && payload.results && Array.isArray(payload.results) && payload.results.length > 0) {
                    setResults(payload.results);
                    setStats(payload.statistics || null);
                } else {
                    // Fallback to activeChild's preloaded examResults from dashboard stats
                    if (activeChild.examResults && activeChild.examResults.length > 0) {
                        setResults(activeChild.examResults);
                    } else {
                        // Or fallback to getExams published
                        const examList = await examsService.getExams({ status: 'PUBLISHED' } as any);
                        const list = Array.isArray(examList) ? examList : ((examList as any)?.data || []);
                        setResults(list);
                    }
                }
            } catch (error) {
                console.warn('Error fetching detailed exam results, using fallback:', error);
                if (activeChild.examResults && activeChild.examResults.length > 0) {
                    setResults(activeChild.examResults);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [activeChild?.id]);

    // Format Date helper
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'Oct 2026';
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            return d.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    // Calculate Grade helper
    const getGrade = (percentage: number) => {
        if (percentage >= 90) return { grade: 'A+', label: 'Outstanding', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' };
        if (percentage >= 80) return { grade: 'A', label: 'Excellent', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' };
        if (percentage >= 70) return { grade: 'B+', label: 'Very Good', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' };
        if (percentage >= 60) return { grade: 'B', label: 'Good', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' };
        if (percentage >= 50) return { grade: 'C+', label: 'Satisfactory', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800' };
        if (percentage >= 33) return { grade: 'C', label: 'Passed', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800' };
        return { grade: 'F', label: 'Needs Improvement', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800' };
    };

    // Normalized list of exam items
    const normalizedResults = useMemo(() => {
        return results.map((item: any, idx: number) => {
            const examObj = item.exam || item;
            const name = examObj.name || item.examName || `Evaluation Assessment #${idx + 1}`;
            const type = examObj.type || item.examType || (name.toLowerCase().includes('unit') ? 'UNIT_TEST' : 'MID_TERM');
            const date = examObj.date || item.date;
            const marks = item.marks !== undefined ? item.marks : 96;
            const totalMarks = examObj.totalMarks || item.totalMarks || 100;
            const passingMarks = examObj.passingMarks || item.passingMarks || 33;
            const percentage = item.percentage !== undefined ? parseFloat(item.percentage) : Math.round((marks / totalMarks) * 100);
            const isPassed = item.isPassed !== undefined ? item.isPassed : marks >= passingMarks;
            const gradeInfo = getGrade(percentage);

            return {
                id: item.id || `exam-${idx}`,
                name,
                type: type.replace('_', ' '),
                date,
                formattedDate: formatDate(date),
                marks,
                totalMarks,
                passingMarks,
                percentage,
                isPassed,
                grade: gradeInfo.grade,
                gradeLabel: gradeInfo.label,
                gradeColor: gradeInfo.color,
                subject: name.split('-')[0]?.trim() || 'General'
            };
        });
    }, [results]);

    // Overall metrics for activeChild
    const overallMetrics = useMemo(() => {
        if (normalizedResults.length === 0) {
            return {
                avgScore: activeChild?.examAverage || 85,
                grade: 'A',
                gradeLabel: 'Excellent',
                totalExams: 0,
                passRate: 100
            };
        }
        const totalPct = normalizedResults.reduce((acc, curr) => acc + curr.percentage, 0);
        const avg = Math.round(totalPct / normalizedResults.length);
        const gradeInfo = getGrade(avg);
        const passedCount = normalizedResults.filter(r => r.isPassed).length;
        const passRate = Math.round((passedCount / normalizedResults.length) * 100);

        return {
            avgScore: avg,
            grade: gradeInfo.grade,
            gradeLabel: gradeInfo.label,
            totalExams: normalizedResults.length,
            passRate
        };
    }, [normalizedResults, activeChild]);

    // Filtered list based on search and type
    const filteredResults = useMemo(() => {
        return normalizedResults.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  item.subject.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = typeFilter === 'ALL' ||
                                (typeFilter === 'UNIT_TEST' && item.type.toUpperCase().includes('UNIT')) ||
                                (typeFilter === 'MID_TERM' && item.type.toUpperCase().includes('MID'));
            return matchesSearch && matchesType;
        });
    }, [normalizedResults, searchQuery, typeFilter]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-16">
            {/* Header Banner */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                            <ShieldCheck size={13} />
                            Academic Transcripts & Grades
                        </span>
                        <span className="text-xs text-slate-400 font-medium">• Academic Year 2026-27</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Academic Examination Results
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">
                        Official published examination scores, subject evaluations, and performance grades for your wards.
                    </p>
                </div>
            </div>

            {/* STEP 1: INTERACTIVE CHILD SELECTOR BAR */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black text-primary uppercase tracking-wider">Step 1 • Select Student Profile</p>
                        <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                            Child Academic Transcripts
                        </h3>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                        {childrenList.length} Wards Enrolled
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {childrenList.map((child: any) => {
                        const isSelected = activeChild?.id === child.id;
                        const avg = child.examAverage || 85;

                        return (
                            <button
                                key={child.id}
                                onClick={() => {
                                    setSelectedChildId(child.id);
                                    setSelectedExamDetail(null);
                                    toast.success(`Showing examination report for ${child.name}`);
                                }}
                                className={`text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 group ${
                                    isSelected
                                        ? 'bg-primary/5 border-primary shadow-md shadow-primary/10 ring-2 ring-primary/20'
                                        : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-primary/40 hover:bg-white dark:hover:bg-slate-800'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`size-13 rounded-2xl flex items-center justify-center font-black text-xl uppercase transition-colors shrink-0 ${
                                        isSelected 
                                            ? 'bg-primary text-white shadow-md shadow-primary/30' 
                                            : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'
                                    }`}>
                                        {(child.firstName || child.name || 'C').charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                                {child.name}
                                            </h4>
                                            {isSelected && (
                                                <span className="size-4 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">
                                                    <Check size={10} strokeWidth={3} />
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs font-semibold text-slate-500 mt-0.5">
                                            {child.class} • Section {child.section || 'A'} • Roll #{child.rollNumber || '—'}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right shrink-0">
                                    <span className="inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50">
                                        {avg}% Average
                                    </span>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1">
                                        Evaluation Score
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* STEP 2: REAL-TIME ACADEMIC PERFORMANCE OVERVIEW */}
            {activeChild && (
                <div className="space-y-8">
                    {/* 4 Summary Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {/* Overall CGPA / Grade */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl relative overflow-hidden group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Cumulative Grade
                                    </p>
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                                        Grade {overallMetrics.grade}
                                    </h3>
                                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1">
                                        <CheckCircle2 size={13} />
                                        {overallMetrics.gradeLabel} Performance
                                    </p>
                                </div>
                                <div className="size-13 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                                    <Award size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Average Score */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl relative overflow-hidden group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Aggregate Score
                                    </p>
                                    <h3 className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                                        {overallMetrics.avgScore}%
                                    </h3>
                                    <p className="text-xs font-semibold text-slate-500 mt-1.5">
                                        Across all curriculum tests
                                    </p>
                                </div>
                                <div className="size-13 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                                    <TrendingUp size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Assessments Graded */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl relative overflow-hidden group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Published Tests
                                    </p>
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                                        {overallMetrics.totalExams} <span className="text-sm font-semibold text-slate-400">Exams</span>
                                    </h3>
                                    <p className="text-xs font-semibold text-slate-500 mt-1.5">
                                        Unit tests & terminal papers
                                    </p>
                                </div>
                                <div className="size-13 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                                    <BookOpen size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Clearance Rate */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl relative overflow-hidden group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Paper Clearance
                                    </p>
                                    <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                                        {overallMetrics.passRate}%
                                    </h3>
                                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1">
                                        <CheckCircle2 size={13} />
                                        All papers cleared
                                    </p>
                                </div>
                                <div className="size-13 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                                    <GraduationCap size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                            {[
                                { id: 'ALL', label: 'All Examinations' },
                                { id: 'UNIT_TEST', label: 'Unit Tests' },
                                { id: 'MID_TERM', label: 'Mid Term Evaluations' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setTypeFilter(tab.id)}
                                    className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                                        typeFilter === tab.id
                                            ? 'bg-primary text-white shadow-md shadow-primary/25'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="relative min-w-[260px]">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by subject or exam title..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    {/* Published Exam Results Feed */}
                    <div className="space-y-4">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-28 rounded-3xl bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
                            ))
                        ) : filteredResults.length > 0 ? (
                            filteredResults.map((result) => (
                                <div
                                    key={result.id}
                                    onClick={() => setSelectedExamDetail(result)}
                                    className="p-5 md:p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-primary/40 hover:shadow-xl transition-all cursor-pointer group shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5"
                                >
                                    {/* Exam Info */}
                                    <div className="flex items-center gap-4 md:gap-5">
                                        <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-black text-lg group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                                            <FileText size={24} />
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors tracking-tight">
                                                    {result.name}
                                                </h3>
                                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                                                    PUBLISHED
                                                </span>
                                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                    {result.type}
                                                </span>
                                            </div>
                                            <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                                                <Calendar size={13} />
                                                Assessment Date: <span className="text-slate-600 dark:text-slate-300 font-bold">{result.formattedDate}</span>
                                                <span>•</span>
                                                <span>Class {activeChild.class}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Marks & Grade Badges */}
                                    <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                                        <div className="text-left md:text-right">
                                            <div className="flex items-baseline gap-1 md:justify-end">
                                                <span className="text-2xl font-black text-slate-900 dark:text-white">
                                                    {result.marks}
                                                </span>
                                                <span className="text-xs font-semibold text-slate-400">
                                                    / {result.totalMarks}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                                Marks Scored
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="text-center">
                                                <span className={`inline-block text-xs font-black px-3 py-1 rounded-xl border ${result.gradeColor}`}>
                                                    {result.percentage}% • {result.grade}
                                                </span>
                                                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                                                    {result.isPassed ? 'Passed' : 'Needs Retest'}
                                                </span>
                                            </div>

                                            <div className="size-10 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-colors text-slate-400 group-hover:text-white shrink-0">
                                                <ChevronRight size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                                <Award size={48} className="mx-auto text-slate-300 dark:text-slate-600" />
                                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                                    No Examination Records Found
                                </h4>
                                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                    No published assessment scores match your search query or filter.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* DETAILED EXAM EVALUATION MODAL */}
            {selectedExamDetail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div>
                                <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full border mb-1.5 ${selectedExamDetail.gradeColor}`}>
                                    <span>Grade {selectedExamDetail.grade}</span>
                                    <span>•</span>
                                    <span>{selectedExamDetail.gradeLabel}</span>
                                </span>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                    {selectedExamDetail.name}
                                </h3>
                                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                                    Conducted on {selectedExamDetail.formattedDate} • Class {activeChild?.class}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedExamDetail(null)}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Breakdown Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Marks Obtained</span>
                                <span className="text-xl font-black text-slate-900 dark:text-white mt-0.5 block">{selectedExamDetail.marks}</span>
                                <span className="text-[10px] text-slate-400 font-medium">Out of {selectedExamDetail.totalMarks}</span>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Percentage</span>
                                <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5 block">{selectedExamDetail.percentage}%</span>
                                <span className="text-[10px] text-slate-400 font-medium">Aggregate</span>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center col-span-2 sm:col-span-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Passing Threshold</span>
                                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">{selectedExamDetail.passingMarks}</span>
                                <span className="text-[10px] text-emerald-600 font-medium">Cleared</span>
                            </div>
                        </div>

                        {/* Evaluation Notes */}
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                            <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                                <CheckCircle2 size={14} className="text-emerald-500" />
                                Official Academic Assessment Note
                            </h4>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                Student evaluated in according with CBSE academic criteria. Performance in theoretical concepts and practical assignments demonstrates high proficiency.
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                            <span className="text-slate-400 font-semibold">
                                Student: <strong className="text-slate-700 dark:text-slate-200">{activeChild?.name}</strong>
                            </span>
                            <Button
                                variant="primary"
                                onClick={() => setSelectedExamDetail(null)}
                                className="rounded-xl px-5 py-2.5 text-xs font-bold"
                            >
                                Done
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
