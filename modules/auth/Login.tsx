import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { getDashboardRoute } from '@/utils/role-config';
import AuthLayout from '@/components/layouts/AuthLayout';
import Alert from '@/components/ui/Alert';
import { APP_NAME } from '@/utils/constants';
import {
    Mail,
    Lock,
    ArrowRight,
    Loader2,
    AlertCircle,
    Eye,
    EyeOff,
    UserCircle2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const loginSchema = z.object({
    email: z.string().email('Invalid Email ID format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
    const router = useRouter();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [activeRole, setActiveRole] = useState<'Admin' | 'Teacher' | 'Student' | 'Parent'>('Admin');

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        }
    });

    const onSubmit = async (data: LoginFormValues) => {
        setLoading(true);
        setLoginError(null);
        try {
            const { email, password, rememberMe } = data;
            const user = await login({ email, password }, rememberMe);
            toast.success(`Success! Welcome to ${APP_NAME}.`);

            const dashboardRoute = getDashboardRoute(user.role);
            if (dashboardRoute) {
                router.push(dashboardRoute);
            } else {
                router.push('/');
            }
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || 'Invalid credentials. Please try again.';
            setLoginError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout 
            title="Login" 
            subtitle="Please sign in to your school account."
        >
            <div className="space-y-6">
                {loginError && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white shrink-0">
                            <AlertCircle size={18} />
                        </div>
                        <p className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-tight">
                            {loginError}
                        </p>
                    </div>
                )}

                <div className="space-y-3">
                    {/* Role Selection */}
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
                        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                            Choose Your Role
                        </label>
                        <div className="grid grid-cols-4 gap-2 p-1 bg-slate-50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-100 dark:border-slate-800">
                            {(['Admin', 'Teacher', 'Student', 'Parent'] as const).map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => setActiveRole(role)}
                                    className={`relative px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 ${activeRole === role
                                        ? 'bg-white dark:bg-slate-700 text-primary shadow-[0_4px_12px_rgba(0,0,0,0.05)] scale-[1.02] z-10'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50'
                                        }`}
                                >
                                    {role}
                                    {activeRole === role && (
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" autoComplete="off">
                        {/* Email Field */}
                        <div className="space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1" htmlFor="email">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <Mail size={20} className="text-slate-400 group-focus-within:text-primary transition-colors duration-300" />
                                </div>
                                <input
                                    {...register('email')}
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className={`w-full bg-slate-50 dark:bg-slate-800/50 border-2 py-3.5 pl-12 pr-4 rounded-[1.25rem] outline-none transition-all duration-300 focus:bg-white dark:focus:bg-slate-900 border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 dark:text-white placeholder:text-slate-400 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/5' : ''}`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-[10px] text-red-500 font-extrabold uppercase tracking-widest pl-4 mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1" htmlFor="password">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <Lock size={20} className="text-slate-400 group-focus-within:text-primary transition-colors duration-300" />
                                </div>
                                <input
                                    {...register('password')}
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={`w-full bg-slate-50 dark:bg-slate-800/50 border-2 py-3.5 pl-12 pr-12 rounded-[1.25rem] outline-none transition-all duration-300 focus:bg-white dark:focus:bg-slate-900 border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 dark:text-white placeholder:text-slate-400 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/5' : ''}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-primary transition-colors duration-300"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-[10px] text-red-500 font-extrabold uppercase tracking-widest pl-4 mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Form Utilities */}
                        <div className="flex items-center justify-between px-1 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-400">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        {...register('rememberMe')}
                                        type="checkbox"
                                        id="remember-me"
                                        className="peer sr-only"
                                    />
                                    <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 peer-checked:bg-primary peer-checked:border-primary transition-all duration-300"></div>
                                    <div className="absolute opacity-0 peer-checked:opacity-100 transition-opacity duration-300 text-white">
                                        <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 4L4.5 7.5L11 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                                    Remember me
                                </span>
                            </label>
                            <Link href="/auth/forgot-password" className="text-sm font-bold text-primary hover:text-indigo-700 dark:hover:text-indigo-400 transition-all duration-300 hover:scale-105 active:scale-95 px-1">
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full relative group overflow-hidden bg-primary hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-[1.25rem] shadow-[0_20px_40px_-12px_rgba(79,70,229,0.35)] transition-all flex justify-center items-center gap-3 hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:translate-y-0 disabled:scale-100 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-500"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
                            
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    <span>Logging in...</span>
                                </>
                            ) : (
                                <>
                                    <span>Login</span>
                                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Secondary Action */}
                    <div className="text-center animate-in fade-in duration-1000 delay-700">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            Don't have an account?{' '}
                            <a href="#" className="text-primary font-bold hover:underline underline-offset-4">
                                Contact Admin
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
