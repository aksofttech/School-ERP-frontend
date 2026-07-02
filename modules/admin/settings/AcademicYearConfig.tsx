import { useState } from 'react';
import {
    Calendar,
    Plus,
    CheckCircle2,
    Clock,
    ArrowRight,
    AlertCircle,
    Activity,
    History,
    Power
} from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

export default function AcademicYearConfig() {
    const { academicYears, loading, activateYear } = useSettings();
    const [activating, setActivating] = useState<string | null>(null);

    const handleActivate = async (id: string) => {
        setActivating(id);
        try {
            await activateYear(id);
        } finally {
            setActivating(null);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Academic Cycles</h1>
                    <p className="text-sm font-medium text-slate-500 italic">Configure temporal ranges and session synchronization.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20">
                        <Plus size={18} />
                        Initialize Cycle
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-64 w-full rounded-[2.5rem]" />
                    ))
                ) : (
                    academicYears.map((year) => (
                        <div key={year.id} className={`bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border-2 transition-all group relative overflow-hidden ${year.isActive ? 'border-primary shadow-2xl shadow-primary/10' : 'border-slate-100 dark:border-slate-800'}`}>
                            {year.isActive && (
                                <div className="absolute top-0 right-0 p-8">
                                    <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[9px] uppercase tracking-widest flex items-center gap-2">
                                        <Activity size={10} className="animate-pulse" />
                                        ACTIVE_SYNC
                                    </Badge>
                                </div>
                            )}

                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className={`size-14 rounded-2xl flex items-center justify-center ${year.isActive ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                                        <Calendar size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{year.name}</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Temporal Matrix</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                                        <div className="flex items-center gap-3">
                                            <Clock size={16} className="text-primary" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initialization</span>
                                        </div>
                                        <span className="text-xs font-black text-slate-900 dark:text-white uppercase">{new Date(year.startDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                                        <div className="flex items-center gap-3">
                                            <History size={16} className="text-indigo-500" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Termination</span>
                                        </div>
                                        <span className="text-xs font-black text-slate-900 dark:text-white uppercase">{new Date(year.endDate).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {!year.isActive ? (
                                    <Button
                                        onClick={() => handleActivate(year.id)}
                                        disabled={activating === year.id}
                                        variant="secondary"
                                        className="w-full justify-center py-5 rounded-2xl font-black text-xs uppercase tracking-widest border-2 hover:bg-slate-900 hover:text-white hover:border-slate-900 dark:hover:bg-primary transition-all group/btn"
                                    >
                                        {activating === year.id ? <Activity size={16} className="animate-spin" /> : <Power size={16} className="group-hover/btn:rotate-12 transition-transform mr-2" />}
                                        Engage Cycle
                                    </Button>
                                ) : (
                                    <div className="flex items-center justify-center py-5 gap-3 text-emerald-500 font-black text-xs uppercase tracking-widest">
                                        <CheckCircle2 size={18} />
                                        Synchronized
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}

                <button className="bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] p-10 border-4 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-all group">
                    <div className="size-16 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:scale-110 transition-all shadow-sm">
                        <Plus size={32} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-primary">Deploy New Session</span>
                </button>
            </div>

            <div className="p-8 bg-amber-500/5 border border-amber-500/20 rounded-[2rem] flex items-start gap-6">
                <div className="size-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                    <AlertCircle size={24} />
                </div>
                <div className="space-y-1">
                    <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest">Operational Warning</h4>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                        Engagement of a new academic cycle will re-synchronize all student clusters and course mappings. Ensure all current financial and academic protocols are terminated correctly before activation.
                    </p>
                </div>
            </div>
        </div>
    );
}
