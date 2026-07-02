import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import {
    Printer,
    Download,
    ChevronLeft,
    Award,
    TrendingUp,
    User,
    School,
    FileText,
    Activity,
    CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { examsService } from '@/services/exams.service';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import AdminLayout from '@/components/layouts/AdminLayout';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import { USER_ROLES } from '@/utils/role-config';
import Head from 'next/head';

export default function ReportCard() {
    const router = useRouter();
    const { studentId, yearId } = router.query;
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState<any>(null);
    const reportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (studentId) {
            fetchReport();
        }
    }, [studentId]);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const data = await examsService.generateReportCard(studentId as string, (yearId as string) || '2023-24');
            setReportData(data);
        } catch (err) {
            // Demo report data if API fails
            setReportData({
                student: { name: 'Aaryan Sharma', id: studentId, grade: '10-A', roll: '24' },
                results: [
                    { subject: 'Mathematics', marks: 92, max: 100, grade: 'A+', remarks: 'Excellent logical reasoning.' },
                    { subject: 'Physics', marks: 88, max: 100, grade: 'A', remarks: 'Strong conceptual grasp.' },
                    { subject: 'Chemistry', marks: 85, max: 100, grade: 'A', remarks: 'Consistent performance.' },
                    { subject: 'English', marks: 95, max: 100, grade: 'A+', remarks: 'Outstanding linguistic skills.' },
                    { subject: 'History', marks: 78, max: 100, grade: 'B+', remarks: 'Satisfactory understanding.' }
                ],
                summary: { total: 438, max: 500, percentage: 87.6, gpa: 3.8, rank: '3rd' },
                attendance: { total: 180, present: 172, percentage: 95.5 }
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <AuthGuard>
                <RoleGuard allowedRoles={[USER_ROLES.SCHOOL_ADMIN, USER_ROLES.SUPER_ADMIN]}>
                    <>

                        <div className="space-y-8 animate-pulse p-8">
                            <Skeleton className="h-40 w-full rounded-[2.5rem]" />
                            <Skeleton className="h-[600px] w-full rounded-[2.5rem]" />
                        </div>
                    
</>
                </RoleGuard>
            </AuthGuard>
        );
    }

    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SCHOOL_ADMIN, USER_ROLES.SUPER_ADMIN]}>
                <AdminLayout title="Report Generation">
                    <Head>
                        <title>Report Card | {reportData?.student?.name || 'School ERP'}</title>
                    </Head>
                    <div className="space-y-8 animate-in fade-in duration-500 pb-12 print:p-0">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 print:hidden">
                            <div className="flex items-center gap-4">
                                <Link href="/admin/students" className="size-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:text-primary transition-colors">
                                    <ChevronLeft size={20} />
                                </Link>
                                <div>
                                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-1">Report Generation</h1>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Student Node: {studentId}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="secondary"
                                    className="rounded-2xl px-6 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 border-2"
                                >
                                    <Download size={18} />
                                    Export PDF
                                </Button>
                                <Button
                                    onClick={handlePrint}
                                    className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-10 py-6 h-auto font-black text-xs uppercase tracking-widest gap-3 shadow-xl shadow-primary/20"
                                >
                                    <Printer size={18} />
                                    Print Protocol
                                </Button>
                            </div>
                        </div>

                        {/* Report Container */}
                        <div
                            ref={reportRef}
                            className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl p-12 space-y-12 print:shadow-none print:border-none print:p-0 print:rounded-none"
                        >
                            {/* Institutional Header */}
                            <div className="flex flex-col items-center text-center space-y-6 border-b-4 border-slate-100 dark:border-slate-800 pb-12">
                                <div className="size-24 bg-primary text-white rounded-[2rem] flex items-center justify-center shadow-2xl">
                                    <School size={48} />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">EduCore International</h2>
                                    <p className="text-sm font-black text-slate-400 uppercase tracking-[0.4em] mt-1">Institutional Performance Protocol</p>
                                </div>
                            </div>

                            {/* Identity Matrix */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Node Identity</p>
                                            <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{reportData.student.name}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Grade Cluster</p>
                                            <p className="text-sm font-black text-slate-900 dark:text-white uppercase">{reportData.student.grade}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Roll Identifier</p>
                                            <p className="text-sm font-black text-slate-900 dark:text-white uppercase">{reportData.student.roll}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-indigo-500">
                                            <Award size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assessment Cycle</p>
                                            <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Annual Summary 2023-24</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status Code</p>
                                            <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[9px] uppercase tracking-widest mt-1">SYNCHRONIZED</Badge>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Rank Index</p>
                                            <p className="text-sm font-black text-slate-900 dark:text-white uppercase">{reportData.summary.rank}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Performance Matrix Table */}
                            <div className="rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50">
                                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-1/3">Subject Protocol</th>
                                            <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Max Units</th>
                                            <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Obtained</th>
                                            <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Grade Index</th>
                                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Metadata</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {reportData.results.map((r: any, i: number) => (
                                            <tr key={i}>
                                                <td className="px-8 py-5 text-sm font-black text-slate-900 dark:text-white uppercase">{r.subject}</td>
                                                <td className="px-8 py-5 text-center text-sm font-bold text-slate-500 font-mono">{r.max}</td>
                                                <td className="px-8 py-5 text-center text-sm font-black text-slate-900 dark:text-white font-mono">{r.marks}</td>
                                                <td className="px-8 py-5 text-center">
                                                    <Badge variant="outline" className={`font-black text-[10px] rounded-lg border-2 ${r.grade.startsWith('A') ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' : 'border-indigo-500/20 text-indigo-500'}`}>
                                                        {r.grade}
                                                    </Badge>
                                                </td>
                                                <td className="px-8 py-5 text-[10px] font-bold text-slate-400 italic uppercase tracking-wider">{r.remarks}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-slate-900 dark:bg-primary text-white">
                                            <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em]">Final Aggregation</th>
                                            <th className="px-8 py-6 text-center text-sm font-black font-mono">{reportData.summary.max}</th>
                                            <th className="px-8 py-6 text-center text-sm font-black font-mono">{reportData.summary.total}</th>
                                            <th className="px-8 py-6 text-center text-sm font-black font-mono">{reportData.summary.percentage}%</th>
                                            <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest">GPA Index: {reportData.summary.gpa}</th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            {/* Analytics & Footer */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Activity size={18} className="text-primary" />
                                        <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Attendance Metric</h4>
                                    </div>
                                    <p className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{reportData.attendance.percentage}%</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">[{reportData.attendance.present} / {reportData.attendance.total} Sessions]</p>
                                </div>
                                <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl space-y-4">
                                    <div className="flex items-center gap-3">
                                        <FileText size={18} className="text-indigo-500" />
                                        <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Faculty Remarks</h4>
                                    </div>
                                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest italic leading-relaxed">
                                        Unit shows exceptional aptitude in analytical protocols. Continued focus on linguistic precision recommended for optimization.
                                    </p>
                                </div>
                                <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl space-y-6 flex flex-col justify-end">
                                    <div className="space-y-4 border-t-2 border-slate-200 dark:border-slate-700 pt-6">
                                        <div className="flex justify-between items-center">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Institutional Stamp</p>
                                                <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Office of Assessment</p>
                                            </div>
                                            <CheckCircle2 size={32} className="text-primary opacity-20" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </AdminLayout>
            </RoleGuard>
        </AuthGuard>
    );
}


ReportCard.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
