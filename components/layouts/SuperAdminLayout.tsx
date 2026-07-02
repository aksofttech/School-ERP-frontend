import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import { USER_ROLES } from '@/utils/role-config';
import DashboardLayout, { NavSection } from './DashboardLayout';
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Users,
  Activity,
  Settings,
  ShieldAlert,
  Wallet,
  BookOpen
} from 'lucide-react';

interface SuperAdminLayoutProps {
  children: ReactNode;
}

const SUPER_ADMIN_SECTIONS: NavSection[] = [
  {
    title: 'Core',
    items: [
      { label: 'Global Dashboard', href: '/super-admin/dashboard', icon: LayoutDashboard },
      { label: 'School Registry', href: '/super-admin/schools', icon: Building2 },
      { label: 'Subscription Plans', href: '/super-admin/plans', icon: CreditCard },
      { label: 'License Manager', href: '/super-admin/license', icon: Activity },
    ]
  },
  {
    title: 'Administration',
    items: [
      { label: 'User Directory', href: '/super-admin/users', icon: Users },
      { label: 'System Health', href: '/super-admin/system-logs', icon: Activity },
    ]
  },
  {
    title: 'System',
    items: [
      { label: 'Global Settings', href: '/super-admin/settings', icon: Settings },
      { label: 'Security Audit', href: '/super-admin/security', icon: ShieldAlert },
    ]
  }
];

function SuperAdminLayoutContent({ children }: SuperAdminLayoutProps) {
  return (
    <DashboardLayout sections={SUPER_ADMIN_SECTIONS} role="Super Admin">
      {children}
    </DashboardLayout>
  );
}

export default function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN]}>
        <SuperAdminLayoutContent>{children}</SuperAdminLayoutContent>
      </RoleGuard>
    </AuthGuard>
  );
}
