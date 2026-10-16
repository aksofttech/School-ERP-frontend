import { useEffect, useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import SuperAdminLayout from '@/components/layouts/SuperAdminLayout';
import { superAdminService } from '@/services/super-admin.service';
import { toast } from 'react-hot-toast';
import {
    Users,
    Building2,
    Search,
    Filter,
    Shield,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Plus,
    Phone,
    Mail,
    Calendar,
    ChevronRight,
    RefreshCw,
    Lock,
    Layers,
    UserCheck,
    UserX,
    Eye,
    X,
    School
} from 'lucide-react';

interface UserRecord {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
    phone?: string;
    schoolId?: string;
    createdAt: string;
    school?: {
        id: string;
        name: string;
        code: string;
    };
}

export default function UserManagement() {
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [schoolFilter, setSchoolFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [groupBySchool, setGroupBySchool] = useState(false);
    const [sortBy, setSortBy] = useState<'name' | 'school' | 'role' | 'date'>('school');

    // Modals
    const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
    const [resetPwdUser, setResetPwdUser] = useState<UserRecord | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const fetchUsers = async () => {
        try {
            const res = await superAdminService.getUsers({ limit: 100 });
            const list = Array.isArray(res) ? res : (res?.data || []);
            setUsers(list);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error('Failed to load user directory');
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Extract unique schools for the school filter dropdown
    const availableSchools = useMemo(() => {
        const schoolsMap = new Map<string, string>();
        users.forEach((u) => {
            if (u.school && u.school.id) {
                schoolsMap.set(u.school.id, u.school.name);
            }
        });
        return Array.from(schoolsMap.entries()).map(([id, name]) => ({ id, name }));
    }, [users]);

    // Filtered & Sorted users
    const filteredUsers = useMemo(() => {
        return users
            .filter((user) => {
                const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
                const email = (user.email || '').toLowerCase();
                const schoolName = (user.school?.name || '').toLowerCase();
                const schoolCode = (user.school?.code || '').toLowerCase();
                const phone = (user.phone || '').toLowerCase();
                const search = searchTerm.toLowerCase();

                const matchesSearch =
                    !searchTerm ||
                    fullName.includes(search) ||
                    email.includes(search) ||
                    schoolName.includes(search) ||
                    schoolCode.includes(search) ||
                    phone.includes(search);

                const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
                const matchesSchool =
                    schoolFilter === 'ALL' ||
                    (schoolFilter === 'SYSTEM' ? !user.schoolId : user.schoolId === schoolFilter);
                const matchesStatus =
                    statusFilter === 'ALL' ||
                    (statusFilter === 'ACTIVE' ? user.isActive : !user.isActive);

                return matchesSearch && matchesRole && matchesSchool && matchesStatus;
            })
            .sort((a, b) => {
                if (sortBy === 'name') {
                    return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
                }
                if (sortBy === 'school') {
                    const sA = a.school?.name || 'AAAA';
                    const sB = b.school?.name || 'AAAA';
                    return sA.localeCompare(sB);
                }
                if (sortBy === 'role') {
                    return a.role.localeCompare(b.role);
                }
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
    }, [users, searchTerm, roleFilter, schoolFilter, statusFilter, sortBy]);

    // Grouping by school
    const groupedUsers = useMemo(() => {
        const groups: Record<string, { schoolName: string; schoolCode: string; users: UserRecord[] }> = {};

        filteredUsers.forEach((u) => {
            const key = u.schoolId || 'SYSTEM';
            if (!groups[key]) {
                groups[key] = {
                    schoolName: u.school?.name || 'Super Admin & Global System Operations',
                    schoolCode: u.school?.code || 'SYSTEM_CORE',
                    users: []
                };
            }
            groups[key].users.push(u);
        });

        return groups;
    }, [filteredUsers]);

    const handleToggleStatus = async (user: UserRecord) => {
        try {
            if (user.isActive) {
                await superAdminService.deactivateUser(user.id);
                toast.success(`User ${user.firstName} deactivated`);
            } else {
                await superAdminService.activateUser(user.id);
                toast.success(`User ${user.firstName} activated`);
            }
            setUsers((prev) =>
                prev.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u))
            );
            if (selectedUser?.id === user.id) {
                setSelectedUser((prev) => (prev ? { ...prev, isActive: !prev.isActive } : null));
            }
        } catch (error) {
            toast.error('Failed to change user status');
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resetPwdUser || !newPassword) return;
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        setActionLoading(true);
        try {
            await superAdminService.resetUserPassword(resetPwdUser.id, newPassword);
            toast.success(`Password reset successfully for ${resetPwdUser.email}`);
            setResetPwdUser(null);
            setNewPassword('');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setActionLoading(false);
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'SUPER_ADMIN':
                return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800';
            case 'SCHOOL_ADMIN':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
            case 'TEACHER':
                return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
            case 'STUDENT':
                return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
            case 'PARENT':
                return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800';
            default:
                return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200';
        }
    };

    const getRoleLabel = (role: string) => {
        return role ? role.replace('_', ' ') : 'USER';
    };

    const renderUserRow = (user: UserRecord) => (
        <div key={user.id} className="p-4 px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50 flex items-center justify-center font-black uppercase text-xs">
                    {user.firstName?.charAt(0) || user.email?.charAt(0)}
                </div>
                <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">
                        {user.firstName} {user.lastName}
                    </p>
                    <p className="text-slate-400 text-xs font-mono">{user.email}</p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getRoleBadge(user.role)}`}>
                    {getRoleLabel(user.role)}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    user.isActive
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200'
                        : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200'
                }`}>
                    <span className={`size-1.5 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    {user.isActive ? 'Active' : 'Deactivated'}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                    {user.phone || 'No phone'}
                </span>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setSelectedUser(user)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <Eye size={15} />
                    </button>
                    <button
                        onClick={() => { setResetPwdUser(user); setNewPassword(''); }}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <Lock size={15} />
                    </button>
                    <button
                        onClick={() => handleToggleStatus(user)}
                        className={`p-1.5 rounded-lg transition-colors ${
                            user.isActive ? 'text-slate-400 hover:text-rose-600' : 'text-emerald-500'
                        }`}
                    >
                        {user.isActive ? <UserX size={15} /> : <UserCheck size={15} />}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <SuperAdminLayout>
            <Head>
                <title>User Directory & Identity Governance - Vikas ERP</title>
            </Head>

            <div className="space-y-8 animate-in fade-in duration-300 pb-16">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Link href="/super-admin/dashboard" className="hover:text-primary transition-colors">
                        Super Admin
                    </Link>
                    <ChevronRight size={14} />
                    <span className="font-semibold text-slate-900 dark:text-white">User Directory</span>
                </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                <Users size={26} />
                            </div>
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                    Identity Directory
                                </h1>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                    Holistic management of users, permissions, and institution associations.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { setIsRefreshing(true); fetchUsers(); }}
                            disabled={isRefreshing}
                            className="inline-flex items-center px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
                        >
                            <RefreshCw size={14} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                            Sync Directory
                        </button>
                        <Link
                            href="/super-admin/users/add"
                            className="inline-flex items-center px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/25 active:scale-95"
                        >
                            <Plus size={16} className="mr-1.5" />
                            Provision New Entity
                        </Link>
                    </div>
                </div>

                {/* Filters & Control Toolbar */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                        {/* Search Input */}
                        <div className="lg:col-span-2 relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, school, phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* School Filter */}
                        <div>
                            <select
                                value={schoolFilter}
                                onChange={(e) => setSchoolFilter(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="ALL">🏫 All Institutions</option>
                                <option value="SYSTEM">🌐 System Only (Super Admin)</option>
                                {availableSchools.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Role Filter */}
                        <div>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="ALL">All Roles</option>
                                <option value="SUPER_ADMIN">Super Admin</option>
                                <option value="SCHOOL_ADMIN">School Admin</option>
                                <option value="TEACHER">Teacher</option>
                                <option value="STUDENT">Student</option>
                                <option value="PARENT">Parent</option>
                            </select>
                        </div>

                        {/* Status Filter & Group Toggle */}
                        <div className="flex items-center gap-2">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="ALL">Any Status</option>
                                <option value="ACTIVE">Active Only</option>
                                <option value="INACTIVE">Inactive Only</option>
                            </select>
                            <button
                                onClick={() => setGroupBySchool(!groupBySchool)}
                                title={groupBySchool ? 'Switch to Standard List' : 'Group by Institution'}
                                className={`p-2.5 rounded-xl border transition-colors shrink-0 ${
                                    groupBySchool
                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                                }`}
                            >
                                <Layers size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats Strip */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-4">
                            <span>
                                Showing <strong className="text-slate-900 dark:text-white">{filteredUsers.length}</strong> of{' '}
                                <strong className="text-slate-900 dark:text-white">{users.length}</strong> registered identities
                            </span>
                            {schoolFilter !== 'ALL' && (
                                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300 font-bold text-[10px]">
                                    Institution Filter Active
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Sort by:</span>
                            <button
                                onClick={() => setSortBy('school')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                                    sortBy === 'school'
                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}
                            >
                                School
                            </button>
                            <button
                                onClick={() => setSortBy('role')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                                    sortBy === 'role'
                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}
                            >
                                Role
                            </button>
                            <button
                                onClick={() => setSortBy('name')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                                    sortBy === 'name'
                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}
                            >
                                Name
                            </button>
                        </div>
                    </div>
                </div>

                {/* Directory Content */}
                {loading ? (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-slate-200 dark:border-slate-800 animate-pulse space-y-4">
                        {Array(6).fill(0).map((_, i) => (
                            <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full"></div>
                        ))}
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center border border-dashed border-slate-300 dark:border-slate-700 space-y-4">
                        <Users size={48} className="mx-auto text-slate-400" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No users match your criteria</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            Try adjusting your filters, clearing the search query, or selecting another institution.
                        </p>
                        <button
                            onClick={() => { setSearchTerm(''); setRoleFilter('ALL'); setSchoolFilter('ALL'); setStatusFilter('ALL'); }}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                        >
                            Reset All Filters
                        </button>
                    </div>
                ) : groupBySchool ? (
                    /* Grouped By School View */
                    <div className="space-y-6">
                        {Object.entries(groupedUsers).map(([key, group]) => (
                            <div key={key} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                                <div className="p-5 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                            <Building2 size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                                {group.schoolName}
                                            </h3>
                                            <span className="text-[11px] font-mono text-slate-400 uppercase">
                                                Code: {group.schoolCode}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
                                        {group.users.length} Users
                                    </span>
                                </div>

                                <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                    {group.users.map((user) => renderUserRow(user))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Flat Table View */
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="bg-slate-50/70 dark:bg-slate-800/40 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                                        <th className="py-4 px-6">Entity Details</th>
                                        <th className="py-4 px-6">Institution (School)</th>
                                        <th className="py-4 px-6">System Role</th>
                                        <th className="py-4 px-6">Status</th>
                                        <th className="py-4 px-6">Contact / Joined</th>
                                        <th className="py-4 px-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50 flex items-center justify-center font-black uppercase text-xs">
                                                        {user.firstName?.charAt(0) || user.email?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white text-sm">
                                                            {user.firstName} {user.lastName}
                                                        </p>
                                                        <p className="text-slate-400 text-[11px] font-mono">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                {user.school ? (
                                                    <div>
                                                        <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                                            <Building2 size={13} className="text-slate-400" />
                                                            {user.school.name}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-mono">
                                                            {user.school.code}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300">
                                                        Super Admin Core
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getRoleBadge(user.role)}`}>
                                                    {getRoleLabel(user.role)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                    user.isActive
                                                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                                                        : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                                                }`}>
                                                    <span className={`size-1.5 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                    {user.isActive ? 'Active' : 'Deactivated'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                                                <p className="text-[11px] font-medium">{user.phone || 'No phone recorded'}</p>
                                                <p className="text-[10px] text-slate-400">
                                                    Joined {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => setSelectedUser(user)}
                                                        title="View Profile Details"
                                                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                                    >
                                                        <Eye size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => { setResetPwdUser(user); setNewPassword(''); }}
                                                        title="Reset Password"
                                                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                                    >
                                                        <Lock size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleStatus(user)}
                                                        title={user.isActive ? 'Deactivate User' : 'Activate User'}
                                                        className={`p-1.5 rounded-lg transition-colors ${
                                                            user.isActive
                                                                ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800'
                                                                : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-slate-800'
                                                        }`}
                                                    >
                                                        {user.isActive ? <UserX size={15} /> : <UserCheck size={15} />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>


            {/* User Details Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Identity Details</h3>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 border border-indigo-200 mx-auto flex items-center justify-center font-black text-2xl uppercase">
                                {selectedUser.firstName?.charAt(0) || selectedUser.email?.charAt(0)}
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                                {selectedUser.firstName} {selectedUser.lastName}
                            </h4>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getRoleBadge(selectedUser.role)}`}>
                                {getRoleLabel(selectedUser.role)}
                            </span>
                        </div>

                        <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-xs font-medium">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 flex items-center gap-1.5"><Mail size={13} /> Email:</span>
                                <span className="text-slate-900 dark:text-white font-mono">{selectedUser.email}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 flex items-center gap-1.5"><Phone size={13} /> Phone:</span>
                                <span className="text-slate-900 dark:text-white">{selectedUser.phone || 'Not recorded'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 flex items-center gap-1.5"><Building2 size={13} /> School:</span>
                                <span className="text-slate-900 dark:text-white font-bold">{selectedUser.school?.name || 'Platform Core (No School)'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 flex items-center gap-1.5"><Calendar size={13} /> Created:</span>
                                <span className="text-slate-900 dark:text-white">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">Status:</span>
                                <span className={`font-bold ${selectedUser.isActive ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {selectedUser.isActive ? 'Active Protocol' : 'Suspended / Deactivated'}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleToggleStatus(selectedUser)}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                                    selectedUser.isActive
                                        ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                                }`}
                            >
                                {selectedUser.isActive ? 'Deactivate Entity' : 'Activate Entity'}
                            </button>
                            <button
                                onClick={() => { setResetPwdUser(selectedUser); setSelectedUser(null); }}
                                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                            >
                                Reset Password
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {resetPwdUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Lock size={16} className="text-amber-500" />
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Reset Password</h3>
                            </div>
                            <button onClick={() => setResetPwdUser(null)} className="text-slate-400 hover:text-slate-600">
                                <X size={16} />
                            </button>
                        </div>

                        <p className="text-xs text-slate-500">
                            Setting a new password for <strong className="text-slate-800 dark:text-slate-200">{resetPwdUser.email}</strong>.
                        </p>

                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                    New Password *
                                </label>
                                <input
                                    type="password"
                                    required
                                    placeholder="Enter minimum 6 characters"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setResetPwdUser(null)}
                                    className="px-3 py-2 text-xs font-bold text-slate-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {actionLoading ? 'Saving...' : 'Set Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </SuperAdminLayout>
    );
}
