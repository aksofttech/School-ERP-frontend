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
    Mail,
    Send,
    User,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    MessageSquare,
    Paperclip,
    Smile
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

export default function TeacherMessages() {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const chats = [
        { id: 1, name: 'Principal Office', lastMsg: 'Syllabus review completed.', time: '10:30 AM', unread: 2, avatar: 'PO' },
        { id: 2, name: 'Mathematics Faculty', lastMsg: 'Meeting at 2 PM in Room 4.', time: '09:15 AM', unread: 0, avatar: 'MF' },
        { id: 3, name: 'Parent of John Doe', lastMsg: 'Regarding absence yesterday.', time: 'Yesterday', unread: 1, avatar: 'JD' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12 h-[calc(100vh-120px)] flex flex-col">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 shrink-0">
                <div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-2 mb-2 text-primary">
                        Teacher Office: Messages
                    </Badge>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Messages</h1>
                    <p className="text-sm font-medium text-slate-500 italic">Chat with students and parents easily.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-10 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95">
                        <Plus size={18} />
                        New Message
                    </Button>
                </div>
            </div>

            <div className="flex-1 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex divide-x-2 divide-slate-50 dark:divide-slate-800">
                <div className="w-96 flex flex-col">
                    <div className="p-8 border-b-2 border-slate-50 dark:border-slate-800">
                        <div className="relative group">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-3 pl-12 pr-6 text-xs font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-100 dark:ring-slate-800 focus:ring-2 focus:ring-primary transition-all shadow-inner"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                        {chats.map(chat => (
                            <div key={chat.id} className="p-6 rounded-[2rem] bg-slate-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800 border-2 border-transparent hover:border-slate-100 transition-all cursor-pointer group flex items-center justify-between">
                                <div className="flex items-center gap-4 truncate">
                                    <div className="size-12 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 flex items-center justify-center text-[10px] font-black group-hover:bg-primary group-hover:text-white transition-all shadow-sm shrink-0">
                                        {chat.avatar}
                                    </div>
                                    <div className="truncate">
                                        <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">{chat.name}</p>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest truncate">{chat.lastMsg}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 shrink-0 pl-2">
                                    <span className="text-[7px] font-black text-slate-300 uppercase">{chat.time}</span>
                                    {chat.unread > 0 && (
                                        <Badge variant="outline" className="bg-primary text-white border-none text-[7px] font-black px-1.5 py-0.5 min-w-[1.2rem] flex justify-center">{chat.unread}</Badge>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex flex-col bg-slate-50/20 dark:bg-slate-800/10">
                    <div className="p-8 border-b-2 border-slate-50 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-[12px]">PO</div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Principal Office</h2>
                                <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                                    <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    Connected
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="secondary" className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-slate-400 hover:text-primary transition-all">
                                <AlertCircle size={20} />
                            </Button>
                            <Button variant="secondary" className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-slate-400 hover:text-primary transition-all">
                                <MoreVertical size={20} />
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-12 space-y-8 flex flex-col justify-end">
                        <div className="flex flex-col gap-2 max-w-[70%] text-left">
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] rounded-bl-none shadow-sm border-2 border-slate-50 dark:border-slate-800">
                                <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300 leading-relaxed uppercase tracking-tight">Reminder: Please finish marking the Q1 exam results by this Friday.</p>
                            </div>
                            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest pl-2">09:12 AM • ENCRYPTED</span>
                        </div>

                        <div className="flex flex-col gap-2 max-w-[70%] self-end text-right">
                            <div className="bg-primary p-6 rounded-[2rem] rounded-br-none shadow-xl border-none text-white">
                                <p className="text-[10px] font-bold leading-relaxed uppercase tracking-tight">Got it. Math and Physics grades are almost done. We will finish by Thursday.</p>
                            </div>
                            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest pr-2">10:45 AM • SECURE</span>
                        </div>
                    </div>

                    <div className="p-8 bg-white dark:bg-slate-900 border-t-2 border-slate-50 dark:border-slate-800">
                        <div className="relative group flex items-center gap-4">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Write a message..."
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-6 pl-14 pr-32 text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest outline-none ring-2 ring-slate-100 dark:ring-slate-800 focus:ring-primary transition-all"
                                />
                                <MessageSquare size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
                                    <Paperclip size={18} className="text-slate-300 hover:text-primary cursor-pointer transition-colors" />
                                    <Smile size={18} className="text-slate-300 hover:text-primary cursor-pointer transition-colors" />
                                </div>
                            </div>
                            <Button className="bg-primary hover:bg-primary/90 text-white rounded-2xl p-6 shadow-xl shadow-primary/20 transition-all active:scale-95 shrink-0 flex items-center justify-center">
                                <Send size={24} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
