import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AuthGuard from '@/components/guards/AuthGuard';
import { authService } from '@/services/auth.service';

function ChangePasswordPageContent() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authService.changePassword(oldPassword, newPassword);
      setMessage('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 font-sans min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Animated Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[60px] opacity-40 dark:opacity-20 animate-float z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary rounded-full blur-[60px] opacity-40 dark:opacity-20 animate-float-delayed z-0"></div>

      <div className="w-full max-w-lg bg-white/80 dark:bg-card-dark/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden z-10 relative border border-white/20 dark:border-slate-700">
        <div className="p-8 md:p-12">
          <div className="mb-10 flex flex-col items-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 to-primary text-white shadow-xl">
              <span className="material-icons-outlined text-[40px]">lock_reset</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight text-center">Update Password</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-center">Secure your account with a strong password.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-sm rounded-lg animate-in slide-in-from-top-1">
                {error}
              </div>
            )}
            {message && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-400 text-sm rounded-lg animate-in slide-in-from-top-1">
                {message}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Current Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <span className="material-icons-outlined">password</span>
                  </div>
                  <input
                    type={showOld ? 'text' : 'password'}
                    required
                    className="block w-full pl-12 pr-12 py-3.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                    placeholder="Enter current password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    <span className="material-icons-outlined">{showOld ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <span className="material-icons-outlined">lock_outline</span>
                  </div>
                  <input
                    type={showNew ? 'text' : 'password'}
                    required
                    className="block w-full pl-12 pr-12 py-3.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                    placeholder="Minimal 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    <span className="material-icons-outlined">{showNew ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Confirm New Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <span className="material-icons-outlined">verified</span>
                  </div>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    className="block w-full pl-12 pr-12 py-3.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    <span className="material-icons-outlined">{showConfirm ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:transform-none flex justify-center items-center gap-2 group"
            >
              {loading ? (
                <span className="material-icons-outlined animate-spin">refresh</span>
              ) : (
                <>
                  Update Password
                  <span className="material-icons-outlined text-xl transition-transform group-hover:translate-x-1">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-10 flex justify-center">
            <button
              onClick={() => router.back()}
              className="text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold text-sm flex items-center gap-2 transition-colors"
            >
              <span className="material-icons-outlined text-lg">arrow_back</span>
              Go back
            </button>
          </div>
        </div>
      </div>

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
  );
}

export default function ChangePasswordPage() {
  return (
    <AuthGuard>
      <ChangePasswordPageContent />
    </AuthGuard>
  );
}
