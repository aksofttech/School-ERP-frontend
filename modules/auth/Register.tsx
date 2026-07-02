import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authService } from '@/services/auth.service';
import AuthLayout from '@/components/layouts/AuthLayout';
import {
    Mail,
    Lock,
    User,
    School,
    ArrowRight,
    Loader2,
    CheckCircle2,
    ShieldCheck,
    Building2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const registerSchema = z.object({
    schoolName: z.string().min(3, 'School name must be at least 3 characters'),
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setLoading(true);
        try {
            await authService.register(data);
            toast.success('Account created successfully. Please login to proceed.');
            router.push('/auth/login');
        } catch (err: any) {
            toast.error(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Create School Account">
            <div className="space-y-8">
                <div className="text-center">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none mb-3">Get Started</h2>
                    <p className="text-sm font-medium text-slate-500 italic">Set up your school management system in minutes.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                            <Building2 size={12} className="text-primary" />
                            School Name
                        </label>
                        <input
                            {...register('schoolName')}
                            placeholder="e.g. Green Valley High School"
                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl py-4 px-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/20 transition-all placeholder:text-slate-300"
                        />
                        {errors.schoolName && <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest pl-4 italic">{errors.schoolName.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">First Name</label>
                            <input
                                {...register('firstName')}
                                placeholder="John"
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/20 transition-all"
                            />
                            {errors.firstName && <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest pl-4 italic">{errors.firstName.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Last Name</label>
                            <input
                                {...register('lastName')}
                                placeholder="Doe"
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/20 transition-all"
                            />
                            {errors.lastName && <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest pl-4 italic">{errors.lastName.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                            <Mail size={12} className="text-primary" />
                            Email Address
                        </label>
                        <input
                            {...register('email')}
                            type="email"
                            placeholder="admin@school.com"
                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl py-4 px-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/20 transition-all placeholder:text-slate-300"
                        />
                        {errors.email && <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest pl-4 italic">{errors.email.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                                <Lock size={12} className="text-primary" />
                                Password
                            </label>
                            <input
                                {...register('password')}
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/20 transition-all"
                            />
                            {errors.password && <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest pl-4 italic">{errors.password.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Confirm Password</label>
                            <input
                                {...register('confirmPassword')}
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/20 transition-all"
                            />
                            {errors.confirmPassword && <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest pl-4 italic">{errors.confirmPassword.message}</p>}
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                        <div className="flex items-start gap-3">
                            <ShieldCheck size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                            <p className="text-[10px] font-bold text-slate-500 italic uppercase leading-relaxed tracking-wider">
                                By signing up, you agree to our terms and conditions and privacy policy.
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-slate-900 text-white dark:bg-primary rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            <>
                                Create Account
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="pt-6 border-t border-slate-50 dark:border-slate-800 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-4">Already have an account?</p>
                    <Link href="/auth/login" className="inline-flex items-center gap-2 text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest hover:text-primary transition-colors">
                        Login here <CheckCircle2 size={16} />
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
