import React from 'react';
import { useState, useEffect } from 'react';
import {
  MapPin,
  Map,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Activity,
  Navigation,
  Clock,
  Compass,
  ArrowRight,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTransport } from '@/hooks/useTransport';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import AdminLayout from '@/components/layouts/AdminLayout';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import { USER_ROLES } from '@/utils/role-config';
import Head from 'next/head';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';

const routeSchema = z.object({
  name: z.string().min(3, 'Route identifier too short'),
  startLocation: z.string().min(3, 'Origin node required'),
  endLocation: z.string().min(3, 'Destination node required'),
  fare: z.string().min(1, 'Tariff protocol required'),
  capacity: z.number().min(1, 'Capacity node required'),
});

type RouteFormValues = z.infer<typeof routeSchema>;

export default function TransportRoutes() {
  const [activeTab, setActiveTab] = useState<'registry' | 'create'>('registry');
  const { loading, routes, fetchRoutes, createRoute } = useTransport();
  const [registering, setRegistering] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<RouteFormValues>({
    resolver: zodResolver(routeSchema),
  });

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  const onRegister = async (data: RouteFormValues) => {
    setRegistering(true);
    const success = await createRoute(data);
    if (success) {
      reset();
      setActiveTab('registry');
    }
    setRegistering(false);
  };

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={[USER_ROLES.SCHOOL_ADMIN, USER_ROLES.SUPER_ADMIN]}>
        <>

          <Head>
            <title>Transport Routes | School ERP</title>
          </Head>
          <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Logistics: Transport Routes</h1>
                <p className="text-sm font-medium text-slate-500 italic">Configure institutional transit pathways and synchronize fleet movement protocols.</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setActiveTab('create')}
                  className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20"
                >
                  <Plus size={18} />
                  Register Transit Pathway
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Network Reach', value: '48 Routes', icon: <Map className="text-primary" /> },
                { label: 'Daily Transfers', value: '1,240', icon: <Activity className="text-indigo-500" /> },
                { label: 'Active Coverage', value: '98.5%', icon: <Compass className="text-emerald-500" /> },
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl flex items-center gap-6 group hover:border-primary/50 transition-all">
                  <div className="size-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform text-slate-400 group-hover:text-primary">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{stat.value}</h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
              <div className="p-10">
                {activeTab === 'create' ? (
                  <div className="space-y-10">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-8">
                      <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Route Architecture</h2>
                      <button onClick={() => setActiveTab('registry')} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Return to Registry</button>
                    </div>
                    <form onSubmit={handleSubmit(onRegister)} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Pathway Identifier (Name)</label>
                          <input
                            {...register('name')}
                            placeholder="North Corridor Express..."
                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-5 px-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Origin Node (Start Location)</label>
                          <input
                            {...register('startLocation')}
                            placeholder="Main Campus Hub..."
                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-5 px-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Destination Node (End Location)</label>
                          <input
                            {...register('endLocation')}
                            placeholder="Central Railway Terminal..."
                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-5 px-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Tariff Token (Fare)</label>
                            <input
                              {...register('fare')}
                              placeholder="₹45.00"
                              className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-5 px-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Payload Capacity</label>
                            <input
                              type="number"
                              {...register('capacity', { valueAsNumber: true })}
                              placeholder="42"
                              className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-5 px-8 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-2 flex justify-end">
                        <Button
                          type="submit"
                          disabled={registering}
                          className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-12 py-6 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95"
                        >
                          {registering ? <Activity size={18} className="animate-spin" /> : <Navigation size={18} />}
                          Deploy Pathway
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="relative group max-w-md w-full">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                        <input
                          type="text"
                          placeholder="Sync Route Identifier..."
                          className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-100 dark:ring-slate-800 focus:ring-2 focus:ring-primary transition-all"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Button variant="secondary" className="rounded-xl px-6 py-4 h-auto font-black text-[10px] uppercase tracking-widest gap-2 border-2">
                          <Filter size={14} />
                          Matrix Filter
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                          <Skeleton key={i} className="h-48 rounded-3xl" />
                        ))
                      ) : routes.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border-4 border-dashed border-slate-100 dark:border-slate-800">
                          <div className="flex flex-col items-center gap-4">
                            <div className="size-20 rounded-full bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-slate-200">
                              <Map size={40} />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Transit Registry Empty</p>
                          </div>
                        </div>
                      ) : (
                        routes.map((route) => (
                          <div key={route.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-slate-50 dark:border-slate-800 p-8 space-y-6 hover:border-primary/30 transition-all group overflow-hidden relative shadow-lg hover:shadow-2xl">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{route.name}</h3>
                                <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-widest px-3">
                                  ACTIVE_ROUTE
                                </Badge>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="size-10 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-all">
                                    <MoreVertical size={20} />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl">
                                  <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
                                    <TrendingUp size={16} className="text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Efficiency Logs</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
                                    <Navigation size={16} className="text-indigo-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Adjust Nodes</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            <div className="flex items-center justify-between gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl relative">
                              <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Origin</p>
                                <p className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase truncate max-w-[120px]">{route.startLocation}</p>
                              </div>
                              <div className="flex-1 flex items-center justify-center">
                                <div className="flex-1 h-px bg-slate-200 dark:border-slate-700 border-dashed border-t-2 self-center mx-2"></div>
                                <div className="size-8 rounded-full bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                  <ArrowRight size={16} />
                                </div>
                                <div className="flex-1 h-px bg-slate-200 dark:border-slate-700 border-dashed border-t-2 self-center mx-2"></div>
                              </div>
                              <div className="space-y-1 text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination</p>
                                <p className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase truncate max-w-[120px]">{route.endLocation}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                              <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                  <Activity size={14} className="text-slate-400" />
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CAP: {route.capacity}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock size={14} className="text-slate-400" />
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">FARE: {route.fare}</span>
                                </div>
                              </div>
                              <Button variant="ghost" className="text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary/5 rounded-xl gap-2 h-auto px-4 py-2">
                                View Spectrum
                                <ChevronRight size={14} />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        
</>
      </RoleGuard>
    </AuthGuard>
  );
}


TransportRoutes.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
