import React from 'react';
import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useTeacher } from '@/hooks/useTeacher';
import { teachersService } from '@/services/teachers.service';
import { documentsService } from '@/services/documents.service';
import Skeleton from '@/components/ui/Skeleton';
import { Document as DocumentType } from '@/utils/types';
import {
    FileText,
    Upload,
    Download,
    Trash2,
    AlertCircle,
    ShieldCheck,
    Search,
    Filter,
    Plus,
    File,
    Clock,
    ExternalLink,
    MoreVertical,
    CheckCircle2
} from 'lucide-react';

export default function TeacherDocuments() {
    const router = useRouter();
    const { id } = router.query;
    const { teacher, loading: teacherLoading, error: teacherError } = useTeacher(id);
    const [documents, setDocuments] = useState<DocumentType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchDocuments = useCallback(async () => {
        if (!id || typeof id !== 'string') return;
        setLoading(true);
        setError(null);
        try {
            const data = await teachersService.getDocuments(id);
            setDocuments(data);
        } catch (err: any) {
            setError(err.message || 'Entity document retrieval protocol failed.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0] || !id || typeof id !== 'string') return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        formData.append('teacherId', id);
        formData.append('type', 'TEACHER_DOCUMENT');

        try {
            await documentsService.upload(formData);
            await fetchDocuments();
            // Reset input
            e.target.value = '';
        } catch (err: any) {
            setError(err.message || 'File injection sequence failed. Protocol aborted.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (docId: string) => {
        if (!confirm('Permanent data erasure initiated. Confirm deletion protocol?')) return;
        try {
            await documentsService.delete(docId);
            await fetchDocuments();
        } catch (err: any) {
            setError(err.message || 'Data erasure sequence failed.');
        }
    };

    const filteredDocs = documents.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (teacherLoading) return (
      <>
        
            <div className="space-y-8 animate-pulse">
                <div className="h-20 w-full bg-slate-100 dark:bg-slate-800 rounded-3xl" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-[2.5rem]" />)}
                </div>
            </div>
        
      </>
    );

    const teacherName = `${teacher?.firstName} ${teacher?.lastName}`;

    return (
        <AdminLayout title={`Archives: ${teacherName}`}>
            <Head>
                <title>Archives - {teacherName} - EduCore</title>
            </Head>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-primary mb-1">
                        <FileText size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Institutional Data Archives</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Faculty Archives</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium italic">Verified document repository for faculty entity {teacher?.employeeId}.</p>
                </div>
                <div className="flex gap-4">
                    <label className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50">
                        {uploading ? <Clock className="animate-spin" size={18} /> : <Plus size={18} />}
                        {uploading ? 'Injecting Data...' : 'Initialize Upload'}
                        <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
                    </label>
                </div>
            </div>

            {error && (
                <div className="p-6 rounded-[2rem] bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center gap-4 mb-10 animate-in slide-in-from-top-4">
                    <AlertCircle size={24} />
                    <p className="text-sm font-bold tracking-tight">{error}</p>
                </div>
            )}

            {/* Filter & Search Bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 mb-10 flex flex-col md:flex-row gap-4 shadow-sm">
                <div className="flex-1 relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search archives by identifier..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>
                <button className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-transparent hover:border-slate-300 dark:hover:border-slate-600">
                    <Filter size={16} />
                    Protocol Filter
                </button>
            </div>

            {/* Documents Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-64 rounded-[2.5rem]" />)}
                </div>
            ) : filteredDocs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredDocs.map((doc) => (
                        <div key={doc.id} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-2 transition-all relative overflow-hidden">
                            {/* Background Accent */}
                            <div className="absolute -top-10 -right-10 size-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <FileText size={28} />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                    <button
                                        onClick={() => handleDelete(doc.id)}
                                        className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/10"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1 mb-6">
                                <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight truncate group-hover:text-primary transition-colors" title={doc.name}>
                                    {doc.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                        {doc.type.split('.').pop()?.toUpperCase() || 'DATA'}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 italic">
                                        {doc.size ? (doc.size / (1024 * 1024)).toFixed(2) : '0.00'} MB
                                    </span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Clock size={12} />
                                    <span className="text-[10px] font-black uppercase tracking-tight">
                                        {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'ARCHIVED'}
                                    </span>
                                </div>
                                <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest hover:underline"
                                >
                                    Retrieve
                                    <ExternalLink size={12} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-20 flex flex-col items-center text-center space-y-8 shadow-sm">
                    <div className="size-32 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-200 shadow-2xl relative">
                        <File size={64} />
                        <div className="absolute -bottom-2 -right-2 size-10 bg-white dark:bg-slate-900 border-4 border-slate-50 dark:border-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                            <Plus size={18} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest">No Archival Data Found</h3>
                        <p className="text-slate-500 italic max-w-sm">The institutional repository currently contains no verified entities for this faculty member.</p>
                    </div>
                    <label className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 active:scale-95 transition-all cursor-pointer">
                        Initialize Archival Sequence
                        <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
                    </label>
                </div>
            )}

            {/* Security Advisory */}
            <div className="mt-20 p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center gap-6">
                <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                    <ShieldCheck size={32} />
                </div>
                <div className="flex-1 space-y-1">
                    <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Security Advisory Protocol</h4>
                    <p className="text-sm text-slate-500 italic">All archival uploads are subject to real-time heuristic scanning. Ensure entities comply with institutional data encryption standards.</p>
                </div>
                <button className="px-6 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-800">
                    Review Policy
                </button>
            </div>

        </AdminLayout>
    );
}


TeacherDocuments.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
