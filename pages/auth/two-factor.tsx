import { useState } from 'react';
import AuthGuard from '@/components/guards/AuthGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import { ToggleLeft, ToggleRight, QrCode } from 'lucide-react';

function TwoFactorPageContent() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setEnabled(!enabled);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">Security Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Manage your account security and authentication methods.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-card-dark rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300">
            <div className="p-8 md:p-10">
              <div className="flex items-start justify-between mb-8">
                <div className="flex gap-5">
                  <div className={`p-4 rounded-2xl ${enabled ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'} transition-colors duration-300`}>
                    <span className="material-icons-outlined text-3xl">{enabled ? 'verified_user' : 'gpp_maybe'}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Two-Factor Authentication</h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                      Add an extra layer of security to your account by requiring more than just a password to log in.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleToggle}
                  disabled={loading}
                  className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${enabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {enabled ? (
                <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-2xl p-6 mt-6 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400">
                    <span className="material-icons-outlined">check_circle</span>
                    <span className="font-semibold text-lg">Standard 2FA is currently active</span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 mt-6">
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <span className="material-icons-outlined">info</span>
                    <span className="font-medium">2FA is recommended to protect your sensitive data</span>
                  </div>
                </div>
              )}
            </div>

            {enabled && (
              <div className="border-t border-slate-100 dark:border-slate-800 p-8 md:p-10 bg-slate-50/30 dark:bg-slate-900/20 animate-in fade-in duration-700">
                <div className="flex flex-col md:flex-row gap-10">
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                      <QrCode size={160} className="text-slate-900 dark:text-white" />
                    </div>
                    <button className="mt-4 text-primary hover:text-primary-hover font-bold text-sm flex items-center gap-1 transition-colors">
                      <span className="material-icons-outlined text-base">refresh</span>
                      Regenerate
                    </button>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Set up Authenticator App</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-6">
                      1. Open your authenticator app (Google Authenticator, Authy, etc.)<br />
                      2. Scan the QR code or enter the setup key below<br />
                      3. Enter the 6-digit code from the app to verify
                    </p>
                    <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm group">
                      <span className="text-slate-400 material-icons-outlined">vpn_key</span>
                      <code className="flex-1 font-mono text-slate-700 dark:text-slate-300 font-bold tracking-widest uppercase">JBSW Y3DP EHPK 3PXP</code>
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-primary transition-all">
                        <span className="material-icons-outlined">content_copy</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-primary to-purple-600 rounded-3xl p-8 text-white shadow-xl shadow-primary/20 flex items-center justify-between">
            <div className="max-w-md">
              <h3 className="text-2xl font-bold mb-2">Back Up Codes</h3>
              <p className="text-white/80 leading-relaxed">Download recovery codes to keep in a safe place in case you lose access to your authenticator app.</p>
            </div>
            <button className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl font-bold transition-all flex items-center gap-2">
              <span className="material-icons-outlined">download</span>
              Download
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card-light dark:bg-card-dark rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="material-icons-outlined text-primary">history</span>
              Security Log
            </h4>
            <div className="space-y-6">
              {[
                { event: 'Password changed', time: '2 days ago', icon: 'key' },
                { event: 'New login from Chrome', time: '5 days ago', icon: 'devices' },
                { event: '2FA method added', time: '1 week ago', icon: 'security' }
              ].map((log, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-500 dark:text-slate-400">
                    <span className="material-icons-outlined text-xl">{log.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{log.event}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 text-slate-500 hover:text-primary font-bold text-sm border-t border-slate-100 dark:border-slate-800 pt-6 transition-colors">
              View all activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TwoFactorPage() {
  return (
    <AuthGuard>
      <AdminLayout>
        <TwoFactorPageContent />
      </AdminLayout>
    </AuthGuard>
  );
}
