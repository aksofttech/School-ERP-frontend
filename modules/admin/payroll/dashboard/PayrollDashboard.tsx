import { useState, useEffect } from 'react';
import {
    CreditCard,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Activity,
    IndianRupee,
    TrendingUp,
    ShieldCheck,
    ChevronRight,
    Zap,
    Users,
    Clock,
    ArrowRight,
    Briefcase,
    AlertCircle,
    FileCheck,
    Wallet
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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

const payrollSchema = z.object({
    staffId: z.string().min(1, 'Staff identity required'),
    amount: z.number().min(0, 'Financial node required'),
    month: z.string().min(1, 'Temporal node (month) required'),
    status: z.enum(['PAID', 'PENDING', 'HOLD']).default('PENDING'),
});

type PayrollFormValues = z.infer<typeof payrollSchema>;

export default function PayrollManagement() {
    const [payrolls, setPayrolls] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'matrix' | 'disburse'>('matrix');
    const [registering, setRegistering] = useState(false);

    // Mocking data for visualization until specific payroll service is finalized
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setPayrolls([
                { id: '1', staffName: 'Dr. Sarah Jenkins', amount: 5200, month: 'January 2024', status: 'PAID', node: 'FACULTY_A' },
                { id: '2', staffName: 'Prof. James Wilson', amount: 4800, month: 'January 2024', status: 'PAID', node: 'FACULTY_B' },
                { id: '3', staffName: 'Admin Mark Cooper', amount: 3200, month: 'January 2024', status: 'PENDING', node: 'ADMIN_BASE' },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const onDisburse = async (data: PayrollFormValues) => {
        setRegistering(true);
        // Simulation of financial protocol
        setTimeout(() => {
            toast.success('Financial Protocol: Salary node successfully disbursed.');
            setRegistering(false);
            setActiveTab('matrix');
        }, 1500);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Institutional Finance: Payroll</h1>
                    <p className="text-sm font-medium text-slate-500 italic">Manage faculty compensation, salary disbursal nodes, and financial transparency metrics.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setActiveTab('disburse')}
                        className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20"
                    >
                        <Plus size={18} />
                        Initialize Disbursal
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Monthly Payload', value: '₹124,500', icon: <Wallet className="text-primary" /> },
                    { label: 'Active Faculty', value: '142 Nodes', icon: <Users className="text-indigo-500" /> },
                    { label: 'Disbursal Ratio', value: '98.2%', icon: <ShieldCheck className="text-emerald-500" /> },
                    { label: 'Protocol Status', value: 'CERTIFIED', icon: <Zap className="text-amber-500" /> },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative group hover:border-primary/50 transition-all">
                        <div className="relative z-10 flex flex-col gap-6">
                            <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{stat.value}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-10">
                    {activeTab === 'disburse' ? (
                        <div className="space-y-10">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-8">
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Salary Disbursement Protocol</h2>
                                <button onClick={() => setActiveTab('matrix')} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Return to Matrix</button>
                            </div>
                            <form onSubmit={() => onDisburse({} as any)} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Faculty Identity Node (ID)</label>
                                        <input
                                            placeholder="STAFF-NODE-2024-X..."
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-5 px-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Temporal Node (Month/Year)</label>
                                        <select
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-5 px-8 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all appearance-none"
                                        >
                                            <option value="JAN_2024">Cycle: January 2024</option>
                                            <option value="FEB_2024">Cycle: February 2024</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Financial Payload (Salary Amount)</label>
                                        <input
                                            type="number"
                                            placeholder="5200.00"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-5 px-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2 flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={registering}
                                        className="bg-primary hover:bg-primary/90 text-white rounded-[2rem] px-12 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95"
                                    >
                                        {registering ? <Activity size={18} className="animate-spin" /> : <CreditCard size={18} />}
                                        Disburse Financial Token
                                    </Button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="relative group max-w-md w-full">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Sync Faculty Identifier..."
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-100 dark:ring-slate-800 focus:ring-2 focus:ring-primary transition-all"
                                    />
                                </div>
                                <Button variant="secondary" className="rounded-xl px-6 py-4 h-auto font-black text-[10px] uppercase tracking-widest gap-2 border-2 text-slate-400">
                                    <Filter size={14} />
                                    Status synchronization
                                </Button>
                            </div>

                            <div className="rounded-[2.5rem] border-2 border-slate-50 dark:border-slate-800 overflow-hidden shadow-xl">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b-2 border-slate-100 dark:border-slate-800">
                                            <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Faculty Node</th>
                                            <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Temporal Cycle</th>
                                            <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Financial Payload</th>
                                            <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status Code</th>
                                            <th className="px-10 py-6"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                        {loading ? (
                                            Array.from({ length: 5 }).map((_, i) => (
                                                <tr key={i}>
                                                    <td className="px-10 py-6"><Skeleton className="h-6 w-32" /></td>
                                                    <td className="px-10 py-6"><Skeleton className="h-6 w-40" /></td>
                                                    <td className="px-10 py-6"><Skeleton className="h-6 w-20" /></td>
                                                    <td className="px-10 py-6"><Skeleton className="h-6 w-24" /></td>
                                                    <td className="px-10 py-6"><Skeleton className="size-8 ml-auto" /></td>
                                                </tr>
                                            ))
                                        ) : (
                                            payrolls.map((pay) => (
                                                <tr key={pay.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                                    <td className="px-10 py-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-black text-[10px]">
                                                                {pay.staffName.substring(0, 2)}
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{pay.staffName}</p>
                                                                <Badge variant="outline" className="text-[7px] font-black uppercase tracking-widest border-none p-0 h-auto">NODE: {pay.node}</Badge>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{pay.month}</td>
                                                    <td className="px-10 py-6 text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">₹{pay.amount.toLocaleString()}</td>
                                                    <td className="px-10 py-6">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`size-2 rounded-full ${pay.status === 'PAID' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                                                            <span className={`text-[9px] font-black uppercase tracking-widest ${pay.status === 'PAID' ? 'text-emerald-500' : 'text-amber-500'}`}>{pay.status}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-6 text-right">
                                                        <button className="size-10 rounded-xl hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-shadow border border-transparent group-hover:border-slate-100 dark:group-hover:border-slate-800">
                                                            <MoreVertical size={20} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
