import React, { useState, useEffect } from 'react';
import { 
    User, 
    Mail, 
    Phone, 
    Shield, 
    Edit2, 
    Save, 
    X, 
    UserCircle,
    Key,
    Smartphone,
    Globe,
    Briefcase
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth.service';
import { toast } from 'react-hot-toast';

export default function ProfileView() {
    const { user, authenticated } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || ''
            });
        }
    }, [user]);



    if (!authenticated || !user) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">


            {/* Profile Info Card */}
            <div className="relative">
                <div className="bg-white dark:bg-surface-dark rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-3xl bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden flex items-center justify-center text-primary uppercase text-4xl font-black italic transition-transform group-hover:scale-105">
                                {user.firstName?.charAt(0) || <UserCircle size={64} />}
                            </div>

                        </div>

                        {/* Name and Role */}
                        <div className="flex-1 space-y-2 translate-y-4">
                            <div className="flex items-center justify-between">
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none">
                                    {user.firstName} {user.lastName}
                                </h1>

                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                    {user.role?.replace('_', ' ')}
                                </span>
                                <span className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                    <Shield size={12} className="text-emerald-500" />
                                    Verified Account
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Information Grid */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all group">
                            <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
                                <Mail size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all group">
                            <div className="p-3 bg-emerald-100/50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 group-hover:scale-110 transition-transform">
                                <Phone size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</p>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{user.phone || 'Not provided'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all group">
                            <div className="p-3 bg-amber-100/50 dark:bg-amber-500/10 rounded-xl text-amber-600 group-hover:scale-110 transition-transform">
                                <Key size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account ID</p>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">ID: {user.id.slice(0, 8)}...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Sections */}
            <div className="px-6">
                {/* School Details */}
                <div className="bg-white dark:bg-surface-dark rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6">
                    <div className="flex items-center gap-3">
                        <Globe size={20} className="text-primary" />
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight italic">Work Info</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Institution ID</span>
                            <span className="font-medium text-slate-900 dark:text-white">{user.schoolId || 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Last Login</span>
                            <span className="font-medium text-slate-900 dark:text-white">
                                {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' }) : 'Never'}
                            </span>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}
