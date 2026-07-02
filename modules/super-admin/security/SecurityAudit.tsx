import {
    ShieldAlert,
    Search,
    Lock,
    Eye,
    FileText
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function SecurityAudit() {
    const logs = [
        { id: 1, action: 'LOGIN_ATTEMPT_FAILED', user: 'unknown@ip-192.168.1.1', time: 'Just now', severity: 'HIGH' },
        { id: 2, action: 'ROLE_UPDATE', user: 'admin@system', time: '2 mins ago', severity: 'MEDIUM' },
        { id: 3, action: 'TENANT_CREATED', user: 'admin@system', time: '1 hour ago', severity: 'LOW' },
        { id: 4, action: 'API_KEY_ROTATION', user: 'system_job', time: '3 hours ago', severity: 'LOW' },
        { id: 5, action: 'SUSPICIOUS_TRAFFIC', user: 'firewall_bot', time: '5 hours ago', severity: 'CRITICAL' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-2 mb-2 text-indigo-500 border-indigo-200 bg-indigo-50">
                        SEC_OPS: AUDIT
                    </Badge>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        Security Audit
                    </h1>
                    <p className="text-sm font-medium text-slate-500 italic">
                        Sensitive action logging and threat detection.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" className="border-2 rounded-xl font-bold text-xs uppercase tracking-wide gap-2 text-rose-500 border-rose-200 bg-rose-50">
                        <ShieldAlert size={16} />
                        Export Threat Report
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Event Type</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Principal</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Time</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Severity</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Raw Data</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-8 py-4">
                                    <div className="flex items-center gap-2">
                                        <Lock size={14} className="text-slate-400" />
                                        <span className="font-bold text-sm text-slate-900 dark:text-white">{log.action}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-4">
                                    <span className="font-mono text-xs text-slate-600 dark:text-slate-400">{log.user}</span>
                                </td>
                                <td className="px-8 py-4">
                                    <span className="text-xs font-medium text-slate-500">{log.time}</span>
                                </td>
                                <td className="px-8 py-4">
                                    <Badge className={`
                           ${log.severity === 'CRITICAL' ? 'bg-rose-600 text-white' :
                                            log.severity === 'HIGH' ? 'bg-rose-100 text-rose-600' :
                                                log.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-600' :
                                                    'bg-slate-100 text-slate-600'} 
                           border-none font-bold text-[9px]
                        `}>
                                        {log.severity}
                                    </Badge>
                                </td>
                                <td className="px-8 py-4 text-right">
                                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-indigo-500">
                                        <FileText size={16} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
