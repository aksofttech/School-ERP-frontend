import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authService } from '@/services/auth.service';
import AuthLayout from '@/components/layouts/AuthLayout';
import {
    Lock,
    ArrowRight,
    Loader2,
    ShieldCheck,
    CheckCircle2,
    AlertTriangle,
    ChevronLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const resetPasswordSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
    const router = useRouter();
    const { token } = router.query;
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (router.isReady && !token) {
            toast.error('Security token missing or invalid');
        }
    }, [router.isReady, token]);

    const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordValues) => {
        if (!token) return;
        setLoading(true);
        try {
            await authService.resetPassword(token as string, data.password);
            setSuccess(true);
            toast.success('Password updated successfully.');
        } catch (err: any) {
            toast.error(err.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <AuthLayout title="Password Updated">
                <div className="text-center space-y-8">
                    <div className="size-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 size={40} />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Password Updated</h2>
                        <p className="text-sm font-medium text-slate-500 italic leading-relaxed">
                            Your password has been successfully updated. You can now log in with your new password.
                        </p>
                    </div>
                    <Link href="/auth/login" className="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                        Go to Login
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout title="Reset Password">
            <div className="space-y-8">
                <div className="text-center">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none mb-3">Reset Password</h2>
                    <p className="text-sm font-medium text-slate-500 italic">Enter your new password below.</p>
                </div>

                {!token && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3">
                        <AlertTriangle className="text-rose-500 shrink-0" size={20} />
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest leading-tight">
                            Invalid or missing reset token. Please use the link sent to your email.
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                            <Lock size={12} className="text-primary" />
                            New Password
                        </label>
                        <input
                            {...register('password')}
                            type="password"
                            placeholder="••••••••"
                            disabled={!token}
                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl py-5 px-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/20 transition-all placeholder:text-slate-300 disabled:opacity-50 shadow-inner"
                        />
                        {errors.password && <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest pl-4 italic">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Confirm New Password</label>
                        <input
                            {...register('confirmPassword')}
                            type="password"
                            placeholder="••••••••"
                            disabled={!token}
                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl py-5 px-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/20 transition-all placeholder:text-slate-300 disabled:opacity-50 shadow-inner"
                        />
                        {errors.confirmPassword && <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest pl-4 italic">{errors.confirmPassword.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !token}
                        className="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                         {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Updating password...
                            </>
                        ) : (
                            <>
                                Update Password
                                <ShieldCheck size={18} />
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
