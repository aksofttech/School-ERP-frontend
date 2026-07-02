import React, { useState } from 'react';

// Mock Data
const alumniData = [
    { id: 1, name: 'Sarah Jenkins', class: '2018', role: 'Product Designer', company: 'TechFlow Inc.', status: 'Active', donation: '₹500.00', lastDonation: 'Dec 12, 2023' },
    { id: 2, name: 'Michael Chen', class: '2015', role: 'Senior Analyst', company: 'Goldman Sachs', status: 'Review', donation: '₹1,200.00', lastDonation: 'Jan 05, 2024' },
    { id: 3, name: 'Jessica Ross', class: '2020', role: 'Marketing Lead', company: 'Spotify', status: 'Active', donation: 'No donations', lastDonation: '-' },
    { id: 4, name: 'David Kim', class: '2012', role: 'Founder & CEO', company: 'StartUp Labs', status: 'Inactive', donation: '₹5,000.00', lastDonation: 'Aug 20, 2022' },
];

const upcomingEvents = [
    { id: 1, title: 'Class of 2014 Reunion', date: '15', month: 'Jun', time: '6:00 PM - 10:00 PM', location: 'Grand Hall', color: 'blue' },
    { id: 2, title: 'Networking Mixer', date: '02', month: 'Jul', time: '5:30 PM - 8:00 PM', location: 'Downtown Cafe', color: 'orange' },
];

