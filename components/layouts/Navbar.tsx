import { useState } from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { APP_NAME } from '@/utils/constants';
import { getDashboardRoute } from '@/utils/role-config';

interface NavbarProps {
    onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/auth/login');
    };

    return (
        <nav className="bg-white border-b border-slate-200 fixed w-full z-30 top-0 left-0 h-16">
            <div className="px-4 h-full flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg md:hidden"
                    >
                        <Menu size={24} />
                    </button>

                    <Link href={getDashboardRoute(user?.role) || "/"} className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                            {APP_NAME.charAt(0)}
                        </div>
                        <span className="text-xl font-bold text-slate-900 hidden sm:block">
                            {APP_NAME}
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
                        >
                            <div className="h-8 w-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                                <User size={20} />
                            </div>
                            <div className="hidden md:block text-left mr-2">
                                <p className="text-sm font-medium text-slate-900">{user?.firstName || 'User'}</p>
                                <p className="text-xs text-slate-500 capitalize">{user?.role?.toLowerCase() || 'Admin'}</p>
                            </div>
                        </button>

                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-slate-100 transform origin-top-right">
                                <div className="px-4 py-3 border-b border-slate-100 md:hidden">
                                    <p className="text-sm font-medium text-slate-900">{user?.firstName || 'User'}</p>
                                    <p className="text-xs text-slate-500 text-truncate">{user?.email}</p>
                                </div>
                                <button
                                    onClick={() => router.push('/profile')}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center"
                                >
                                    <User size={16} className="mr-2" />
                                    Your Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                >
                                    <LogOut size={16} className="mr-2" />
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
