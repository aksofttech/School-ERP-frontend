import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import SuperAdminLayout from '@/components/layouts/SuperAdminLayout';

export default function UserManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All Roles');
    const [statusFilter, setStatusFilter] = useState('Any Status');

    // Dummy data
    const users = [
        { id: 1, name: 'John Doe', role: 'Teacher', email: 'john.doe@school.edu', idNumber: 'T-4921', status: 'Active', lastLogin: '2 hours ago', avatar: null, color: 'indigo' },
        { id: 2, name: 'Sarah Smith', role: 'Student', email: 'sarah.s@school.edu', idNumber: 'S-1024', status: 'Inactive', lastLogin: '2 weeks ago', avatar: null, color: 'emerald' },
        { id: 3, name: 'Michael Chen', role: 'Parent', email: 'm.chen@email.com', idNumber: 'P-0056', status: 'Active', lastLogin: 'Yesterday', avatar: null, color: 'blue' },
        { id: 4, name: 'Emily Watson', role: 'Staff', email: 'e.watson@school.edu', idNumber: 'St-892', status: 'Pending', lastLogin: '-', avatar: null, color: 'rose' },
        { id: 5, name: 'Robert Johnson', role: 'Student', email: 'rob.j@school.edu', idNumber: 'S-1153', status: 'Active', lastLogin: '5 mins ago', avatar: null, color: 'orange' },
    ];

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.idNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'Any Status' || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    return (
        <SuperAdminLayout>
            <Head>
                <title>User Management - EduCore</title>
            </Head>

            <div className="flex flex-col gap-1 pb-6">
                <nav className="flex items-center gap-2 text-sm mb-4 text-slate-500 dark:text-slate-400">
                    <span className="hover:text-primary transition-colors cursor-pointer">Super Admin</span>
                    <span className="material-icons-round text-[16px]">chevron_right</span>
                    <span className="font-medium text-slate-900 dark:text-white underline decoration-primary decoration-2 underline-offset-4">User Management</span>
                </nav>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Identity Directory</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Holistic management of users, permissions and access protocols.</p>
                </div>
                <Link href="/super-admin/users/add" className="flex items-center gap-3 bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95">
                    <span className="material-icons-round text-xl">person_add_alt</span>
                    <span>Provision New Entity</span>
                </Link>
            </div>

            <div className="bg-white dark:bg-card-dark rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                {/* Enhanced Control Bar */}
                <div className="p-8 border-b border-slate-100 dark:border-slate-700/50 flex flex-col lg:flex-row justify-between items-center gap-6 bg-slate-50/30 dark:bg-slate-800/20">
                    <div className="relative w-full lg:max-w-md">
                        <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-sm font-bold text-slate-900 dark:text-white shadow-inner focus:outline-none"
                            placeholder="Search by identity, email or system ID..."
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-5 py-3 rounded-xl text-xs font-black uppercase bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            <option>All Roles</option>
                            <option>Student</option>
                            <option>Teacher</option>
                            <option>Staff</option>
                            <option>Parent</option>
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-5 py-3 rounded-xl text-xs font-black uppercase bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            <option>Any Status</option>
                            <option>Active</option>
                            <option>Inactive</option>
                            <option>Pending</option>
                        </select>
                        <div className="h-10 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden lg:block"></div>
                        <button className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-primary transition-colors">
                            <span className="material-icons-round">tune</span>
                        </button>
                    </div>
                </div>

                {/* Premium User Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/40">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Entity Details</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">System Role</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Unique ID</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Current State</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Last Encounter</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Governance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No matching entities found in directory.</td>
                                </tr>
                            ) : filteredUsers.map((user) => (
                                <tr key={user.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-300">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xs bg-${user.color}-500/10 text-${user.color}-600`}>
                                                {user.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 dark:text-white leading-tight">{user.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 mt-1">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className="font-mono text-xs font-bold text-slate-500">{user.idNumber}</span>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' :
                                            user.status === 'Inactive' ? 'bg-slate-500/10 text-slate-500' : 'bg-amber-500/10 text-amber-600'
                                            }`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 animate-pulse' : user.status === 'Inactive' ? 'bg-slate-400' : 'bg-amber-500'}`}></span>
                                            {user.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className="text-xs font-bold text-slate-500">{user.lastLogin}</span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary transition-all">
                                                <span className="material-icons-round text-xl">admin_panel_settings</span>
                                            </button>
                                            <button className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 hover:text-rose-500 transition-all">
                                                <span className="material-icons-round text-xl">delete_outline</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Intelligent Pagination */}
                <div className="p-8 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/20 dark:bg-slate-800/10 flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Showing <span className="text-slate-900 dark:text-white">1 - {filteredUsers.length}</span> of 1,248 Entities
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50 transition-all">
                            <span className="material-icons-round">chevron_left</span>
                        </button>
                        <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs shadow-lg transition-transform active:scale-95">1</button>
                        <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-black text-xs hover:bg-slate-50 transition-all">2</button>
                        <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50 transition-all">
                            <span className="material-icons-round">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
