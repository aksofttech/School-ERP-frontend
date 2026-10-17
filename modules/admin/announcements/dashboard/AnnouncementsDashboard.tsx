import React, { useState, useEffect, useMemo } from 'react';
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
    FileText,
    Send,
    AlertCircle,
    Loader2,
    CheckCircle2,
    Bell,
    Megaphone,
    BookOpen,
    Eye,
    Clock,
    Share2,
    Printer
} from 'lucide-react';
import Button from '@/components/ui/Button';

export default function AnnouncementsDashboard() {
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAudience, setSelectedAudience] = useState<string>('ALL');
    const [readingNotice, setReadingNotice] = useState<any>(null);
    const [editingNotice, setEditingNotice] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    // Fetch announcements on mount
    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await communicationService.getNotices();
            const list = Array.isArray(response)
                ? response
                : Array.isArray((response as any)?.data)
                    ? (response as any).data
                    : [];
            setAnnouncements(list);
        } catch (error) {
            console.error('Error fetching notices:', error);
            toast.error('Failed to load announcements');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        setEditingNotice({
            id: null,
            title: '',
            content: '',
            audience: 'ALL',
            status: 'PUBLISHED',
            publishDate: new Date().toISOString().slice(0, 16),
        });
    };

    const handleEditNotice = (item: any) => {
        setReadingNotice(null);
        setEditingNotice({
            id: item.id,
            title: item.title,
            content: item.content,
            audience: item.audience || 'ALL',
            status: item.status || 'PUBLISHED',
            publishDate: item.publishDate ? new Date(item.publishDate).toISOString().slice(0, 16) : '',
        });
    };

    const handleSave = async (status: 'DRAFT' | 'PUBLISHED') => {
        if (!editingNotice.title?.trim() || !editingNotice.content?.trim()) {
            toast.error('Please enter both Title and Content');
            return;
        }

        try {
            setSaving(true);
            const payload = {
                title: editingNotice.title.trim(),
                content: editingNotice.content.trim(),
                audience: editingNotice.audience,
                status: status,
                publishDate: editingNotice.publishDate
                    ? new Date(editingNotice.publishDate).toISOString()
                    : new Date().toISOString(),
            };

            if (editingNotice.id) {
                await apiClient.patch(`/communication/notices/${editingNotice.id}`, payload);
                toast.success('Announcement updated successfully');
            } else {
                await communicationService.createNotice(payload);
                toast.success('Announcement published to all portals!');
            }

            setEditingNotice(null);
            await fetchAnnouncements();
        } catch (error: any) {
            console.error('Error saving notice:', error);
            const errorMsg = error.response?.data?.message || 'Failed to save announcement';
            toast.error(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) return;
        try {
            await apiClient.delete(`/communication/notices/${id}`);
            toast.success('Announcement deleted');
            if (readingNotice?.id === id) setReadingNotice(null);
            fetchAnnouncements();
        } catch (error) {
            toast.error('Failed to delete announcement');
        }
    };

    // Filter announcements based on search and audience tab
    const filteredAnnouncements = useMemo(() => {
        return announcements.filter((item) => {
            const matchesSearch =
                item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.content?.toLowerCase().includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;

            if (selectedAudience === 'ALL') return true;
            if (selectedAudience === 'STUDENTS') return item.audience === 'STUDENTS' || item.audience === 'ALL';
            if (selectedAudience === 'PARENTS') return item.audience === 'PARENTS' || item.audience === 'ALL';
            if (selectedAudience === 'TEACHERS') return item.audience === 'TEACHERS' || item.audience === 'ALL';
            return item.audience === selectedAudience;
        });
    }, [announcements, searchTerm, selectedAudience]);

    // Computed counts
    const totalNotices = announcements.length;
    const studentNotices = announcements.filter((a) => a.audience === 'STUDENTS' || a.audience === 'ALL').length;
    const parentNotices = announcements.filter((a) => a.audience === 'PARENTS' || a.audience === 'ALL').length;
    const facultyNotices = announcements.filter((a) => a.audience === 'TEACHERS' || a.audience === 'ALL').length;

    const getAudienceBadge = (audience: string) => {
        switch (audience) {
            case 'STUDENTS':
                return {
                    label: 'Students Roster',
                    icon: <GraduationCap size={12} />,
                    styles: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
                };
            case 'PARENTS':
                return {
                    label: 'Parents Portal',
                    icon: <Users size={12} />,
                    styles: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
                };
            case 'TEACHERS':
                return {
                    label: 'Faculty & Staff',
                    icon: <BookOpen size={12} />,
                    styles: 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200 dark:border-purple-800',
                };
            default:
                return {
                    label: 'School Wide (All)',
                    icon: <Globe size={12} />,
                    styles: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-800',
                };
        }
    };

    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
                <>
                    <Head>
                        <title>Official Notices & Announcements | School ERP</title>
                    </Head>

                    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
                        {/* Header */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 text-primary mb-1">
                                    <Megaphone size={18} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Official Broadcasts</span>
                                </div>
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Announcements</h1>
                                <p className="text-sm font-medium text-slate-500 italic">
                                    Publish institutional notices, exam circulars, holiday memos, and event updates.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={handleCreateNew}
                                    className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 py-4 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20 hover:-translate-y-0.5 active:scale-95 transition-all"
                                >
                                    <Plus size={18} />
                                    <span>New Announcement</span>
                                </Button>
                            </div>
                        </div>

                        {/* Top KPI Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Bell size={22} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                                        Live
                                    </span>
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Broadcasts</p>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{totalNotices} Active</h3>
                                <p className="text-[11px] font-medium text-slate-500 mt-2">Active institutional notices on noticeboard</p>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="size-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                        <GraduationCap size={22} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-full">
                                        Targeted
                                    </span>
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">For Students</p>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{studentNotices} Circulars</h3>
                                <p className="text-[11px] font-medium text-slate-500 mt-2">Exams, curriculum, timetable, sports</p>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <Users size={22} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full">
                                        Parental
                                    </span>
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">For Parents</p>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{parentNotices} Bulletins</h3>
                                <p className="text-[11px] font-medium text-slate-500 mt-2">PTM, uniform instructions, holiday schedules</p>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="size-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                                        <BookOpen size={22} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 dark:bg-purple-500/10 px-2.5 py-1 rounded-full">
                                        Faculty
                                    </span>
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">For Staff</p>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{facultyNotices} Memos</h3>
                                <p className="text-[11px] font-medium text-slate-500 mt-2">Staff meetings, NEP training, workshops</p>
                            </div>
                        </div>

                        {/* Search and Audience Filter Tabs */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="relative group max-w-md w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search notices by keyword, title, subject..."
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary transition-all"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>

                            {/* Audience Filter Pills */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">Audience:</span>
                                {[
                                    { key: 'ALL', label: 'All Notices' },
                                    { key: 'STUDENTS', label: 'Students' },
                                    { key: 'PARENTS', label: 'Parents' },
                                    { key: 'TEACHERS', label: 'Teachers' },
                                ].map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setSelectedAudience(tab.key)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                                            selectedAudience === tab.key
                                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Announcements Feed Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="h-64 rounded-[2rem] bg-slate-100 dark:bg-slate-800 animate-pulse" />
                                ))
                            ) : filteredAnnouncements.length === 0 ? (
                                <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="size-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                            <AlertCircle size={32} />
                                        </div>
                                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">No Announcements Found</h4>
                                        <p className="text-xs text-slate-400">Try changing your search terms or audience filters.</p>
                                    </div>
                                </div>
                            ) : (
                                filteredAnnouncements.map((item) => {
                                    const badge = getAudienceBadge(item.audience);
                                    const publishFormatted = item.publishDate
                                        ? new Date(item.publishDate).toLocaleDateString('en-US', {
                                              month: 'short',
                                              day: 'numeric',
                                              year: 'numeric',
                                          })
                                        : new Date(item.createdAt).toLocaleDateString();

                                    return (
                                        <div
                                            key={item.id}
                                            className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:border-primary/60 dark:hover:border-primary/60 hover:shadow-xl transition-all group relative"
                                        >
                                            <div className="space-y-4">
                                                {/* Audience & Status Bar */}
                                                <div className="flex justify-between items-start gap-2">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${badge.styles}`}
                                                    >
                                                        {badge.icon}
                                                        <span>{badge.label}</span>
                                                    </span>

                                                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        {publishFormatted}
                                                    </span>
                                                </div>

                                                {/* Notice Title */}
                                                <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                                                    {item.title}
                                                </h3>

                                                {/* Content Preview */}
                                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                                                    {item.content}
                                                </p>
                                            </div>

                                            {/* Card Footer Actions */}
                                            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                                <button
                                                    onClick={() => setReadingNotice(item)}
                                                    className="inline-flex items-center gap-1.5 text-xs font-black text-primary uppercase tracking-widest hover:underline"
                                                >
                                                    <Eye size={14} />
                                                    <span>Read Full</span>
                                                </button>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEditNotice(item)}
                                                        className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                        title="Edit Announcement"
                                                    >
                                                        <FileEdit size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                                                        title="Delete Notice"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* FULL NOTICE READING MODAL */}
                        {readingNotice && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full overflow-hidden p-8 space-y-6 animate-in zoom-in-95">
                                    <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-800">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                                        getAudienceBadge(readingNotice.audience).styles
                                                    }`}
                                                >
                                                    {getAudienceBadge(readingNotice.audience).icon}
                                                    <span>{getAudienceBadge(readingNotice.audience).label}</span>
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400">
                                                    {new Date(readingNotice.publishDate || readingNotice.createdAt).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                                {readingNotice.title}
                                            </h2>
                                        </div>
                                        <button
                                            onClick={() => setReadingNotice(null)}
                                            className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 max-h-96 overflow-y-auto">
                                        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium whitespace-pre-wrap">
                                            {readingNotice.content}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="secondary"
                                                onClick={() => handleEditNotice(readingNotice)}
                                                className="rounded-xl px-4 py-2.5 h-auto text-xs font-black uppercase tracking-wider gap-2"
                                            >
                                                <FileEdit size={14} />
                                                <span>Edit Notice</span>
                                            </Button>
                                        </div>
                                        <button
                                            onClick={() => setReadingNotice(null)}
                                            className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CREATE / EDIT ANNOUNCEMENT MODAL */}
                        {editingNotice && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full overflow-hidden p-8 space-y-6 animate-in zoom-in-95">
                                    <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-800">
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                                {editingNotice.id ? 'Edit Announcement' : 'Publish New Announcement'}
                                            </h3>
                                            <p className="text-xs text-slate-400">Broadcasts are immediately delivered to student and parent mobile portals.</p>
                                        </div>
                                        <button
                                            onClick={() => setEditingNotice(null)}
                                            className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                                Announcement Headline / Title *
                                            </label>
                                            <input
                                                type="text"
                                                value={editingNotice.title}
                                                onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                                                placeholder="e.g. Annual Sports Day Registrations 2026..."
                                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 px-5 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary uppercase transition-all"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                                    Target Audience
                                                </label>
                                                <select
                                                    value={editingNotice.audience}
                                                    onChange={(e) => setEditingNotice({ ...editingNotice, audience: e.target.value })}
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 px-4 text-xs font-black uppercase text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary"
                                                >
                                                    <option value="ALL">School Wide (Everyone)</option>
                                                    <option value="STUDENTS">Students Only</option>
                                                    <option value="PARENTS">Parents Only</option>
                                                    <option value="TEACHERS">Faculty / Teachers Only</option>
                                                </select>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                                    Publish Date
                                                </label>
                                                <input
                                                    type="datetime-local"
                                                    value={editingNotice.publishDate}
                                                    onChange={(e) => setEditingNotice({ ...editingNotice, publishDate: e.target.value })}
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 px-4 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                                Notice Content Body *
                                            </label>
                                            <textarea
                                                rows={6}
                                                value={editingNotice.content}
                                                onChange={(e) => setEditingNotice({ ...editingNotice, content: e.target.value })}
                                                placeholder="Write the full announcement text, instructions, dates, requirements..."
                                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary resize-none leading-relaxed transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => setEditingNotice(null)}
                                            className="rounded-xl px-6 py-3 h-auto text-xs font-black uppercase tracking-widest"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="button"
                                            disabled={saving}
                                            onClick={() => handleSave('PUBLISHED')}
                                            className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 py-3 h-auto text-xs font-black uppercase tracking-widest gap-2 shadow-xl shadow-primary/20"
                                        >
                                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                            <span>{editingNotice.id ? 'Save Updates' : 'Publish Notice'}</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            </RoleGuard>
        </AuthGuard>
    );
}

AnnouncementsDashboard.getLayout = function getLayout(page: React.ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
