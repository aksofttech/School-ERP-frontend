import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import SuperAdminLayout from '@/components/layouts/SuperAdminLayout';

export default function AddUser() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    return (
        <SuperAdminLayout>
            <Head>
                <title>Provision New Entity - EduCore</title>
            </Head>

            <div className="flex flex-col gap-1 pb-6">
                <nav className="flex items-center gap-2 text-sm mb-4 text-slate-500 dark:text-slate-400">
                    <span className="hover:text-primary transition-colors cursor-pointer">Super Admin</span>
                    <span className="material-icons-round text-[16px]">chevron_right</span>
                    <span className="hover:text-primary transition-colors cursor-pointer" onClick={() => router.push('/super-admin/users')}>Identity Directory</span>
                    <span className="material-icons-round text-[16px]">chevron_right</span>
                    <span className="font-medium text-slate-900 dark:text-white underline decoration-primary decoration-2 underline-offset-4">Provision Entity</span>
                </nav>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="flex flex-col gap-1">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Provision Identity</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Inject a new authenticated entity into the global system directory.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => router.back()} className="px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all active:scale-95">
                        Cancel
                    </button>
                    <button className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95 transition-all">
                        <span className="material-icons-round text-lg mr-2">verified_user</span>
                        Finalize Activation
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-20">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-card-dark rounded-[2.5rem] border border-slate-200 dark:border-slate-700 p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                            <span className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                                <span className="material-icons-round">person_add_alt</span>
                            </span>
                            Authentication Profile
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Display Name</label>
                                <input className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none shadow-inner" placeholder="e.g. Dr. Julian Bashir" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">System Email</label>
                                <input className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none shadow-inner" placeholder="julian@system.edu" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Primary Role</label>
                                <select className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none shadow-inner appearance-none">
                                    <option>Super Administrator</option>
                                    <option>School Admin</option>
                                    <option>Support Staff</option>
                                    <option>Auditor</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-card-dark rounded-[2.5rem] border border-slate-200 dark:border-slate-700 p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                            <span className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                <span className="material-icons-round">security</span>
                            </span>
                            Access Protocols
                        </h2>
                        <div className="space-y-6">
                            {[
                                { title: 'Global Directory Access', desc: 'Permission to view and search all entities' },
                                { title: 'Vault Decryption', desc: 'Authorization to view sensitive license data' },
                                { title: 'System Auditing', desc: 'Ability to export and review security logs' },
                            ].map((perm, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-transparent hover:border-primary/50 transition-all group">
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">{perm.title}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{perm.desc}</p>
                                    </div>
                                    <div className="h-6 w-11 bg-slate-200 dark:bg-slate-800 rounded-full p-1 cursor-pointer">
                                        <div className="h-4 w-4 bg-white rounded-full shadow-sm"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-slate-900 dark:bg-slate-800 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                        <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                            <span className="material-icons-round text-primary">info</span>
                            Advisory
                        </h3>
                        <p className="text-slate-400 font-medium text-sm leading-relaxed mb-6">Provisioning a new super-admin entity grants total system control. Use extreme caution when granting these protocols.</p>
                        <div className="h-1 bg-slate-800 w-full rounded-full">
                            <div className="h-full bg-primary w-2/3 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.8)]"></div>
                        </div>
                        <span className="material-icons-round absolute -bottom-10 -right-10 text-[10rem] text-white/5 rotate-12">manage_accounts</span>
                    </div>

                    <div className="bg-white dark:bg-card-dark rounded-[2.5rem] border border-slate-200 dark:border-slate-700 p-10">
                        <div className="flex flex-col items-center">
                            <div className="h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-300 mb-6 border-4 border-dashed border-slate-200 dark:border-slate-800">
                                <span className="material-icons-round text-4xl">add_a_photo</span>
                            </div>
                            <button className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-transform">
                                Upload Photo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
