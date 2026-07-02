import Image from 'next/image';
import React, { ReactNode } from 'react';
import { GraduationCap, CheckCircle, ShieldCheck, Zap, Globe } from 'lucide-react';
import { APP_NAME } from '@/utils/constants';

interface AuthLayoutProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-800 dark:text-slate-200 font-sans flex flex-col relative overflow-hidden transition-colors duration-500">
            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 dark:bg-secondary/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none z-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:32px_32px]"></div>

            <div className="w-full flex-1 flex flex-col md:flex-row z-10 relative">
                {/* Left Side - Visual Content (Desktop Only) */}
                <div className="w-full md:w-1/2 relative hidden md:flex flex-col justify-between p-12 lg:p-16 text-white overflow-hidden">
                    {/* Background with Overlay */}
                    <div className="absolute inset-0 z-0">
                        <Image 
                            src="/login-bg.png" 
                            className="w-full h-full object-cover"
                            alt="School Management"
                            fill
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/80 to-indigo-900/90 mix-blend-multiply"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent)]"></div>
                    </div>

                    {/* Branding */}
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                            <GraduationCap size={24} className="text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">{APP_NAME}</span>
                    </div>

                    {/* Central Content */}
                    <div className="relative z-10 mt-12">
                        <h1 className="text-5xl font-extrabold mb-6 leading-[1.1] tracking-tight text-white drop-shadow-sm">
                            Smart School <br />
                            <span className="text-indigo-200">Management.</span>
                        </h1>
                        <p className="text-indigo-50/80 text-lg font-medium max-w-sm leading-relaxed">
                            Everything you need to manage your school in one simple place.
                        </p>
                    </div>

                    {/* Feature Chips */}
                    <div className="relative z-10 flex flex-wrap gap-3 mt-8">
                        {[
                            { icon: <ShieldCheck size={16} />, label: 'Secure' },
                            { icon: <Zap size={16} />, label: 'Fast' },
                            { icon: <Globe size={16} />, label: 'Online' }
                        ].map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-semibold mb-2">
                                {feature.icon}
                                <span>{feature.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Footer Info */}
                    <div className="relative z-10 mt-auto pt-6">
                        <div className="flex -space-x-3 mb-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 relative">
                                    <Image
                                        className="rounded-full border-2 border-white/20 object-cover"
                                        src={`https://i.pravatar.cc/100?img=${i + 10}`}
                                        alt="User"
                                        fill
                                        unoptimized
                                    />
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-white/20 bg-primary/50 backdrop-blur-md flex items-center justify-center text-[10px] font-bold">
                                500+
                            </div>
                        </div>
                        <p className="text-xs text-indigo-100 font-medium opacity-70 italic">
                            Used by top schools everywhere.
                        </p>
                    </div>
                </div>

                {/* Right Side - Authentication Form */}
                <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center bg-white dark:bg-slate-900/40 relative">
                    {/* Mobile Header */}
                    <div className="md:hidden flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <GraduationCap size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{APP_NAME}</h2>
                    </div>

                    <div className="mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
                            {title || 'Welcome'}
                        </h2>
                        <div className="w-10 h-1 bg-primary rounded-full mb-3"></div>
                        <p className="text-slate-500 dark:text-slate-400 text-base font-medium leading-relaxed">
                            {subtitle || 'Login to manage your school.'}
                        </p>
                    </div>

                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        {children}
                    </div>

                    {/* Enhanced Footer */}
                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-1000 delay-500">
                        <p className="text-xs tracking-wide text-slate-400 dark:text-slate-500 font-semibold uppercase">
                            © {new Date().getFullYear()} {APP_NAME}
                        </p>
                        <div className="flex gap-6">
                            <a href="#" className="text-xs font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest">Support</a>
                            <a href="#" className="text-xs font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest">Privacy</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
