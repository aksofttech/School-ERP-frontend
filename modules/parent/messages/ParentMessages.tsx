import { useState } from 'react';
import { useParent } from '@/contexts/ParentContext';
import {
    MessageSquare,
    Search,
    Plus,
    Send,
    Paperclip,
    MoreVertical,
    Phone,
    Video,
    Check,
    CheckCheck,
    User
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function ParentMessages() {
    const { selectedChildId, childrenList } = useParent();
    const [activeThread, setActiveThread] = useState<number | null>(1);

    // Mock Conversations
    const threads = [
        { id: 1, name: 'Mrs. Davis', role: 'Class Teacher (5B)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Davis', unread: 2, lastMsg: 'Please sign the permission slip for the field trip.', time: '10:30 AM', childId: childrenList[0]?.id },
        { id: 2, name: 'Mr. Anderson', role: 'Math Teacher', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anderson', unread: 0, lastMsg: 'Alex is doing great in Calculus!', time: 'Yesterday', childId: childrenList[0]?.id },
        { id: 3, name: 'Admin Office', role: 'School Administration', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', unread: 0, lastMsg: 'Fee receipt generated #INV-2023-001', time: 'Oct 01', childId: null },
    ];

    const filteredThreads = selectedChildId === 'ALL'
        ? threads
        : threads.filter(t => !t.childId || t.childId === selectedChildId);

    return (
        <div className="h-[calc(100vh-12rem)] flex gap-6 animate-in fade-in duration-500">
            {/* Sidebar List */}
            <div className="w-full lg:w-96 flex flex-col bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Messages</h2>
                        <Button size="sm" className="bg-primary text-white rounded-xl shadow-lg shadow-primary/25">
                            <Plus size={18} />
                        </Button>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-3 flex items-center gap-3">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="bg-transparent border-none focus:ring-0 w-full text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {filteredThreads.map((thread) => (
                        <div
                            key={thread.id}
                            onClick={() => setActiveThread(thread.id)}
                            className={`p-4 rounded-2xl flex gap-4 cursor-pointer transition-all border ${activeThread === thread.id
                                ? 'bg-primary/5 border-primary/20 shadow-sm'
                                : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            <div className="relative">
                                <img src={thread.avatar} alt="" className="size-12 rounded-xl bg-slate-200 object-cover" />
                                {thread.unread > 0 && (
                                    <span className="absolute -top-1 -right-1 size-4 bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
                                        {thread.unread}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={`font-bold text-sm ${activeThread === thread.id ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{thread.name}</h4>
                                    <span className="text-[10px] mobile:hidden font-bold text-slate-400">{thread.time}</span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">{thread.lastMsg}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 hidden lg:flex flex-col bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                {activeThread ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-20 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <img src={threads.find(t => t.id === activeThread)?.avatar} alt="" className="size-10 rounded-xl bg-slate-200 object-cover" />
                                <div>
                                    <h3 className="font-black text-slate-900 dark:text-white text-lg leading-tight">{threads.find(t => t.id === activeThread)?.name}</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{threads.find(t => t.id === activeThread)?.role}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" className="text-slate-400 hover:text-primary"><Phone size={20} /></Button>
                                <Button variant="ghost" className="text-slate-400 hover:text-primary"><Video size={20} /></Button>
                                <Button variant="ghost" className="text-slate-400 hover:text-primary"><MoreVertical size={20} /></Button>
                            </div>
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="flex justify-center">
                                <Badge variant="outline" className="text-[9px] font-bold text-slate-400 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1">Oct 24, 2023</Badge>
                            </div>

                            {/* Incoming */}
                            <div className="flex gap-4 max-w-[80%]">
                                <img src={threads.find(t => t.id === activeThread)?.avatar} alt="" className="size-8 rounded-lg bg-slate-200 mt-1" />
                                <div className="space-y-1">
                                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-700">
                                        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                            Hello! This is a reminder about the parent-teacher meeting scheduled for next Friday.
                                        </p>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 ml-1">10:30 AM</span>
                                </div>
                            </div>

                            {/* Outgoing */}
                            <div className="flex gap-4 max-w-[80%] ml-auto flex-row-reverse">
                                <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary mt-1">
                                    <User size={16} />
                                </div>
                                <div className="space-y-1">
                                    <div className="bg-primary p-4 rounded-2xl rounded-tr-none shadow-lg shadow-primary/20">
                                        <p className="text-sm text-white font-medium leading-relaxed">
                                            Thank you regarding the update. We will be there.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 justify-end mr-1">
                                        <span className="text-[10px] font-bold text-slate-400">10:32 AM</span>
                                        <CheckCheck size={12} className="text-primary" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-2 pr-2 rounded-2xl border border-slate-200 dark:border-slate-700 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                                <Button variant="ghost" className="text-slate-400 hover:text-primary">
                                    <Paperclip size={20} />
                                </Button>
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400"
                                />
                                <Button className="bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                                    <Send size={18} />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 opacity-50">
                        <MessageSquare size={64} className="mb-4" />
                        <p className="text-sm font-bold uppercase tracking-widest">Select a conversation to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
}
