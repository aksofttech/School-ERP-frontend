import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import {
  BarChart3,
  ChevronLeft,
  TrendingUp,
  Users,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Download,
  PieChart as PieChartIcon
} from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { examsService } from '@/services/exams.service';
import { Exam } from '@/utils/types';
import Skeleton from '@/components/ui/Skeleton';
import StatCard from '@/components/ui/StatCard';
import AdminLayout from '@/components/layouts/AdminLayout';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import { USER_ROLES } from '@/utils/role-config';
import Head from 'next/head';

export default function ExamResults() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      initData();
    }
  }, [id]);

  const initData = async () => {
    setLoading(true);
    try {
      const resultsData = await examsService.getExamResults(id as string);
      setData(resultsData);
    } catch (error: any) {
      toast.error('Failed to load performance analytics');
      router.push('/admin/exams');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <RoleGuard allowedRoles={[USER_ROLES.SCHOOL_ADMIN, USER_ROLES.SUPER_ADMIN]}>
          <>

            <div className="space-y-8 animate-in fade-in duration-500 p-8">
              <Skeleton className="h-20 w-full rounded-[2rem]" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-[2rem]" />)}
              </div>
              <Skeleton className="h-96 w-full rounded-[2.5rem]" />
            </div>
          
</>
        </RoleGuard>
      </AuthGuard>
    );
  }

  if (!data) return null;

  const { exam, statistics, results } = data;
  const passCount = results.filter((r: any) => parseFloat(r.percentage) >= 33).length; // Default 33% but should use passingMarks
  const failCount = results.length - passCount;

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={[USER_ROLES.SCHOOL_ADMIN, USER_ROLES.SUPER_ADMIN]}>
        <AdminLayout title="Performance Analytics">
          <Head>
            <title>Exam Results | {exam?.name || 'School ERP'}</title>
          </Head>
          <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Link href="/admin/exams" className="size-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-primary transition-all shadow-sm">
                  <ChevronLeft size={24} />
                </Link>
                <div>
                  <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">Performance Intelligence</h1>
                  <p className="text-sm font-medium text-slate-500 italic">Advanced analytics for {exam.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="rounded-2xl px-6 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2">
                  <Download size={18} />
                  Export Results
                </Button>
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-8 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20">
                  <BarChart3 size={18} />
                  Spectrum Analysis
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Average Core"
                value={`${statistics.averageMarks}%`}
                icon={<TrendingUp size={24} />}
                color="indigo"
                trendType="neutral"
              />
              <StatCard
                title="Cohort Velocity"
                value={statistics.totalStudents}
                icon={<Users size={24} />}
                color="blue"
                trendType="neutral"
              />
              <StatCard
                title="Certified Nodes"
                value={passCount}
                icon={<CheckCircle2 size={24} />}
                color="emerald"
                trend={`${((passCount / results.length) * 100).toFixed(1)}%`}
                trendType="up"
              />
              <StatCard
                title="Protocol Deviations"
                value={failCount}
                icon={<XCircle size={24} />}
                color="purple"
                trend={`${((failCount / results.length) * 100).toFixed(1)}%`}
                trendType="down"
              />
            </div>

            {/* Main Analysis Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Result List */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <BarChart3 size={20} />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Student Performance Matrix</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800">
                        <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Student</th>
                        <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Score</th>
                        <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Percentage</th>
                        <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Rank</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                      {results.map((result: any) => (
                        <tr key={result.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                <GraduationCap size={18} />
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">{result.student.user.firstName} {result.student.user.lastName}</p>
                                <p className="text-[10px] font-medium text-slate-500 italic uppercase">Roll: {result.student.rollNumber || 'N/A'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{result.marks}</span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 w-24 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${parseFloat(result.percentage) >= 60 ? 'bg-emerald-500' : parseFloat(result.percentage) >= 33 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                  style={{ width: `${result.percentage}%` }}
                                />
                              </div>
                              <span className={`text-[10px] font-black uppercase tracking-widest ${parseFloat(result.percentage) >= 33 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {result.percentage}%
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <span className="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 uppercase tracking-tighter">
                              {result.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Grade Distribution */}
              <div className="space-y-8">
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-2xl">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <PieChartIcon size={20} />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Grade Distribution</h2>
                  </div>
                  <div className="space-y-6">
                    {Object.entries(statistics.gradeDistribution).map(([grade, count]: [string, any]) => (
                      <div key={grade}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Grade {grade}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{count} Students</span>
                        </div>
                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden p-1">
                          <div
                            className="h-full bg-primary rounded-md transition-all duration-1000"
                            style={{ width: `${(count / results.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats Summary */}
                <div className="bg-slate-900 dark:bg-white rounded-[2.5rem] p-8 text-white dark:text-slate-900 shadow-2xl relative overflow-hidden group">
                  <h3 className="text-xl font-black uppercase tracking-tight italic mb-6">Execution Summary</h3>
                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Peak Performance</span>
                      <span className="text-lg font-black italic">{statistics.highestMarks}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Base Performance</span>
                      <span className="text-lg font-black italic">{statistics.lowestMarks}%</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-10 -right-10 size-40 bg-primary opacity-20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                </div>
              </div>
            </div>
          </div>
        </AdminLayout>
      </RoleGuard>
    </AuthGuard>
  );
}


ExamResults.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
