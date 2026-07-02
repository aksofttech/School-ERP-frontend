import Head from 'next/head';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import { USER_ROLES } from '@/utils/role-config';

export default function SystemSettings() {
    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
                <AdminLayout>
                    <Head>
                        <title>System Settings - School ERP</title>
                    </Head>

                    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-20">
                        {/* Header */}
                        <div className="flex flex-col gap-4">
                            {/* Breadcrumbs */}
                            <div className="flex flex-wrap gap-2">
                                <span className="text-slate-500 text-sm font-medium">Home</span>
                                <span className="text-slate-400 text-sm font-medium">/</span>
                                <span className="text-slate-500 text-sm font-medium">Dashboard</span>
                                <span className="text-slate-400 text-sm font-medium">/</span>
                                <span className="text-slate-900 dark:text-white text-sm font-medium">System Settings</span>
                            </div>
                            {/* PageHeading */}
                            <div className="flex flex-wrap justify-between gap-4 items-end mb-2">
                                <div className="flex flex-col gap-1">
                                    <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">General Settings</h1>
                                    <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Manage global configurations for your institution.</p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-white dark:bg-[#1e2936] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                        Reset
                                    </button>
                                    <button className="flex items-center justify-center rounded-lg h-10 px-6 bg-primary text-white text-sm font-bold shadow-md hover:bg-blue-600 transition-colors gap-2">
                                        <span className="material-symbols-outlined text-[18px]">save</span>
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                            {/* Tabs */}
                            <div className="flex gap-8 border-b border-slate-200 dark:border-slate-700">
                                <button className="flex flex-col items-center justify-center border-b-[2px] border-primary text-primary pb-3 px-1">
                                    <p className="text-sm font-bold tracking-[0.015em]">School Details</p>
                                </button>
                                <button className="flex flex-col items-center justify-center border-b-[2px] border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:border-slate-300 pb-3 px-1 transition-all">
                                    <p className="text-sm font-bold tracking-[0.015em]">Localization</p>
                                </button>
                                <button className="flex flex-col items-center justify-center border-b-[2px] border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:border-slate-300 pb-3 px-1 transition-all">
                                    <p className="text-sm font-bold tracking-[0.015em]">Appearance</p>
                                </button>
                            </div>
                        </div>

                        {/* Alert/Notice Banner */}
                        <div className="w-full rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 p-4 flex items-start gap-3">
                            <span className="material-symbols-outlined text-primary mt-0.5">info</span>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Setup Required</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300">Please complete the school profile and regional settings before onboarding students.</p>
                            </div>
                        </div>

                        {/* Card 1: School Identity */}
                        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#1e2936] shadow-sm overflow-hidden">
                            {/* Card Header (Visual) */}
                            <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-end p-6">
                                <div className="absolute -bottom-8 left-6">
                                    <div className="relative group cursor-pointer">
                                        <div className="size-24 rounded-full border-4 border-white dark:border-[#1e2936] bg-white shadow-md flex items-center justify-center overflow-hidden">
                                            <span className="material-symbols-outlined text-4xl text-slate-400">school</span>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="material-symbols-outlined text-white">edit</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-12 p-6 flex flex-col gap-6">
                                <div className="flex flex-col gap-1 mb-2">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">School Identity</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Configure basic school information displayed on reports and portals.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">School Name</label>
                                        <input className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500" placeholder="e.g. Springfield High" type="text" defaultValue="Springfield International School" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Abbreviation / Code</label>
                                        <input className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500" type="text" defaultValue="SIS-2024" />
                                    </div>
                                    <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Motto / Tagline</label>
                                        <input className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500" placeholder="Excellence in Education" type="text" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Contact Information */}
                        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#1e2936] shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Contact Information</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Public contact details for emails and footers.</p>
                                </div>
                                <span className="material-symbols-outlined text-slate-300 text-4xl">contact_mail</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Official Email</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-slate-400 material-symbols-outlined text-[20px]">mail</span>
                                        <input className="w-full pl-10 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-600 dark:bg-slate-800 dark:text-white" placeholder="admin@school.edu" type="email" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-slate-400 material-symbols-outlined text-[20px]">call</span>
                                        <input className="w-full pl-10 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-600 dark:bg-slate-800 dark:text-white" placeholder="+1 (555) 000-0000" type="tel" />
                                    </div>
                                </div>
                                <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Physical Address</label>
                                    <textarea className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-600 dark:bg-slate-800 dark:text-white" placeholder="123 Education Lane, Knowledge City" rows={3}></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Regional & System */}
                        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#1e2936] shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Regional Settings</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Set default language, timezone and date formats.</p>
                                </div>
                                <span className="material-symbols-outlined text-slate-300 text-4xl">public</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Timezone</label>
                                    <select className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-600 dark:bg-slate-800 dark:text-white">
                                        <option>(GMT-08:00) Pacific Time</option>
                                        <option>(GMT-05:00) Eastern Time</option>
                                        <option defaultValue="selected">(GMT+00:00) UTC</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date Format</label>
                                    <select className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-600 dark:bg-slate-800 dark:text-white">
                                        <option>MM/DD/YYYY</option>
                                        <option defaultValue="selected">DD/MM/YYYY</option>
                                        <option>YYYY-MM-DD</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Currency</label>
                                    <select className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-600 dark:bg-slate-800 dark:text-white">
                                        <option>USD ($)</option>
                                        <option>EUR (€)</option>
                                        <option>GBP (£)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-6 border-t border-slate-100 dark:border-slate-700 pt-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-0.5">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Enable Maintenance Mode</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Prevents users from accessing the system during updates.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input className="sr-only peer" type="checkbox" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                    </div>
                </AdminLayout>
            </RoleGuard>
        </AuthGuard>
    );
}
