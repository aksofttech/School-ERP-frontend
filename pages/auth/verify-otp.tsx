import Head from 'next/head';
import Link from 'next/link';

export default function VerifyOTP() {
    return (
        <>
            <Head>
                <title>Identity Verification - School ERP</title>
                <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            </Head>
            <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 font-sans min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
                {/* Animated Blobs */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-[50px] opacity-60 dark:opacity-30 animate-float z-0"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[50px] opacity-60 dark:opacity-30 animate-float-delayed z-0"></div>

                <div className="absolute inset-0 opacity-5 dark:opacity-[0.03] pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                <div className="w-full max-w-lg bg-white dark:bg-card-dark rounded-2xl shadow-2xl overflow-hidden z-10 relative border border-slate-200 dark:border-slate-700">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-primary"></div>

                    <div className="p-8 md:p-12 flex flex-col items-center">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <span className="material-icons-outlined text-[40px]">lock_person</span>
                        </div>

                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Verify Your Identity</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-base">
                                We&apos;ve sent a 6-digit verification code to <span className="font-semibold text-slate-900 dark:text-slate-200">pr*******@school.edu</span>.
                            </p>
                        </div>

                        <div className="w-full flex justify-center gap-3 mb-8">
                            {[...Array(6)].map((_, i) => (
                                <input
                                    key={i}
                                    className="w-12 h-14 text-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-2xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm"
                                    maxLength={1}
                                    placeholder="-"
                                    type="text"
                                />
                            ))}
                        </div>

                        <button
                            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/30 text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-[1.02] group"
                            type="button"
                        >
                            Verify Account
                            <span className="material-icons-outlined text-lg ml-2 transition-transform group-hover:translate-x-1">arrow_forward</span>
                        </button>

                        <div className="mt-8 flex flex-col items-center gap-4">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Didn&apos;t receive the code?
                                <button className="font-bold text-primary hover:underline ml-1">Resend (00:30)</button>
                            </p>
                            <Link href="/auth/login" className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors group">
                                <span className="material-icons-outlined text-lg transition-transform group-hover:-translate-x-1">arrow_back</span>
                                <span>Back to Log In</span>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-4 border-t border-slate-100 dark:border-slate-700 text-center text-xs text-slate-400">
                        <p>© 2024 School ERP System. All rights reserved.</p>
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
