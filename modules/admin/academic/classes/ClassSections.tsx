import { useState, useEffect } from 'react';
import {
    Building,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Activity,
    UserCheck,
    ShieldCheck,
    ChevronRight,
    Zap,
    Users,
    Layers,
    Clock,
    ArrowRight,
    TrendingUp,
    AlertCircle
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useClasses } from '@/hooks/useClasses';
import { classesService } from '@/services/classes.service';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';
import { toast } from 'react-hot-toast';

const sectionSchema = z.object({
    name: z.string().min(1, 'Section name is required'),
    capacity: z.number().min(1, 'Capacity is required'),
});

type SectionFormValues = z.infer<typeof sectionSchema>;

export default function ClassSections({ classId }: { classId: string }) {
    const [sections, setSections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [activeTab, setActiveTab] = useState<'matrix' | 'create'>('matrix');

    const { register, handleSubmit, reset } = useForm<SectionFormValues>({
        resolver: zodResolver(sectionSchema),
    });

    const fetchSections = async () => {
        setLoading(true);
        try {
            const data = await classesService.getSections(classId);
            setSections(data);
        } catch (error: any) {
            toast.error(error.message || 'Failed to load sections');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (classId) fetchSections();
    }, [classId]);

    const onRegister = async (data: SectionFormValues) => {
        setRegistering(true);
        try {
            await classesService.createSection({ ...data, classId });
            toast.success('Section added successfully.');
            reset();
            setActiveTab('matrix');
            fetchSections();
        } catch (error: any) {
            toast.error(error.message || 'Failed to register section');
        } finally {
            setRegistering(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-2 mb-2">
                        Class Information
                    </Badge>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Manage Sections</h1>
                    <p className="text-sm font-medium text-slate-500 italic">Add or edit sections, manage student limits, and assign class teachers.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setActiveTab('create')}
                        className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20"
                    >
                        <Plus size={18} />
                        Add New Section
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-10">
                    {activeTab === 'create' ? (
                        <div className="space-y-10">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-8">
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Add Section</h2>
                                <button onClick={() => setActiveTab('matrix')} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Back to List</button>
                            </div>
                            <form onSubmit={handleSubmit(onRegister)} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Section Name (A/B/C)</label>
                                        <input
                                            {...register('name')}
                                            placeholder="Section A / Alpha..."
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-5 px-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Student Limit (Capacity)</label>
                                        <input
                                            type="number"
                                            {...register('capacity', { valueAsNumber: true })}
                                            placeholder="40"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-5 px-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2 flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={registering}
                                        className="bg-primary hover:bg-primary/90 text-white rounded-[2rem] px-12 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95"
                                    >
                                        {registering ? <Activity size={18} className="animate-spin" /> : <Building size={18} />}
                                        Create Section
                                    </Button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="relative group max-w-md w-full">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search for a section..."
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-100 dark:ring-slate-800 focus:ring-2 focus:ring-primary transition-all"
                                    />
                                </div>
                                <Button variant="secondary" className="rounded-xl px-6 py-4 h-auto font-black text-[10px] uppercase tracking-widest gap-2 border-2 text-slate-400">
                                    <Filter size={14} />
                                    Manage Sections
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {loading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <Skeleton key={i} className="h-64 rounded-[2.5rem]" />
                                    ))
                                ) : sections.length === 0 ? (
                                    <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border-4 border-dashed border-slate-100 dark:border-slate-800">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="size-20 rounded-full bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-slate-200">
                                                <Building size={40} />
                                            </div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">No sections found for this class.</p>
                                        </div>
                                    </div>
                                ) : (
                                    sections.map((section) => (
                                        <div key={section.id} className="bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-slate-50 dark:border-slate-800 p-10 space-y-8 hover:border-primary transition-all shadow-xl group cursor-pointer overflow-hidden relative">
                                            <div className="flex justify-between items-start relative z-10">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">SECTION {section.name}</h3>
                                                        <Badge color="emerald" className="bg-emerald-500/10 text-emerald-600 border-none text-[8px] font-black uppercase tracking-widest px-3">
                                                            SYNCED
                                                        </Badge>
                                                    </div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Class Section</p>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button className="size-10 rounded-2xl hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 dark:border-slate-800">
                                                            <MoreVertical size={20} />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl">
                                                        <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
                                                            <UserCheck size={16} className="text-primary" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Assign Class Teacher</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
                                                            <Activity size={16} className="text-indigo-500" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">View Attendance</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                                <div className="bg-slate-50 dark:bg-slate-800/80 p-6 rounded-[2rem] flex flex-col items-center gap-3 border border-slate-100 dark:border-slate-800">
                                                    <Users size={24} className="text-primary" />
                                                    <div className="text-center">
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Students</p>
                                                        <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase">{section._count?.students || 0} Students</p>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-50 dark:bg-slate-800/80 p-6 rounded-[2rem] flex flex-col items-center gap-3 border border-slate-100 dark:border-slate-800">
                                                    <Zap size={24} className="text-amber-500" />
                                                    <div className="text-center">
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Capacity</p>
                                                        <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase">{section.capacity} LIMIT</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between relative z-10">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <ShieldCheck size={14} className="text-emerald-500" />
                                                    Validated
                                                </p>
                                                <span className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                                                    View Section
                                                    <ChevronRight size={14} />
                                                </span>
                                            </div>

                                            <div className="absolute -right-8 -bottom-8 size-32 bg-emerald-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all"></div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
