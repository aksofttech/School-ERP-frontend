import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ParentLayout from '@/components/layouts/ParentLayout';
import { examsService } from '@/services/exams.service';
import { toast } from 'react-hot-toast';
import {
    Award,
    TrendingUp,
    FileText,
    Download,
    Star,
    ShieldCheck,
    Calendar,
    Target,
    ChevronLeft
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import StatCard from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

export default function ParentStudentResultsPage() {
    const router = useRouter();
    const { id: studentId } = router.query;
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (studentId) {
            examsService.generateReportCard(studentId as string, 'current').then(setData).catch(() => {
                toast.error('Failed to load child academic report');
            }).finally(() => setLoading(false));
        }
    }, [studentId]);

    if (loading) return (
        <ParentLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                <LoadingSkeleton />
            </div>
        </ParentLayout>
    );

    if (!data) return (
        <ParentLayout>
            <div className="flex flex-col items-center justify-center h-96 opacity-30 italic">
                <Award size={48} className="mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">No performance data finalized for this student.</p>
            </div>
        </ParentLayout>
    );

    const { student, results, statistics } = data;

    return (
        <ParentLayout>
            <div className="space-y-8 animate-in fade-in duration-500 pb-12">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Link href="/parent/dashboard" className="size-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-primary transition-all shadow-sm">
                            <ChevronLeft size={24} />
                        </Link>
                        <div>
                            <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-2 mb-2 text-primary">
                                WARD_PERFORMANCE
                            </Badge>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Academic Protocol</h1>
                            <p className="text-sm font-medium text-slate-500 italic">Official assessment records for {student.name}</p>
                        </div>
                    </div>
                    <Button variant="outline" className="rounded-2xl px-8 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2">
                        <Download size={18} />
                        Request Certified Copy
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Average Score"
                        value={`${statistics.averageMarks}%`}
                        icon={<TrendingUp size={24} />}
                        color="indigo"
                        trendType="neutral"
                    />
                    <StatCard
                        title="Current Grade"
                        value={statistics.overallGrade}
                        icon={<Award size={24} />}
                        color="emerald"
                        trendType="neutral"
                    />
                    <StatCard
                        title="Total Assessments"
                        value={statistics.totalExams}
                        icon={<ShieldCheck size={24} />}
                        color="blue"
                        trendType="neutral"
                    />
                </div>

                {/* Performance Matrix - Shared UI Component logic would be better here but for brevity: */}
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-10">
                    <div className="flex items-center gap-3 mb-10 border-b border-slate-100 dark:border-slate-800 pb-8">
                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Target size={20} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Verified Assessment Nodes</h2>
                    </div>

                    <div className="space-y-6">
                        {results.map((res: any) => (
                            <div key={res.id} className="group relative bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] p-8 hover:bg-white dark:hover:bg-slate-800 border-2 border-transparent hover:border-primary/20 transition-all hover:shadow-xl">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="size-16 rounded-[1.5rem] bg-white dark:bg-slate-900 flex items-center justify-center text-primary shadow-sm border border-slate-100 dark:border-slate-800 group-hover:bg-primary group-hover:text-white transition-all">
                                            <FileText size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1 italic">{res.exam.name}</h3>
                                            <div className="flex items-center gap-4 text-slate-400">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={12} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{new Date(res.exam.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-amber-500">
                                                    <Star size={12} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{res.exam.type}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-12">
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Score Registry</p>
                                            <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic">
                                                {res.marks} <span className="text-xs text-slate-400 opacity-50">/ {((res as any).exam as any).totalMarks || 100}</span>
                                            </p>
                                        </div>
                                        <div className="size-14 rounded-2xl bg-indigo-500 text-white flex items-center justify-center text-xl font-black italic shadow-lg shadow-indigo-500/20">
                                            {res.grade}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ParentLayout>
    );
}

function LoadingSkeleton() {
    return (
        <>
            <Skeleton className="h-20 w-full rounded-[2rem]" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-[2rem]" />)}
            </div>
            <Skeleton className="h-96 w-full rounded-[2.5rem]" />
        </>
    );
}
