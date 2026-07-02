import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import SuperAdminLayout from '@/components/layouts/SuperAdminLayout';
import { superAdminService } from '@/services/super-admin.service';

export default function PlanFeatures() {
  const router = useRouter();
  const { id } = router.query;
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchPlan = async () => {
        try {
          const data = await superAdminService.getPlanById(id as string);
          setPlan(data);
        } catch (error) {
          console.error('Failed to fetch plan:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchPlan();
    }
  }, [id]);

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Synchronizing Vault...</p>
        </div>
      </SuperAdminLayout>
    );
  }

  if (!plan) {
    return (
      <SuperAdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
          <div className="h-20 w-20 bg-rose-500/10 text-rose-600 rounded-[2rem] flex items-center justify-center">
            <span className="material-icons-round text-4xl">error_outline</span>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Tier Not Found</h2>
            <p className="text-slate-500 font-medium max-w-xs mx-auto mt-2">The subscription tier you are looking for does not exist in the catalog.</p>
          </div>
          <button onClick={() => router.push('/super-admin/plans')} className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest active:scale-95 transition-transform shadow-xl">
            Return to Catalog
          </button>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <Head>
        <title>Feature Manifest: {plan.name} - EduCore</title>
      </Head>

      <div className="flex flex-col gap-1 pb-6">
        <nav className="flex items-center gap-2 text-sm mb-4 text-slate-500 dark:text-slate-400">
          <span className="hover:text-primary transition-colors cursor-pointer">Super Admin</span>
          <span className="material-icons-round text-[16px]">chevron_right</span>
          <span className="hover:text-primary transition-colors cursor-pointer" onClick={() => router.push('/super-admin/plans')}>Subscription Plans</span>
          <span className="material-icons-round text-[16px]">chevron_right</span>
          <span className="font-medium text-slate-900 dark:text-white underline decoration-primary decoration-2 underline-offset-4">Feature Manifest</span>
        </nav>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">{plan.billingCycle || 'Annual'}</span>
            <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">ID: {plan.id}</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{plan.name} Features</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Configure granular access levels and system permissions for this tier.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95 transition-all">
            <span className="material-icons-round text-lg">save</span>
            Save Configuration
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Protocol Selector */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-card-dark rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
            <div className="p-8 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800/20 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Active Capabilities</h3>
              <div className="relative">
                <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                <input className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border-none rounded-xl text-xs font-bold shadow-inner focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Filter protocols..." />
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4">
                {['LMS Integration', 'Advanced Reporting', 'API Access', 'Automated Attendance', 'Parent Portal Premium', 'Custom Branding'].map((feature, i) => (
                  <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-primary/50 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                        <span className="material-icons-round">verify</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{feature}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Active for all {plan.name} users</p>
                      </div>
                    </div>
                    <div className="h-6 w-11 bg-emerald-500 rounded-full p-1 cursor-pointer">
                      <div className="h-4 w-4 bg-white rounded-full ml-auto shadow-sm"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Metadata Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 dark:bg-slate-800/50 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-indigo-500/20">
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-1">Vault Snapshot</h3>
              <p className="text-slate-400 font-medium text-xs mb-8">Current state of {plan.name} tier.</p>

              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Tier Value</p>
                  <p className="text-3xl font-black">${plan.price || '99'}<span className="text-sm text-slate-500">/mo</span></p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Entity Limit</p>
                  <p className="text-lg font-bold">5,000 Active Nodes</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Last Manifest Sync</p>
                  <p className="text-sm font-medium text-slate-300">2 Hours Ago</p>
                </div>
              </div>
            </div>
            <span className="material-icons-round absolute -bottom-10 -right-10 text-[10rem] text-white/5 rotate-12">inventory_2</span>
          </div>

          <div className="bg-white dark:bg-card-dark rounded-[2.5rem] border border-slate-200 dark:border-slate-700 p-8 shadow-xl shadow-slate-200/40 dark:shadow-none">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-2">System Advisories</h3>
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-1">
                <span className="material-icons-round text-sm">warning</span> Deployment Alert
              </p>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed">Changing these features will affect <span className="text-slate-900 dark:text-white">128 active schools</span> currently on this tier.</p>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
