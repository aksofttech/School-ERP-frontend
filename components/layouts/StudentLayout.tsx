import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import { USER_ROLES } from '@/utils/role-config';
import DashboardLayout, { NavSection } from './DashboardLayout';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Calendar,
  CreditCard,
  Bell,
  CheckSquare,
  ClipboardList,
  Award,
  UserCheck,
  MessageSquare,
  Megaphone,
  Search
} from 'lucide-react';

interface StudentLayoutProps {
  children: ReactNode;
}

const STUDENT_SECTIONS: NavSection[] = [
  {
    title: 'Studies',
    items: [
      { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
      { label: 'Homework', href: '/student/homework', icon: BookOpen },
      { label: 'Attendance', href: '/student/attendance', icon: UserCheck },
      { label: 'Exams', href: '/student/exams', icon: Award },
      { label: 'Results', href: '/student/results', icon: ClipboardList },
      { label: 'Timetable', href: '/student/timetable', icon: Calendar },
    ]
  },
  {
    title: 'Details',
    items: [
      { label: 'Fees', href: '/student/fees', icon: CreditCard },
      { label: 'Downloads', href: '/student/downloads', icon: Search },
    ]
  }
];

function StudentLayoutContent({ children }: StudentLayoutProps) {
  return (
    <DashboardLayout sections={STUDENT_SECTIONS} role="Student">
      {children}
    </DashboardLayout>
  );
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={[USER_ROLES.STUDENT]}>
        <StudentLayoutContent>{children}</StudentLayoutContent>
      </RoleGuard>
    </AuthGuard>
  );
}
