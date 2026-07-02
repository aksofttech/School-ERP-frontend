import React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import {
    Search,
    Plus,
    UserCircle2,
    MoreVertical,
    Edit3,
    ShieldAlert,
    Trash2,
    History,
    Filter,
    CheckCircle2,
    XCircle,
    MoreHorizontal
} from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/DropdownMenu';
import { Badge } from '@/components/ui/Badge';
import AdminLayout from '@/components/layouts/AdminLayout';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import { USER_ROLES } from '@/utils/role-config';
import Head from 'next/head';

export default function UsersList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('ALL');

    const {
        users,
        loading,
        error,
        pagination,
        params,
        setParams,
        deleteUser
    } = useUsers({
        page: 1,
        limit: 10,
        search: searchTerm,
        role: roleFilter === 'ALL' ? undefined : roleFilter
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setParams({ ...params, search: searchTerm, page: 1 });
    };

    const handleRoleChange = (role: string) => {
        setRoleFilter(role);
        setParams({ ...params, role: role === 'ALL' ? undefined : role, page: 1 });
    };

    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
                <>

                    <Head>
                        <title>User Management | School ERP</title>
                    </Head>
                    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Users</h1>
                                <p className="text-sm font-medium text-slate-500 italic">View and manage all system users.</p>
                            </div>
                <div className="flex items-center gap-3">
                    <Link href="/admin/users/add">
                        <Button className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20">
                            <Plus size={18} />
                            <span>New User</span>
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Stats or Quick Filters can go here */}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50 dark:bg-slate-900/50">
                    <form onSubmit={handleSearch} className="relative group max-w-md w-full">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search user by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary transition-all shadow-sm"
                        />
                    </form>

                    <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        {['ALL', 'TEACHER', 'STUDENT', 'PARENT'].map((role) => (
                            <button
                                key={role}
                                onClick={() => handleRoleChange(role)}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${roleFilter === role
                                    ? 'bg-slate-900 text-white dark:bg-primary shadow-lg'
                                    : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 hover:border-primary'
                                    }`}
                            >
                                {role.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">User</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Role</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Last Login</th>
                                <th className="px-8 py-6 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-8 py-6"><Skeleton className="h-12 w-48 rounded-xl" /></td>
                                        <td className="px-8 py-6"><Skeleton className="h-6 w-24 rounded-lg" /></td>
                                        <td className="px-8 py-6"><Skeleton className="h-6 w-20 rounded-lg" /></td>
                                        <td className="px-8 py-6"><Skeleton className="h-4 w-24 rounded-md" /></td>
                                        <td className="px-8 py-6"><Skeleton className="h-8 w-8 ml-auto rounded-lg" /></td>
                                    </tr>
                                ))
                            ) : error ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-rose-500">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="size-16 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center">
                                                <span className="text-3xl font-black">!</span>
                                            </div>
                                            <div>
                                                <p className="text-xl font-black uppercase tracking-widest">Failed to load</p>
                                                <p className="text-sm font-medium italic">{error}</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="size-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                                                <Search size={32} />
                                            </div>
                                            <div>
                                                <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">No Users Found</p>
                                                <p className="text-sm font-medium text-slate-500 italic">Try searching with a different name or email.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm group-hover:scale-110 transition-transform">
                                                    {user.profilePicture ? (
                                                        <img src={user.profilePicture} alt="" className="size-full object-cover" />
                                                    ) : (
                                                        <UserCircle2 className="text-slate-400" size={24} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">{user.firstName} {user.lastName}</p>
                                                    <p className="text-[10px] font-medium text-slate-500 italic">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <Badge variant="outline" className={`rounded-lg px-3 py-1 font-black text-[9px] uppercase tracking-widest border-2 ${user.role === 'SUPER_ADMIN' ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' :
                                                user.role === 'ADMIN' ? 'border-primary/20 text-primary bg-primary/5' :
                                                    user.role === 'TEACHER' ? 'border-indigo-500/20 text-indigo-500 bg-indigo-500/5' :
                                                        'border-slate-500/20 text-slate-500 bg-slate-500/5'
                                                }`}>
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`size-2 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-sm font-bold text-slate-400 font-mono">
                                            {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'NEVER'}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="secondary" size="sm" className="size-10 rounded-xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all">
                                                        <MoreHorizontal size={20} className="text-slate-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-slate-200 dark:border-slate-800 shadow-2xl">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/users/edit/${user.id}`} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
                                                            <Edit3 size={16} className="text-primary" />
                                                            <span className="text-xs font-black uppercase tracking-widest">Edit Profile</span>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/users/history/${user.id}`} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
                                                            <History size={16} className="text-indigo-500" />
                                                            <span className="text-xs font-black uppercase tracking-widest">Login History</span>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/users/permissions/${user.role}`} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
                                                            <ShieldAlert size={16} className="text-amber-500" />
                                                            <span className="text-xs font-black uppercase tracking-widest">Edit Permissions</span>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="my-2 bg-slate-100 dark:bg-slate-800" />
                                                    <DropdownMenuItem
                                                        onClick={() => deleteUser(user.id)}
                                                        className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-rose-500 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-500/10"
                                                    >
                                                        <Trash2 size={16} />
                                                        <span className="text-xs font-black uppercase tracking-widest">Delete User</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="p-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Showing {users.length} of {pagination.total} Users
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="secondary"
                                disabled={pagination.page === 1}
                                onClick={() => setParams({ ...params, page: pagination.page - 1 })}
                                className="rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest disabled:opacity-30"
                            >
                                Previous
                            </Button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: pagination.totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setParams({ ...params, page: i + 1 })}
                                        className={`size-8 rounded-lg text-[10px] font-black transition-all ${pagination.page === i + 1
                                            ? 'bg-slate-900 text-white dark:bg-primary'
                                            : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <Button
                                variant="secondary"
                                disabled={pagination.page === pagination.totalPages}
                                onClick={() => setParams({ ...params, page: pagination.page + 1 })}
                                className="rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest disabled:opacity-30"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            </div>
                
</>
            </RoleGuard>
        </AuthGuard>
    );
}


UsersList.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
