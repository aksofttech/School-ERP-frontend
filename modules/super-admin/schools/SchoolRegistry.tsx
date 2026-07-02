import { useState, useEffect } from 'react';
import { superAdminService } from '@/services/super-admin.service';
import {
    Building2,
    Search,
    MapPin,
    MoreVertical,
    Plus,
    ShieldCheck,
    AlertOctagon,
    Globe,
    Server
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

export default function SchoolRegistry() {
    const [schools, setSchools] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        const fetchSchools = async () => {
            setLoading(true);
            try {
                const data = await superAdminService.getSchools();
                setSchools(Array.isArray(data) ? data : (data.data || []));
            } catch (error) {
                toast.error('Failed to load tenant registry.');
            } finally {
                setLoading(false);
            }
        };
        fetchSchools();
    }, []);

    // Mock Data if API is empty
    const displaySchools = schools.length > 0 ? schools : [
        { id: 1, name: 'Springfield High School', slug: 'springfield-high', plan: 'ENTERPRISE', region: 'US-EAST', status: 'ACTIVE', users: 1240, deployment: 'Cloud v2.4' },
        { id: 2, name: 'Riverdale Academy', slug: 'riverdale-academy', plan: 'STANDARD', region: 'EU-WEST', status: 'ACTIVE', users: 850, deployment: 'Cloud v2.4' },
        { id: 3, name: 'Tech Valley Institute', slug: 'tech-valley', plan: 'PRO', region: 'US-WEST', status: 'SUSPENDED', users: 2400, deployment: 'Cloud v2.3' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-2 mb-2 text-indigo-500 border-indigo-200 bg-indigo-50">
                        TENANT_CORE: REGISTRY
                    </Badge>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        School Registry
                    </h1>
                    <p className="text-sm font-medium text-slate-500 italic">
                        Master database of all deployed educational instances.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search tenant..."
                            className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:ring-indigo-500 focus:border-indigo-500 w-64"
                        />
                    </div>
                    <Button className="bg-indigo-600 text-white rounded-xl px-4 py-2 h-auto font-bold text-xs uppercase tracking-wide hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 gap-2">
                        <Plus size={16} />
                        Deploy Instance
                    </Button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {displaySchools.map((school) => (
                    <div key={school.id} className="group bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 hover:shadow-2xl hover:border-indigo-500/30 transition-all cursor-pointer relative overflow-hidden">
                        {/* Status Indicator Line */}
                        <div className={`absolute top-0 left-0 w-full h-1 ${school.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'}`} />

                        <div className="flex justify-between items-start mb-6">
                            <div className="size-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform">
                                <Building2 size={24} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                            </div>
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-indigo-500">
                                <MoreVertical size={20} />
                            </Button>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1 truncate">{school.name}</h3>
                            <div className="flex items-center gap-2">
                                <Globe size={12} className="text-slate-400" />
                                <p className="text-xs font-mono text-slate-500">{school.slug}.edunexus.app</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Plan</p>
                                <p className="text-xs font-black text-indigo-600 dark:text-indigo-400">{school.plan}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Region</p>
                                <p className="text-xs font-black text-slate-700 dark:text-slate-300">{school.region}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Server size={14} className="text-emerald-500" />
                                <span className="text-[10px] font-bold text-slate-500">{school.deployment}</span>
                            </div>

                            {school.status === 'ACTIVE' ? (
                                <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold text-[9px] uppercase tracking-wide gap-1">
                                    <ShieldCheck size={10} /> Active
                                </Badge>
                            ) : (
                                <Badge className="bg-rose-50 text-rose-600 border-rose-100 font-bold text-[9px] uppercase tracking-wide gap-1">
                                    <AlertOctagon size={10} /> Suspended
                                </Badge>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
