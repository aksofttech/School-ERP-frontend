import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import SuperAdminLayout from '@/components/layouts/SuperAdminLayout';
import { superAdminService } from '@/services/super-admin.service';

export default function PlansList() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await superAdminService.getPlans();
        setPlans(data.data || []);
      } catch (error) {
        console.error('Failed to fetch plans:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <SuperAdminLayout>
      <Head>
        <title>Subscription Plans - Super Admin</title>
      </Head>

      <div className="flex flex-col gap-1 pb-6">
        <nav className="flex items-center gap-2 text-sm mb-4 text-slate-500 dark:text-slate-400">
          <span className="hover:text-primary transition-colors cursor-pointer">Super Admin</span>
          <span className="material-icons-round text-[16px]">chevron_right</span>
          <span className="font-medium text-slate-900 dark:text-white underline decoration-primary decoration-2 underline-offset-4">Subscription Plans</span>
        </nav>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Monetization Models</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Strategic subscription tiers and enterprise pricing structures.</p>
        </div>
        <button className="flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl hover:-translate-y-1 active:scale-95">
          <span className="material-icons-round text-xl">add_card</span>
          <span>Draft New Tier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white dark:bg-card-dark rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 animate-pulse">
              <div className="h-8 w-32 bg-slate-100 dark:bg-slate-800 rounded-lg mb-6"></div>
              <div className="h-12 w-48 bg-slate-100 dark:bg-slate-800 rounded-lg mb-8"></div>
              <div className="space-y-4">
                {Array(4).fill(0).map((_, j) => (
                  <div key={j} className="h-4 w-full bg-slate-50 dark:bg-slate-800/50 rounded-lg"></div>
                ))}
              </div>
            </div>
          ))
        ) : plans.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white dark:bg-card-dark rounded-[2.5rem] border border-slate-100 dark:border-slate-800 border-dashed">
            <span className="material-icons-round text-6xl text-slate-200 mb-4 block">payments</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">No active plans found</h3>
            <p className="text-slate-500 mt-2 font-medium">Initiate your business strategy by creating your first subscription tier.</p>
          </div>
        ) : (
          plans.map((plan) => (
            <div key={plan.id} className="group relative bg-white dark:bg-card-dark rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-700 hover:border-primary transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2">
              <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-2xl ${plan.name.includes('Pro') ? 'bg-primary/10 text-primary' : plan.name.includes('Enterprise') ? 'bg-indigo-500/10 text-indigo-500' : 'bg-slate-100 text-slate-500'}`}>
                  <span className="material-icons-round text-3xl">{plan.name.includes('Pro') ? 'rocket_launch' : plan.name.includes('Enterprise') ? 'diamond' : 'bolt'}</span>
                </div>
                {plan.name.includes('Pro') && (
                  <span className="px-4 py-1.5 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/25">Popular</span>
                )}
              </div>

              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{plan.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8">Tailored for growing institutions requiring advanced controls.</p>

              <div className="flex items-baseline gap-1 mb-10">
                <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">${plan.price}</span>
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">/ Per Month</span>
              </div>

              <div className="space-y-5 mb-12">
                {plan.features?.map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="material-icons-round text-primary text-[14px]">check</span>
                    </div>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href={`/super-admin/plans/features?id=${plan.id}`}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-black text-sm hover:bg-primary hover:text-white transition-all group/btn"
              >
                Configure Features
                <span className="material-icons-round text-xl group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
              </Link>

              {/* Decorative Background Glow */}
              <div className="absolute -right-10 -bottom-10 h-32 w-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
            </div>
          ))
        )}
      </div>
    </SuperAdminLayout>
  );
}
