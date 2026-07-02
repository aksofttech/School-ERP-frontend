import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { 
    School, 
    Search, 
    Bell, 
    History, 
    Printer, 
    Settings2, 
    Eye, 
    RefreshCcw, 
    Maximize2, 
    BarChart3,
    GraduationCap,
    CheckCircle2
} from 'lucide-react';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import { USER_ROLES } from '@/utils/role-config';

export default function ReportCards() {
    const [template, setTemplate] = useState('standard');

    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN, USER_ROLES.TEACHER]}>
                <AdminLayout title="Report Card Generation">
                    <Head>
                        <title>Report Card Generation - EduCore</title>
                    </Head>

                    <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-700">
                        {/* Header Area */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-primary mb-1 text-[10px] font-black uppercase tracking-[0.2em]">
                                    <School size={14} />
                                    Academic Certification
                                </div>
                                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Report Cards</h1>
                                <p className="text-slate-500 dark:text-slate-400 font-medium italic">Configure, preview, and generate student performance transcripts.</p>
                            </div>

                            <div className="flex gap-4">
                                <button className="px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2">
                                    <History size={16} className="text-primary" />
                                    Archive
                                </button>
                                <button className="px-8 py-4 bg-primary text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/30 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-2">
                                    <Printer size={16} />
                                    Bulk Dispatch
                                </button>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-12 gap-8">
                            {/* Left Panel: Configuration */}
                            <div className="col-span-12 xl:col-span-5 space-y-8">
                                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 size-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-1000" />
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                                <Settings2 size={20} />
                                            </div>
                                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Protocol Config</h3>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            {[
                                                { label: 'Academic cycle', options: ['2023 - 2024', '2022 - 2023'] },
                                                { label: 'Exam Phase', options: ['Final Term', 'Mid Term'] },
                                                { label: 'Academic Level', options: ['Class 10', 'Class 9'] },
                                                { label: 'Academic Sector', options: ['Section A', 'Section B'] },
                                            ].map((field, i) => (
                                                <div key={i} className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{field.label}</label>
                                                    <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-bold text-slate-900 dark:text-white ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all">
                                                        {field.options.map(opt => <option key={opt}>{opt}</option>)}
                                                    </select>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-10">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Template Matrix</p>
                                            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                                                {['standard', 'minimal', 'modern'].map((style) => (
                                                    <label key={style} className="cursor-pointer shrink-0 group/tmpl">
                                                        <input type="radio" name="template" value={style} checked={template === style} onChange={() => setTemplate(style)} className="sr-only" />
                                                        <div className={`w-28 h-36 rounded-2xl border-2 transition-all p-3 flex flex-col gap-2 bg-white dark:bg-slate-800 ${template === style ? 'border-primary shadow-lg shadow-primary/10' : 'border-slate-100 dark:border-slate-800 group-hover/tmpl:border-primary/30'}`}>
                                                            <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 overflow-hidden p-2 flex flex-col gap-2">
                                                                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full" />
                                                                <div className="h-1.5 w-2/3 bg-slate-200 dark:bg-slate-700 rounded-full" />
                                                                <div className="mt-auto grid grid-cols-2 gap-1">
                                                                    <div className="h-3 bg-primary/10 rounded-sm" />
                                                                    <div className="h-3 bg-primary/10 rounded-sm" />
                                                                </div>
                                                            </div>
                                                            <span className={`text-[9px] font-black text-center uppercase tracking-widest ${template === style ? 'text-primary' : 'text-slate-400'}`}>
                                                                {style}
                                                            </span>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Student Selector */}
                                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col min-h-[400px]">
                                    <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Subject Selection</h3>
                                            <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">42 Active Nodes</span>
                                        </div>
                                        <div className="relative group">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
                                            <input className="w-full bg-white dark:bg-slate-800 border-none rounded-xl pl-12 pr-6 py-4 text-xs font-bold text-slate-900 dark:text-white ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm" placeholder="Search entity by name or roll..." />
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto max-h-[400px]">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10">
                                                <tr>
                                                    <th className="px-8 py-4 w-10"><input type="checkbox" className="rounded-md border-slate-200 size-4" /></th>
                                                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Entity Name</th>
                                                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Serial</th>
                                                    <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Outcome</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                                {[
                                                    { name: 'John Doe', roll: '10A01', status: 'SYNCHRONIZED' },
                                                    { name: 'Jane Smith', roll: '10A02', status: 'PENDING' },
                                                    { name: 'Alex Vorn', roll: '10A03', status: 'SYNCHRONIZED' },
                                                ].map((student, i) => (
                                                    <tr key={i} className={`hover:bg-primary/5 transition-all cursor-pointer group ${i === 0 ? 'bg-primary/5 border-l-4 border-primary' : ''}`}>
                                                        <td className="px-8 py-6"><input type="checkbox" defaultChecked={i === 0} className="rounded-md border-slate-200 size-4" /></td>
                                                        <td className="px-4 py-6 font-black text-xs text-slate-900 dark:text-white uppercase tracking-tight">{student.name}</td>
                                                        <td className="px-4 py-6 text-right font-mono text-[10px] text-slate-400 font-bold">{student.roll}</td>
                                                        <td className="px-8 py-6 text-center">
                                                            <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${student.status === 'SYNCHRONIZED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                                {student.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel: Live Preview */}
                            <div className="col-span-12 xl:col-span-7 flex flex-col gap-8">
                                {/* Preview Controls */}
                                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-4 flex flex-wrap items-center gap-8 shadow-xl">
                                    <div className="flex items-center gap-3 pl-4">
                                        <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                            <Eye size={16} />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Live Viewport</span>
                                    </div>
                                    <div className="flex items-center gap-6 border-l border-slate-100 dark:border-slate-800 pl-8">
                                        {['Attendance', 'Remarks', 'Academic Rank'].map(opt => (
                                            <label key={opt} className="inline-flex items-center cursor-pointer gap-3 group">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="relative w-8 h-4 bg-slate-100 dark:bg-slate-800 rounded-full peer peer-checked:bg-primary transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4 shadow-inner" />
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="flex-1" />
                                    <div className="flex gap-2 pr-2">
                                        <button className="size-10 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-primary transition-all flex items-center justify-center">
                                            <RefreshCcw size={18} />
                                        </button>
                                        <button className="size-10 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-primary transition-all flex items-center justify-center">
                                            <Maximize2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Preview Canvas */}
                                <div className="flex-1 bg-slate-50 dark:bg-slate-950 rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-800 flex justify-center p-12 overflow-y-auto relative shadow-inner min-h-[800px]">
                                    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
                                        <span className="bg-slate-900 text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-2xl flex items-center gap-2">
                                            <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                            Active Profile: John Doe
                                        </span>
                                    </div>

                                    {/* The Realistic Report Card */}
                                    <div className="bg-white w-full max-w-[700px] h-fit shadow-[0_30px_100px_rgba(0,0,0,0.1)] p-16 flex flex-col gap-12 text-slate-900 rounded-sm relative overflow-hidden ring-1 ring-slate-200">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-12 translate-x-12" />
                                        
                                        {/* Header */}
                                        <div className="flex justify-between items-center border-b-4 border-slate-900 pb-10">
                                            <div className="flex items-center gap-6">
                                                <div className="size-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                                                    <GraduationCap size={44} strokeWidth={1.5} />
                                                </div>
                                                <div>
                                                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">EduCore Academy</h1>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Institutional Excellence Node</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <h2 className="text-xl font-black uppercase tracking-widest text-slate-900">Academic Transcript</h2>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 bg-slate-100 px-3 py-1 rounded-full">Phase: Final Assessment 23-24</p>
                                            </div>
                                        </div>

                                        {/* Student Info Map */}
                                        <div className="grid grid-cols-2 gap-x-12 gap-y-6 bg-slate-50/50 p-8 rounded-2xl border border-slate-100">
                                            {[
                                                { label: 'Personnel Name', value: 'John Doe' },
                                                { label: 'Serial ID', value: '10A01' },
                                                { label: 'Academic Sector', value: 'Class 10 - Section A' },
                                                { label: 'Guardian Node', value: 'Robert Doe' },
                                            ].map((attr, i) => (
                                                <div key={i} className="flex justify-between border-b border-slate-200 pb-2">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{attr.label}</span>
                                                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{attr.value}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Data Matrix */}
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 mb-2">
                                                <BarChart3 size={20} className="text-primary" />
                                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Performance Matrix</h3>
                                            </div>
                                            <table className="w-full border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-900 text-white">
                                                        <th className="text-left p-4 text-[9px] font-black uppercase tracking-widest">Academic Faculty</th>
                                                        <th className="text-center p-4 text-[9px] font-black uppercase tracking-widest">Max Threshold</th>
                                                        <th className="text-center p-4 text-[9px] font-black uppercase tracking-widest">Achieved</th>
                                                        <th className="text-center p-4 text-[9px] font-black uppercase tracking-widest">Grade Point</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {[
                                                        { sub: 'Mathematics', max: 100, obt: 95, grade: 'A+' },
                                                        { sub: 'Neural Science', max: 100, obt: 88, grade: 'A' },
                                                        { sub: 'Algorithmic Studies', max: 100, obt: 92, grade: 'A' },
                                                        { sub: 'Structural Linguistics', max: 100, obt: 84, grade: 'B+' },
                                                    ].map((row, i) => (
                                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="p-4 text-[10px] font-black text-slate-900 uppercase tracking-tight">{row.sub}</td>
                                                            <td className="text-center p-4 text-[10px] font-bold text-slate-400">{row.max}</td>
                                                            <td className="text-center p-4 text-[10px] font-black text-slate-900">{row.obt}</td>
                                                            <td className={`text-center p-4 text-[10px] font-black ${row.grade.includes('A') ? 'text-emerald-500' : 'text-primary'}`}>{row.grade}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Observer Logic */}
                                        <div className="p-8 bg-slate-900 text-white rounded-[2rem] relative overflow-hidden group">
                                            <CheckCircle2 size={100} className="absolute -right-8 -bottom-8 text-white/5 transform -rotate-12 group-hover:scale-110 transition-transform duration-700" />
                                            <h4 className="text-[9px] font-black uppercase tracking-[0.3em] mb-3 text-primary">Observer Synthesis</h4>
                                            <p className="text-xs font-medium italic leading-relaxed opacity-80">
                                                &quot;Node 10A01 demonstrates exceptional algorithmic processing capability. Consistency across computational subjects remains optimal. Recommended focus for coming cycles: Enhanced collaborative communication protocols.&quot;
                                            </p>
                                        </div>

                                        <div className="flex-1" />

                                        {/* Terminus Signatures */}
                                        <div className="flex justify-between items-end mt-12 pt-10 border-t-2 border-slate-100">
                                            <div className="text-center w-48 relative">
                                                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-16 bg-blue-900/5 blur-xl rounded-full" />
                                                <div className="h-16 w-full flex items-end justify-center pb-2">
                                                    <span className="font-serif text-3xl text-slate-400 opacity-40 italic tracking-tighter">Sarah Jenkins</span>
                                                </div>
                                                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 border-t border-slate-200 pt-3">Academic Proctor</p>
                                            </div>
                                            <div className="text-center w-48">
                                                <div className="h-16 w-full flex items-end justify-center pb-2">
                                                    <span className="font-serif text-3xl text-slate-400 opacity-40 italic tracking-tighter">Dr. Alan Turing</span>
                                                </div>
                                                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 border-t border-slate-200 pt-3">Executive Principal</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </AdminLayout>
            </RoleGuard>
        </AuthGuard>
    );
}
