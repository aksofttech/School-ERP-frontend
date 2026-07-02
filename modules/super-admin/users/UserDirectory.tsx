import { useState } from 'react';
import {
    Users,
    Search,
    Shield,
    MoreVertical,
    UserPlus
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

export default function UserDirectory() {
    const [users, setUsers] = useState([
        { id: 1, name: 'Alice Admin', email: 'alice@springfield.edu', role: 'SCHOOL_ADMIN', school: 'Springfield High', status: 'ACTIVE' },
        { id: 2, name: 'Bob Principal', email: 'bob@riverdale.edu', role: 'SCHOOL_ADMIN', school: 'Riverdale Academy', status: 'ACTIVE' },
        { id: 3, name: 'Charlie Teacher', email: 'charlie@springfield.edu', role: 'TEACHER', school: 'Springfield High', status: 'LOCKED' },
        { id: 4, name: 'Diana Parent', email: 'diana@gmail.com', role: 'PARENT', school: 'Springfield High', status: 'ACTIVE' },
        { id: 5, name: 'Eve Student', email: 'eve@riverdale.edu', role: 'STUDENT', school: 'Riverdale Academy', status: 'ACTIVE' },
    ]);
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddUser = () => {
        toast('Opening Global User Provisioning...', { icon: '👤' });
        // Should open a modal
    };

    const handleDeleteUser = (id: number) => {
        if (confirm('Are you sure you want to revoke global access for this user?')) {
            toast.success('User access revoked.');
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.school.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-2 mb-2 text-indigo-500 border-indigo-200 bg-indigo-50">
                        USER: GLOBAL LIST
                    </Badge>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        User Directory
                    </h1>
                    <p className="text-sm font-medium text-slate-500 italic">
                        Search and manage users across all tenants.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search user by email or ID..."
                            className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:ring-indigo-500 focus:border-indigo-500 w-64"
                        />
                    </div>
                    <Button 
                        onClick={handleAddUser}
                        className="bg-indigo-600 text-white rounded-xl px-4 py-2 h-auto font-bold text-xs uppercase tracking-wide hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 gap-2">
                        <UserPlus size={16} />
                        Add Global User
                    </Button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">User Profile</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Global Role</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Tenant</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-8 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold">
                                            {user.name?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-900 dark:text-white">{user.name}</p>
                                            <p className="text-xs text-slate-400">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-4">
                                    <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wider bg-slate-50 dark:bg-slate-800/50">
                                        <Shield size={10} className="mr-1" />
                                        {user.role}
                                    </Badge>
                                </td>
                                <td className="px-8 py-4">
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{user.school}</span>
                                </td>
                                <td className="px-8 py-4">
                                    <Badge className={`${user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} border-none font-bold text-[9px]`}>
                                        {user.status}
                                    </Badge>
                                </td>
                                <td className="px-8 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="text-slate-400 hover:text-indigo-500"
                                            onClick={() => toast('Profile editor is currently under scheduled maintenance.', { icon: '⚙️' })}
                                        >
                                            <Shield size={16} />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="text-slate-400 hover:text-red-500"
                                            onClick={() => handleDeleteUser(user.id)}
                                        >
                                            <MoreVertical size={16} />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
