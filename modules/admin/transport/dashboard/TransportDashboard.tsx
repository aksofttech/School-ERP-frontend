import React from 'react';
import { useState } from 'react';
import Head from 'next/head';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import { USER_ROLES } from '@/utils/role-config';
import { 
    Bus, 
    Route, 
    Users, 
    Wrench, 
    Plus, 
    Search, 
    MapPin, 
    Clock, 
    ShieldCheck, 
    MoreVertical,
    ChevronRight,
    ArrowUpRight,
    Filter,
    Navigation,
    User as UserIcon,
    AlertCircle
} from 'lucide-react';

export default function TransportDashboard() {
    const [searchTerm, setSearchTerm] = useState('');
    
    const routes = [
        {
            id: 'RT-001',
            name: 'North Sector Alpha',
            time: '07:30 AM - 08:45 AM',
            driverName: 'John Doe',
            driverAvatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop',
            busNo: 'BUS-104',
            capacity: 48,
            totalCapacity: 60,
            status: 'On Route',
            type: 'Primary',
            color: 'emerald'
        },
        {
            id: 'RT-002',
            name: 'East Lake Meridian',
            time: '07:15 AM - 08:30 AM',
            driverName: 'Mike Smith',
            driverAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
            busNo: 'BUS-202',
            capacity: 58,
            totalCapacity: 60,
            status: 'Completed',
            type: 'Secondary',
            color: 'blue'
        },
        {
            id: 'RT-003',
            name: 'Downtown Central',
            time: '07:45 AM - 09:00 AM',
            driverName: 'Unassigned',
            driverAvatar: '',
            busNo: 'BUS-909',
            capacity: 0,
            totalCapacity: 60,
            status: 'Maintenance',
            type: 'Special',
            color: 'rose'
        },
        {
            id: 'RT-004',
            name: 'West Valley Express',
            time: '06:50 AM - 08:00 AM',
            driverName: 'Sarah Jenkins',
            driverAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
            busNo: 'BUS-111',
            capacity: 36,
            totalCapacity: 60,
            status: 'On Route',
            type: 'Express',
            color: 'emerald'
        }
    ];

    const stats = [
        { title: 'Fleet Strength', value: '12', icon: Bus, color: 'text-primary', bg: 'bg-primary/5', trend: 'Full Deployment' },
        { title: 'Active Routes', value: '8', icon: Route, color: 'text-emerald-500', bg: 'bg-emerald-500/5', trend: 'Live Sync' },
        { title: 'Student Load', value: '450', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/5', trend: '92% Occupancy' },
        { title: 'Maintenance', value: '1', icon: Wrench, color: 'text-rose-500', bg: 'bg-rose-500/5', trend: 'Critical Node' },
    ];

    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
                <>

                    <Head>
                        <title>Transport Logistics - EduCore</title>
                    </Head>

                    <div className="flex-1 flex flex-col gap-10 animate-in fade-in duration-700">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-primary mb-1">
                                    <Navigation size={18} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Transport Status</span>
                                </div>
                                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase tracking-tighter">Transport Management</h1>
                                <p className="text-slate-500 dark:text-slate-400 font-medium italic">
                                    Manage all school buses, routes, and drivers from here.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-primary/30 hover:-translate-y-1 active:scale-95">
                                    <Plus size={18} />
                                    <span>Add New Route</span>
                                </button>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-2xl group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 size-24 bg-slate-50 dark:bg-slate-800 rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-all duration-700" />
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.title}</p>
                                            <div className={`size-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                                <stat.icon size={20} />
                                            </div>
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className={`size-1.5 rounded-full ${stat.color === 'text-rose-500' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{stat.trend}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Inventory Table Container */}
                        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden min-h-[600px]">
                            {/* Toolbar */}
                            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row gap-8 justify-between items-center bg-slate-50/30 dark:bg-slate-900/30">
                                <div className="flex items-center gap-12 overflow-x-auto no-scrollbar w-full sm:w-auto">
                                    {['View Routes', 'Bus List', 'Service Logs', 'Maintenance'].map((tab) => (
                                        <button key={tab} className={`relative py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${tab === 'View Routes' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}>
                                            {tab}
                                            {tab === 'View Routes' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full transition-all duration-500" />}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-4 w-full sm:w-auto">
                                    <div className="relative group w-full sm:w-72">
                                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                        <input 
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white dark:bg-slate-800 border-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-primary text-xs font-bold text-slate-900 dark:text-white outline-none transition-all shadow-sm" 
                                            placeholder="Search bus or route..." 
                                        />
                                    </div>
                                    <button className="h-14 px-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-sm">
                                        <Filter size={16} className="text-primary" />
                                        <span className="hidden sm:inline">Advanced Search</span>
                                    </button>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="flex-1 overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-50 dark:border-slate-800">
                                            <th className="py-6 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-12"><input type="checkbox" className="rounded-md border-slate-200 size-4" /></th>
                                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 min-w-[300px]">Route Details</th>
                                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Driver Name</th>
                                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Bus Number</th>
                                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Students on Board</th>
                                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                                            <th className="py-6 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                        {routes.map((route) => (
                                            <tr key={route.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all cursor-pointer">
                                                <td className="py-8 px-10">
                                                    <input type="checkbox" className="rounded-md border-slate-200 size-4 group-hover:border-primary transition-colors" />
                                                </td>
                                                <td className="py-8 px-4">
                                                    <div className="flex items-center gap-5">
                                                        <div className={`size-12 rounded-2xl ${route.status === 'Maintenance' ? 'bg-rose-500/10 text-rose-500' : 'bg-primary/5 text-primary'} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                                                            <Route size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{route.name}</p>
                                                            <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                                <span className="flex items-center gap-1"><MapPin size={10} /> {route.id}</span>
                                                                <span className="flex items-center gap-1 font-bold text-primary italic"><Clock size={10} /> {route.time}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-8 px-4">
                                                    <div className="flex items-center gap-3">
                                                        {route.driverAvatar ? (
                                                            <img src={route.driverAvatar} className="size-8 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800" alt="Driver" />
                                                        ) : (
                                                            <div className="size-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                                <UserIcon size={14} />
                                                            </div>
                                                        )}
                                                        <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{route.driverName}</span>
                                                    </div>
                                                </td>
                                                <td className="py-8 px-4 text-xs font-black text-slate-500 uppercase tracking-widest">{route.busNo}</td>
                                                <td className="py-8 px-4">
                                                    <div className="flex flex-col gap-2 w-32">
                                                        <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                            <span>Load: {route.capacity} Unit</span>
                                                            <span className="text-primary">{Math.round((route.capacity/route.totalCapacity)*100)}%</span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                            <div className={`h-full ${route.status === 'Maintenance' ? 'bg-slate-300' : 'bg-primary'} rounded-full`} style={{ width: `${(route.capacity/route.totalCapacity)*100}%` }} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-8 px-4">
                                                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                                        route.status === 'On Route' ? 'bg-emerald-500/10 text-emerald-500' :
                                                        route.status === 'Maintenance' ? 'bg-rose-500/10 text-rose-500' :
                                                        'bg-blue-500/10 text-blue-500'
                                                    }`}>
                                                        <div className={`size-1.5 rounded-full ${
                                                            route.status === 'On Route' ? 'bg-emerald-500 animate-pulse' :
                                                            route.status === 'Maintenance' ? 'bg-rose-500' :
                                                            'bg-blue-500'
                                                        }`} />
                                                        {route.status}
                                                    </span>
                                                </td>
                                                <td className="py-8 px-10 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-primary transition-all hover:shadow-md"
                                                            title="View Map"
                                                        >
                                                            <Navigation size={16} />
                                                        </button>
                                                        <button 
                                                            className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-primary transition-all hover:shadow-md"
                                                        >
                                                            <MoreVertical size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Terminal */}
                             <div className="p-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between mt-auto bg-slate-50/20 dark:bg-slate-900/20">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                    Total <span className="text-slate-900 dark:text-white">{routes.length} Buses</span> in this list
                                </p>
                                <div className="flex gap-3">
                                    <button className="h-10 px-6 rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm">
                                        Export Records
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


TransportDashboard.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
