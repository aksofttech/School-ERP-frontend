import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Activity,
    Calendar,
    Clock,
    ChevronRight,
    Zap,
    BookOpen,
    ArrowRight,
    Download,
    File,
    FileText,
    Image as ImageIcon,
    Film,
    Music,
    Archive,
    ShieldCheck,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { documentsService } from '@/services/documents.service';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

export default function StudentDownloads() {
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const data = await documentsService.getAll({});
                setDocuments(data.data || data);
            } catch (error: any) {
                toast.error('Failed to synchronize digital resource nodes.');
            } finally {
                setLoading(false);
            }
        };
        fetchDocuments();
    }, []);

    const getFileIcon = (type: string) => {
        if (type.includes('pdf')) return <FileText className="text-rose-500" />;
        if (type.includes('image')) return <ImageIcon className="text-blue-500" />;
        if (type.includes('video')) return <Film className="text-purple-500" />;
        if (type.includes('audio')) return <Music className="text-amber-500" />;
        if (type.includes('zip')) return <Archive className="text-slate-500" />;
        return <File className="text-slate-400" />;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-2 mb-2 text-primary">
                        RESOURCE_CORE: DIGITAL_ARCHIVE
                    </Badge>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Downloads Center</h1>
                    <p className="text-sm font-medium text-slate-500 italic">Access study materials, circulars, and institutional documents securely.</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-slate-50 dark:border-slate-800 shadow-xl">
                        <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black">
                            <Download size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[7px] font-black uppercase tracking-widest text-slate-400">Resources</span>
                            <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase">Active</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-100 dark:border-slate-800 pb-8">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Archive Registry</h2>
                        <div className="flex gap-4">
                            <div className="relative group">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search Archive..."
                                    className="bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-3 pl-12 pr-6 text-xs font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-100 dark:ring-slate-800 focus:ring-2 focus:ring-primary transition-all shadow-inner"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-32 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/50 animate-pulse" />
                            ))
                        ) : (
                            documents.length > 0 ? (
                                documents.map((doc) => (
                                    <div key={doc.id} className="group relative overflow-hidden bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-[2.5rem] p-6 hover:border-primary/20 transition-all hover:shadow-2xl">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-slate-900 transition-colors shadow-sm">
                                                {getFileIcon(doc.type || 'file')}
                                            </div>
                                            <Badge variant="outline" className="text-[7px] font-black uppercase tracking-widest border-none bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5">
                                                {(doc.size / 1024).toFixed(1)} KB
                                            </Badge>
                                        </div>

                                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1 truncate pr-8">{doc.name}</h3>
                                        <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mb-6">Uploaded: {new Date(doc.createdAt || Date.now()).toLocaleDateString()}</p>

                                        <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">v1.0</span>
                                            <Button variant="ghost" className="size-8 rounded-full p-0 hover:bg-primary hover:text-white transition-colors">
                                                <Download size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-3 flex flex-col items-center justify-center p-20 gap-4 opacity-30 italic">
                                    <Archive size={48} />
                                    <p className="text-[10px] font-black uppercase tracking-widest">No digital resources currently available for download.</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        CONTENT_DELIVERY_NETWORK_ACTIVE
                    </p>
                </div>
            </div>
        </div>
    );
}
