import React from 'react';
import Head from 'next/head';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import { USER_ROLES } from '@/utils/role-config';

export default function EventsDashboard() {
    const upcomingEvents = [
        {
            date: '15',
            month: 'Oct',
            title: 'Parent-Teacher Mtg',
            time: '10:00 AM',
            location: 'Main Hall',
            type: 'purple'
        },
        {
            date: '15',
            month: 'Oct',
            title: 'Basketball Finals',
            time: '02:00 PM',
            location: 'Sports Complex',
            type: 'amber'
        },
        {
            date: '18',
            month: 'Oct',
            title: 'Math Olympiad',
            time: '09:00 AM',
            location: 'Room 304',
            type: 'blue'
        },
        {
            date: '25',
            month: 'Oct',
            title: 'Library Cleaning',
            time: 'All Day',
            location: 'Library',
            type: 'gray'
        },
        {
            date: '31',
            month: 'Oct',
            title: 'Halloween Parade',
            time: '01:00 PM',
            location: 'Campus Grounds',
            type: 'amber'
        }
    ];

    const calendarDays = [
        // Previous month last days
        { day: 29, type: 'prev' }, { day: 30, type: 'prev' },
        // Current month
        { day: 1, type: 'curr' },
        { day: 2, type: 'curr', event: 'Faculty Meeting', eventColor: 'purple' },
        { day: 3, type: 'curr' }, { day: 4, type: 'curr' },
        { day: 5, type: 'curr', event: 'Football Tryouts', eventColor: 'amber' },
        { day: 6, type: 'curr' }, { day: 7, type: 'curr' }, { day: 8, type: 'curr' }, { day: 9, type: 'curr' },
        { day: 10, type: 'curr', event: 'Mid-Term Exams Start', eventColor: 'blue' },
        { day: 11, type: 'curr', event: 'Biology Exam', eventColor: 'blue' },
        { day: 12, type: 'curr' }, { day: 13, type: 'curr' },
        { day: 14, type: 'curr', event: 'Columbus Day', eventColor: 'emerald' },
        { day: 15, type: 'curr', hasMulti: true, events: [{ title: 'Parent-Teacher Mtg', color: 'purple' }, { title: 'Basketball Finals', color: 'amber' }] },
        { day: 16, type: 'curr' }, { day: 17, type: 'curr' },
        { day: 18, type: 'curr', event: 'Math Olympiad', eventColor: 'blue' },
        { day: 19, type: 'curr' }, { day: 20, type: 'curr' }, { day: 21, type: 'curr' }, { day: 22, type: 'curr' }, { day: 23, type: 'curr' }, { day: 24, type: 'curr' },
        { day: 25, type: 'curr', event: 'Library Cleaning', eventColor: 'gray' },
        { day: 26, type: 'curr' }, { day: 27, type: 'curr' }, { day: 28, type: 'curr' }, { day: 29, type: 'curr' }, { day: 30, type: 'curr' },
        { day: 31, type: 'curr', event: 'Halloween Parade', eventColor: 'amber' },
        // Next month
        { day: 1, type: 'next' }, { day: 2, type: 'next' }
    ];

    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
                <>

                    <Head>
                        <title>Calendar & Events - School ERP</title>
                    </Head>

                    <div className="flex flex-col gap-6 h-full overflow-hidden">
                        {/* Header */}
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-wrap items-end justify-between gap-4">
                                <div className="flex flex-col gap-1">
                                    <h2 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight">Academic Calendar</h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-base">Manage school-wide events, exams, and holidays for 2023-2024</p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-white dark:bg-[#1e2936] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                                        <span className="material-symbols-outlined text-[20px]">ios_share</span>
                                        Export
                                    </button>
                                    <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary hover:bg-blue-600 text-white text-sm font-bold transition-colors shadow-sm">
                                        <span className="material-symbols-outlined text-[20px]">add</span>
                                        Create New Event
                                    </button>
                                </div>
                            </div>

                            {/* Filter Chips */}
                            <div className="flex flex-wrap gap-3">
                                <button className="flex h-8 items-center gap-2 rounded-full bg-slate-900 text-white px-3 text-xs font-medium hover:opacity-90 transition-opacity">
                                    <span className="material-symbols-outlined text-[16px]">grid_view</span>
                                    All Events
                                </button>
                                <button className="flex h-8 items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-3 text-xs font-medium hover:bg-emerald-200 transition-colors">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    Holidays
                                </button>
                                <button className="flex h-8 items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-3 text-xs font-medium hover:bg-blue-200 transition-colors">
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                    Exams
                                </button>
                                <button className="flex h-8 items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 px-3 text-xs font-medium hover:bg-amber-200 transition-colors">
                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                    Sports
                                </button>
                                <button className="flex h-8 items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800 px-3 text-xs font-medium hover:bg-purple-200 transition-colors">
                                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                    Meetings
                                </button>
                            </div>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 flex-1 overflow-visible">
                            {/* Calendar Section */}
                            <div className="xl:col-span-3 flex flex-col gap-4">
                                {/* Calendar Controls */}
                                <div className="flex items-center justify-between bg-white dark:bg-[#1e2936] p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">October 2023</h3>
                                        <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1">
                                            <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md text-slate-500 dark:text-slate-400">
                                                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                            </button>
                                            <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md text-slate-500 dark:text-slate-400">
                                                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                            </button>
                                        </div>
                                        <button className="text-sm font-medium text-primary hover:underline">Today</button>
                                    </div>
                                    <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                                        <button className="px-3 py-1 rounded-md bg-white dark:bg-slate-700 shadow-sm text-xs font-bold text-slate-900 dark:text-white">Month</button>
                                        <button className="px-3 py-1 rounded-md text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Week</button>
                                        <button className="px-3 py-1 rounded-md text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Day</button>
                                    </div>
                                </div>

                                {/* Calendar Grid */}
                                <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col min-h-[600px]">
                                    {/* Days Header */}
                                    <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700">
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                            <div key={day} className="py-3 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">{day}</div>
                                        ))}
                                    </div>
                                    {/* Calendar Body */}
                                    <div className="grid grid-cols-7 grid-rows-5 flex-1 divide-x divide-y divide-slate-200 dark:divide-slate-700">
                                        {calendarDays.map((dayObj, idx) => (
                                            <div key={idx} className={`min-h-[100px] p-2 relative group hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${dayObj.type !== 'curr' ? 'bg-slate-50/50 dark:bg-slate-800/20' : ''}`}>
                                                <span className={`${dayObj.type !== 'curr' ? 'text-slate-400 dark:text-slate-600' : 'text-slate-700 dark:text-slate-300'} font-medium text-sm`}>{dayObj.day}</span>
                                                {dayObj.event && (
                                                    <div className="mt-1 flex flex-col gap-1">
                                                        <div className={`bg-${dayObj.eventColor}-100 dark:bg-${dayObj.eventColor}-900/40 text-${dayObj.eventColor}-700 dark:text-${dayObj.eventColor}-300 text-[10px] px-1.5 py-0.5 rounded font-medium truncate border-l-2 border-${dayObj.eventColor}-500`}>
                                                            {dayObj.event}
                                                        </div>
                                                    </div>
                                                )}
                                                {dayObj.hasMulti && dayObj.events && (
                                                    <div className="mt-1 flex flex-col gap-1">
                                                        {dayObj.events.map((ev, i) => (
                                                            <div key={i} className={`bg-${ev.color}-100 dark:bg-${ev.color}-900/40 text-${ev.color}-700 dark:text-${ev.color}-300 text-[10px] px-1.5 py-0.5 rounded font-medium truncate border-l-2 border-${ev.color}-500`}>
                                                                {ev.title}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Sidebar */}
                            <div className="xl:col-span-1 flex flex-col gap-6">
                                {/* Upcoming List */}
                                <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
                                    <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">Upcoming Events</h3>
                                        <a className="text-xs font-semibold text-primary hover:text-blue-600 cursor-pointer">View All</a>
                                    </div>
                                    <div className="flex flex-col p-2 overflow-y-auto max-h-[400px]">
                                        {upcomingEvents.map((evt, idx) => (
                                            <div key={idx} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg group cursor-pointer transition-colors flex gap-3">
                                                <div className={`flex flex-col items-center justify-center bg-${evt.type}-50 dark:bg-${evt.type}-900/20 text-${evt.type}-700 dark:text-${evt.type}-300 rounded-lg w-12 h-12 shrink-0 border border-${evt.type}-100 dark:border-${evt.type}-800`}>
                                                    <span className="text-xs font-bold uppercase">{evt.month}</span>
                                                    <span className="text-lg font-bold">{evt.date}</span>
                                                </div>
                                                <div className="flex flex-col justify-center">
                                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{evt.title}</h4>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{evt.time} • {evt.location}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Stats Card */}
                                <div className="bg-gradient-to-br from-primary to-blue-600 rounded-xl p-5 text-white shadow-lg">
                                    <h3 className="font-bold text-lg mb-1">Monthly Summary</h3>
                                    <p className="text-blue-100 text-sm mb-4">You have 12 events scheduled for October.</p>
                                    <div className="flex justify-between items-center text-center">
                                        <div>
                                            <div className="text-2xl font-black">4</div>
                                            <div className="text-xs text-blue-100">Exams</div>
                                        </div>
                                        <div className="h-8 w-px bg-white/20"></div>
                                        <div>
                                            <div className="text-2xl font-black">2</div>
                                            <div className="text-xs text-blue-100">Holidays</div>
                                        </div>
                                        <div className="h-8 w-px bg-white/20"></div>
                                        <div>
                                            <div className="text-2xl font-black">6</div>
                                            <div className="text-xs text-blue-100">Meetings</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                
</>
            </RoleGuard>
        </AuthGuard>
    );
}


EventsDashboard.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
