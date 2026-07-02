import React from 'react';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useStudent } from '@/hooks/useStudent';
import { studentsService } from '@/services/students.service';
import Skeleton from '@/components/ui/Skeleton';
import { Document } from '@/utils/types';
import {
  FileText,
  Search,
  CloudUpload,
  MoreVertical,
  Eye,
  Download,
  Plus,
  FileIcon,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Filter
} from 'lucide-react';

export default function StudentDocuments() {
  const router = useRouter();
  const { id } = router.query;
  const { student, loading: studentLoading } = useStudent(id);

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDocs = async () => {
      if (!id || typeof id !== 'string') return;
      setLoading(true);
      try {
        const data = await studentsService.getDocuments(id);
        setDocuments(data);
      } catch (err: any) {
        setError(err.message || 'Failed to retrieve archives.');
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [id]);

  const filteredDocs = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (studentLoading || loading) {
    return (
      <>
        
        <div className="space-y-8">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Skeleton className="h-64 w-full rounded-[2.5rem]" />
            <Skeleton className="h-64 w-full rounded-[2.5rem]" />
            <Skeleton className="h-64 w-full rounded-[2.5rem]" />
          </div>
        </div>
      
      </>
    );
  }

  const name = `${student?.firstName} ${student?.lastName}`;

  return (
    <AdminLayout title={`Archives: ${name}`}>
      <Head>
        <title>Data Archives - {name} - EduCore</title>
      </Head>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-primary mb-1">
            <FileText size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Data Vault</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Data Archives</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic">Secure vault for verified entity documentation and digital assets.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-2">
            <CloudUpload size={18} />
            Upload Asset
          </button>
        </div>
      </div>

      {/* Search & Utility Bar */}
      <div className="flex flex-col md:flex-row gap-6 mb-10 items-center">
        <div className="flex-1 w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 flex items-center shadow-sm">
          <div className="h-10 w-10 flex items-center justify-center text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search within archives..."
            className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 px-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="px-4 py-2 text-slate-400 hover:text-primary transition-colors">
            <Filter size={18} />
          </button>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500">
            Total Assets: {documents.length}
          </span>
        </div>
      </div>

      {error && (
        <div className="p-10 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-4 mb-10 animate-in fade-in zoom-in">
          <AlertCircle size={48} />
          <div className="space-y-1">
            <h3 className="text-xl font-black uppercase tracking-widest">Protocol Failure</h3>
            <p className="font-bold italic">{error}</p>
          </div>
        </div>
      )}

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDocs.map((doc) => (
          <div key={doc.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-[4rem]"></div>

            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className="h-16 w-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm">
                <FileIcon size={32} />
              </div>
              <div className="flex gap-2">
                <button className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary transition-colors flex items-center justify-center">
                  <Eye size={18} />
                </button>
                <button className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary transition-colors flex items-center justify-center">
                  <Download size={18} />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors leading-tight">{doc.name}</h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6">Archive ID: {doc.id.slice(0, 8)}...</p>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Status</span>
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                  <CheckCircle2 size={12} />
                  Verified
                </span>
              </div>
              <button className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {/* Upload Trigger Card */}
        <div className="bg-slate-50 dark:bg-slate-800/10 rounded-[2.5rem] border-4 border-dashed border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white dark:hover:bg-slate-900 hover:border-primary/30 transition-all min-h-[320px]">
          <div className="size-20 rounded-2xl bg-white dark:bg-slate-800 text-primary flex items-center justify-center mb-6 shadow-xl shadow-primary/10 group-hover:scale-110 transition-transform">
            <Plus size={40} />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Expand Archives</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest leading-relaxed px-4 opacity-60">Initialize new document upload sequence</p>
        </div>
      </div>

      {!loading && filteredDocs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="p-6 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-200">
            <FileText size={64} />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-widest uppercase">No Archives Found</h3>
          <p className="text-slate-500 italic max-w-sm">No digital assets match your current search parameters within this entity's vault.</p>
        </div>
      )}
    </AdminLayout>
  );
}


StudentDocuments.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
