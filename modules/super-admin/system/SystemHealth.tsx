import {
    Activity,
    Server,
    Database,
    Cpu,
    HardDrive,
    AlertTriangle,
    RefreshCw,
    Terminal
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function SystemHealth() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-2 mb-2 text-indigo-500 border-indigo-200 bg-indigo-50">
                        DEVOPS: MONITORING
                    </Badge>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        System Health
                    </h1>
                    <p className="text-sm font-medium text-slate-500 italic">
                        Infrastructure status and performance logs.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" className="border-2 rounded-xl font-bold text-xs uppercase tracking-wide gap-2">
                        <RefreshCw size={14} /> Refresh
                    </Button>
                    <Button className="bg-indigo-600 text-white rounded-xl px-4 py-2 h-auto font-bold text-xs uppercase tracking-wide hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 gap-2">
                        <Terminal size={16} />
                        View Raw Logs
                    </Button>
                </div>
            </div>

            {/* Infrastructure Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'API Gateway', status: 'Operational', icon: <Server size={20} />, color: 'text-emerald-500' },
                    { label: 'Database Shards', status: 'Operational', icon: <Database size={20} />, color: 'text-emerald-500' },
                    { label: 'Redis Cache', status: 'Degraded', icon: <Cpu size={20} />, color: 'text-amber-500' },
                    { label: 'CDN Edge', status: 'Operational', icon: <HardDrive size={20} />, color: 'text-emerald-500' },
                ].map((node, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`size-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center ${node.color}`}>
                                {node.icon}
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-900 dark:text-white">{node.label}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{node.status}</p>
                            </div>
                        </div>
                        <div className={`size-2 rounded-full ${node.status === 'Operational' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                    </div>
                ))}
            </div>

            {/* Live Logs */}
            <div className="bg-slate-950 rounded-[2.5rem] p-8 font-mono text-xs overflow-hidden relative border border-slate-800">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-2">
                            <div className="size-3 rounded-full bg-rose-500" />
                            <div className="size-3 rounded-full bg-amber-500" />
                            <div className="size-3 rounded-full bg-emerald-500" />
                        </div>
                        <span className="text-slate-400 font-bold ml-2">/var/log/syslog</span>
                    </div>
                    <Badge className="bg-slate-800 text-slate-300 border-none font-bold">Tailing...</Badge>
                </div>

                <div className="space-y-2 h-96 overflow-y-auto pr-4 text-slate-300">
                    {[
                        '[23:45:12] INFO: API Gateway - Handled 14,203 req/sec',
                        '[23:45:13] INFO: Auth Service - Validated session 8x92...a2z',
                        '[23:45:14] INFO: DB Shard-01 - Query latency 12ms',
                        '[23:45:14] WARN: Redis Cache - High memory usage (85%)',
                        '[23:45:15] INFO: Worker-04 - Processed background job: REPORT_GEN',
                        '[23:45:16] INFO: API Gateway - Handled 15,102 req/sec',
                        '[23:45:17] ERROR: Tenant-42 - Payment webhook failed (Retry 1/3)',
                        '[23:45:18] INFO: Tenant-42 - Payment webhook success (Retry 2/3)',
                        '[23:45:18] INFO: Sync Service - Completed partial sync for School-ID-99',
                    ].map((log, i) => (
                        <div key={i} className="flex gap-4 hover:bg-slate-900 p-1 rounded">
                            <span className="text-slate-600 select-none">{i + 1402}</span>
                            <span className={log.includes('INFO') ? 'text-emerald-400' : log.includes('WARN') ? 'text-amber-400' : 'text-rose-400'}>
                                {log}
                            </span>
                        </div>
                    ))}
                    {/* Repeated logs for effect */}
                    {Array.from({ length: 15 }).map((_, i) => (
                        <div key={i + 10} className="flex gap-4 hover:bg-slate-900 p-1 rounded opacity-50">
                            <span className="text-slate-600 select-none">{i + 1412}</span>
                            <span className="text-slate-500">
                                [23:45:{(19 + i).toString().padStart(2, '0')}] DEBUG: Internal health check pass...
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
