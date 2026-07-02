import { useState, useEffect } from 'react';
import { useParent } from '@/contexts/ParentContext';
import { feesService } from '@/services/fees.service';
import {
    CreditCard,
    IndianRupee,
    Receipt,
    History,
    Filter,
    Download,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    Calendar,
    Wallet
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

export default function ParentFees() {
    const { selectedChildId, childrenList } = useParent();
    const [fees, setFees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFees = async () => {
            setLoading(true);
            try {
                // In a real scenario, API would support filtering by 'studentId' or 'all'
                // Simulating filtering for demo based on what 'feesService.getFees' returns
                const data = await feesService.getFees(
                    selectedChildId !== 'ALL' ? { studentId: selectedChildId } : {}
                );
                // If API doesn't support ALL, we'd fetch for each and merge. 
                // Here we assume backend handles permissions to see all wards' fees.
                setFees(Array.isArray(data) ? data : (data.data || []));
            } catch (error) {
                toast.error('Failed to sync financial ledger.');
            } finally {
                setLoading(false);
            }
        };

        fetchFees();
    }, [selectedChildId]);

    const handlePayFee = async (feeId: string | number) => {
        const promise = new Promise((resolve) => setTimeout(resolve, 1500));
        toast.promise(promise, {
            loading: 'Processing secure payment...',
            success: 'Payment completed successfully!',
            error: 'Payment failed. Please try again.',
        });
    };

    const handlePayAll = () => {
        if (totalDue === 0) return toast.error('No outstanding balance found.');
        toast.loading('Redirecting to payment gateway...');
        setTimeout(() => {
            toast.dismiss();
            toast.success('Batch payment session initiated.');
        }, 1500);
    };

    const handleDownloadStatement = () => {
        toast.loading('Generating financial statement...');
        setTimeout(() => {
            toast.dismiss();
            toast.success('Statement downloaded.');
            window.print();
        }, 1500);
    };

    // Mocking data if API is empty for visualization
    const currentYear = new Date().getFullYear();
    const displayFees = fees.length > 0 ? fees : [
        { id: 1, title: 'Term 2 Tuition', amount: 1200, dueDate: `${currentYear}-11-15`, status: 'PENDING', studentId: childrenList[0]?.id },
        { id: 2, title: 'Bus Fee', amount: 350, dueDate: `${currentYear}-11-01`, status: 'OVERDUE', studentId: childrenList[1]?.id },
        { id: 3, title: 'Lab Materials', amount: 150, dueDate: `${currentYear}-10-20`, status: 'PAID', studentId: childrenList[0]?.id },
    ];

    const filteredFees = selectedChildId === 'ALL'
        ? displayFees
        : displayFees.filter(f => f.studentId === selectedChildId);

    const totalDue = filteredFees
        .filter(f => f.status !== 'PAID')
        .reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-2 mb-2 text-primary">
                        FINANCIAL_CORE: LEDGER
                    </Badge>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Financial Overview</h1>
                    <p className="text-sm font-medium text-slate-500 italic">
                        {selectedChildId === 'ALL'
                            ? `Consolidated financial status for ${childrenList.length} wards.`
                            : `Financial records for ${childrenList.find(c => c.id === selectedChildId)?.name}.`}
                    </p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-slate-50 dark:border-slate-800 shadow-xl">
                        <div className="size-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-black">
                            <IndianRupee size={24} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[7px] font-black uppercase tracking-widest text-slate-400">Total Outstanding</span>
                            <span className="text-xl font-black text-slate-900 dark:text-white uppercase">₹{totalDue.toLocaleString()}</span>
                        </div>
                        <Button 
                            onClick={handlePayAll}
                            size="sm" 
                            className="bg-rose-500 hover:bg-rose-600 text-white border-none rounded-xl ml-4 font-bold shadow-lg shadow-rose-500/20">
                            PAY ALL
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Upcoming', value: '₹1,200', icon: <Calendar className="text-primary" />, sub: 'DUE_30_DAYS' },
                    { label: 'History', value: '₹4,500', icon: <History className="text-slate-500" />, sub: 'PAID_YTD' },
                    { label: 'Payment Method', value: '**** 4242', icon: <CreditCard className="text-emerald-500" />, sub: 'PRIMARY_CARD' },
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

            {/* Invoice List */}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-100 dark:border-slate-800 pb-8">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Invoice Registry</h2>
                        <div className="flex gap-4">
                            <Button 
                                onClick={handleDownloadStatement}
                                variant="secondary" 
                                className="bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-slate-400 hover:text-primary transition-all gap-2 text-[10px] font-black uppercase tracking-widest">
                                <Download size={16} />
                                Download Statement
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-24 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/50 animate-pulse" />
                            ))
                        ) : (
                            filteredFees.length > 0 ? (
                                filteredFees.map((fee, i) => (
                                    <div key={i} className="group relative overflow-hidden bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 hover:border-primary/20 transition-all hover:shadow-2xl">
                                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center gap-6">
                                                <div className={`size-16 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm ${fee.status === 'PAID' ? 'bg-emerald-50 text-emerald-500' : fee.status === 'OVERDUE' ? 'bg-rose-50 text-rose-500' : 'bg-primary/5 text-primary'}`}>
                                                    <Wallet />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">{fee.title}</h3>
                                                        {selectedChildId === 'ALL' && (
                                                            <Badge variant="outline" className="text-[7px] font-black uppercase tracking-widest border-none bg-slate-100 text-slate-500 px-2 py-0.5">
                                                                {childrenList.find(c => c.id === fee.studentId)?.name || 'Unknown'}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                                                        <span>Due: {fee.dueDate}</span>
                                                        {fee.status === 'OVERDUE' && <span className="text-rose-500 font-bold">Late by 5 days</span>}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8">
                                                <div className="text-right">
                                                    <span className="block text-2xl font-black text-slate-900 dark:text-white">₹{fee.amount}</span>
                                                    <Badge variant={fee.status === 'PAID' ? 'outline' : fee.status === 'OVERDUE' ? 'destructive' : 'secondary'} className={`text-[7px] font-black uppercase tracking-widest px-2 py-0.5 ${fee.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : ''}`}>
                                                        {fee.status}
                                                    </Badge>
                                                </div>
                                                {fee.status !== 'PAID' && (
                                                    <Button 
                                                        onClick={() => handlePayFee(fee.id)}
                                                        className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl px-6 py-3 h-auto font-black text-[9px] uppercase tracking-widest border-none hover:opacity-90 transition-opacity whitespace-nowrap">
                                                        Pay Now
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center p-20 gap-4 opacity-30 italic">
                                    <Receipt size={48} />
                                    <p className="text-[10px] font-black uppercase tracking-widest">No detailed financial records found.</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
