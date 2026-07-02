import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import { USER_ROLES } from '@/utils/role-config';
import { communicationService } from '@/services/communication.service';
import { apiClient } from '@/utils/api-client';
import { toast } from 'react-hot-toast';
import { 
    Plus, 
    Search, 
    GraduationCap, 
    Users, 
    Globe, 
    FileEdit, 
    Trash2, 
    X, 
    Calendar, 
    Bold, 
    Italic, 
    Underline, 
    List as ListIcon, 
    ListOrdered, 
    Link2, 
    Image as ImageIcon, 
    UploadCloud, 
    FileText, 
    Send,
    AlertCircle,
    Loader2,
    CheckCircle2
} from 'lucide-react';

export default function AnnouncementsDashboard() {
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    // Fetch announcements on mount
    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await communicationService.getNotices();
            // Support both API shapes:
            // - Paginated: { data: [...], meta: {...} }
            // - Plain array: [...]
            const list = Array.isArray(response)
                ? response
                : Array.isArray((response as any)?.data)
                    ? (response as any).data
                    : [];
            setAnnouncements(list);
            if (list.length > 0 && !selectedAnnouncement) {
                // DON'T auto-select, stay in list view or wait for click
            }
        } catch (error) {
            console.error('Error fetching notices:', error);
            toast.error('Failed to load announcements');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAnnouncement = (announcement: any) => {
        setSelectedAnnouncement({
            ...announcement,
            // Ensure types match our form expectations
        });
    };

    const handleCreateNew = () => {
        setSelectedAnnouncement({
            id: null,
            title: '',
            content: '',
            audience: 'ALL',
            status: 'DRAFT',
            publishDate: new Date().toISOString().slice(0, 16),
            attachments: []
        });
    };

    const handleInputChange = (field: string, value: any) => {
        setSelectedAnnouncement((prev: any) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async (status: 'DRAFT' | 'PUBLISHED') => {
        if (!selectedAnnouncement.title || !selectedAnnouncement.content) {
            toast.error('Title and Content are required');
            return;
        }

        try {
            setSaving(true);
            
            // SANITIZE PAYLOAD: Only send fields the backend expects
            const payload = {
                title: selectedAnnouncement.title,
                content: selectedAnnouncement.content,
                audience: selectedAnnouncement.audience,
                status: status,
                // Backend validates `publishDate` as ISO 8601; `datetime-local` returns a string
                // like `YYYY-MM-DDTHH:mm` (often without timezone), so convert to full ISO.
                publishDate: selectedAnnouncement.publishDate
                    ? new Date(selectedAnnouncement.publishDate).toISOString()
                    : undefined,
                attachments: selectedAnnouncement.attachments,
                classId: selectedAnnouncement.classId
            };

            if (selectedAnnouncement.id) {
                await apiClient.patch(`/communication/notices/${selectedAnnouncement.id}`, payload);
                toast.success(status === 'PUBLISHED' ? 'Announcement Published!' : 'Draft Saved');
            } else {
                await communicationService.createNotice(payload);
                toast.success(status === 'PUBLISHED' ? 'Announcement Published and Notifications Sent!' : 'Draft Created');
            }
            
            await fetchAnnouncements();
            setSelectedAnnouncement(null);
        } catch (error: any) {
            console.error('Error saving notice:', error);
            const errorMsg = error.response?.data?.message || 'Failed to save announcement';
            toast.error(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this announcement?')) return;
        try {
            await apiClient.delete(`/communication/notices/${id}`);
            toast.success('Deleted successfully');
            fetchAnnouncements();
            setSelectedAnnouncement(null);
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'PUBLISHED': return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
            case 'DRAFT': return 'bg-amber-50 text-amber-700 ring-amber-600/20';
            case 'SCHEDULED': return 'bg-blue-50 text-blue-700 ring-blue-600/20';
            default: return 'bg-slate-50 text-slate-700 ring-slate-600/20';
        }
    };

    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
                <>

                    <Head>
                        <title>Announcements | School ERP</title>
                    </Head>
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[600px] p-6 pt-2">
                        {/* LEFT COLUMN: List View */}
                        <div className="lg:col-span-4 flex flex-col bg-white dark:bg-[#1e2936] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden h-[calc(100vh-250px)]">
                            {/* List Header */}
                            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-lg text-slate-800 dark:text-white uppercase tracking-tight">All Posts</h3>
                                    <button onClick={handleCreateNew} className="flex items-center justify-center rounded-lg h-9 px-3 bg-primary text-white hover:bg-blue-600 transition-colors gap-2 text-xs font-black uppercase shadow-sm">
                                        <Plus size={16} />
                                        <span>Add New</span>
                                    </button>
                                </div>
                                {/* Search & Filter */}
                                <div className="flex flex-col gap-3">
                                    <div className="relative group">
                                        <Search size={16} className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <input
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-2 pl-9 pr-3 text-xs font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400"
                                            placeholder="Search title..."
                                            type="text"
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* List Items */}
                            <div className="overflow-y-auto custom-scroll flex-1 p-2 space-y-2 bg-slate-50/50 dark:bg-slate-800/50">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
                                        <Loader2 className="animate-spin" size={24} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Loading Posts...</span>
                                    </div>
                                ) : announcements.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-400 text-center px-6">
                                        <AlertCircle size={24} strokeWidth={1.5} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">No announcements found</span>
                                    </div>
                                ) : announcements.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                                    <div key={item.id} onClick={() => handleSelectAnnouncement(item)} className={`group cursor-pointer p-4 rounded-lg bg-white dark:bg-slate-900 border shadow-sm transition-all relative ${selectedAnnouncement?.id === item.id ? 'border-primary ring-1 ring-primary/20' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'}`}>
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ring-1 ring-inset ${getStatusStyles(item.status)}`}>{item.status}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(item.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <h4 className="font-black text-slate-900 dark:text-white mb-1 line-clamp-1 text-sm uppercase">{item.title}</h4>
                                        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 line-clamp-2 mb-2 italic">{item.content}</p>
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tight">
                                            <Globe size={12} className="text-slate-300" />
                                            <span>Target: {item.audience}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Editor */}
                        <div className="lg:col-span-8 bg-white dark:bg-[#1e2936] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-[calc(100vh-250px)]">
                            {selectedAnnouncement ? (
                                <>
                                    {/* Editor Header */}
                                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800 rounded-t-xl">
                                        <div className="flex items-center gap-2">
                                            <FileEdit size={18} className="text-primary" />
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{selectedAnnouncement.id ? 'Editing Announcement' : 'New Announcement'}</span>
                                        </div>
                                        {selectedAnnouncement.id && (
                                            <button onClick={() => handleDelete(selectedAnnouncement.id)} className="text-slate-400 hover:text-red-500 transition-colors uppercase text-[10px] font-black tracking-widest flex items-center gap-1">
                                                <Trash2 size={14} />
                                                Delete Permanent
                                            </button>
                                        )}
                                    </div>
                                    {/* Editor Content Form */}
                                    <div className="flex-1 overflow-y-auto custom-scroll p-8">
                                        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
                                            {/* Title Input */}
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Announcement Title</label>
                                                <input 
                                                    value={selectedAnnouncement.title}
                                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                                    className="w-full text-lg font-black px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-400 text-slate-800 dark:text-white uppercase" 
                                                    placeholder="Enter a catchy title..."
                                                    type="text" 
                                                />
                                            </div>
                                            {/* Targeting and Date Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Audience */}
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Audience</label>
                                                    <select 
                                                        value={selectedAnnouncement.audience}
                                                        onChange={(e) => handleInputChange('audience', e.target.value)}
                                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-[11px] font-black uppercase focus:border-primary focus:ring-1 focus:ring-primary text-slate-700 dark:text-slate-200"
                                                    >
                                                        <option value="ALL">All Schools (Everyone)</option>
                                                        <option value="TEACHERS">Teachers Only</option>
                                                        <option value="STUDENTS">Students Only</option>
                                                        <option value="PARENTS">Parents Only</option>
                                                    </select>
                                                </div>
                                                {/* Schedule */}
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Publish Schedule</label>
                                                    <div className="relative group">
                                                        <Calendar size={18} className="absolute left-3 top-3 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                        <input 
                                                            value={selectedAnnouncement.publishDate || ''}
                                                            onChange={(e) => handleInputChange('publishDate', e.target.value)}
                                                            className="w-full px-4 py-2.5 pl-10 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-[11px] font-bold focus:border-primary focus:ring-1 focus:ring-primary text-slate-600 dark:text-slate-300 transition-all outline-none" 
                                                            type="datetime-local" 
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Content Editor */}
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Announcement Body</label>
                                                <div className="rounded-xl border border-slate-300 dark:border-slate-600 overflow-hidden bg-white dark:bg-slate-900 focus-within:ring-1 focus-within:ring-primary/30 focus-within:border-primary transition-all shadow-sm">
                                                    <div className="flex items-center gap-2 p-2.5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                                                        <Bold size={16} className="text-slate-400" />
                                                        <Italic size={16} className="text-slate-400" />
                                                        <Underline size={16} className="text-slate-400" />
                                                        <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                                                        <ListIcon size={16} className="text-slate-400" />
                                                        <Link2 size={16} className="text-slate-400" />
                                                    </div>
                                                    <textarea 
                                                        value={selectedAnnouncement.content}
                                                        onChange={(e) => handleInputChange('content', e.target.value)}
                                                        className="w-full h-64 p-5 border-none resize-none focus:ring-0 text-slate-800 dark:text-slate-200 text-sm leading-relaxed font-medium placeholder:italic" 
                                                        placeholder="Start typing your announcement here..."
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Editor Footer Actions */}
                                    <div className="px-8 py-5 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-b-xl flex justify-between items-center z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
                                        <div className="flex items-center gap-2">
                                            {saving ? (
                                                <Loader2 className="animate-spin text-primary" size={14} />
                                            ) : (
                                                <CheckCircle2 size={14} className="text-emerald-500" />
                                            )}
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{saving ? 'Syncing with server...' : 'Ready to save'}</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={() => handleSave('DRAFT')}
                                                disabled={saving}
                                                className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
                                            >
                                                Save Draft
                                            </button>
                                            <button 
                                                onClick={() => handleSave('PUBLISHED')}
                                                disabled={saving}
                                                className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-primary text-white font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                                            >
                                                <Send size={16} />
                                                Publish Now
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 border-4 border-white dark:border-slate-900 shadow-xl">
                                        <GraduationCap size={40} className="text-primary" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase mb-2">Comms Dashboard</h3>
                                    <p className="max-w-md text-xs font-bold text-slate-500 dark:text-slate-400 mb-8 italic">Broadcasting information across your institution is now easier than ever. Select a post or create a new one to get started.</p>
                                    <button onClick={handleCreateNew} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20">
                                        <Plus size={18} />
                                        Create First Post
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                
</>
            </RoleGuard>
        </AuthGuard>
    );
}


AnnouncementsDashboard.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
