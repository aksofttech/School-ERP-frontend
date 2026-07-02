import React, { useState } from 'react';

export default function SchoolsList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All Status');

    const schoolsData = [
        { id: 'LDN-001', name: 'Springfield International', plan: 'Enterprise', cycle: 'Yearly', admin: 'Sarah Connor', email: 'sarah@springfield.edu', status: 'Active', color: 'emerald', students: '1,402', city: 'London, UK' },
        { id: 'NYC-202', name: 'Westside High Tech', plan: 'Basic', cycle: 'Monthly', admin: 'John Doe', email: 'admin@westside.edu', status: 'Pending Setup', color: 'amber', students: '850', city: 'New York, USA' },
        { id: 'VAN-505', name: 'Riverdale Academy', plan: 'Pro', cycle: 'Yearly', admin: 'Alice Smith', email: 'principal@riverdale.ca', status: 'Active', color: 'emerald', students: '2,100', city: 'Vancouver, CA' },
        { id: 'TOK-101', name: 'Tokyo STEM School', plan: 'Enterprise', cycle: 'Yearly', admin: 'Kenji Sato', email: 'kenji@tokyostem.jp', status: 'Active', color: 'emerald', students: '3,200', city: 'Tokyo, JP' },
        { id: 'PAR-888', name: 'Paris Arts Academy', plan: 'Pro', cycle: 'Monthly', admin: 'Marie Curie', email: 'marie@parisarts.fr', status: 'Maintenance', color: 'rose', students: '1,100', city: 'Paris, FR' },
    ];

    const filteredSchools = schoolsData.filter(school => {
        const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            school.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            school.admin.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'All Status' || school.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">
            {/* Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Schools Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Configure and monitor educational institutions globally.</p>
                </div>
                <button className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-hover border border-transparent rounded-2xl shadow-xl shadow-primary/25 text-sm font-bold text-white transition-all transform hover:-translate-y-1 active:scale-95">
                    <span className="material-icons-outlined text-xl mr-2">add_business</span>
                    Onboard New School
                </button>
            </div>

            {/* Sub-header Filter Bar */}
            <div className="bg-white/50 dark:bg-card-dark/50 backdrop-blur-xl p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-center transition-all">
                <div className="relative w-full lg:max-w-md group">
                    <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 pr-4 py-3.5 w-full bg-white dark:bg-slate-800 border-none rounded-xl shadow-inner-sm text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        placeholder="Search institutions by name, ID or admin..."
                        type="text"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="flex-1 lg:flex-none appearance-none bg-white dark:bg-slate-800 border-none text-slate-700 dark:text-slate-200 py-3.5 pl-5 pr-12 rounded-xl text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary/20 cursor-pointer outline-none"
                    >
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Pending Setup</option>
                        <option>Maintenance</option>
                    </select>

                    <button className="flex items-center justify-center gap-2 px-5 py-3.5 bg-white dark:bg-slate-800 border-none rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all text-sm font-bold active:scale-95">
                        <span className="material-icons-outlined text-lg">tune</span>
                        Advanced
                    </button>

                    <div className="hidden sm:flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                        <button className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-md text-primary">
                            <span className="material-icons-outlined text-lg">view_list</span>
                        </button>
                        <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                            <span className="material-icons-outlined text-lg">grid_view</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* List Table */}
            <div className="bg-white dark:bg-card-dark rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Institution Details</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing Model</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Main Administrator</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Size</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Settings</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                            {filteredSchools.map((school, i) => (
                                <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 rounded-2xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 border border-slate-100 dark:border-slate-700 font-black text-primary text-xl">
                                                {school.name.substring(0, 1)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{school.name}</p>
                                                <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1">
                                                    <span className="material-icons-outlined text-xs">location_on</span>
                                                    {school.city}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="inline-flex flex-col items-start min-w-[100px]">
                                            <span className={`text-sm font-bold ${school.plan === 'Enterprise' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-200'}`}>{school.plan}</span>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-1">{school.cycle} Billing</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-500">
                                                {school.admin.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{school.admin}</p>
                                                <p className="text-[10px] font-medium text-slate-400 mt-0.5">{school.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <p className="text-sm font-black text-slate-900 dark:text-white">{school.students}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Users</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${school.status === 'Active' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' :
                                            school.status === 'Pending Setup' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' :
                                                'bg-rose-50 dark:bg-rose-900/20 text-rose-600'
                                            }`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${school.status === 'Active' ? 'bg-emerald-500' :
                                                school.status === 'Pending Setup' ? 'bg-amber-500' :
                                                    'bg-rose-500'
                                                } ${school.status === 'Active' ? 'animate-pulse' : ''}`}></span>
                                            {school.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary hover:bg-primary/10 transition-all">
                                                <span className="material-icons-outlined text-lg">edit</span>
                                            </button>
                                            <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all">
                                                <span className="material-icons-outlined text-lg">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
