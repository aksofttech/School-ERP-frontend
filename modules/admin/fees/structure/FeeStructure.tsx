import { useState, useEffect } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  Settings2,
  ArrowRight,
  Calculator,
  Calendar,
  Layers,
  Edit2,
  Trash2,
  IndianRupee
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { feesService } from '@/services/fees.service';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

export default function FeeStructure() {
  const [structures, setStructures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStructures();
  }, []);

  const fetchStructures = async () => {
    setLoading(true);
    try {
      const data = await feesService.getFeeStructures();
      setStructures(data);
    } catch (err) {
      // Demo data if API fails
      setStructures([
        { id: '1', name: 'Annual Tuition Fee', category: 'General', amount: 45000, frequency: 'ANNUAL' },
        { id: '2', name: 'Building Fund', category: 'General', amount: 5000, frequency: 'ONE_TIME' },
        { id: '3', name: 'Lab Fee', category: 'Academic', amount: 2500, frequency: 'SEMESTER' },
        { id: '4', name: 'Transport Fee', category: 'Transport', amount: 1500, frequency: 'MONTHLY' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Fee Structure</h1>
          <p className="text-sm font-medium text-slate-500 italic">Set up and manage different types of fees for the school.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20">
            <Plus size={18} />
            Add Fee Type
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Expected', value: '₹452K', icon: IndianRupee, color: 'text-emerald-500' },
          { label: 'Fee Types', value: structures.length, icon: Layers, color: 'text-primary' },
          { label: 'Unpaid Months', value: '12', icon: Calendar, color: 'text-amber-500' },
          { label: 'Collection Rate', value: '98.2%', icon: Calculator, color: 'text-indigo-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center gap-6">
            <div className={`size-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-6 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="size-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg">
              <Settings2 size={20} />
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Manage Fees</h2>
          </div>
          <div className="relative group max-w-xs w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search fee type..."
              className="w-full bg-white dark:bg-slate-800 border-none rounded-xl py-3 pl-12 pr-4 text-xs font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Fee Name</th>
                <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Frequency</th>
                <th className="px-10 py-6 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-10 py-8"><Skeleton className="h-4 w-48 rounded-lg" /></td>
                    <td className="px-10 py-8"><Skeleton className="h-4 w-24 rounded-lg" /></td>
                    <td className="px-10 py-8"><Skeleton className="h-4 w-20 rounded-lg" /></td>
                    <td className="px-10 py-8"><Skeleton className="h-4 w-24 rounded-lg" /></td>
                    <td className="px-10 py-8 text-right"><Skeleton className="size-8 ml-auto rounded-lg" /></td>
                  </tr>
                ))
              ) : (
                structures.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <CreditCard size={18} />
                        </div>
                        <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <Badge variant="secondary" className="font-black text-[9px] uppercase tracking-widest rounded-lg">{s.category}</Badge>
                    </td>
                    <td className="px-10 py-8 text-sm font-black text-slate-900 dark:text-white uppercase tabular-nums">
                      ₹{s.amount.toLocaleString()}
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.frequency}</span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="size-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-primary hover:shadow-lg transition-all">
                          <Edit2 size={16} />
                        </button>
                        <button className="size-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-rose-500 hover:shadow-lg transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
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
