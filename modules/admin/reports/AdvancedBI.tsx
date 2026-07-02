import { useState } from 'react';
import {
    BarChart3,
    PieChart,
    LineChart,
    TrendingUp,
    TrendingDown,
    Clock,
    Filter,
    Download,
    Calendar,
    ChevronRight,
    Zap,
    Activity,
    Layers,
    ArrowRight,
    ShieldCheck,
    FileText,
    Search,
    MoreVertical
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';

export default function AdvancedBI() {
    const [activeReport, setActiveReport] = useState<'attendance' | 'academic' | 'fees'>('attendance');

    const reportCategories = [
        { id: 'attendance', label: 'Attendance Reports', icon: <Activity size={18} />, color: 'text-emerald-500' },
        { id: 'academic', label: 'Academic Performance', icon: <TrendingUp size={18} />, color: 'text-primary' },
        { id: 'fees', label: 'Fees & Finance', icon: <Zap size={18} />, color: 'text-amber-500' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-2 mb-2 text-primary">
                        SYSTEM REPORTS
                    </Badge>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">School Reports & Analytics</h1>
                    <p className="text-sm font-medium text-slate-500 italic">View detailed reports and analytics for attendance, academics, and finance.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-8 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20"
                    >
                        <Download size={18} />
                        Download Report
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Category Sidebar */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-xl space-y-8">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Report Categories</h3>
                        <div className="space-y-3">
                            {reportCategories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveReport(cat.id as any)}
                                    className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all group ${activeReport === cat.id
                                        ? 'bg-primary text-white shadow-xl shadow-primary/20 translate-x-2'
                                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`size-10 rounded-2xl flex items-center justify-center ${activeReport === cat.id ? 'bg-white/20' : 'bg-slate-50 dark:bg-slate-800 group-hover:scale-110 transition-transform'
                                            }`}>
                                            {cat.icon}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span>
                                    </div>
                                    <ChevronRight size={16} className={activeReport === cat.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transition-opacity'} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-primary rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                        <div className="relative z-10 space-y-6">
                            <div className="size-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                <Zap size={24} className="text-white" />
                            </div>
                            <div>
                                <h4 className="text-lg font-black uppercase tracking-tight">Automatic Summary</h4>
                                <p className="text-white/60 text-[10px] font-medium leading-relaxed mt-2 italic">Analysis shows a 12% improvement in school performance this month.</p>
                            </div>
                            <Button variant="secondary" className="w-full bg-white/10 hover:bg-white/20 text-white border-none rounded-2xl py-4 text-[9px] font-black uppercase tracking-widest">Run Analysis</Button>
                        </div>
                        <div className="absolute top-0 right-0 size-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                    </div>
                </div>

                {/* Visualization Hub */}
                <div className="lg:col-span-9 space-y-10">
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 text-slate-100 dark:text-slate-800 -z-0">
                            <BarChart3 size={240} strokeWidth={1} />
                        </div>

                        <div className="relative z-10 space-y-12">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{activeReport} Analytics</h2>
                                    <p className="text-slate-500 text-sm font-medium italic">Showing data for the current academic session.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex p-1 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                        <button className="px-6 py-3 bg-white dark:bg-slate-900 text-primary rounded-xl shadow-sm text-[10px] font-black uppercase tracking-widest">Monthly</button>
                                        <button className="px-6 py-3 text-slate-400 hover:text-slate-600 transition-colors text-[10px] font-black uppercase tracking-widest">Quarterly</button>
                                    </div>
                                </div>
                            </div>

                            {/* Visualization Mock - Using high-fidelity CSS layout */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="h-80 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center p-10 space-y-6 group">
                                    <div className="flex items-end gap-3 h-40">
                                        {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                            <div key={i} className="w-6 bg-primary/20 rounded-t-xl relative group/bar hover:bg-primary transition-all cursor-pointer" style={{ height: `${h}%` }}>
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity text-[8px] font-black text-primary uppercase whitespace-nowrap">{h}%</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Growth Chart</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center justify-between mb-6">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Key Performance Indicators</h4>
                                            <Activity size={16} className="text-primary" />
                                        </div>
                                        <div className="space-y-6">
                                            {[
                                                { label: 'Overall Efficiency', value: '94%', color: 'bg-primary' },
                                                { label: 'Student Retention', value: '88%', color: 'bg-indigo-500' },
                                                { label: 'Academic Growth', value: '91%', color: 'bg-emerald-500' },
                                            ].map((kpi, i) => (
                                                <div key={i} className="space-y-2">
                                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                        <span>{kpi.label}</span>
                                                        <span className="text-slate-900 dark:text-white">{kpi.value}</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div className={`h-full ${kpi.color} rounded-full`} style={{ width: kpi.value }}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] p-6 flex flex-col gap-3">
                                            <div className="flex items-center gap-2 text-emerald-600">
                                                <TrendingUp size={16} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">+12.4%</span>
                                            </div>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Improvement</p>
                                        </div>
                                        <div className="bg-rose-500/5 border border-rose-500/20 rounded-[2rem] p-6 flex flex-col gap-3">
                                            <div className="flex items-center gap-2 text-rose-600">
                                                <TrendingDown size={16} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">-02.1%</span>
                                            </div>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Difference</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[8px] font-black uppercase tracking-widest">LIVE DATA</Badge>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
                                        <ShieldCheck size={14} className="text-emerald-500" />
                                        VERIFIED DATA
                                    </p>
                                </div>
                                <span className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all cursor-pointer">
                                    View Full Report
                                    <ArrowRight size={14} />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
