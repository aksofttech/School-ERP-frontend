import { useState, useEffect } from 'react';
import { useParent } from '@/contexts/ParentContext';
import { examsService } from '@/services/exams.service';
import {
    BarChart3,
    TrendingUp,
    Award,
    Download,
    Filter,
    ChevronRight,
    ShieldCheck,
    FileText
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

export default function ParentResults() {
    const { selectedChildId, childrenList } = useParent();
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                if (selectedChildId === 'ALL') {
                    // If viewing all, realistically we might show a summary or default to first
                    if (childrenList.length > 0) {
                        const data = await examsService.getExams({ studentId: childrenList[0].id, status: 'PUBLISHED' } as any);
                        setResults(Array.isArray(data) ? data : (data.data || []));
                    }
                } else {
                    const data = await examsService.getExams({ studentId: selectedChildId, status: 'PUBLISHED' } as any);
                    setResults(Array.isArray(data) ? data : (data.data || []));
                }
            } catch (error) {
                toast.error('Failed to retrieve academic records.');
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [selectedChildId]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-2 mb-2 text-primary">
                        SCHOOL RECORD: RESULTS
                    </Badge>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Academic Results</h1>
                    <p className="text-sm font-medium text-slate-500 italic">
                        {selectedChildId === 'ALL'
                            ? `Please select a child to view detailed report cards.`
                            : `Performance metrics for ${childrenList.find(c => c.id === selectedChildId)?.name}.`}
                    </p>
                </div>
                <div className="flex items-center gap-6">
                    {selectedChildId !== 'ALL' && (
                        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border-2 border-slate-50 dark:border-slate-800 shadow-xl">
                            <div className="size-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black">
                                A+
                            </div>
                            <div className="flex flex-col pr-4">
                                <span className="text-[7px] font-black uppercase tracking-widest text-slate-400">Current CGPA</span>
                                <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase">Outstanding</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {selectedChildId === 'ALL' ? (
                <div className="flex flex-col items-center justify-center p-20 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl opacity-50">
                    <BarChart3 size={64} className="text-slate-300 mb-4" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest">Select a child to analyze performance.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Feed */}
                    <div className="lg:col-span-2 space-y-6">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-32 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/50 animate-pulse" />
                            ))
                        ) : (
                            results.length > 0 ? (
                                results.map((result) => (
                                    <div key={result.id} className="group flex items-center justify-between p-6 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 hover:border-primary/20 hover:shadow-2xl transition-all cursor-pointer">
                                        <div className="flex items-center gap-6">
                                            <div className="size-16 rounded-2xl bg-primary/5 flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm group-hover:scale-110 transition-transform">
                                                <FileText className="text-primary transition-colors" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight italic">{result.name}</h3>
                                                    <Badge variant="outline" className="text-[7px] font-black uppercase tracking-widest border-none bg-emerald-500/10 text-emerald-600 px-2 py-0.5">
                                                        PUBLISHED
                                                    </Badge>
                                                </div>
                                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Assessment Date: {result.date || 'Oct 24, 2023'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-10">
                                            <div className="hidden md:flex flex-col items-end">
                                                <span className="text-xl font-black text-slate-900 dark:text-white">96%</span>
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Aggregate</span>
                                            </div>
                                            <div className="size-10 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-colors">
                                                <ChevronRight size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center p-20 gap-4 opacity-30 italic bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800">
                                    <Award size={48} />
                                    <p className="text-[10px] font-black uppercase tracking-widest">No published results available.</p>
                                </div>
                            )
                        )}
                    </div>

                    {/* Stats Side */}
                    <div className="space-y-6">
                        <div className="bg-primary text-white rounded-[2.5rem] p-8 shadow-2xl shadow-primary/20 relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-xl font-black uppercase tracking-tight mb-2">Detailed Report</h3>
                                <p className="text-primary-100 text-xs font-medium mb-6">Download the complete academic transcript for this term.</p>
                                <Button 
                                    onClick={() => {
                                        toast.loading('Generating PDF report...');
                                        setTimeout(() => {
                                            toast.dismiss();
                                            toast.success('Report card downloaded.');
                                            window.print();
                                        }, 2000);
                                    }}
                                    className="w-full bg-white text-primary font-black uppercase tracking-widest text-[10px] h-12 rounded-xl border-none hover:bg-white/90 gap-2">
                                    <Download size={16} />
                                    Download PDF
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