export default function AlumniDashboard() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');

    const filteredAlumni = alumniData.filter(alumni =>
        (filter === 'All' || alumni.status === filter) &&
        (alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) || alumni.company.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="max-w-[1400px] mx-auto flex flex-col gap-6">

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { title: 'Total Alumni', value: '12,450', change: '+2.5%', sub: 'vs last year', icon: 'school', color: 'text-primary', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                        { title: 'Active Donors', value: '850', change: '+12%', sub: 'engagement', icon: 'volunteer_activism', color: 'text-primary', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                        { title: 'Upcoming Reunions', value: '3', change: null, sub: 'Next event in 14 days', icon: 'event_upcoming', color: 'text-primary', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                        { title: 'Employment Rate', value: '92%', change: '+1.2%', sub: null, icon: 'work', color: 'text-primary', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                    ].map((stat, index) => (
                        <div key={index} className="bg-white dark:bg-[#1e2936] p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
                            <div className={`absolute right-[-10px] top-[-10px] p-4 rounded-full transition-transform group-hover:scale-110 ${stat.bg}`}>
                                <span className={`material-symbols-outlined ${stat.color}`} style={{ fontSize: '48px', opacity: 0.2 }}>{stat.icon}</span>
                            </div>
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                            </div>
                            <div className="flex items-center gap-1 w-fit text-xs font-semibold">
                                {stat.change && (
                                    <span className="flex items-center px-2 py-0.5 rounded bg-green-50 dark:bg-green-900/20 text-green-600">
                                        <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                        {stat.change}
                                    </span>
                                )}
                                {stat.sub && <span className="text-slate-400 dark:text-slate-500 font-normal ml-1">{stat.sub}</span>}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Layout Split: Table & Widget */}
                <div className="flex flex-col xl:flex-row gap-6">
                    {/* Main Table Section */}
                    <div className="flex-1 bg-white dark:bg-[#1e2936] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm flex flex-col min-w-0">
                        {/* Toolbar */}
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-3 justify-between items-center">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mr-2">Alumni List</h3>
                                <div className="hidden sm:flex rounded-lg bg-slate-100 dark:bg-slate-700 p-0.5">
                                    {['All', 'Donors', 'Volunteers'].map(t => (
                                        <button
                                            key={t}
                                            className={`px-3 py-1 rounded text-xs font-semibold ${filter === (t === 'All' ? 'All' : t) ? 'bg-white dark:bg-[#1e2936] shadow text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <div className="relative flex-1 sm:w-48">
                                    <input
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search alumni..."
                                        className="w-full h-9 pl-3 pr-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e2936] text-sm text-slate-700 dark:text-slate-200 focus:ring-1 focus:ring-primary focus:border-primary"
                                    />
                                    <span className="material-symbols-outlined absolute right-2 top-1.5 text-slate-500 pointer-events-none text-[20px]">search</span>
                                </div>
                                <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700">
                                    <span className="material-symbols-outlined">filter_list</span>
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                                        <th className="p-4 w-10"><input className="rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" /></th>
                                        <th className="p-4">Name & Class</th>
                                        <th className="p-4">Current Role</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Last Donation</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {filteredAlumni.map((alum) => (
                                        <tr key={alum.id} className="group hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="p-4"><input className="rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" /></td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 font-bold text-sm">
                                                        {alum.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white text-sm">{alum.name}</p>
                                                        <p className="text-xs text-slate-500">Class of {alum.class}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white">{alum.role}</p>
                                                <p className="text-xs text-slate-500">{alum.company}</p>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${alum.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                        alum.status === 'Review' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${alum.status === 'Active' ? 'bg-green-600' :
                                                            alum.status === 'Review' ? 'bg-amber-600' :
                                                                'bg-slate-500'
                                                        }`}></span>
                                                    {alum.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <p className={`text-sm font-medium ${alum.donation.includes('₹') ? 'text-slate-900 dark:text-white' : 'text-slate-400 italic'}`}>{alum.donation}</p>
                                                {alum.lastDonation !== '-' && <p className="text-xs text-slate-500">{alum.lastDonation}</p>}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-1.5 text-slate-400 hover:text-primary rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                                                        <span className="material-symbols-outlined text-[18px]">mail</span>
                                                    </button>
                                                    <button className="p-1.5 text-slate-400 hover:text-primary rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Showing <span className="font-bold text-slate-900 dark:text-white">1-{filteredAlumni.length}</span> of <span className="font-bold text-slate-900 dark:text-white">12,450</span> results</p>
                            <div className="flex gap-2">
                                <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50">Previous</button>
                                <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">Next</button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Events & Highlights */}
                    <div className="w-full xl:w-96 flex flex-col gap-6 shrink-0">
                        {/* Upcoming Events Widget */}
                        <div className="bg-white dark:bg-[#1e2936] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-900 dark:text-white">Upcoming Events</h3>
                                <button className="text-xs font-semibold text-primary hover:text-blue-600">View All</button>
                            </div>
                            <div className="flex flex-col gap-4">
                                {upcomingEvents.map((event) => (
                                    <div key={event.id} className="flex gap-3 group cursor-pointer">
                                        <div className={`flex flex-col items-center justify-center w-12 h-14 rounded-lg bg-${event.color === 'blue' ? 'blue' : 'orange'}-50 dark:bg-${event.color === 'blue' ? 'blue' : 'orange'}-900/20 text-${event.color === 'blue' ? 'blue' : 'orange'}-600 border border-${event.color === 'blue' ? 'blue' : 'orange'}-100 dark:border-${event.color === 'blue' ? 'blue' : 'orange'}-900/30`}>
                                            <span className="text-xs font-bold uppercase">{event.month}</span>
                                            <span className="text-lg font-bold leading-none">{event.date}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{event.title}</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                {event.time}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">location_on</span>
                                                {event.location}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-5 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-700/50 text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                Create New Event
                            </button>
                        </div>

                        {/* Notable Alumni Widget */}
                        <div className="bg-gradient-to-br from-primary to-blue-600 rounded-xl shadow-lg p-5 text-white relative overflow-hidden">
                            <div className="absolute right-[-20px] top-[-20px] bg-white/10 p-8 rounded-full"></div>
                            <div className="absolute right-10 bottom-[-40px] bg-white/10 p-10 rounded-full"></div>
                            <h3 className="font-bold text-white mb-4 relative z-10">Notable Alumni Spotlight</h3>
                            <div className="flex items-center gap-3 mb-4 relative z-10">
                                <div className="size-12 rounded-full border-2 border-white/30 bg-primary flex items-center justify-center font-bold text-lg">ET</div>
                                <div>
                                    <p className="font-bold text-sm">Dr. Emily Thorne</p>
                                    <p className="text-xs text-blue-100">Class of 2008 • Nobel Prize Winner</p>
                                </div>
                            </div>
                            <p className="text-xs text-blue-100 leading-relaxed relative z-10 mb-4">
                                Recently awarded for her breakthrough research in renewable energy solutions.
                            </p>
                            <button className="w-full py-2 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-bold text-white transition-colors relative z-10 border border-white/20">
                                View Full Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
