import Link from 'next/link';
import { useRouter } from 'next/router';
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    BookOpen,
    Calendar,
    FileText,
    Settings,
    X
} from 'lucide-react';

export default function Sidebar() {
    const router = useRouter();

    const isActive = (path: string) => router.pathname.startsWith(path);

    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Students', href: '/admin/students', icon: GraduationCap },
        { name: 'Teachers', href: '/admin/teachers', icon: Users },
        { name: 'Classes', href: '/admin/classes', icon: BookOpen },
        { name: 'Attendance', href: '/admin/attendance', icon: Calendar },
        { name: 'Reports', href: '/admin/reports', icon: FileText },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 bg-white border-r border-slate-200 fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
                <div className="p-4 space-y-1">
                    {navigation.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active
                                        ? 'bg-brand-50 text-brand-700'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                            >
                                <item.icon size={20} className={active ? 'text-brand-600' : 'text-slate-400'} />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            </aside>
        </>
    );
}
