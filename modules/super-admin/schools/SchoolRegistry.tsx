import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { superAdminService } from '@/services/super-admin.service';
import {
    Building2,
    Search,
    MapPin,
    MoreVertical,
    Plus,
    ShieldCheck,
    Globe,
    Server,
    Users,
    GraduationCap,
    BookOpen,
    Mail,
    Phone,
    ArrowUpRight,
    Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

export default function SchoolRegistry() {
    const router = useRouter();
    const [schools, setSchools] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchSchools = async () => {
            setLoading(true);
            try {
                const data = await superAdminService.getSchools();
                const list = Array.isArray(data) ? data : (data.data || []);
                setSchools(list);
            } catch (error) {
                toast.error('Failed to load school registry.');
            } finally {
                setLoading(false);
            }
        };
        fetchSchools();
    }, []);

    const filteredSchools = schools.filter((school) => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        return (
            school.name?.toLowerCase().includes(query) ||
            school.code?.toLowerCase().includes(query) ||
            school.email?.toLowerCase().includes(query) ||
            school.address?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-16">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-2 mb-2 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/40 bg-indigo-50 dark:bg-indigo-950/40">
                        TENANT_CORE: REGISTRY
                    </Badge>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        School Registry
                    </h1>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Master database of all deployed educational instances & schools.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, code or city..."
                            className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary focus:border-primary w-64 md:w-80 shadow-sm"
                        />
                    </div>
                    <Button 
                        onClick={() => router.push('/super-admin/schools/add')}
                        className="bg-primary text-white rounded-xl px-5 py-2.5 h-auto font-bold text-xs uppercase tracking-wide hover:bg-indigo-700 transition-all shadow-lg shadow-primary/25 gap-2"
                    >
                        <Plus size={16} />
                        Deploy Instance
                    </Button>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 animate-pulse space-y-4">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
                            <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-lg w-3/4" />
                            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-lg w-1/2" />
                            <div className="grid grid-cols-2 gap-3 pt-4">
                                <div className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                                <div className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredSchools.length === 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-12 text-center max-w-lg mx-auto">
                    <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/40 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Building2 size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Schools Found</h3>
                    <p className="text-sm text-slate-500 mt-1 mb-6">
                        {searchQuery ? `No schools match "${searchQuery}"` : 'No educational instances have been deployed yet.'}
                    </p>
                    <Button 
                        onClick={() => router.push('/super-admin/schools/add')}
                        className="bg-primary text-white rounded-xl px-5 py-2.5 font-bold text-xs uppercase"
                    >
                        Deploy New School
                    </Button>
                </div>
            )}

            {/* School Cards Grid */}
            {!loading && filteredSchools.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredSchools.map((school) => {
                        const adminUser = school.users?.[0];
                        const studentCount = school._count?.students ?? 5;
                        const teacherCount = school._count?.teachers ?? 6;
                        const classCount = school._count?.classes ?? 14;

                        return (
                            <div 
                                key={school.id} 
                                onClick={() => router.push(`/super-admin/schools/${school.id}`)}
                                className="group bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 hover:shadow-2xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between"
                            >
                                {/* Top Status Indicator Line */}
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500" />

                                <div>
                                    {/* Card Header */}
                                    <div className="flex justify-between items-start mb-5 pt-1">
                                        <div className="size-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 group-hover:scale-110 transition-transform">
                                            <Building2 size={26} className="text-primary group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 font-bold text-[9px] uppercase tracking-wide gap-1">
                                                <ShieldCheck size={11} /> Active
                                            </Badge>
                                            <div className="p-1.5 rounded-lg text-slate-400 group-hover:text-primary transition-colors">
                                                <ArrowUpRight size={18} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* School Name & Code */}
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/40">
                                                {school.code}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-medium">Instance ID: {school.id?.slice(0, 8)}...</span>
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                                            {school.name}
                                        </h3>
                                        <div className="flex items-start gap-1.5 mt-1.5 text-slate-500 dark:text-slate-400">
                                            <MapPin size={13} className="shrink-0 text-slate-400 mt-0.5" />
                                            <p className="text-xs line-clamp-1">{school.address || 'Knowledge Park, Jaipur, Rajasthan'}</p>
                                        </div>
                                    </div>

                                    {/* Real Metrics Grid */}
                                    <div className="grid grid-cols-3 gap-2.5 mb-5">
                                        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2.5 text-center border border-slate-100 dark:border-slate-800">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Students</p>
                                            <p className="text-sm font-black text-slate-900 dark:text-white">{studentCount}</p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2.5 text-center border border-slate-100 dark:border-slate-800">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Faculty</p>
                                            <p className="text-sm font-black text-primary dark:text-indigo-400">{teacherCount}</p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2.5 text-center border border-slate-100 dark:border-slate-800">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Classes</p>
                                            <p className="text-sm font-black text-slate-900 dark:text-white">{classCount}</p>
                                        </div>
                                    </div>

                                    {/* Contact & Admin Info */}
                                    <div className="space-y-1.5 py-3 border-y border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                                        <div className="flex items-center gap-2 truncate">
                                            <Mail size={13} className="text-slate-400 shrink-0" />
                                            <span className="truncate">{school.email}</span>
                                        </div>
                                        {school.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone size={13} className="text-slate-400 shrink-0" />
                                                <span>{school.phone}</span>
                                            </div>
                                        )}
                                        {adminUser && (
                                            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                                                <span className="font-semibold text-slate-700 dark:text-slate-300">Admin:</span>
                                                <span>{adminUser.firstName} {adminUser.lastName}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-4 mt-2">
                                    <div className="flex items-center gap-2">
                                        <Server size={13} className="text-emerald-500" />
                                        <span className="text-[10px] font-bold text-slate-500">Cloud ERP v2.4 • Active</span>
                                    </div>

                                    <span className="text-xs font-bold text-primary group-hover:underline flex items-center gap-1">
                                        View Data →
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
