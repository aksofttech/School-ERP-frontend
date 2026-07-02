import React, { useState, useMemo } from 'react';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import { UserRole } from '@/utils/types';
import { useFees } from '@/hooks/useFees';
import { format } from 'date-fns';
import { 
  Search, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Wallet,
  IndianRupee
} from 'lucide-react';

export default function FeeCollection() {
  const { fees, loading, recordPayment } = useFees({ limit: 50 });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'PENDING' | 'OVERDUE' | 'PAID' | 'ALL'>('PENDING');
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Filter fees client-side for immediate feedback
  const filteredFees = useMemo(() => {
    return (fees || []).filter((fee: any) => {
      // Status filter
      if (activeTab !== 'ALL' && fee.status !== activeTab) return false;
      
      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const studentName = `${fee.student?.user?.firstName || ''} ${fee.student?.user?.lastName || ''}`.toLowerCase();
        const className = fee.student?.class?.name?.toLowerCase() || '';
        return studentName.includes(term) || className.includes(term) || fee.id.toLowerCase().includes(term);
      }
      return true;
    });
  }, [fees, activeTab, searchTerm]);

  const handlePayment = async (feeId: string) => {
    setProcessingId(feeId);
    try {
      await recordPayment(feeId, {});
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={[UserRole.SCHOOL_ADMIN]}>
        <div className="flex flex-col gap-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
            
            <div className="space-y-2 relative z-10">
              <div className="flex items-center gap-2 text-primary">
                <Wallet size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Finance Operations</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Fee Collection</h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Process payments, review outstanding balances, and track daily financial intake.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters & Actions */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6 sticky top-6">
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Search & Filter</h3>
                  <div className="relative group">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Student or ID..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:font-normal"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Status Views</h3>
                  <TabButton 
                    active={activeTab === 'PENDING'} 
                    onClick={() => setActiveTab('PENDING')}
                    icon={<Clock size={16} />}
                    label="Pending Fees"
                    count={(fees || []).filter(f => f.status === 'PENDING').length}
                    color="text-amber-500"
                    bgActive="bg-amber-50 dark:bg-amber-500/10"
                    borderActive="border-amber-200 dark:border-amber-500/20"
                  />
                  <TabButton 
                    active={activeTab === 'OVERDUE'} 
                    onClick={() => setActiveTab('OVERDUE')}
                    icon={<AlertCircle size={16} />}
                    label="Overdue"
                    count={(fees || []).filter(f => f.status === 'OVERDUE').length}
                    color="text-rose-500"
                    bgActive="bg-rose-50 dark:bg-rose-500/10"
                    borderActive="border-rose-200 dark:border-rose-500/20"
                  />
                  <TabButton 
                    active={activeTab === 'PAID'} 
                    onClick={() => setActiveTab('PAID')}
                    icon={<CheckCircle size={16} />}
                    label="Recently Paid"
                    color="text-emerald-500"
                    bgActive="bg-emerald-50 dark:bg-emerald-500/10"
                    borderActive="border-emerald-200 dark:border-emerald-500/20"
                  />
                  <TabButton 
                    active={activeTab === 'ALL'} 
                    onClick={() => setActiveTab('ALL')}
                    icon={<Wallet size={16} />}
                    label="All Records"
                    color="text-primary"
                    bgActive="bg-primary/5 dark:bg-primary/10"
                    borderActive="border-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* List */}
            <div className="lg:col-span-3 space-y-4">
              {loading && filteredFees.length === 0 ? (
                <div className="flex flex-col h-96 items-center justify-center gap-4 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent shadow-lg shadow-primary/20"></div>
                  <p className="text-sm font-bold text-slate-400 italic animate-pulse tracking-widest uppercase">Loading ledger...</p>
                </div>
              ) : filteredFees.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 gap-4 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 text-slate-400">
                  <Wallet size={48} className="opacity-20" />
                  <p className="font-bold tracking-tight">No records found matching criteria.</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {filteredFees.map((fee: any) => (
                    <div 
                      key={fee.id} 
                      className={`flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border transition-all duration-300 group
                        ${fee.status === 'PAID' ? 'bg-slate-50 border-slate-100 dark:bg-slate-800/20 dark:border-slate-800/50' : 'bg-white border-slate-200 hover:border-primary/30 hover:shadow-md dark:bg-slate-900 dark:border-slate-800 dark:hover:border-primary/50'}
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black transition-colors ${
                          fee.status === 'PAID' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' :
                          fee.status === 'OVERDUE' ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400' :
                          'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
                        }`}>
                          {fee.student?.user?.firstName?.[0] || '?'}
                        </div>
                        
                        <div className="space-y-1">
                          <h4 className="font-black text-slate-900 dark:text-white tracking-tight text-sm md:text-base">
                            {fee.student?.user?.firstName} {fee.student?.user?.lastName}
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-slate-500 uppercase tracking-widest">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                              Class: {fee.student?.class?.name || 'N/A'}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                              ID: #{fee.id.substring(fee.id.length - 6)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-none border-slate-100 dark:border-slate-800">
                        <div className="text-left md:text-right space-y-1">
                          <span className="text-lg md:text-xl font-black tracking-tighter text-slate-900 dark:text-white inline-flex items-center">
                            <IndianRupee size={16} className="-mr-0.5" />
                            {fee.amount.toLocaleString()}
                          </span>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Due: {format(new Date(fee.dueDate), 'MMM dd')}
                          </p>
                        </div>
                        
                        <div className="flex flex-col gap-2 min-w-[120px]">
                          {fee.status === 'PAID' ? (
                            <div className="flex items-center justify-center gap-2 py-2 px-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border border-emerald-200/50 rounded-xl text-xs font-black uppercase tracking-widest cursor-default">
                              <CheckCircle size={14} />
                              Paid
                            </div>
                          ) : (
                            <button
                              onClick={() => handlePayment(fee.id)}
                              disabled={processingId === fee.id}
                              className={`flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                processingId === fee.id
                                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                  : 'bg-primary text-white hover:bg-blue-600 shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:scale-95'
                              }`}
                            >
                              {processingId === fee.id ? (
                                <div className="w-4 h-4 rounded-full border-2 border-slate-400 border-t-transparent animate-spin"></div>
                              ) : (
                                <>
                                  <CreditCard size={14} />
                                  Collect
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </RoleGuard>
    </AuthGuard>
  );
}

function TabButton({ active, onClick, icon, label, count, color, bgActive, borderActive }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
        active 
          ? `${bgActive} ${borderActive}` 
          : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={active ? color : 'text-slate-400'}>
          {icon}
        </div>
        <span className={`text-xs font-black uppercase tracking-widest ${active ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${active ? color + ' bg-white/50 dark:bg-black/20' : 'text-slate-400 bg-slate-100 dark:bg-slate-800'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

FeeCollection.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
