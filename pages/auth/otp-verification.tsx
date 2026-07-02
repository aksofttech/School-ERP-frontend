import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { authService } from '@/services/auth.service';

export default function OTPVerificationPage() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const isValid = await authService.verifyOTP(otp);
      if (isValid) {
        router.push('/admin/dashboard');
      } else {
        throw new Error('Invalid OTP Code');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Verify OTP - School ERP</title>
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      </Head>
      <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 font-sans min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
        {/* Animated Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-[50px] opacity-60 dark:opacity-30 animate-float z-0"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500 rounded-full blur-[50px] opacity-60 dark:opacity-30 animate-float-delayed z-0"></div>

        <div className="absolute inset-0 opacity-5 dark:opacity-[0.03] pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

        <div className="w-full max-w-md bg-white dark:bg-card-dark rounded-2xl shadow-2xl overflow-hidden z-10 relative border border-slate-200 dark:border-slate-700">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 to-primary"></div>

          <div className="p-8 md:p-10 flex flex-col items-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-purple-600 text-white shadow-lg">
              <span className="material-icons-outlined text-3xl">verified_user</span>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">OTP Verification</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Enter the 6-digit code sent to your device
              </p>
            </div>

            {error && (
              <div className="w-full mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-sm rounded">
                {error}
              </div>
            )}

            <form className="w-full space-y-6" onSubmit={handleSubmit}>
              <div>
                <input
                  id="otp"
                  className="block w-full px-4 py-4 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-primary text-center text-3xl tracking-[1.2rem] font-mono outline-none transition-all"
                  placeholder="000000"
                  maxLength={6}
                  required
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                />
                <p className="mt-3 text-xs text-center text-slate-500">Test Code: <span className="font-mono">123456</span></p>
              </div>

              <button
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/30 text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed group"
                type="submit"
                disabled={loading}
              >
                <span>{loading ? 'Verifying...' : 'Verify & Proceed'}</span>
                {!loading && <span className="material-icons-outlined text-lg ml-2 transition-transform group-hover:translate-x-1">arrow_forward</span>}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Didn&apos;t receive the code?
                <button className="font-medium text-primary hover:underline ml-1 focus:outline-none">
                  Resend Code
                </button>
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-[10px] uppercase tracking-wider font-semibold text-slate-400">
            <span>© 2024 School ERP</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">Help</a>
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            </div>
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <button
          aria-label="Toggle Dark Mode"
          className="fixed bottom-4 right-4 p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors z-50 focus:outline-none"
          onClick={() => document.documentElement.classList.toggle('dark')}
        >
          <span className="material-icons-outlined dark:hidden">dark_mode</span>
          <span className="material-icons-outlined hidden dark:inline">light_mode</span>
        </button>

        <style jsx global>{`
          @keyframes float {
            0% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(30px, 30px) rotate(10deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
          }
          .animate-float {
            animation: float 10s infinite ease-in-out;
          }
          .animate-float-delayed {
            animation: float 10s infinite ease-in-out;
            animation-delay: 5s;
          }
        `}</style>
      </div>
    </>
  );
}
