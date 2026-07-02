import React, { useState } from 'react';
import { 
    Users, 
    ShieldCheck, 
    TreePalm, 
    UserPlus, 
    Search, 
    Filter, 
    Mail, 
    Phone, 
    MoreVertical, 
    ChevronLeft, 
    ChevronRight,
    Search as SearchIcon,
    Plus
} from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import { USER_ROLES } from '@/utils/role-config';
import Head from 'next/head';

// Mock Data
const staffData = [
    { id: 'NT-042', name: 'Sarah Jenkins', role: 'Admin Officer', dept: 'Administration', status: 'Active', email: 'sarah.j@school.edu', phone: '+1 (555) 012-3456', avatar: null },
    { id: 'NT-089', name: 'David Lo', role: 'Bus Driver', dept: 'Transport', status: 'On Leave', email: 'david.l@school.edu', phone: '+1 (555) 012-7890', avatar: null },
    { id: 'NT-091', name: 'Michael Chen', role: 'IT Support Lead', dept: 'Information Tech', status: 'Active', email: 'm.chen@school.edu', phone: '+1 (555) 012-9988', avatar: null },
    { id: 'NT-012', name: 'Emily Davis', role: 'Head Janitor', dept: 'Facilities', status: 'Resigned', email: 'e.davis@school.edu', phone: '+1 (555) 012-1122', avatar: null },
    { id: 'NT-098', name: 'Robert Fox', role: 'Accountant', dept: 'Finance', status: 'Active', email: 'r.fox@school.edu', phone: '+1 (555) 012-6655', avatar: null },
];

export default function StaffDashboard() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');

    const filteredStaff = staffData.filter(staff =>
        (filter === 'All' || staff.status === filter) &&
        (staff.name.toLowerCase().includes(searchTerm.toLowerCase()) || staff.id.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SCHOOL_ADMIN, USER_ROLES.SUPER_ADMIN]}>
                <>

                    <Head>
                        <title>Staff Directory | School ERP</title>
                    </Head>
                    <div className="flex-1 p-6 max-w-[1400px] w-full mx-auto animate-in fade-in duration-700">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Employees</h1>
                                <p className="text-sm font-medium text-slate-500 italic">View and manage all teachers and staff members.</p>
                            </div>
                            <button className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-primary/30 hover:-translate-y-1 active:scale-95">
                                <Plus size={18} />
                                <span>Add New Staff</span>
                            </button>
                        </div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                    { title: 'Total Employees', value: '142', change: '+2%', icon: Users, color: 'text-primary', bg: 'bg-primary/5', changeColor: 'text-emerald-500 bg-emerald-500/10' },
                    { title: 'Active', value: '130', change: '+1%', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/5', changeColor: 'text-emerald-500 bg-emerald-500/10' },
                    { title: 'On Leave', value: '8', change: 'Stable', icon: TreePalm, color: 'text-amber-500', bg: 'bg-amber-500/5', changeColor: 'text-slate-400 bg-slate-100' },
                    { title: 'New Staff', value: '4', change: '+4%', icon: UserPlus, color: 'text-purple-500', bg: 'bg-purple-500/5', changeColor: 'text-emerald-500 bg-emerald-500/10' },
                ].map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 size-24 bg-slate-50 dark:bg-slate-800/50 rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-700" />
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{stat.title}</p>
                                <div className={`size-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={20} />
                                </div>
                            </div>
                            <div className="flex items-end gap-3">
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</h3>
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${stat.changeColor.split(' ')[0]} ${stat.changeColor.split(' ')[1]}`}>{stat.change}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main List Container */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl flex flex-col min-h-[600px] overflow-hidden">
                {/* Toolbar */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-6 justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    {/* Tabs */}
                    <div className="flex items-center gap-8 w-full sm:w-auto overflow-x-auto no-scrollbar px-2">
                        {['All', 'Active', 'On Leave', 'Resigned'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`relative py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${filter === tab ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {tab === 'All' ? 'All Employees' : tab}
                                {filter === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full animate-in slide-in-from-left duration-300" />}
                            </button>
                        ))}
                    </div>
                    {/* Search & Filters */}
                    <div className="flex gap-4 w-full sm:w-auto">
                        <div className="relative group w-full sm:w-72">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-12 pl-12 pr-6 rounded-2xl border-none ring-1 ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm"
                                placeholder="Search staff members..."
                                type="text"
                            />
                        </div>
                        <button className="h-12 px-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-sm">
                            <Filter size={16} className="text-primary" />
                            <span className="hidden sm:inline">Filter</span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800">
                                <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-12">
                                    <input className="rounded-md border-slate-300 text-primary focus:ring-primary size-4" type="checkbox" />
                                </th>
                                <th className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 min-w-[240px]">Staff Member</th>
                                <th className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Department</th>
                                <th className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                                <th className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {filteredStaff.map((staff) => (
                                <tr key={staff.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all cursor-pointer">
                                    <td className="py-8 px-8">
                                        <input className="rounded-md border-slate-200 text-primary focus:ring-primary size-4" type="checkbox" />
                                    </td>
                                    <td className="py-8 px-4">
                                        <div className="flex items-center gap-5">
                                            <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-xs text-slate-500 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                                {staff.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{staff.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 italic uppercase">UID: {staff.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-8 px-4">
                                        <p className="text-xs font-black text-slate-900 dark:text-white tracking-widest mb-1">{staff.role.toUpperCase()}</p>
                                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{staff.dept}</p>
                                    </td>
                                    <td className="py-8 px-4">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${staff.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' :
                                                staff.status === 'On Leave' ? 'bg-amber-500/10 text-amber-500' :
                                                    'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                                            <div className={`size-1.5 rounded-full ${staff.status === 'Active' ? 'bg-emerald-500' :
                                                    staff.status === 'On Leave' ? 'bg-amber-500' :
                                                        'bg-slate-400 animate-pulse'}`} />
                                            {staff.status}
                                        </span>
                                    </td>
                                    <td className="py-8 px-4 text-right">
                                        <button className="p-3 rounded-xl hover:bg-white dark:hover:bg-slate-800 text-slate-400 hover:text-primary transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700 hover:shadow-md">
                                            <MoreVertical size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto bg-slate-50/30 dark:bg-slate-900/30">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Displaying <span className="text-slate-900 dark:text-white">{filteredStaff.length} members</span> of 142 total staff</p>
                    <div className="flex gap-3">
                        <button className="size-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-primary hover:border-primary transition-all flex items-center justify-center disabled:opacity-30">
                            <ChevronLeft size={18} />
                        </button>
                        <button className="size-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-primary hover:border-primary transition-all flex items-center justify-center">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
            </div>
                
</>
            </RoleGuard>
        </AuthGuard>
    );
}


StaffDashboard.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
