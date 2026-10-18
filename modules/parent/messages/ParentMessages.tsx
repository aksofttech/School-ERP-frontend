import React, { useState, useMemo } from 'react';
import { useParent } from '@/contexts/ParentContext';
import {
    Bell,
    Megaphone,
    Search,
    Filter,
    Calendar,
    CheckCircle2,
    AlertCircle,
    Clock,
    User,
    Send,
    Paperclip,
    MoreVertical,
    Phone,
    Video,
    Check,
    CheckCheck,
    X,
    ShieldCheck,
    Tag,
    FileText,
    ArrowRight,
    MessageSquare,
    Sparkles
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

export default function ParentMessages() {
    const { selectedChildId, childrenList } = useParent();
    const [activeTab, setActiveTab] = useState<'announcements' | 'teachers'>('announcements');
    const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCircular, setSelectedCircular] = useState<any>(null);
    const [activeThreadId, setActiveThreadId] = useState<number>(1);
    const [messageInput, setMessageInput] = useState('');

    // Official School Announcements Data
    const announcements = [
        {
            id: 'ann-1',
            title: 'Diwali Break & Festive Holidays 2026',
            category: 'HOLIDAY',
            categoryLabel: 'Holiday & Festive',
            categoryColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60',
            categoryIcon: '🏖️',
            priority: 'IMPORTANT',
            date: '17 Oct 2026',
            publishedBy: 'Office of the Principal • Dr. Meenakshi Sundaram',
            audience: 'All Parents & Students',
            content: 'The school will remain closed from October 28, 2026 to November 03, 2026 on account of Dhanteras, Diwali, Govardhan Puja, and Bhai Dooj. Regular classes will resume on Wednesday, November 04, 2026. Holiday homework and project guidelines have been uploaded to student dashboards. Wishing all students, parents, and staff members a joyous and safe festive season!',
            attachments: ['Diwali_Holiday_Homework_Class10.pdf', 'School_Reopening_Guidelines.pdf']
        },
        {
            id: 'ann-2',
            title: 'Mandatory Parent-Teacher Meeting (PTM) - Quarter 2',
            category: 'PTM',
            categoryLabel: 'Parent-Teacher Meet',
            categoryColor: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/60',
            categoryIcon: '👥',
            priority: 'URGENT',
            date: '15 Oct 2026',
            publishedBy: 'Academic Directorate • Vidya Mandir Administration',
            audience: 'Parents of Classes 6th to 12th',
            content: 'Quarter 2 Parent-Teacher Interaction will take place on Saturday, October 24, 2026, from 09:00 AM to 01:00 PM. Parents will have dedicated one-on-one sessions with Class Teachers and Subject Educators to review Unit Test performance, attendance records, and board examination preparedness. We request both parents to attend in their allotted time slots.',
            attachments: ['PTM_Time_Slots_Class10.pdf']
        },
        {
            id: 'ann-3',
            title: "Annual Sports Day 'SPARDHA 2026' - Inter-House Athletics Meet",
            category: 'SPORTS',
            categoryLabel: 'Sports & Athletics',
            categoryColor: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800/60',
            categoryIcon: '🏆',
            priority: 'CIRCULAR',
            date: '12 Oct 2026',
            publishedBy: 'Department of Physical Education & Athletics',
            audience: 'All Houses & Classes',
            content: "Registrations are now officially open for the 18th Annual Inter-House Athletics Meet 'SPARDHA 2026' to be held on November 20-21. Events include 100m/200m Sprint, 4x100m Relay, Long Jump, Shot Put, Tug of War, and Badminton. Interested students can contact Coach Dinesh Pareek (HOD Physical Education) or their House Captains before October 25, 2026.",
            attachments: ['Spardha_2026_Event_Catalog.pdf']
        },
        {
            id: 'ann-4',
            title: 'Transition to Mandatory Winter School Uniform',
            category: 'POLICY',
            categoryLabel: 'School Dress Policy',
            categoryColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60',
            categoryIcon: '📋',
            priority: 'CIRCULAR',
            date: '08 Oct 2026',
            publishedBy: 'Administrative Officer • Campus Store',
            audience: 'All Students & Guardians',
            content: 'Notice to all parents and students: All students must switch to the prescribed winter school uniform starting November 01, 2026. This includes navy blue blazers with school crest, grey woollen trousers/skirts, navy blue pullovers, and school ties. The official school uniform shop is open on campus on all weekdays from 09:00 AM to 03:00 PM.',
            attachments: ['Winter_Uniform_Specifications.pdf']
        },
        {
            id: 'ann-5',
            title: 'Mid-Term Examination 2026-27 Schedule & Instructions',
            category: 'ACADEMIC',
            categoryLabel: 'Board & Terminal Exams',
            categoryColor: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60',
            categoryIcon: '📝',
            priority: 'IMPORTANT',
            date: '04 Oct 2026',
            publishedBy: 'Examination Controller • Senior Academic Wing',
            audience: 'Classes 9th to 12th',
            content: 'Mid-Term Examinations for Classes 9 to 12 are scheduled to commence from November 10, 2026. Students must carry their official School ID cards and reporting time is 08:30 AM sharp. No electronic gadgets or calculators will be permitted in the examination halls. Datesheets and syllabus breakdowns have been distributed by respective class teachers.',
            attachments: ['Class10_MidTerm_Datesheet.pdf']
        }
    ];

    // Filtered Announcements
    const filteredAnnouncements = useMemo(() => {
        return announcements.filter(item => {
            const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  item.content.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [categoryFilter, searchQuery]);

    // Teacher Communications Threads
    const [threads, setThreads] = useState([
        {
            id: 1,
            name: 'Rajesh Sharma',
            role: 'Class Teacher • Class 10th-A',
            wardName: 'Aarav Agarwal',
            subject: 'Mathematics & Class Incharge',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
            unread: 1,
            lastMsg: 'Aarav has shown strong progress in Quadratic Equations and Unit Test 2.',
            time: '10:30 AM',
            messages: [
                {
                    id: 1,
                    sender: 'teacher',
                    text: 'Namaste Mr. Sanjay Agarwal, this is a note from Rajesh Sharma (Class 10th-A Class Teacher). Aarav scored 96% in the Mathematics Unit Test. We appreciate your encouragement at home.',
                    time: '10:15 AM'
                },
                {
                    id: 2,
                    sender: 'teacher',
                    text: 'Please ensure he brings his completed geometry workbook by Thursday for internal assessment submission.',
                    time: '10:30 AM'
                }
            ]
        },
        {
            id: 2,
            name: 'Sunita Verma',
            role: 'Class Teacher • Class 7th-A',
            wardName: 'Ananya Agarwal',
            subject: 'English & Class Incharge',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sunita',
            unread: 0,
            lastMsg: 'Ananya has been selected for the inter-school debate team.',
            time: 'Yesterday',
            messages: [
                {
                    id: 1,
                    sender: 'teacher',
                    text: 'Dear Mr. Agarwal, Ananya performed wonderfully in the Hindi and English recitation competitions today.',
                    time: 'Yesterday, 02:40 PM'
                },
                {
                    id: 2,
                    sender: 'parent',
                    text: 'Thank you Sunita Maam. We are delighted to hear that. Will she need special preparation for the debate?',
                    time: 'Yesterday, 03:00 PM'
                },
                {
                    id: 3,
                    sender: 'teacher',
                    text: 'We will conduct practice sessions during activity periods. No additional burden at home is needed.',
                    time: 'Yesterday, 03:15 PM'
                }
            ]
        },
        {
            id: 3,
            name: 'Accounts & Administration Office',
            role: 'Fee Billing & Campus Administration',
            wardName: 'General School Account',
            subject: 'Official Fee Receipts & Bus Transport',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminOffice',
            unread: 0,
            lastMsg: 'Quarter 2 tuition and transport fee receipt has been reconciled.',
            time: '14 Oct',
            messages: [
                {
                    id: 1,
                    sender: 'teacher',
                    text: 'Dear Guardian, fee receipts for Quarter 2 (AY 2026-27) have been confirmed. All accounts are settled with zero pending balance.',
                    time: '14 Oct, 11:00 AM'
                }
            ]
        }
    ]);

    const activeThread = useMemo(() => {
        return threads.find(t => t.id === activeThreadId) || threads[0];
    }, [threads, activeThreadId]);

    // Send Message Handler
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        const newMsg = {
            id: Date.now(),
            sender: 'parent',
            text: messageInput.trim(),
            time: 'Just now'
        };

        setThreads(prev => prev.map(t => {
            if (t.id === activeThread.id) {
                return {
                    ...t,
                    lastMsg: messageInput.trim(),
                    time: 'Just now',
                    messages: [...t.messages, newMsg]
                };
            }
            return t;
        }));

        setMessageInput('');
        toast.success(`Message sent to ${activeThread.name}`);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-16">
            {/* Header Banner */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                            <Megaphone size={13} />
                            Official Communications Hub
                        </span>
                        <span className="text-xs text-slate-400 font-medium">• Vidya Mandir Senior Secondary School</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        School Announcements & Teacher Communications
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">
                        Administrative circulars, event announcements, and direct messages from your children's educators.
                    </p>
                </div>
            </div>

            {/* Navigation Tabs: Announcements vs Teacher Messages */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setActiveTab('announcements')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                            activeTab === 'announcements'
                                ? 'bg-primary text-white shadow-md shadow-primary/25'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                        <Megaphone size={15} />
                        <span>Official School Announcements ({announcements.length})</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('teachers')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                            activeTab === 'teachers'
                                ? 'bg-primary text-white shadow-md shadow-primary/25'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                        <MessageSquare size={15} />
                        <span>Class Teacher Communications ({threads.length})</span>
                    </button>
                </div>

                <span className="text-xs font-bold text-slate-400 hidden sm:block pr-3">
                    Portal: <strong className="text-slate-900 dark:text-white">Sanjay Agarwal (Parent)</strong>
                </span>
            </div>

            {/* TAB 1: OFFICIAL SCHOOL ANNOUNCEMENTS */}
            {activeTab === 'announcements' && (
                <div className="space-y-6">
                    {/* Category Filter & Search Bar */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                            {[
                                { id: 'ALL', label: 'All Circulars' },
                                { id: 'HOLIDAY', label: '🏖️ Holidays' },
                                { id: 'PTM', label: '👥 PTM Meetings' },
                                { id: 'SPORTS', label: '🏆 Sports' },
                                { id: 'POLICY', label: '📋 Policy' },
                                { id: 'ACADEMIC', label: '📝 Exams' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setCategoryFilter(tab.id)}
                                    className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                                        categoryFilter === tab.id
                                            ? 'bg-primary text-white shadow-md shadow-primary/25'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="relative min-w-[280px]">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search announcements..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    {/* Announcements Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredAnnouncements.map((item) => (
                            <div
                                key={item.id}
                                className="p-6 md:p-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-primary/40 hover:shadow-2xl transition-all shadow-sm flex flex-col justify-between space-y-5 group"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full border ${item.categoryColor}`}>
                                            <span>{item.categoryIcon}</span>
                                            <span>{item.categoryLabel}</span>
                                        </span>
                                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                            <Calendar size={13} />
                                            {item.date}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-snug">
                                        {item.title}
                                    </h3>

                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium line-clamp-3">
                                        {item.content}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Published By</span>
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-1">{item.publishedBy}</span>
                                    </div>

                                    <Button
                                        onClick={() => setSelectedCircular(item)}
                                        className="bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl px-4 py-2 text-xs font-bold gap-1.5 transition-colors"
                                    >
                                        <span>Read Full Notice</span>
                                        <ArrowRight size={13} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 2: CLASS TEACHER COMMUNICATIONS */}
            {activeTab === 'teachers' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[640px]">
                    {/* Left: Teachers Thread List */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-base font-black text-slate-900 dark:text-white">
                                Teacher Contacts
                            </h3>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                                Assigned educators for Aarav & Ananya
                            </p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            {threads.map((thread) => {
                                const isSelected = activeThread.id === thread.id;

                                return (
                                    <div
                                        key={thread.id}
                                        onClick={() => setActiveThreadId(thread.id)}
                                        className={`p-3.5 rounded-2xl flex items-center gap-3.5 cursor-pointer transition-all border ${
                                            isSelected
                                                ? 'bg-primary/10 border-primary/30 shadow-sm'
                                                : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm uppercase shrink-0">
                                            {thread.name.charAt(0)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                                                    {thread.name}
                                                </h4>
                                                <span className="text-[10px] font-bold text-slate-400 shrink-0">
                                                    {thread.time}
                                                </span>
                                            </div>
                                            <p className="text-[11px] font-semibold text-primary truncate">
                                                {thread.role}
                                            </p>
                                            <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                                Student: {thread.wardName}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Active Chat & Note Window */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col">
                        {/* Thread Header */}
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
                            <div className="flex items-center gap-3.5">
                                <div className="size-11 rounded-xl bg-primary text-white flex items-center justify-center font-black text-base shadow-sm">
                                    {activeThread.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                                        {activeThread.name}
                                    </h4>
                                    <p className="text-xs font-semibold text-slate-500">
                                        {activeThread.role} • Ward: <strong className="text-primary">{activeThread.wardName}</strong>
                                    </p>
                                </div>
                            </div>

                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Available on Campus
                            </span>
                        </div>

                        {/* Message Stream */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30 dark:bg-slate-900/30">
                            {activeThread.messages.map((msg) => {
                                const isParent = msg.sender === 'parent';

                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex gap-3 max-w-[80%] ${isParent ? 'ml-auto flex-row-reverse' : ''}`}
                                    >
                                        <div className={`size-8 rounded-xl flex items-center justify-center text-xs font-black uppercase shrink-0 mt-1 ${
                                            isParent ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                                        }`}>
                                            {isParent ? 'S' : activeThread.name.charAt(0)}
                                        </div>

                                        <div className="space-y-1">
                                            <div className={`p-4 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                                                isParent
                                                    ? 'bg-primary text-white rounded-tr-none'
                                                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none'
                                            }`}>
                                                <p>{msg.text}</p>
                                            </div>
                                            <div className={`flex items-center gap-1 text-[10px] font-semibold text-slate-400 ${isParent ? 'justify-end' : ''}`}>
                                                <span>{msg.time}</span>
                                                {isParent && <CheckCheck size={12} className="text-primary" />}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Message Input Box */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
                            <input
                                type="text"
                                placeholder={`Type your query or note for ${activeThread.name}...`}
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                className="flex-1 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary"
                            />
                            <Button
                                type="submit"
                                className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-5 py-3 h-auto text-xs font-black gap-2 shadow-md shadow-primary/25"
                            >
                                <Send size={14} />
                                <span>Send</span>
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {/* FULL CIRCULAR READER MODAL */}
            {selectedCircular && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div>
                                <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full border mb-2 ${selectedCircular.categoryColor}`}>
                                    <span>{selectedCircular.categoryIcon}</span>
                                    <span>{selectedCircular.categoryLabel}</span>
                                </span>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-snug">
                                    {selectedCircular.title}
                                </h3>
                                <p className="text-xs font-semibold text-slate-400 mt-1 flex items-center gap-2">
                                    <span>Date: {selectedCircular.date}</span>
                                    <span>•</span>
                                    <span>Target: {selectedCircular.audience}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedCircular(null)}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-500 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium space-y-3">
                            <p>{selectedCircular.content}</p>
                        </div>

                        {/* Official Sign-off */}
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800 text-slate-400">
                            <div>
                                <span className="text-[10px] font-bold block uppercase tracking-wider">Issued by</span>
                                <span className="font-bold text-slate-700 dark:text-slate-300">{selectedCircular.publishedBy}</span>
                            </div>

                            <Button
                                onClick={() => {
                                    toast.success('Circular acknowledged and marked as read.');
                                    setSelectedCircular(null);
                                }}
                                className="bg-primary hover:bg-primary/90 text-white rounded-xl px-5 py-2.5 text-xs font-bold gap-1.5"
                            >
                                <Check size={14} />
                                <span>Acknowledge Notice</span>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
