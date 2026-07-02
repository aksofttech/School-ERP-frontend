import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import { USER_ROLES } from '@/utils/role-config';
import DashboardLayout, { NavSection } from './DashboardLayout';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  MessageSquare,
  Bell,
  CheckSquare,
  ClipboardCheck,
  Award,
  Star,
  BookMarked,
  Megaphone
} from 'lucide-react';

interface TeacherLayoutProps {
  children: ReactNode;
}

const TEACHER_SECTIONS: NavSection[] = [
  {
    title: 'Classroom',
    items: [
      { label: 'Dashboard', href: '/teacher/dashboard', icon: LayoutDashboard },
      { label: 'Attendance', href: '/teacher/attendance', icon: ClipboardCheck },
      { label: 'Timetable', href: '/teacher/timetable', icon: Calendar },
    ]
  },
  {
    title: 'Grades',
    items: [
      { label: 'Assignments', href: '/teacher/assignments', icon: CheckSquare },
      { label: 'Exams', href: '/teacher/exams', icon: Award },
    ]
  },
];

function TeacherLayoutContent({ children }: TeacherLayoutProps) {
  return (
    <DashboardLayout sections={TEACHER_SECTIONS} role="Teacher">
      {children}
    </DashboardLayout>
  );
}

export default function TeacherLayout({ children }: TeacherLayoutProps) {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={[USER_ROLES.TEACHER]}>
        <TeacherLayoutContent>{children}</TeacherLayoutContent>
      </RoleGuard>
    </AuthGuard>
  );
}
