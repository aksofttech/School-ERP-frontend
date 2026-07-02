import { useState } from 'react';
import {
    Receipt,
    Search,
    Filter,
    Download,
    MoreVertical,
    ChevronRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    CreditCard,
    IndianRupee
} from 'lucide-react';
import { useFees } from '@/hooks/useFees';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';

export default function FeePayments() {
    const [searchTerm, setSearchTerm] = useState('');
    const { fees, loading, pagination, setParams, params } = useFees({
        page: 1,
        limit: 10,
        search: searchTerm
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setParams({ ...params, search: searchTerm, page: 1 });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Financial Ledger</h1>
                    <p className="text-sm font-medium text-slate-500 italic">Monitor transactions, oversee dues, and verify fiscal synchronizations.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" className="rounded-2xl px-6 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 border-2">
                        <Download size={18} />
                        Export Report
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50 dark:bg-slate-900/50">
                    <form onSubmit={handleSearch} className="relative group max-w-md w-full">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Query Student UID or Invoice No..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary transition-all shadow-sm"
                        />
                    </form>

                    <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        {['ALL', 'PENDING', 'PAID', 'OVERDUE', 'PARTIAL'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setParams({ ...params, status: status === 'ALL' ? undefined : status, page: 1 })}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${(params as any).status === status || (!params.status && status === 'ALL')
                                        ? 'bg-slate-900 text-white dark:bg-primary shadow-lg'
                                        : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 hover:border-primary'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Financial Entity / ID</th>
                                <th className="px-8 py-6 text-left text-[100px] font-black text-slate-400 uppercase tracking-[0.2em]">Target Node</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Fiscal Value</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Synchronization</th>
                                <th className="px-8 py-6 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-8 py-6"><Skeleton className="h-10 w-48 rounded-xl" /></td>
                                        <td className="px-8 py-6"><Skeleton className="h-6 w-32 rounded-lg" /></td>
                                        <td className="px-8 py-6"><Skeleton className="h-6 w-20 rounded-lg" /></td>
                                        <td className="px-8 py-6"><Skeleton className="h-6 w-24 rounded-lg" /></td>
                                        <td className="px-8 py-6"><Skeleton className="size-8 ml-auto rounded-lg" /></td>
                                    </tr>
                                ))
                            ) : fees.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="size-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                                                <Receipt size={32} />
                                            </div>
                                            <div>
                                                <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">No Records Found</p>
                                                <p className="text-sm font-medium text-slate-500 italic">Adjust your filters or query student-specific ledger.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                fees.map((fee) => (
                                    <tr key={fee.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                    <CreditCard size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">{fee.feeType}</p>
                                                    <p className="text-[10px] font-medium text-slate-500 italic font-mono uppercase">INV-{fee.id.substring(0, 8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-black text-[10px]">
                                                    ID
                                                </div>
                                                <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{fee.studentId}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-black text-slate-900 dark:text-white uppercase tabular-nums">₹{fee.amount.toLocaleString()}</p>
                                            <p className="text-[10px] font-medium text-slate-400 italic">Balance: ₹0.00</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <Badge variant="outline" className={`rounded-lg px-3 py-1 font-black text-[9px] uppercase tracking-widest border-2 ${fee.status === 'PAID' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' :
                                                    fee.status === 'PENDING' ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' :
                                                        'border-rose-500/20 text-rose-500 bg-rose-500/5'
                                                }`}>
                                                {fee.status}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="secondary" size="sm" className="size-10 rounded-xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all">
                                                        <MoreVertical size={18} className="text-slate-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl">
                                                    <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer">
                                                        <IndianRupee size={16} className="text-emerald-500" />
                                                        <span className="text-xs font-black uppercase tracking-widest">Record Payment</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer">
                                                        <Download size={16} className="text-primary" />
                                                        <span className="text-xs font-black uppercase tracking-widest">Export Invoice</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
