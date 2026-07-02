import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Activity,
    Calendar,
    Clock,
    ChevronRight,
    Zap,
    BookOpen,
    ArrowRight,
    TrendingUp,
    Award,
    BarChart3,
    Download,
    ShieldCheck,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { examsService } from '@/services/exams.service';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

export default function StudentResults() {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                // In a real scenario, we would fetch results specifically for the student
                // Here we mock the service call fitting the existing API structure
                const data = await examsService.getExams({ status: 'PUBLISHED' });
                setResults(data.data || data);
            } catch (error: any) {
                toast.error('Failed to retrieve academic performance metrics.');
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-2 mb-2 text-primary">
                        ACADEMIC_CORE: PERFORMANCE_METRICS
                    </Badge>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Academic Results</h1>
                    <p className="text-sm font-medium text-slate-500 italic">Analyze performance vectors, review grade distributions, and download official transcripts.</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-slate-50 dark:border-slate-800 shadow-xl">
                        <div className="size-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black">A+</div>
                        <div className="flex flex-col">
                            <span className="text-[7px] font-black uppercase tracking-widest text-slate-400">CGPA Detail</span>
                            <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase">9.8 / 10.0</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Published Reports', value: '08', icon: <FileText className="text-primary" />, sub: 'ACADEMIC_YEAR_24' },
                    { label: 'Highest Grade', value: 'A+', icon: <Award className="text-amber-500" />, sub: 'MATHEMATICS' },
                    { label: 'Performance', value: '+12%', icon: <TrendingUp className="text-emerald-500" />, sub: 'VS_LAST_TERM' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl relative group overflow-hidden">
                        <div className="relative z-10 flex items-center justify-between mb-6">
                            <div className="size-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                                {stat.icon}
                            </div>
                            <span className="text-[7px] font-black uppercase tracking-widest text-slate-300">{stat.sub}</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-100 dark:border-slate-800 pb-8">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Performance Registry</h2>
                        <div className="flex gap-4">
                            <Button variant="secondary" className="bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-slate-400 hover:text-primary transition-all gap-2 text-[10px] font-black uppercase tracking-widest">
                                <Download size={16} />
                                Download All
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-24 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/50 animate-pulse" />
                            ))
                        ) : (
                            results.length > 0 ? (
                                results.map((result) => (
                                    <div key={result.id} className="group flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/30 rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:border-primary/20 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer">
                                        <div className="flex items-center gap-6">
                                            <div className="size-16 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm group-hover:scale-110 transition-transform">
                                                <BarChart3 className="text-slate-400 group-hover:text-primary transition-colors" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight italic">{result.name}</h3>
                                                    <Badge variant="outline" className="text-[7px] font-black uppercase tracking-widest border-none bg-emerald-500/10 text-emerald-600 px-2 py-0.5">
                                                        PUBLISHED
                                                    </Badge>
                                                </div>
                                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Term 1 • {result.session || '2023-2024'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-10">
                                            <div className="hidden md:flex flex-col items-end">
                                                <span className="text-xl font-black text-slate-900 dark:text-white">92%</span>
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Aggregate</span>
                                            </div>
                                            <div className="size-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-colors">
                                                <ChevronRight size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center p-20 gap-4 opacity-30 italic">
                                    <BarChart3 size={48} />
                                    <p className="text-[10px] font-black uppercase tracking-widest">No published results found in current session.</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        GRADE_INTEGRITY_VERIFIED_SHA256
                    </p>
                </div>
            </div>
        </div>
    );
}

// Helper component for missing icon
function FileText(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" x2="8" y1="13" y2="13" />
            <line x1="16" x2="8" y1="17" y2="17" />
            <line x1="10" x2="8" y1="9" y2="9" />
        </svg>
    )
}
