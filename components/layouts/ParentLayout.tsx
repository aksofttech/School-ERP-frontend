import { ReactNode, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import { USER_ROLES } from '@/utils/role-config';
import { ParentProvider, useParent } from '@/contexts/ParentContext';
import DashboardLayout, { NavSection } from './DashboardLayout';
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  BarChart3,
  MessageSquare,
  Bell,
  Users,
  ChevronDown,
  GraduationCap,
  Clock,
  ClipboardList,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

interface ParentLayoutProps {
  children: ReactNode;
}

const PARENT_SECTIONS: NavSection[] = [
  {
    title: 'Academic Monitoring',
    items: [
      { label: 'Dashboard', href: '/parent/dashboard', icon: LayoutDashboard },
      { label: 'Attendance', href: '/parent/attendance', icon: Calendar },
      { label: 'Exam Results', href: '/parent/results', icon: BarChart3 },
    ]
  },
  {
    title: 'Finance & Comms',
    items: [
      { label: 'Fees & Payments', href: '/parent/fees', icon: CreditCard },
      { label: 'Announcements', href: '/parent/messages', icon: MessageSquare },
    ]
  }
];

function ChildSwitcher() {
  const { selectedChildId, setSelectedChildId, childrenList } = useParent();
  const [isOpen, setIsOpen] = useState(false);

  const selectedChild = selectedChildId === 'ALL'
    ? { name: 'Family Overview', avatar: '' }
    : childrenList.find(c => c.id === selectedChildId);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-2 pr-4 py-1.5 hover:border-primary/50 transition-all shadow-sm"
      >
        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary overflow-hidden relative">
          {selectedChildId === 'ALL' ? (
            <Users size={16} />
          ) : (
            <Image
              src={selectedChild?.avatar || ''}
              alt=""
              className="size-8 object-cover"
              fill
              unoptimized
            />
          )}
        </div>
        <div className="text-left hidden lg:block">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest leading-none mb-0.5">Perspective</p>
          <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">{selectedChild?.name}</p>
        </div>
        <ChevronDown size={14} className="text-slate-400 ml-2" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-surface-dark rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 z-20">
            <button
              onClick={() => { setSelectedChildId('ALL'); setIsOpen(false); }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${selectedChildId === 'ALL' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
            >
              <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                <Users size={16} />
              </div>
              <span className="font-bold text-sm">Family Overview</span>
            </button>
            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
            {childrenList.map(child => (
              <button
                key={child.id}
                onClick={() => { setSelectedChildId(child.id); setIsOpen(false); }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${selectedChildId === child.id ? 'bg-primary/10 text-primary' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
              >
                <div className="size-8 relative">
                   <Image 
                    src={child.avatar || ''} 
                    alt="" 
                    className="rounded-lg object-cover bg-slate-200"
                    fill
                    unoptimized
                  />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">{child.name}</p>
                  <p className="text-[10px] text-slate-400">{child.class}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MobileHeader() {
  const router = useRouter();
  const isHome = router.pathname === '/parent/dashboard';
  
  return (
    <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-40 backdrop-blur-lg bg-white/80 dark:bg-slate-900/80">
      <div className="flex items-center gap-3">
        {!isHome && (
          <button 
            onClick={() => router.back()}
            className="p-2 -ml-2 text-slate-400 hover:text-primary transition-colors"
          >
            <ChevronDown className="rotate-90" size={20} />
          </button>
        )}
        <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight italic">
          {isHome ? 'Child Connect' : 'Back'}
        </h2>
      </div>
      <ChildSwitcher />
    </div>
  );
}

function ParentLayoutContent({ children }: ParentLayoutProps) {
  return (
    <DashboardLayout sections={PARENT_SECTIONS} role="Parent" headerExtra={<div className="hidden lg:block"><ChildSwitcher /></div>}>
      <MobileHeader />
      <div className="pb-20 lg:pb-0">
        {children}
      </div>
    </DashboardLayout>
  );
}

export default function ParentLayout({ children }: ParentLayoutProps) {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={[USER_ROLES.PARENT]}>
        <ParentProvider>
          <ParentLayoutContent>{children}</ParentLayoutContent>
        </ParentProvider>
      </RoleGuard>
    </AuthGuard>
  );
}
