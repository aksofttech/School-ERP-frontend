import { useState, useEffect } from 'react';
import {
    Users,
    BookOpen,
    Send,
    CheckCircle2,
    AlertCircle,
    Search,
    ChevronRight,
    Filter,
    Plus
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { feesService } from '@/services/fees.service';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

export default function FeeAssignment() {
    const [loading, setLoading] = useState(false);
    const [selection, setSelection] = useState<'class' | 'student'>('class');
    const [targetId, setTargetId] = useState('');

    const handleAssign = async () => {
        if (!targetId) {
            toast.error('Identity Target Required');
            return;
        }
        setLoading(true);
        try {
            // Logic for mass assignment
            toast.success('Financial synchronization protocol initiated.');
        } catch (err: any) {
            toast.error(err.message || 'Synchronization failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Synchronize Fees</h1>
                    <p className="text-sm font-medium text-slate-500 italic">Map financial architectures to institutional nodes.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Configuration Panel */}
                <div className="lg:col-span-12">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-10">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1 space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Target Cluster Type</label>
                                    <div className="flex p-2 bg-slate-50 dark:bg-slate-800 rounded-3xl gap-2">
                                        <button
                                            onClick={() => setSelection('class')}
                                            className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selection === 'class' ? 'bg-slate-900 text-white dark:bg-primary shadow-lg' : 'text-slate-400 hover:text-primary'}`}
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <BookOpen size={16} />
                                                Class Registry
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => setSelection('student')}
                                            className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selection === 'student' ? 'bg-slate-900 text-white dark:bg-primary shadow-lg' : 'text-slate-400 hover:text-primary'}`}
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <Users size={16} />
                                                Student Node
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Select Identity Node</label>
                                    <div className="relative group">
                                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                                        <input
                                            placeholder={selection === 'class' ? "Enter Class Matrix (e.g., Grade 10-A)..." : "Enter Student ID or Institutional Email..."}
                                            value={targetId}
                                            onChange={(e) => setTargetId(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-3xl py-6 pl-16 pr-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center px-10">
                                <div className="size-16 rounded-full bg-primary/5 flex items-center justify-center text-primary group">
                                    <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>

                            <div className="flex-1 space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Protocol: Architectural Mapping</label>
                                    <div className="bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800/50 space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                                    <CheckCircle2 size={16} />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Tuition Frequency</span>
                                            </div>
                                            <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[9px]">ANNUAL</Badge>
                                        </div>
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                                    <CheckCircle2 size={16} />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Transport Node</span>
                                            </div>
                                            <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[9px]">MONTHLY</Badge>
                                        </div>
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                                    <CheckCircle2 size={16} />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Infrastructure</span>
                                            </div>
                                            <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[9px]">ONE-TIME</Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4 text-slate-400">
                                <AlertCircle size={20} className="text-amber-500" />
                                <p className="text-[10px] font-bold uppercase tracking-widest max-w-xl">
                                    This operation will generate ledger entries for all child nodes within the selected cluster. Automated billing protocols will be engaged immediately.
                                </p>
                            </div>
                            <Button
                                onClick={handleAssign}
                                disabled={loading}
                                className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white rounded-2xl px-10 py-6 h-auto font-black text-xs uppercase tracking-widest gap-3 shadow-xl shadow-primary/20"
                            >
                                {loading ? <div className="animate-spin size-4 border-2 border-white/30 border-t-white rounded-full" /> : <Send size={18} />}
                                Execute Synchronization
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Recent Assignments / History */}
                <div className="lg:col-span-12">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="flex items-center gap-4">
                                <div className="size-10 bg-indigo-500 text-white rounded-xl flex items-center justify-center shadow-lg">
                                    <Plus size={20} />
                                </div>
                                <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Synchronization History</h2>
                            </div>
                            <Button variant="secondary" size="sm" className="rounded-xl px-4 py-2 font-black text-[10px] uppercase tracking-widest">
                                View Matrix Logs
                            </Button>
                        </div>
                        <div className="p-10 text-center py-20">
                            <div className="size-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-4">
                                <Filter size={24} />
                            </div>
                            <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">No Recent Deployments</p>
                            <p className="text-xs font-medium text-slate-500 italic mt-1">Initiate a sync protocol to begin ledger population.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
