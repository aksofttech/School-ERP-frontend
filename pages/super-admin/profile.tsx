import Head from 'next/head';
import { useState } from 'react';
import SuperAdminLayout from '@/components/layouts/SuperAdminLayout';

export default function SuperAdminProfile() {
    const [activeTab, setActiveTab] = useState('Overview');

    return (
        <SuperAdminLayout>
            <Head>
                <title>My Profile - EduCore</title>
            </Head>

            <div className="flex flex-col gap-1 pb-6">
                <nav className="flex items-center gap-2 text-sm mb-4 text-slate-500 dark:text-slate-400">
                    <span className="hover:text-primary transition-colors cursor-pointer">Super Admin</span>
                    <span className="material-icons-round text-[16px]">chevron_right</span>
                    <span className="font-medium text-slate-900 dark:text-white underline decoration-primary decoration-2 underline-offset-4">Administrative Profile</span>
                </nav>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="flex flex-col gap-1">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Security & Identity</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your administrative credentials and personal system preferences.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
                        <span className="material-icons-round text-lg text-slate-400">key</span>
                        Credential Reset
                    </button>
                    <button className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95 transition-all">
                        <span className="material-icons-round text-lg">edit</span>
                        Modify Identity
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Side: Profile Sidebar */}
                <div className="w-full lg:w-80 flex flex-col gap-6">
                    <div className="bg-white dark:bg-card-dark rounded-[2.5rem] border border-slate-200 dark:border-slate-700 p-8 text-center relative overflow-hidden group shadow-2xl shadow-slate-200/50 dark:shadow-none">
                        <div className="relative z-10">
                            <div className="relative inline-block mb-6">
                                <div className="h-32 w-32 rounded-[2.5rem] bg-indigo-500/10 flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden">
                                    <span className="material-icons-round text-6xl text-indigo-500">account_circle</span>
                                </div>
                                <button className="absolute -bottom-2 -right-2 h-10 w-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                                    <span className="material-icons-round text-lg">photo_camera</span>
                                </button>
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Eleanor Vance</h2>
                            <p className="text-xs font-black uppercase tracking-widest text-primary mb-4">Master Administrator</p>
                            <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest mx-auto w-fit">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Online Status
                            </div>
                        </div>
                        {/* Decorative Background */}
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-500/5 to-primary/5 -z-0"></div>
                    </div>

                    <div className="bg-white dark:bg-card-dark rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 space-y-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Quick Stats</h3>
                        {[
                            { label: 'Login Streak', value: '12 Days', icon: 'local_fire_department', color: 'orange' },
                            { label: 'Security Level', value: 'Elevated', icon: 'verified_user', color: 'emerald' },
                            { label: 'Notifications', value: '4 New', icon: 'notifications_paused', color: 'blue' },
                        ].map((stat, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                                <div className={`h-10 w-10 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-600 flex items-center justify-center`}>
                                    <span className="material-icons-round text-xl">{stat.icon}</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{stat.label}</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Navigation & Content */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {['Overview', 'Security Audit', 'Activity History', 'Preferences'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl' : 'bg-white dark:bg-slate-800/50 text-slate-500 border border-slate-100 dark:border-slate-800 hover:bg-slate-50'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Active Content Area */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Info Block 1 */}
                        <div className="bg-white dark:bg-card-dark rounded-[2.5rem] border border-slate-200 dark:border-slate-700 p-8 shadow-xl shadow-slate-200/40 dark:shadow-none group">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">Professional Identity</h3>
                                <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary transition-all">
                                    <span className="material-icons-round text-xl">edit</span>
                                </button>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Legal Signature</p>
                                    <p className="text-base font-bold text-slate-900 dark:text-white">Eleanor Vance</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">System Identifier</p>
                                    <p className="text-base font-bold text-slate-900 dark:text-white font-mono">SA-9021-XRT</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Primary Department</p>
                                    <p className="text-base font-bold text-slate-900 dark:text-white">Administrative HQ - Region Alpha</p>
                                </div>
                            </div>
                        </div>

                        {/* Info Block 2 */}
                        <div className="bg-white dark:bg-card-dark rounded-[2.5rem] border border-slate-200 dark:border-slate-700 p-8 shadow-xl shadow-slate-200/40 dark:shadow-none">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">Communication Node</h3>
                                <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary transition-all">
                                    <span className="material-icons-round text-xl">settings</span>
                                </button>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                        <span className="material-icons-round">alternate_email</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Gateway</p>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">eleanor.v@system.edu</p>
                                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">Verified</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                        <span className="material-icons-round">stay_primary_portrait</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile Sync</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">+1 (212) 902-1823</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Ledger Block */}
                        <div className="md:col-span-2 bg-slate-900 dark:bg-slate-800/50 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="material-icons-round text-primary-hover">security</span>
                                        <h3 className="text-2xl font-black">Multi-Factor Protocol</h3>
                                    </div>
                                    <p className="text-slate-400 font-medium max-w-md">Your account is currently protected by biometric and hardware-based secondary authentication protocols.</p>
                                </div>
                                <div className="flex gap-4">
                                    <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm shadow-xl hover:scale-105 transition-transform active:scale-95">Update Keys</button>
                                    <button className="px-6 py-3 bg-slate-800 border border-slate-700 text-white rounded-xl font-bold text-sm hover:bg-slate-700 transition-all">Audit Logs</button>
                                </div>
                            </div>
                            {/* Visual Accents */}
                            <div className="absolute top-0 right-0 h-full w-48 bg-gradient-to-l from-primary/10 to-transparent"></div>
                            <span className="material-icons-round absolute -bottom-10 -right-10 text-[10rem] text-white/5 rotate-12">shield</span>
                        </div>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
