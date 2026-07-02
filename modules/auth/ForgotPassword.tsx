import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authService } from '@/services/auth.service';
import AuthLayout from '@/components/layouts/AuthLayout';
import {
    Mail,
    ArrowRight,
    Loader2,
    KeyRound,
    CheckCircle2,
    ChevronLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email format'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordValues) => {
        setLoading(true);
        try {
            await authService.forgotPassword(data.email);
            setSubmitted(true);
            toast.success('Password reset link sent.');
        } catch (err: any) {
            toast.error(err.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <AuthLayout title="Email Sent">
                <div className="text-center space-y-8">
                    <div className="size-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <CheckCircle2 size={40} />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Success</h2>
                        <p className="text-sm font-medium text-slate-500 italic px-4 leading-relaxed">
                            We have sent a password reset link to your email address. Please check your inbox.
                        </p>
                    </div>
                    <div className="pt-4 flex flex-col gap-4">
                        <Link href="/auth/login" className="w-full py-5 bg-slate-900 text-white dark:bg-primary rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                            Back to Login
                        </Link>
                        <button onClick={() => setSubmitted(false)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">
                            Didn't receive email? Try again
                        </button>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout title="Forgot Password">
            <div className="space-y-8">
                <div className="flex flex-col items-center">
                    <div className="size-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-6">
                        <KeyRound size={32} />
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none mb-3">Forgot Password</h2>
                        <p className="text-sm font-medium text-slate-500 italic">Enter your email to reset your password.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                            <Mail size={12} className="text-primary" />
                            Email Address
                        </label>
                        <input
                            {...register('email')}
                            type="email"
                            placeholder="admin@school.com"
                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl py-5 px-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/20 transition-all placeholder:text-slate-300 shadow-inner"
                        />
                        {errors.email && <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest pl-4 italic">{errors.email.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Sending email...
                            </>
                        ) : (
                            <>
                                Reset Password
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="pt-6 border-t border-slate-50 dark:border-slate-800 text-center">
                    <Link href="/auth/login" className="inline-flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">
                        <ChevronLeft size={16} /> Back to Login
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
