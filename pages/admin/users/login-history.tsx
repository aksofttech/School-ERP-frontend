import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '@/components/layouts/AdminLayout';
import { usersService } from '@/services/users.service';

export default function LoginHistory() {
  const router = useRouter();
  const { id } = router.query;
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      usersService.getLoginHistory(id as string)
        .then(setHistory)
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  return (
    <AdminLayout>
      <Head>
        <title>Identity Access Log - EduCore</title>
      </Head>

      <div className="flex flex-col gap-1 pb-6">
        <nav className="flex items-center gap-2 text-sm mb-4 text-slate-500 dark:text-slate-400">
          <span className="hover:text-primary transition-colors cursor-pointer" onClick={() => router.push('/admin/dashboard')}>Main Console</span>
          <span className="material-icons-round text-[16px]">chevron_right</span>
          <span className="hover:text-primary transition-colors cursor-pointer" onClick={() => router.push('/admin/users')}>User Directory</span>
          <span className="material-icons-round text-[16px]">chevron_right</span>
          <span className="font-medium text-slate-900 dark:text-white underline decoration-primary decoration-2 underline-offset-4">Security Audit</span>
        </nav>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Access Protocol Logs</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Historical audit trail for unique identity {id?.slice(-8)}.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-white transition-all active:scale-95 shadow-sm">
            Export Logs
          </button>
          <button onClick={() => router.back()} className="px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm shadow-xl hover:-translate-y-1 active:scale-95 transition-all">
            Return to Core
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-card-dark rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden pb-20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Timestamp</th>
                <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Network Node (IP)</th>
                <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Interface / Hardware</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={3} className="px-10 py-8">
                      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-lg w-full"></div>
                    </td>
                  </tr>
                ))
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-10 py-24 text-center">
                    <span className="material-icons-round text-6xl text-slate-200 mb-4 block">no_accounts</span>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Clean Audit History</h3>
                    <p className="text-slate-500 mt-2 font-medium italic text-sm">No anomalous login events detected for this node.</p>
                  </td>
                </tr>
              ) : (
                history.map((item, idx) => (
                  <tr key={idx} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-10 py-8">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{item.date}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Universal Time Protocol</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                          <span className="material-icons-round text-[18px]">hub</span>
                        </div>
                        <span className="text-sm font-black text-slate-600 dark:text-slate-300 font-mono tracking-wider">{item.ip}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${item.device.toLowerCase().includes('iphone') || item.device.toLowerCase().includes('mobile') ? 'bg-indigo-500/10 text-indigo-500' : 'bg-blue-500/10 text-blue-500'}`}>
                          <span className="material-icons-round text-xl">
                            {item.device.toLowerCase().includes('iphone') || item.device.toLowerCase().includes('mobile') ? 'smartphone' : 'desktop_windows'}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{item.device}</span>
                          <span className="text-[10px] font-bold text-slate-400 tracking-tight">Verified Hardware ID</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
