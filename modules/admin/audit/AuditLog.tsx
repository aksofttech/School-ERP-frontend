import { useState, useEffect } from 'react';
import {
    ShieldAlert,
    Search,
    Filter,
    MoreVertical,
    Activity,
    ShieldCheck,
    ChevronRight,
    Zap,
    Users,
    Clock,
    ArrowRight,
    AlertCircle,
    History,
    Terminal,
    Database
} from 'lucide-react';
import { auditService } from '@/services/audit.service';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';
import { toast } from 'react-hot-toast';

export default function AuditLog() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const data = await auditService.getActivityLogs();
            setLogs(data.data || data);
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch audit matrix');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-2 mb-2 text-primary">
                        SYSTEM_CORE: SECURITY_AUDIT
                    </Badge>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">System Compliance Matrix</h1>
                    <p className="text-sm font-medium text-slate-500 italic">Monitor institutional state changes, verify protocol execution, and track high-privilege access nodes.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        onClick={fetchLogs}
                        className="bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-slate-900/5 transition-all active:scale-95"
                    >
                        <History size={18} />
                        Re-Sync Logs
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div className="relative group max-w-md w-full">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Sync Log Identifier / User Node..."
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-100 dark:ring-slate-800 focus:ring-2 focus:ring-primary transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-1 bg-slate-50 dark:bg-slate-800 rounded-2xl flex">
                                <button className="px-6 py-3 bg-white dark:bg-slate-900 text-primary rounded-xl shadow-sm text-[10px] font-black uppercase tracking-widest">Protocol View</button>
                                <button className="px-6 py-3 text-slate-400 hover:text-slate-600 transition-colors text-[10px] font-black uppercase tracking-widest">Raw Matrix</button>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[2.5rem] border-2 border-slate-50 dark:border-slate-800 overflow-hidden shadow-xl">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b-2 border-slate-100 dark:border-slate-800">
                                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Temporal Node</th>
                                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Execution Agent</th>
                                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Protocol Action</th>
                                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Target Entity</th>
                                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verification</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {loading ? (
                                    Array.from({ length: 8 }).map((_, i) => (
                                        <tr key={i}>
                                            <td className="px-10 py-6"><Skeleton className="h-4 w-32" /></td>
                                            <td className="px-10 py-6"><Skeleton className="h-4 w-40" /></td>
                                            <td className="px-10 py-6"><Skeleton className="h-4 w-48" /></td>
                                            <td className="px-10 py-6"><Skeleton className="h-4 w-24" /></td>
                                            <td className="px-10 py-6"><Skeleton className="h-4 w-20" /></td>
                                        </tr>
                                    ))
                                ) : logs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center italic text-slate-400 text-xs font-black uppercase tracking-widest">No Compliance Nodes Detected in the Current Matrix</td>
                                    </tr>
                                ) : (
                                    logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-10 py-6 text-left">
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{new Date(log.createdAt).toLocaleDateString()}</p>
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{new Date(log.createdAt).toLocaleTimeString()}</p>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-left">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                                                        <Terminal size={14} />
                                                    </div>
                                                    <p className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight truncate max-w-[150px]">{log.userEmail || 'SYS_PROTOCOL'}</p>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-left">
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-[8px] font-black uppercase tracking-widest border-2 ${log.action === 'CREATE' ? 'text-emerald-500 border-emerald-500/20' :
                                                            log.action === 'DELETE' ? 'text-rose-500 border-rose-500/20' :
                                                                'text-blue-500 border-blue-500/20'
                                                            }`}
                                                    >
                                                        {log.action}
                                                    </Badge>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{log.entityType}</p>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-left">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic truncate max-w-[120px]">{log.entityId}</p>
                                            </td>
                                            <td className="px-10 py-6 text-left">
                                                <div className="flex items-center gap-2">
                                                    <ShieldCheck size={14} className="text-emerald-500" />
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">VERIFIED_NODE</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-10 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-8">
                        <div className="flex items-center gap-10">
                            <div className="flex items-center gap-3">
                                <Database size={20} className="text-slate-300" />
                                <div className="text-left">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Entries</p>
                                    <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">12,450 Nodes</p>
                                </div>
                            </div>
                            <div className="h-10 w-px bg-slate-100 dark:bg-slate-800"></div>
                            <div className="flex items-center gap-3">
                                <AlertCircle size={20} className="text-amber-500" />
                                <div className="text-left">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Anomalies</p>
                                    <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">00 Zero Node</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="secondary" className="rounded-xl border-2 px-6 py-4 h-auto font-black text-[10px] uppercase tracking-widest gap-2 text-slate-400">Download Matrix</Button>
                            <Button className="bg-primary hover:bg-primary/90 text-white rounded-[2rem] px-10 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20">Expand Protocol</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
