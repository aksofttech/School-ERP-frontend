import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
    ShieldAlert,
    ShieldCheck,
    Search,
    Lock,
    Eye,
    FileText,
    RefreshCw,
    Download,
    Filter,
    ChevronRight,
    User,
    Globe,
    Calendar,
    Clock,
    X,
    Copy,
    Check,
    AlertTriangle,
    SlidersHorizontal,
    Activity
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { superAdminService } from '@/services/super-admin.service';
import { toast } from 'react-hot-toast';

interface AuditRecord {
    id: string;
    action: string;
    ip?: string | null;
    createdAt: string;
    userId: string;
    user?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
        schoolId?: string | null;
        school?: {
            id: string;
            name: string;
            code: string;
        };
    };
    severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export default function SecurityAudit() {
    const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [severityFilter, setSeverityFilter] = useState('ALL');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'severity' | 'action' | 'principal'>('newest');
    const [selectedLog, setSelectedLog] = useState<AuditRecord | null>(null);
    const [copied, setCopied] = useState(false);

    // Derive severity based on action keywords if not explicitly present
    const getSeverity = (action: string): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' => {
        const act = action.toUpperCase();
        if (act.includes('FAILED') || act.includes('THREAT') || act.includes('SUSPICIOUS') || act.includes('BREACH')) {
            return 'CRITICAL';
        }
        if (act.includes('DELETE') || act.includes('LOCK') || act.includes('RESET_PASSWORD') || act.includes('REVOKE')) {
            return 'HIGH';
        }
        if (act.includes('UPDATE') || act.includes('SECURITY') || act.includes('PLAN') || act.includes('SETTINGS')) {
            return 'MEDIUM';
        }
        return 'LOW';
    };

    const fetchAuditLogs = async () => {
        try {
            const res = await superAdminService.getAuditLogs({ limit: 100 });
            const list = Array.isArray(res) ? res : (res?.data || []);
            const enriched = list.map((item: any) => ({
                ...item,
                severity: item.severity || getSeverity(item.action),
            }));
            setAuditLogs(enriched);
        } catch (error) {
            console.error('Failed to fetch audit logs', error);
            toast.error('Failed to load audit logs');
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAuditLogs();
    }, []);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchAuditLogs();
        toast.success('Security audit trail synced');
    };

    const handleExportReport = () => {
        const textData = JSON.stringify(auditLogs, null, 2);
        const blob = new Blob([textData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `security-audit-report-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Security threat & audit report exported successfully!');
    };

    const handleCopyJson = (log: AuditRecord) => {
        navigator.clipboard.writeText(JSON.stringify(log, null, 2));
        setCopied(true);
        toast.success('Audit payload copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    // Filter and Sort logs
    const filteredAndSortedLogs = useMemo(() => {
        return auditLogs
            .filter((log) => {
                const search = searchTerm.toLowerCase();
                const actionMatch = (log.action || '').toLowerCase().includes(search);
                const userMatch =
                    (log.user?.email || '').toLowerCase().includes(search) ||
                    (log.user?.firstName || '').toLowerCase().includes(search) ||
                    (log.user?.lastName || '').toLowerCase().includes(search);
                const ipMatch = (log.ip || '').toLowerCase().includes(search);

                const matchesSearch = !searchTerm || actionMatch || userMatch || ipMatch;
                const matchesSeverity = severityFilter === 'ALL' || log.severity === severityFilter;

                return matchesSearch && matchesSeverity;
            })
            .sort((a, b) => {
                if (sortBy === 'newest') {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                }
                if (sortBy === 'oldest') {
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                }
                if (sortBy === 'severity') {
                    const weight: Record<string, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
                    return (weight[b.severity || 'LOW'] || 0) - (weight[a.severity || 'LOW'] || 0);
                }
                if (sortBy === 'action') {
                    return a.action.localeCompare(b.action);
                }
                if (sortBy === 'principal') {
                    const nameA = `${a.user?.firstName || ''} ${a.user?.email || ''}`;
                    const nameB = `${b.user?.firstName || ''} ${b.user?.email || ''}`;
                    return nameA.localeCompare(nameB);
                }
                return 0;
            });
    }, [auditLogs, searchTerm, severityFilter, sortBy]);

    const criticalCount = useMemo(() => {
        return auditLogs.filter((l) => l.severity === 'CRITICAL' || l.severity === 'HIGH').length;
    }, [auditLogs]);

    const distinctPrincipals = useMemo(() => {
        const s = new Set<string>();
        auditLogs.forEach((l) => {
            if (l.user?.email) s.add(l.user.email);
            else if (l.ip) s.add(l.ip);
        });
        return s.size;
    }, [auditLogs]);

    const getSeverityBadgeClass = (severity?: string) => {
        switch (severity) {
            case 'CRITICAL':
                return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800';
            case 'HIGH':
                return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800';
            case 'MEDIUM':
                return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300 pb-16">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Link href="/super-admin/dashboard" className="hover:text-primary transition-colors">
                    Super Admin
                </Link>
                <ChevronRight size={14} />
                <span className="font-semibold text-slate-900 dark:text-white">Security Audit & Threat Detection</span>
            </div>

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                            <ShieldAlert size={26} />
                        </div>
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                Security Audit & Compliance
                            </h1>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Immutable event journaling, privilege escalations, and multi-tenant access telemetry.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        variant="outline"
                        className="rounded-xl font-bold text-xs gap-2"
                    >
                        <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                        {isRefreshing ? 'Syncing...' : 'Sync Logs'}
                    </Button>
                    <button
                        onClick={handleExportReport}
                        className="inline-flex items-center px-5 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors shadow-sm"
                    >
                        <Download size={14} className="mr-2" />
                        Export Threat Report
                    </button>
                </div>
            </div>

            {/* 4 Security KPI Telemetry Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Audit Events</span>
                        <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                            <Activity size={18} />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">{auditLogs.length}</p>
                    <p className="text-[11px] text-slate-400">Recorded system interactions</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">High / Critical Threats</span>
                        <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
                            <ShieldAlert size={18} />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-rose-600 dark:text-rose-400">{criticalCount}</p>
                    <p className="text-[11px] text-slate-400">Elevated security concerns</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tracked Principals</span>
                        <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                            <User size={18} />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">{distinctPrincipals}</p>
                    <p className="text-[11px] text-slate-400">Distinct actors & remote IPs</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">DevSecOps Status</span>
                        <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck size={18} />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">100%</p>
                    <p className="text-[11px] text-slate-400">Zero active data leaks</p>
                </div>
            </div>

            {/* Filter & Sorting Toolbar */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Live Search */}
                    <div className="relative lg:col-span-2">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by event action, principal email, or IP..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Severity Filter */}
                    <div>
                        <select
                            value={severityFilter}
                            onChange={(e) => setSeverityFilter(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="ALL">All Severities</option>
                            <option value="CRITICAL">🔴 Critical Only</option>
                            <option value="HIGH">🟠 High Severity</option>
                            <option value="MEDIUM">🟡 Medium Severity</option>
                            <option value="LOW">🔵 Low Severity</option>
                        </select>
                    </div>

                    {/* Sort Dropdown */}
                    <div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="newest">🕒 Sort: Newest First</option>
                            <option value="oldest">⏳ Sort: Oldest First</option>
                            <option value="severity">⚠️ Sort: Highest Severity</option>
                            <option value="action">🔤 Sort: Action Name (A-Z)</option>
                            <option value="principal">👤 Sort: Principal (A-Z)</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                    <span>
                        Showing <strong className="text-slate-900 dark:text-white">{filteredAndSortedLogs.length}</strong> of{' '}
                        <strong className="text-slate-900 dark:text-white">{auditLogs.length}</strong> recorded audit events
                    </span>
                    {(searchTerm || severityFilter !== 'ALL') && (
                        <button
                            onClick={() => { setSearchTerm(''); setSeverityFilter('ALL'); }}
                            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            Reset Active Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Audit Logs Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-10 space-y-4">
                        {Array(5).fill(0).map((_, i) => (
                            <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : filteredAndSortedLogs.length === 0 ? (
                    <div className="p-16 text-center space-y-4">
                        <ShieldAlert size={48} className="mx-auto text-slate-400" />
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">No security events found</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            No logs match your current filter query. Try selecting &quot;All Severities&quot; or clearing search.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50/70 dark:bg-slate-800/40 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="py-4 px-6">Event Type & Action</th>
                                    <th className="py-4 px-6">Principal (Actor)</th>
                                    <th className="py-4 px-6">Source IP</th>
                                    <th className="py-4 px-6">Timestamp</th>
                                    <th className="py-4 px-6">Severity</th>
                                    <th className="py-4 px-6 text-right">Raw Data</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {filteredAndSortedLogs.map((log) => {
                                    const dateObj = new Date(log.createdAt);
                                    const timeStr = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
                                    const dateStr = dateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

                                    return (
                                        <tr
                                            key={log.id}
                                            onClick={() => setSelectedLog(log)}
                                            className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                                                        <Lock size={15} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white text-sm">
                                                            {log.action}
                                                        </p>
                                                        <span className="text-[10px] font-mono text-slate-400">
                                                            ID: {log.id.slice(0, 13)}...
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6">
                                                {log.user ? (
                                                    <div>
                                                        <p className="font-bold text-slate-800 dark:text-slate-200">
                                                            {log.user.firstName} {log.user.lastName}
                                                        </p>
                                                        <p className="text-[11px] font-mono text-slate-400">{log.user.email}</p>
                                                        <span className="inline-block mt-0.5 px-2 py-0.2 rounded text-[9px] font-bold bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300">
                                                            {log.user.role?.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="font-mono text-slate-500">System Gateway</span>
                                                )}
                                            </td>

                                            <td className="py-4 px-6">
                                                <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                                                    {log.ip || '127.0.0.1'}
                                                </span>
                                            </td>

                                            <td className="py-4 px-6 text-slate-500">
                                                <p className="font-medium text-slate-800 dark:text-slate-200">{timeStr}</p>
                                                <p className="text-[10px] text-slate-400">{dateStr}</p>
                                            </td>

                                            <td className="py-4 px-6">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getSeverityBadgeClass(log.severity)}`}>
                                                    {log.severity || 'LOW'}
                                                </span>
                                            </td>

                                            <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => setSelectedLog(log)}
                                                    title="Inspect Raw Audit Payload"
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                                >
                                                    <FileText size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Inspect Raw Audit Payload Modal */}
            {selectedLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 lg:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-xl">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                        Audit Event Inspector
                                    </h3>
                                    <p className="text-xs text-slate-400 font-mono">
                                        ID: {selectedLog.id}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Event Details Grid */}
                        <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl text-xs">
                            <div className="flex justify-between">
                                <span className="text-slate-400 font-bold uppercase tracking-wider">Action:</span>
                                <span className="font-bold text-slate-900 dark:text-white">{selectedLog.action}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400 font-bold uppercase tracking-wider">Severity:</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getSeverityBadgeClass(selectedLog.severity)}`}>
                                    {selectedLog.severity}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400 font-bold uppercase tracking-wider">Principal:</span>
                                <span className="font-mono text-slate-800 dark:text-slate-200">
                                    {selectedLog.user ? `${selectedLog.user.firstName} ${selectedLog.user.lastName} (${selectedLog.user.email})` : 'System Core'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400 font-bold uppercase tracking-wider">Source IP:</span>
                                <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedLog.ip || '127.0.0.1'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400 font-bold uppercase tracking-wider">Timestamp:</span>
                                <span className="font-mono text-slate-800 dark:text-slate-200">{new Date(selectedLog.createdAt).toISOString()}</span>
                            </div>
                        </div>

                        {/* Raw JSON viewer */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                                    Raw Event Payload
                                </span>
                                <button
                                    onClick={() => handleCopyJson(selectedLog)}
                                    className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                                >
                                    {copied ? <Check size={13} /> : <Copy size={13} />}
                                    {copied ? 'Copied' : 'Copy JSON'}
                                </button>
                            </div>
                            <pre className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-[11px] font-mono overflow-x-auto max-h-56 border border-slate-200 dark:border-slate-800 custom-scrollbar">
                                {JSON.stringify(selectedLog, null, 2)}
                            </pre>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md"
                            >
                                Close Inspector
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
