import React from 'react';
import Head from 'next/head';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import { USER_ROLES } from '@/utils/role-config';

export default function ReportsDashboard() {
    const students = [
        { id: 1, name: 'John Doe', rollNo: '10A01', status: 'Ready', statusColor: 'green' },
        { id: 2, name: 'Jane Smith', rollNo: '10A02', status: 'Ready', statusColor: 'green' },
        { id: 3, name: 'Robert Johnson', rollNo: '10A03', status: 'Missing Grades', statusColor: 'yellow' },
        { id: 4, name: 'Emily Davis', rollNo: '10A04', status: 'Ready', statusColor: 'green' },
        { id: 5, name: 'Michael Wilson', rollNo: '10A05', status: 'Ready', statusColor: 'green' },
    ];

    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
                <>

                    <Head>
                        <title>Report Card Generation - School ERP</title>
                    </Head>

                    <div className="flex flex-col gap-6 h-full overflow-hidden">
                        {/* Page Header */}
                        <div className="flex flex-wrap justify-between items-center gap-4 shrink-0">
                            <div>
                                <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">Report Card Generation</h1>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Configure, preview, and generate student report cards.</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 cursor-pointer rounded-lg h-9 px-4 bg-white dark:bg-[#1e2a36] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">history</span>
                                    <span className="truncate">History</span>
                                </button>
                                <button className="flex items-center gap-2 cursor-pointer rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold shadow-md hover:bg-blue-600 transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">print</span>
                                    <span className="truncate">Bulk Generate</span>
                                </button>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="flex-1 overflow-auto">
                            <div className="grid grid-cols-12 gap-6 h-full min-h-[800px]">
                                {/* Left Panel: Filters & Student List */}
                                <div className="col-span-12 xl:col-span-5 flex flex-col gap-6">
                                    {/* Filter Configuration Card */}
                                    <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="material-symbols-outlined text-primary">tune</span>
                                            <h3 className="font-bold text-slate-900 dark:text-white">Configuration</h3>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <label className="flex flex-col gap-1.5">
                                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Academic Year</span>
                                                <div className="relative">
                                                    <select className="w-full appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary">
                                                        <option>2023 - 2024</option>
                                                        <option>2022 - 2023</option>
                                                    </select>
                                                    <span className="material-symbols-outlined absolute right-3 top-2.5 pointer-events-none text-slate-500">expand_more</span>
                                                </div>
                                            </label>
                                            <label className="flex flex-col gap-1.5">
                                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Exam Term</span>
                                                <div className="relative">
                                                    <select className="w-full appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary">
                                                        <option>Final Term</option>
                                                        <option>Mid Term</option>
                                                    </select>
                                                    <span className="material-symbols-outlined absolute right-3 top-2.5 pointer-events-none text-slate-500">expand_more</span>
                                                </div>
                                            </label>
                                            <label className="flex flex-col gap-1.5">
                                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Class</span>
                                                <div className="relative">
                                                    <select className="w-full appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary">
                                                        <option>Class 10</option>
                                                        <option>Class 9</option>
                                                    </select>
                                                    <span className="material-symbols-outlined absolute right-3 top-2.5 pointer-events-none text-slate-500">expand_more</span>
                                                </div>
                                            </label>
                                            <label className="flex flex-col gap-1.5">
                                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Section</span>
                                                <div className="relative">
                                                    <select className="w-full appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary">
                                                        <option>Section A</option>
                                                        <option>Section B</option>
                                                    </select>
                                                    <span className="material-symbols-outlined absolute right-3 top-2.5 pointer-events-none text-slate-500">expand_more</span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Student Selection List */}
                                    <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 flex-1 flex flex-col shadow-sm overflow-hidden min-h-[400px]">
                                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col gap-3">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-bold text-slate-900 dark:text-white">Student List</h3>
                                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold px-2 py-1 rounded-full">42 Students</span>
                                            </div>
                                            <div className="relative">
                                                <input className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 pl-9 pr-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 dark:text-white placeholder-slate-400" placeholder="Search by name or roll no..." />
                                                <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-500 text-[20px]">search</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 overflow-y-auto">
                                            <table className="w-full text-left text-sm">
                                                <thead className="bg-slate-50 dark:bg-slate-900 sticky top-0 z-10 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                                    <tr>
                                                        <th className="px-4 py-3 w-10">
                                                            <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary bg-transparent" />
                                                        </th>
                                                        <th className="px-4 py-3">Name</th>
                                                        <th className="px-4 py-3 text-right">Roll No</th>
                                                        <th className="px-4 py-3 text-center">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                                    {students.map((student) => (
                                                        <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                                                            <td className="px-4 py-3">
                                                                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary bg-transparent" defaultChecked={student.status === 'Ready'} />
                                                            </td>
                                                            <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{student.name}</td>
                                                            <td className="px-4 py-3 text-right text-slate-500 dark:text-slate-400">{student.rollNo}</td>
                                                            <td className="px-4 py-3 text-center">
                                                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-${student.statusColor}-50 text-${student.statusColor}-700 ring-1 ring-inset ring-${student.statusColor}-600/20 dark:bg-${student.statusColor}-900/30 dark:text-${student.statusColor}-300`}>{student.status}</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Panel: Preview */}
                                <div className="col-span-12 xl:col-span-7 flex flex-col gap-6">
                                    <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex flex-wrap items-center gap-6 shadow-sm">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-[20px]">visibility</span>
                                            Show:
                                        </span>
                                        <label className="inline-flex items-center cursor-pointer gap-2">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Attendance</span>
                                        </label>
                                        <label className="inline-flex items-center cursor-pointer gap-2">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Remarks</span>
                                        </label>
                                        <div className="flex-1"></div>
                                        <div className="flex gap-2">
                                            <button className="text-slate-500 hover:text-primary transition-colors p-1" title="Refresh Preview">
                                                <span className="material-symbols-outlined">refresh</span>
                                            </button>
                                            <button className="text-slate-500 hover:text-primary transition-colors p-1" title="Fullscreen">
                                                <span className="material-symbols-outlined">fullscreen</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Live Preview Area */}
                                    <div className="flex-1 bg-slate-200/50 dark:bg-[#15202b] rounded-xl border border-slate-200 dark:border-slate-700 flex justify-center p-8 overflow-y-auto relative shadow-inner">
                                        <div className="absolute top-4 right-4 z-10">
                                            <span className="bg-black/75 text-white text-xs px-2 py-1 rounded backdrop-blur">Live Preview: John Doe</span>
                                        </div>

                                        {/* The Report Card Document */}
                                        <div className="bg-white w-full max-w-[650px] min-h-[800px] shadow-lg p-10 flex flex-col gap-8 text-slate-900">
                                            {/* Header */}
                                            <div className="flex justify-between items-center border-b-2 border-primary pb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                        <span className="material-symbols-outlined text-3xl">school</span>
                                                    </div>
                                                    <div>
                                                        <h1 className="text-2xl font-bold text-primary">Green Valley High School</h1>
                                                        <p className="text-sm text-gray-500">123 Education Lane, Springfield</p>
                                                        <p className="text-sm text-gray-500">Phone: (555) 123-4567</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <h2 className="text-xl font-bold uppercase tracking-wide text-gray-800">Report Card</h2>
                                                    <p className="text-sm font-medium text-gray-600 mt-1">Academic Year: 2023-2024</p>
                                                </div>
                                            </div>

                                            {/* Student Details */}
                                            <div className="grid grid-cols-2 gap-x-8 gap-y-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                                                <div className="flex justify-between border-b border-gray-200 pb-1">
                                                    <span className="text-sm font-semibold text-gray-500">Student Name</span>
                                                    <span className="text-sm font-bold">John Doe</span>
                                                </div>
                                                <div className="flex justify-between border-b border-gray-200 pb-1">
                                                    <span className="text-sm font-semibold text-gray-500">Roll Number</span>
                                                    <span className="text-sm font-bold">10A01</span>
                                                </div>
                                                <div className="flex justify-between border-b border-gray-200 pb-1">
                                                    <span className="text-sm font-semibold text-gray-500">Class & Section</span>
                                                    <span className="text-sm font-bold">10 - A</span>
                                                </div>
                                                <div className="flex justify-between border-b border-gray-200 pb-1">
                                                    <span className="text-sm font-semibold text-gray-500">Date of Birth</span>
                                                    <span className="text-sm font-bold">15 May 2008</span>
                                                </div>
                                                <div className="col-span-2 pt-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-semibold text-gray-500">Attendance</span>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                <div className="h-full bg-green-500 w-[92%]"></div>
                                                            </div>
                                                            <span className="text-sm font-bold">92%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Grades Table */}
                                            <div>
                                                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-primary text-lg">bar_chart</span>
                                                    Academic Performance
                                                </h3>
                                                <table className="w-full border-collapse">
                                                    <thead>
                                                        <tr className="bg-primary/5 border-b-2 border-primary/20">
                                                            <th className="text-left p-3 text-sm font-bold text-primary">Subject</th>
                                                            <th className="text-center p-3 text-sm font-bold text-primary">Max Marks</th>
                                                            <th className="text-center p-3 text-sm font-bold text-primary">Obtained</th>
                                                            <th className="text-center p-3 text-sm font-bold text-primary">Grade</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        <tr>
                                                            <td className="p-3 text-sm font-medium">Mathematics</td>
                                                            <td className="text-center p-3 text-sm text-gray-600">100</td>
                                                            <td className="text-center p-3 text-sm font-bold">95</td>
                                                            <td className="text-center p-3 text-sm font-bold text-green-600">A+</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="p-3 text-sm font-medium">Science</td>
                                                            <td className="text-center p-3 text-sm text-gray-600">100</td>
                                                            <td className="text-center p-3 text-sm font-bold">88</td>
                                                            <td className="text-center p-3 text-sm font-bold text-green-600">A</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="p-3 text-sm font-medium">English Literature</td>
                                                            <td className="text-center p-3 text-sm text-gray-600">100</td>
                                                            <td className="text-center p-3 text-sm font-bold">76</td>
                                                            <td className="text-center p-3 text-sm font-bold text-primary">B+</td>
                                                        </tr>
                                                    </tbody>
                                                    <tfoot className="bg-slate-50 border-t border-slate-200">
                                                        <tr>
                                                            <td className="p-3 text-sm font-bold">Total</td>
                                                            <td className="text-center p-3 text-sm font-bold">300</td>
                                                            <td className="text-center p-3 text-sm font-bold text-primary">259</td>
                                                            <td className="text-center p-3 text-sm font-bold">86.3%</td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>

                                            {/* Remarks */}
                                            <div className="mt-2 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                                <h4 className="text-sm font-bold text-yellow-800 mb-1">Class Teacher's Remarks</h4>
                                                <p className="text-sm text-yellow-900 italic">"John has shown excellent improvement in Mathematics this term. He is a diligent student but could participate more in class discussions."</p>
                                            </div>

                                            <div className="flex-1"></div>

                                            {/* Footer Signatures */}
                                            <div className="flex justify-between items-end mt-12 pt-8 border-t border-gray-200">
                                                <div className="text-center w-40">
                                                    <div className="h-12 w-full mb-2 flex items-end justify-center">
                                                        <span className="font-serif italic text-2xl text-blue-900 opacity-60">Sarah J.</span>
                                                    </div>
                                                    <p className="text-xs font-bold border-t border-gray-400 pt-1">Class Teacher</p>
                                                </div>
                                                <div className="text-center w-40">
                                                    <div className="h-12 w-full mb-2 flex items-end justify-center">
                                                        <span className="font-serif italic text-2xl text-blue-900 opacity-60">Dr. A. Smith</span>
                                                    </div>
                                                    <p className="text-xs font-bold border-t border-gray-400 pt-1">Principal</p>
                                                </div>
                                            </div>
                                            <div className="text-center text-[10px] text-gray-400 mt-4">
                                                Generated by School ERP System on Oct 24, 2023
                                            </div>
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


ReportsDashboard.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
