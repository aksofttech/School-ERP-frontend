import React, { useState, useEffect, useMemo } from 'react';
import {
  Banknote,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Download,
  Printer,
  X,
  CreditCard,
  User,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  Building,
  RefreshCw,
  Eye,
  Send,
  Calendar,
  Layers,
  FileText,
  DollarSign
} from 'lucide-react';
import { payrollService, StaffPaymentRecord, StaffMemberOption } from '@/services/payroll.service';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

export default function PayrollDashboard() {
  const [payments, setPayments] = useState<StaffPaymentRecord[]>([]);
  const [stats, setStats] = useState({
    totalPayroll: 0,
    totalPaid: 0,
    totalPending: 0,
    paidCount: 0,
    pendingCount: 0,
    totalStaff: 0,
  });
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('October 2026');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [staffOptions, setStaffOptions] = useState<StaffMemberOption[]>([]);

  // Modals state
  const [selectedPayslip, setSelectedPayslip] = useState<StaffPaymentRecord | null>(null);
  const [quickDisburseRecord, setQuickDisburseRecord] = useState<StaffPaymentRecord | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Quick Disburse form state
  const [disburseMethod, setDisburseMethod] = useState('Bank Transfer');
  const [disburseTxn, setDisburseTxn] = useState('');
  const [disburseRemarks, setDisburseRemarks] = useState('');

  // New Disbursal form state
  const [newStaffId, setNewStaffId] = useState('');
  const [newBasic, setNewBasic] = useState<number>(40000);
  const [newAllowances, setNewAllowances] = useState<number>(4000);
  const [newDeductions, setNewDeductions] = useState<number>(2000);
  const [newMonth, setNewMonth] = useState('October 2026');
  const [newMethod, setNewMethod] = useState('Bank Transfer');
  const [newStatus, setNewStatus] = useState<'PAID' | 'PENDING'>('PAID');
  const [newTxnId, setNewTxnId] = useState('');
  const [newRemarks, setNewRemarks] = useState('');

  // Fetch Payroll Data
  const fetchPayroll = async () => {
    try {
      setLoading(true);
      const res = await payrollService.getDashboard({
        month: selectedMonth === 'all' ? undefined : selectedMonth,
        status: selectedStatus === 'all' ? undefined : selectedStatus,
        search: searchQuery.trim() || undefined,
      });

      setPayments(res.payments || []);
      if (res.stats) {
        setStats(res.stats);
      }
      if (res.availableMonths && res.availableMonths.length > 0) {
        setAvailableMonths(res.availableMonths);
        if (!selectedMonth && res.availableMonths[0]) {
          setSelectedMonth(res.availableMonths[0]);
        }
      }
    } catch (err: any) {
      console.error('Failed to load payroll records:', err);
      toast.error('Unable to load staff payroll data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Staff List for Disbursal modal
  const fetchStaffList = async () => {
    try {
      const staff = await payrollService.getStaffList();
      setStaffOptions(staff);
      if (staff.length > 0 && !newStaffId) {
        setNewStaffId(staff[0].id);
        setNewBasic(staff[0].defaultBasic);
        setNewAllowances(staff[0].defaultAllowances);
        setNewDeductions(staff[0].defaultDeductions);
      }
    } catch (err) {
      console.error('Failed to load staff members:', err);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, [selectedMonth, selectedStatus]);

  useEffect(() => {
    fetchStaffList();
  }, []);

  // When staff selection changes in Add modal, update default values
  const handleStaffSelect = (staffId: string) => {
    setNewStaffId(staffId);
    const selected = staffOptions.find((s) => s.id === staffId);
    if (selected) {
      setNewBasic(selected.defaultBasic);
      setNewAllowances(selected.defaultAllowances);
      setNewDeductions(selected.defaultDeductions);
    }
  };

  // Quick Disburse handler for pending records
  const handleConfirmQuickDisburse = async () => {
    if (!quickDisburseRecord) return;
    try {
      setSubmitting(true);
      await payrollService.disburse({
        id: quickDisburseRecord.id,
        status: 'PAID',
        paymentMethod: disburseMethod,
        transactionId: disburseTxn.trim() || `TXN-${Date.now().toString().slice(-8)}`,
        remarks: disburseRemarks.trim() || `Disbursed on ${new Date().toLocaleDateString('en-IN')}`,
      });
      toast.success(`Salary successfully marked as PAID for ${quickDisburseRecord.staff.firstName}!`);
      setQuickDisburseRecord(null);
      setDisburseTxn('');
      setDisburseRemarks('');
      await fetchPayroll();
    } catch (err: any) {
      toast.error(err.message || 'Failed to disburse salary');
    } finally {
      setSubmitting(false);
    }
  };

  // Add new salary record handler
  const handleCreateSalary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffId) {
      toast.error('Please select a staff member');
      return;
    }

    try {
      setSubmitting(true);
      await payrollService.disburse({
        staffId: newStaffId,
        basicSalary: Number(newBasic),
        allowances: Number(newAllowances),
        deductions: Number(newDeductions),
        netSalary: Number(newBasic) + Number(newAllowances) - Number(newDeductions),
        month: newMonth,
        paymentMethod: newMethod,
        status: newStatus,
        transactionId: newStatus === 'PAID' ? (newTxnId.trim() || `TXN-${Date.now().toString().slice(-8)}`) : undefined,
        remarks: newRemarks.trim() || `Salary for ${newMonth}`,
      });
      toast.success('Salary record saved successfully!');
      setShowAddModal(false);
      await fetchPayroll();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save salary record');
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered payments by search query
  const filteredPayments = useMemo(() => {
    if (!searchQuery.trim()) return payments;
    const q = searchQuery.toLowerCase().trim();
    return payments.filter((p) => {
      const name = `${p.staff.firstName} ${p.staff.lastName}`.toLowerCase();
      const email = p.staff.email.toLowerCase();
      const txn = (p.transactionId || '').toLowerCase();
      const method = (p.paymentMethod || '').toLowerCase();
      return name.includes(q) || email.includes(q) || txn.includes(q) || method.includes(q);
    });
  }, [payments, searchQuery]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-2">
            <Banknote size={14} />
            Institutional Payroll & Staff Disbursals
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Staff Payments
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage teacher salaries, bank transfers, pay slips, and monthly disbursals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchPayroll()}
            className="p-3 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <Button
            onClick={() => {
              if (staffOptions.length > 0 && !newStaffId) {
                setNewStaffId(staffOptions[0].id);
                setNewBasic(staffOptions[0].defaultBasic);
                setNewAllowances(staffOptions[0].defaultAllowances);
                setNewDeductions(staffOptions[0].defaultDeductions);
              }
              setShowAddModal(true);
            }}
            className="bg-primary hover:bg-primary/90 text-white rounded-xl px-5 py-2.5 font-bold text-sm shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            <Plus size={18} />
            Disburse Salary
          </Button>
        </div>
      </div>

      {/* Top Aggregate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Payroll */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-primary/40 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Payroll
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Banknote size={20} />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">
            ₹{stats.totalPayroll.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>Period:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {selectedMonth === 'all' ? 'All Records' : selectedMonth}
            </span>
          </div>
        </div>

        {/* Card 2: Disbursed / Paid */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Disbursed (Paid)
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">
            ₹{stats.totalPaid.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>{stats.paidCount} Staff Members Credited</span>
          </div>
        </div>

        {/* Card 3: Pending Disbursals */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Pending Disbursal
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock size={20} />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">
            ₹{stats.totalPending.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold">
            <span>{stats.pendingCount} Salaries Queued</span>
          </div>
        </div>

        {/* Card 4: Staff Members */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Staff on Payroll
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <User size={20} />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">
            {stats.totalStaff} Members
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>Teaching & Admin Faculty</span>
          </div>
        </div>
      </div>

      {/* Main Content Area: Controls & Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Controls Toolbar */}
        <div className="p-6 border-b border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search staff name, email, or transaction ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Month Filter */}
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-400" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Months</option>
                {availableMonths.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Status</option>
                <option value="PAID">Paid Only</option>
                <option value="PENDING">Pending Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
              <RefreshCw size={32} className="animate-spin text-primary" />
              <p className="text-sm font-medium">Loading staff payments data...</p>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Banknote size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-base font-semibold text-slate-600 dark:text-slate-300">
                No salary records found
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Try selecting a different month or create a new salary disbursal above.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-4 px-6">Staff Member</th>
                  <th className="py-4 px-6">Month</th>
                  <th className="py-4 px-6">Basic Pay</th>
                  <th className="py-4 px-6">Allowances / Deductions</th>
                  <th className="py-4 px-6 font-bold text-slate-700 dark:text-slate-200">Net Salary</th>
                  <th className="py-4 px-6">Payment Mode & Txn</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                {filteredPayments.map((record) => {
                  const staffName = `${record.staff.firstName} ${record.staff.lastName}`.trim();
                  const roleLabel =
                    record.staff.role === 'SCHOOL_ADMIN'
                      ? record.staff.email.includes('principal')
                        ? 'Principal'
                        : 'Admin Head'
                      : record.staff.teacher?.qualification
                      ? `Teacher (${record.staff.teacher.qualification})`
                      : 'Teacher';

                  const isPaid = record.status === 'PAID';

                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Staff Member */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20">
                            {record.staff.firstName?.[0] || 'S'}
                            {record.staff.lastName?.[0] || ''}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              {staffName}
                            </div>
                            <div className="text-xs text-slate-400">{record.staff.email}</div>
                            <div className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">
                              {roleLabel}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Month */}
                      <td className="py-4 px-6 font-medium text-slate-700 dark:text-slate-300">
                        {record.month}
                      </td>

                      {/* Basic Pay */}
                      <td className="py-4 px-6 font-medium text-slate-600 dark:text-slate-400">
                        ₹{record.basicSalary.toLocaleString('en-IN')}
                      </td>

                      {/* Allowances & Deductions */}
                      <td className="py-4 px-6">
                        <div className="text-xs">
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            +₹{record.allowances.toLocaleString('en-IN')}
                          </span>
                          <span className="text-slate-400 mx-1">/</span>
                          <span className="text-rose-500 font-medium">
                            -₹{record.deductions.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </td>

                      {/* Net Salary */}
                      <td className="py-4 px-6">
                        <span className="font-black text-slate-900 dark:text-white text-base">
                          ₹{record.netSalary.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Payment Mode & Txn */}
                      <td className="py-4 px-6">
                        {isPaid ? (
                          <div>
                            <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                              <CreditCard size={13} className="text-slate-400" />
                              {record.paymentMethod}
                            </div>
                            {record.transactionId && (
                              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                                {record.transactionId}
                              </div>
                            )}
                            {record.paymentDate && (
                              <div className="text-[10px] text-slate-400">
                                {new Date(record.paymentDate).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                            <Clock size={12} />
                            Awaiting Disbursal
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 text-center">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                            <CheckCircle2 size={12} />
                            PAID
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                            <Clock size={12} />
                            PENDING
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isPaid ? (
                            <button
                              onClick={() => {
                                setQuickDisburseRecord(record);
                                setDisburseMethod(record.paymentMethod || 'Bank Transfer');
                                setDisburseTxn(`TXN-${Date.now().toString().slice(-8)}`);
                                setDisburseRemarks(`Salary disbursed for ${record.month}`);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                            >
                              <Send size={12} />
                              Pay Now
                            </button>
                          ) : (
                            <button
                              onClick={() => setSelectedPayslip(record)}
                              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                            >
                              <Eye size={13} />
                              Pay Slip
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL 1: Quick Disburse Pending Salary */}
      {quickDisburseRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Banknote size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Disburse Salary
                  </h3>
                  <p className="text-xs text-slate-500">
                    {quickDisburseRecord.month}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setQuickDisburseRecord(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Staff Card */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl mb-5 border border-slate-200/60 dark:border-slate-800">
              <div className="text-xs text-slate-500 mb-1">Payee Staff Member</div>
              <div className="font-bold text-base text-slate-900 dark:text-white">
                {quickDisburseRecord.staff.firstName} {quickDisburseRecord.staff.lastName}
              </div>
              <div className="text-xs text-slate-400 mb-3">{quickDisburseRecord.staff.email}</div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                <span className="text-xs text-slate-500">Net Payable Amount</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  ₹{quickDisburseRecord.netSalary.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Payment Method
                </label>
                <select
                  value={disburseMethod}
                  onChange={(e) => setDisburseMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Bank Transfer">Bank Transfer (NEFT / IMPS)</option>
                  <option value="UPI">UPI / QR Code</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Cash">Cash Voucher</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Transaction / Reference ID
                </label>
                <input
                  type="text"
                  value={disburseTxn}
                  onChange={(e) => setDisburseTxn(e.target.value)}
                  placeholder="e.g. HDFC918204812"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Disbursal Remarks
                </label>
                <input
                  type="text"
                  value={disburseRemarks}
                  onChange={(e) => setDisburseRemarks(e.target.value)}
                  placeholder="Optional remarks"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setQuickDisburseRecord(null)}
                className="w-1/2 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmQuickDisburse}
                disabled={submitting}
                className="w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    Confirm Disbursal
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: New Salary Assignment / Custom Disbursal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Plus size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Create / Disburse Salary
                  </h3>
                  <p className="text-xs text-slate-500">Record a monthly staff payment</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSalary} className="space-y-4">
              {/* Select Staff */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Staff Member *
                </label>
                <select
                  value={newStaffId}
                  onChange={(e) => handleStaffSelect(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                >
                  {staffOptions.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name} ({staff.qualification} - {staff.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Month */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Payment Month *
                </label>
                <select
                  value={newMonth}
                  onChange={(e) => setNewMonth(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="November 2026">November 2026</option>
                  <option value="October 2026">October 2026</option>
                  <option value="September 2026">September 2026</option>
                  <option value="August 2026">August 2026</option>
                </select>
              </div>

              {/* Financial Inputs: Basic, Allowances, Deductions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Basic Salary (₹)
                  </label>
                  <input
                    type="number"
                    value={newBasic}
                    onChange={(e) => setNewBasic(Number(e.target.value))}
                    min={0}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Allowances (₹)
                  </label>
                  <input
                    type="number"
                    value={newAllowances}
                    onChange={(e) => setNewAllowances(Number(e.target.value))}
                    min={0}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm font-semibold text-emerald-600 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Deductions (₹)
                  </label>
                  <input
                    type="number"
                    value={newDeductions}
                    onChange={(e) => setNewDeductions(Number(e.target.value))}
                    min={0}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm font-semibold text-rose-500 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Net Salary Preview */}
              <div className="bg-blue-50/60 dark:bg-blue-950/40 p-4 rounded-2xl flex items-center justify-between border border-blue-200/50 dark:border-blue-900/40">
                <span className="text-xs font-bold text-blue-900 dark:text-blue-200">
                  Calculated Net Payable
                </span>
                <span className="text-xl font-black text-blue-700 dark:text-blue-300">
                  ₹{(Number(newBasic) + Number(newAllowances) - Number(newDeductions)).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Status & Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as 'PAID' | 'PENDING')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="PAID">PAID (Disburse Now)</option>
                    <option value="PENDING">PENDING (Queue for Later)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Payment Mode
                  </label>
                  <select
                    value={newMethod}
                    onChange={(e) => setNewMethod(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="UPI">UPI</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              {/* Txn ID (if Paid) */}
              {newStatus === 'PAID' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Transaction ID / Ref (Optional)
                  </label>
                  <input
                    type="text"
                    value={newTxnId}
                    onChange={(e) => setNewTxnId(e.target.value)}
                    placeholder="Leave empty for auto-generated TXN ID"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )}

              {/* Remarks */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Remarks / Notes
                </label>
                <input
                  type="text"
                  value={newRemarks}
                  onChange={(e) => setNewRemarks(e.target.value)}
                  placeholder="Optional note"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      Save Payment
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: School Payslip Viewer */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Action Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Official Salary Slip
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Printer size={14} />
                  Print
                </button>
                <button
                  onClick={() => setSelectedPayslip(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Payslip Document Container */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-800/20 text-slate-800 dark:text-slate-200">
              {/* Header */}
              <div className="text-center pb-6 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-wide uppercase">
                  Vidya Mandir Senior Secondary School
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Affiliated to CBSE, New Delhi (Affiliation No. 1730241) • Institutional Area, Jaipur
                </p>
                <div className="inline-block mt-3 px-4 py-1 rounded-full bg-slate-200 dark:bg-slate-700 font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Pay Slip: {selectedPayslip.month}
                </div>
              </div>

              {/* Employee Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-6 border-b border-slate-200 dark:border-slate-700 text-xs">
                <div>
                  <div className="text-slate-400">Employee Name</div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                    {selectedPayslip.staff.firstName} {selectedPayslip.staff.lastName}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Role / Designation</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedPayslip.staff.role === 'SCHOOL_ADMIN'
                      ? 'Administration'
                      : selectedPayslip.staff.teacher?.qualification || 'Teacher'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Payment Status</div>
                  <div className="font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    {selectedPayslip.status}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Payment Mode</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedPayslip.paymentMethod}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Transaction Ref</div>
                  <div className="font-mono text-slate-700 dark:text-slate-300 mt-0.5 text-[11px]">
                    {selectedPayslip.transactionId || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Disbursed On</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedPayslip.paymentDate
                      ? new Date(selectedPayslip.paymentDate).toLocaleDateString('en-IN')
                      : 'Pending'}
                  </div>
                </div>
              </div>

              {/* Earnings vs Deductions Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-200 dark:border-slate-700">
                {/* Earnings */}
                <div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-3 pb-1 border-b border-emerald-100 dark:border-emerald-950">
                    Earnings
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Basic Salary</span>
                      <span className="font-semibold">₹{selectedPayslip.basicSalary.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dearness & Allowances</span>
                      <span className="font-semibold text-emerald-600">
                        +₹{selectedPayslip.allowances.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold">
                      <span>Gross Earnings</span>
                      <span>
                        ₹{(selectedPayslip.basicSalary + selectedPayslip.allowances).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <div className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-3 pb-1 border-b border-rose-100 dark:border-rose-950">
                    Deductions
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Provident Fund (PF) & TDS</span>
                      <span className="font-semibold text-rose-500">
                        -₹{selectedPayslip.deductions.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold">
                      <span>Total Deductions</span>
                      <span className="text-rose-500">
                        -₹{selectedPayslip.deductions.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Salary Highlight */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                    Net Salary Credited
                  </div>
                  <div className="text-xs text-slate-500 italic mt-0.5">
                    {selectedPayslip.remarks || 'Credited directly to bank account'}
                  </div>
                </div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  ₹{selectedPayslip.netSalary.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Verification Stamp */}
              <div className="mt-8 pt-6 border-t border-dashed border-slate-200 dark:border-slate-700 flex justify-between items-end text-[11px] text-slate-400">
                <div>
                  <div>Computer Generated Pay Slip</div>
                  <div>Accounts & Finance Dept • Vidya Mandir</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-700 dark:text-slate-300">
                    Authorized Signatory
                  </div>
                  <div>Accountant / School Admin</div>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-6 text-right">
              <Button
                variant="outline"
                onClick={() => setSelectedPayslip(null)}
                className="rounded-xl px-6"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
