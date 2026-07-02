import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { APP_NAME } from '@/utils/constants';
import { getDashboardRoute } from '@/utils/role-config';
import { 
    Menu, 
    X, 
    Search, 
    LogOut, 
    ChevronRight, 
    Moon, 
    Sun, 
    HelpCircle, 
    GraduationCap, 
    UserCircle, 
    Settings, 
    User 
} from 'lucide-react';
import { NotificationBell } from '@/components/ui/NotificationBell';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/DropdownMenu';

export interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
}

export interface NavSection {
    title: string;
    items: NavItem[];
}

interface DashboardLayoutProps {
    children: ReactNode;
    sections: NavSection[];
    role: string;
    headerExtra?: ReactNode;
}

export default function DashboardLayout({ children, sections, role, headerExtra }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { user, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined' && document.documentElement.classList.contains('dark')) {
            setIsDarkMode(true);
        }
    }, []);

    const toggleDarkMode = () => {
        document.documentElement.classList.toggle('dark');
        setIsDarkMode(!isDarkMode);
    };

    const isActive = (href: string) => router.pathname.startsWith(href);

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 font-sans flex overflow-hidden transition-colors duration-200">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 z-50 h-screen w-64 
                bg-white dark:bg-surface-dark border-r border-slate-200 dark:border-slate-700
                transition-transform duration-300 ease-in-out flex flex-col
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Sidebar Header */}
                <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-700 shrink-0">
                    <Link href={getDashboardRoute(user?.role) || "/"} className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <GraduationCap size={20} />
                        </div>
                        <span className="font-display">{APP_NAME}</span>
                    </Link>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
                    {sections.map((section, idx) => (
                        <div key={idx} className="space-y-2">
                            <h3 className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{section.title}</h3>
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const active = isActive(item.href);
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`
                                                flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group
                                                ${active
                                                    ? 'bg-primary/10 text-primary dark:text-indigo-400'
                                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-all'
                                                }
                                            `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon size={18} className={active ? 'text-primary' : 'text-slate-400 group-hover:text-primary'} />
                                                <span>{item.label}</span>
                                            </div>
                                            {active && <ChevronRight size={14} />}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar Footer - User Profile */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden shadow-sm uppercase">
                            {user?.firstName?.charAt(0) || <UserCircle size={24} />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.firstName} {user?.lastName}</p>
                            <p className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500 font-bold truncate">{role}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30 shadow-sm">
                    <div className="flex items-center gap-4 flex-1">
                        <button
                            className="lg:hidden p-2 text-slate-500 hover:text-primary transition-colors"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>

                        {/* Search Bar */}
                        <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 rounded-xl px-4 py-2 w-full max-w-md border border-transparent focus-within:border-primary/30 transition-all">
                            <Search size={18} className="text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search students, staff or more..."
                                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-4 ml-4">
                        {headerExtra && <div className="hidden sm:block">{headerExtra}</div>}

                        <button
                            onClick={toggleDarkMode}
                            className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <NotificationBell />

                        <button className="hidden sm:flex p-2 text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                            <HelpCircle size={20} />
                        </button>

                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 p-1.5 pr-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden uppercase shadow-sm">
                                        {user?.firstName?.charAt(0) || <UserCircle size={18} />}
                                    </div>
                                    <div className="hidden lg:block text-left">
                                        <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase leading-none tracking-wider mb-0.5">{user?.firstName}</p>
                                        <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase leading-none tracking-tighter">{role?.replace('_', ' ')}</p>
                                    </div>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-slate-200 dark:border-slate-800 shadow-2xl">
                                <div className="px-4 py-3 mb-2 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-1">
                                    <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">{user?.firstName} {user?.lastName}</p>
                                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{role?.replace('_', ' ')}</p>
                                    <div className="pt-2 space-y-1 border-t border-slate-200/50 dark:border-slate-700/50 mt-2">
                                        <p className="text-[8px] font-bold text-slate-500 lowercase tracking-wide flex items-center gap-2">
                                            <span className="w-1 h-1 rounded-full bg-primary" />
                                            {user?.email}
                                        </p>
                                        {user?.phone && (
                                            <p className="text-[8px] font-bold text-slate-500 lowercase tracking-wide flex items-center gap-2">
                                                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                                {user?.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/profile" className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
                                        <User size={16} className="text-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">My Profile</span>
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                    onClick={logout}
                                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-rose-500 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-500/10"
                                >
                                    <LogOut size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Sign Out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8 no-scrollbar pb-24 lg:pb-8">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {children}
                    </div>
                </main>

                {/* Mobile Bottom Navigation (Visible for Parent role on small screens) */}
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-6 py-3 z-50 flex items-center justify-between shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
                    {(sections || []).filter(Boolean).map(section => 
                        (section.items || []).filter(Boolean).map(item => {
                            const active = isActive(item.href);
                            const Icon = item.icon || UserCircle;
                            return (
                                <Link 
                                    key={item.href} 
                                    href={item.href} 
                                    className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-primary' : 'text-slate-400'}`}
                                >
                                    <Icon size={20} className={active ? 'animate-bounce-short' : ''} />
                                    <span className="text-[10px] font-black uppercase tracking-tighter">{item.label || 'Menu'}</span>
                                </Link>
                            );
                        })
                    ).flat().slice(0, 5)}
                </nav>
            </div>
        </div>
    );
}
