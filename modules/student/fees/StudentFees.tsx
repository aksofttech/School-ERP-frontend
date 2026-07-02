import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Activity,
    Calendar,
    Clock,
    ChevronRight,
    Zap,
    BookOpen,
    ArrowRight,
    CreditCard,
    IndianRupee,
    Receipt,
    History,
    ShieldCheck,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { feesService } from '@/services/fees.service';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

export default function StudentFees() {
    const [fees, setFees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFees = async () => {
            try {
                // In a real scenario, fetch fees for the logged-in student
                const data = await feesService.getFees({});
                setFees(data.data || data);
            } catch (error: any) {
                toast.error('Failed to load fees.');
            } finally {
                setLoading(false);
            }
        };
        fetchFees();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-2 mb-2 text-primary">
                        Student Office: Fees
                    </Badge>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Fee Management</h1>
                    <p className="text-sm font-medium text-slate-500 italic">View your school fees, payment history, and receipts.</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-slate-50 dark:border-slate-800 shadow-xl">
                        <div className="size-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black">
                            <IndianRupee size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[7px] font-black uppercase tracking-widest text-slate-400">Total Due</span>
                            <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase">₹1,200.00</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Paid In Full', value: '₹4,500', icon: <CheckCircle2 className="text-emerald-500" />, sub: 'PAID' },
                    { label: 'Pending Dues', value: '₹1,200', icon: <AlertCircle className="text-rose-500" />, sub: 'UNPAID' },
                    { label: 'Next Invoice', value: '15 NOV', icon: <Calendar className="text-primary" />, sub: 'UPCOMING' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl relative group overflow-hidden">
                        <div className="relative z-10 flex items-center justify-between mb-6">
                            <div className="size-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                                {stat.icon}
                            </div>
                            <span className="text-[7px] font-black uppercase tracking-widest text-slate-300">{stat.sub}</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-100 dark:border-slate-800 pb-8">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Fee History</h2>
                        <div className="flex gap-4">
                            <Button 
                                onClick={() => toast('Loading full transaction history...', { icon: '📜' })}
                                variant="secondary" 
                                className="bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-slate-400 hover:text-primary transition-all gap-2 text-[10px] font-black uppercase tracking-widest">
                                <History size={16} />
                                Transaction History
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-24 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/50 animate-pulse" />
                            ))
                        ) : (
                            fees.length > 0 ? (
                                fees.map((fee) => (
                                    <div key={fee.id} className="group relative overflow-hidden bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 hover:border-primary/20 transition-all hover:shadow-2xl">
                                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center gap-6">
                                                <div className={`size-16 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm ${fee.status === 'PAID' ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-500' : 'bg-rose-50 dark:bg-rose-900/10 text-rose-500'}`}>
                                                    <Receipt />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">{fee.type || 'Tuition Fee'}</h3>
                                                        <Badge variant={(fee.status === 'PAID') ? 'outline' : 'destructive'} className={`text-[7px] font-black uppercase tracking-widest px-2 py-0.5 ${(fee.status === 'PAID') ? 'bg-emerald-500/10 text-emerald-600 border-none' : ''}`}>
                                                            {fee.status || 'PENDING'}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Due Date: {fee.dueDate || 'IMMEDIATE'}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8">
                                                <div className="text-right">
                                                    <span className="block text-2xl font-black text-slate-900 dark:text-white">₹{fee.amount}</span>
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Amount</span>
                                                </div>
                                                {fee.status !== 'PAID' && (
                                                    <Button 
                                                        onClick={() => {
                                                            toast.loading('Initializing secure gateway...');
                                                            setTimeout(() => {
                                                                toast.dismiss();
                                                                toast.success('Payment portal opened.');
                                                            }, 1500);
                                                        }}
                                                        className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl px-6 py-3 h-auto font-black text-[9px] uppercase tracking-widest border-none hover:opacity-90 transition-opacity whitespace-nowrap">
                                                        Process Payment
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center p-20 gap-4 opacity-30 italic">
                                    <Receipt size={48} />
                                    <p className="text-[10px] font-black uppercase tracking-widest">No fee records found.</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        SECURE PAYMENT
                    </p>
                </div>
            </div>
        </div>
    );
}
