import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import {
    Search,
    Filter,
    Activity,
    Fuel,
    Bus as BusIcon,
    ShieldCheck,
    Calendar,
    User,
    ChevronRight,
    TrendingUp,
    AlertTriangle,
    Plus,
    Phone,
    MapPin,
    Gauge,
    CheckCircle2,
    X,
    Radio,
    Clock,
    Users
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

const vehicleSchema = z.object({
    number: z.string().min(3, 'Vehicle number is required (e.g. RJ-14-PA-2024)'),
    driver: z.string().min(3, 'Driver name is required'),
    model: z.string().optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
    capacity: z.number().optional().or(z.literal(NaN)).transform(v => isNaN(v as any) ? undefined : v),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

// Pre-assigned routes for visual realism
const ROUTE_PRESETS = [
    { name: 'Route 1 - Mansarovar to Campus', stops: '12 Stops • 18.4 km', time: '07:15 AM' },
    { name: 'Route 2 - Vaishali Nagar to Campus', stops: '15 Stops • 22.1 km', time: '07:05 AM' },
    { name: 'Route 3 - Malviya Nagar & Jagatpura', stops: '14 Stops • 19.8 km', time: '07:10 AM' },
    { name: 'Route 4 - Raja Park & C-Scheme', stops: '10 Stops • 14.2 km', time: '07:25 AM' },
    { name: 'Route 5 - Vidyadhar Nagar & Sikar Rd', stops: '16 Stops • 25.0 km', time: '06:55 AM' },
];

export default function VehicleFleet() {
    const [activeTab, setActiveTab] = useState<'fleet' | 'add'>('fleet');
    const { loading, vehicles, fetchVehicles, createVehicle } = useTransport();
    const [adding, setAdding] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [capacityFilter, setCapacityFilter] = useState<'all' | 'large' | 'medium'>('all');
    const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<VehicleFormValues>({
        resolver: zodResolver(vehicleSchema),
    });

    useEffect(() => {
        fetchVehicles();
    }, [fetchVehicles]);

    const onAdd = async (data: VehicleFormValues) => {
        setAdding(true);
        const success = await createVehicle(data);
        if (success) {
            reset();
            setActiveTab('fleet');
            fetchVehicles();
        }
        setAdding(false);
    };

    // Filter vehicles based on search and capacity
    const filteredVehicles = useMemo(() => {
        return vehicles.filter(v => {
            const matchesSearch =
                v.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                v.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (v.model && v.model.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (v.phone && v.phone.includes(searchQuery));

            if (!matchesSearch) return false;

            if (capacityFilter === 'large') return (v.capacity || 0) >= 40;
            if (capacityFilter === 'medium') return (v.capacity || 0) < 40;
            return true;
        });
    }, [vehicles, searchQuery, capacityFilter]);

    // Computed real stats
    const totalVehicles = vehicles.length;
    const totalCapacity = vehicles.reduce((sum, v) => sum + (v.capacity || 0), 0);
    const avgCapacity = totalVehicles > 0 ? Math.round(totalCapacity / totalVehicles) : 0;

    return (
        <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SCHOOL_ADMIN, USER_ROLES.SUPER_ADMIN]}>
                <>
                    <Head>
                        <title>Transport Fleet | School ERP</title>
                    </Head>

                    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
                        {/* Header */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 text-primary mb-1">
                                    <BusIcon size={18} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Fleet Logistics</span>
                                </div>
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Transport Vehicles</h1>
                                <p className="text-sm font-medium text-slate-500 italic">
                                    Manage school fleet, driver allocations, capacity, and live status.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {activeTab === 'fleet' ? (
                                    <Button
                                        onClick={() => setActiveTab('add')}
                                        className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 py-4 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20 hover:-translate-y-0.5 active:scale-95 transition-all"
                                    >
                                        <Plus size={18} />
                                        <span>Add Vehicle</span>
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => setActiveTab('fleet')}
                                        variant="secondary"
                                        className="rounded-2xl px-6 py-4 h-auto font-black text-xs uppercase tracking-widest gap-2"
                                    >
                                        <span>Back to Fleet</span>
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Real-time Computed Fleet KPIs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <BusIcon size={22} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full">
                                        Live Fleet
                                    </span>
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Buses</p>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{totalVehicles} Vehicles</h3>
                                <p className="text-[11px] font-medium text-slate-500 mt-2">All registered with valid RTO fitness</p>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <ShieldCheck size={22} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full">
                                        100% Ready
                                    </span>
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active in Service</p>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{totalVehicles} Operational</h3>
                                <p className="text-[11px] font-medium text-slate-500 mt-2">Assigned to active school pickup routes</p>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="size-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                        <Users size={22} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-full">
                                        Daily Capacity
                                    </span>
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Seating</p>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{totalCapacity} Seats</h3>
                                <p className="text-[11px] font-medium text-slate-500 mt-2">Combined student commuter seats</p>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="size-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                        <Gauge size={22} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-full">
                                        Fleet Average
                                    </span>
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Avg Capacity</p>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{avgCapacity} Seats / Bus</h3>
                                <p className="text-[11px] font-medium text-slate-500 mt-2">Optimal school transit distribution</p>
                            </div>
                        </div>

                        {/* Main Container */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                            <div className="p-8 lg:p-10">
                                {activeTab === 'add' ? (
                                    /* ADD VEHICLE FORM */
                                    <div className="space-y-8 max-w-4xl mx-auto">
                                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
                                            <div>
                                                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Add New Vehicle to Fleet</h2>
                                                <p className="text-xs font-medium text-slate-400">Fill in the bus number plate, driver credentials, and passenger seating.</p>
                                            </div>
                                            <button 
                                                onClick={() => setActiveTab('fleet')} 
                                                className="text-xs font-black text-primary uppercase tracking-widest hover:underline"
                                            >
                                                Cancel & Return
                                            </button>
                                        </div>

                                        <form onSubmit={handleSubmit(onAdd)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Vehicle Registration Number *</label>
                                                    <input
                                                        {...register('number')}
                                                        placeholder="e.g. RJ-14-PA-9988"
                                                        className={`w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary uppercase transition-all ${errors.number ? 'ring-2 ring-rose-500' : ''}`}
                                                    />
                                                    {errors.number && <p className="text-[11px] font-bold text-rose-500 pl-1">{errors.number.message}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Vehicle Model / Make (Optional)</label>
                                                    <input
                                                        {...register('model')}
                                                        placeholder="e.g. Tata Starbus Ultra / Ashok Leyland"
                                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary transition-all"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Seating Capacity (Seats)</label>
                                                    <input
                                                        type="number"
                                                        {...register('capacity', { valueAsNumber: true })}
                                                        placeholder="e.g. 42"
                                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Driver Full Name *</label>
                                                    <input
                                                        {...register('driver')}
                                                        placeholder="e.g. Suresh Kumar Sharma"
                                                        className={`w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary transition-all ${errors.driver ? 'ring-2 ring-rose-500' : ''}`}
                                                    />
                                                    {errors.driver && <p className="text-[11px] font-bold text-rose-500 pl-1">{errors.driver.message}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Driver Phone Number</label>
                                                    <input
                                                        {...register('phone')}
                                                        placeholder="e.g. +91 98290 12345"
                                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary transition-all"
                                                    />
                                                </div>

                                                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs">
                                                    <p className="font-bold mb-1">Safety Notice:</p>
                                                    <p className="text-[11px]">Vehicles added will automatically be synchronized with the real-time GPS telemetry tracker and assigned to student route pick-up rosters.</p>
                                                </div>
                                            </div>

                                            <div className="md:col-span-2 flex justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    onClick={() => setActiveTab('fleet')}
                                                    className="rounded-2xl px-8 py-4 h-auto font-black text-xs uppercase tracking-widest"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    disabled={adding}
                                                    className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-10 py-4 h-auto font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20"
                                                >
                                                    {adding ? <Activity size={18} className="animate-spin" /> : <Plus size={18} />}
                                                    <span>Register Vehicle</span>
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    /* FLEET LIST VIEW */
                                    <div className="space-y-8">
                                        {/* Filter and Search Bar */}
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="relative group max-w-md w-full">
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                                <input
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    placeholder="Search vehicle number, driver, model, phone..."
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary transition-all"
                                                />
                                                {searchQuery && (
                                                    <button
                                                        onClick={() => setSearchQuery('')}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </div>

                                            {/* Capacity Filters */}
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">Filter:</span>
                                                <button
                                                    onClick={() => setCapacityFilter('all')}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                                                        capacityFilter === 'all'
                                                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                                                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    All Buses ({vehicles.length})
                                                </button>
                                                <button
                                                    onClick={() => setCapacityFilter('large')}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                                                        capacityFilter === 'large'
                                                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                                                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    Heavy (&ge;40 Seats)
                                                </button>
                                                <button
                                                    onClick={() => setCapacityFilter('medium')}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                                                        capacityFilter === 'medium'
                                                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                                                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    Mini (&lt;40 Seats)
                                                </button>
                                            </div>
                                        </div>

                                        {/* Vehicles Cards Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {loading ? (
                                                Array.from({ length: 6 }).map((_, i) => (
                                                    <Skeleton key={i} className="h-72 rounded-[2rem]" />
                                                ))
                                            ) : filteredVehicles.length === 0 ? (
                                                <div className="col-span-full py-16 text-center bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="size-16 rounded-full bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-slate-400">
                                                            <BusIcon size={32} />
                                                        </div>
                                                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">No Vehicles Match Criteria</h4>
                                                        <p className="text-xs text-slate-400">Try adjusting your search query or reset the capacity filter.</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                filteredVehicles.map((v, idx) => {
                                                    const routeInfo = ROUTE_PRESETS[idx % ROUTE_PRESETS.length];
                                                    return (
                                                        <div
                                                            key={v.id}
                                                            onClick={() => setSelectedVehicle({ ...v, route: routeInfo })}
                                                            className="bg-white dark:bg-slate-800/70 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 space-y-6 hover:border-primary/60 dark:hover:border-primary/60 hover:shadow-xl transition-all group cursor-pointer relative"
                                                        >
                                                            {/* Vehicle Header & Number Plate */}
                                                            <div className="flex justify-between items-start">
                                                                <div className="space-y-1.5">
                                                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-inner">
                                                                        <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-1 rounded">IND</span>
                                                                        <span className="text-sm font-black tracking-widest text-slate-900 dark:text-white uppercase font-mono">{v.number}</span>
                                                                    </div>
                                                                    <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                                                                        {v.model || 'Standard School Bus'}
                                                                    </p>
                                                                </div>

                                                                <div className="flex flex-col items-end gap-1">
                                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 border border-emerald-500/20">
                                                                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                                        Active
                                                                    </span>
                                                                    <span className="text-[9px] font-bold text-slate-400">GPS On</span>
                                                                </div>
                                                            </div>

                                                            {/* Route Badge */}
                                                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <MapPin size={13} className="text-primary" />
                                                                    <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase truncate">{routeInfo.name}</p>
                                                                </div>
                                                                <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 pl-5">
                                                                    <span>{routeInfo.stops}</span>
                                                                    <span className="text-primary font-black">{routeInfo.time}</span>
                                                                </div>
                                                            </div>

                                                            {/* Driver and Contact */}
                                                            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                                                                        {v.driver.charAt(0)}
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Assigned Driver</p>
                                                                        <p className="text-xs font-black text-slate-900 dark:text-white truncate">{v.driver}</p>
                                                                    </div>
                                                                </div>

                                                                {v.phone && (
                                                                    <a
                                                                        href={`tel:${v.phone}`}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-500 hover:text-primary hover:shadow-sm border border-slate-200 dark:border-slate-700 transition-colors"
                                                                        title="Call Driver"
                                                                    >
                                                                        <Phone size={14} />
                                                                    </a>
                                                                )}
                                                            </div>

                                                            {/* Capacity & Inspect Footer */}
                                                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <Users size={14} className="text-slate-400" />
                                                                    <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                                                        {v.capacity || 40} Seats
                                                                    </span>
                                                                </div>

                                                                <span className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                                                                    Inspect
                                                                    <ChevronRight size={14} />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* VEHICLE INSPECTION MODAL */}
                        {selectedVehicle && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden p-8 space-y-6 animate-in zoom-in-95">
                                    <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-800">
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Vehicle Specifications</span>
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase font-mono">{selectedVehicle.number}</h3>
                                        </div>
                                        <button
                                            onClick={() => setSelectedVehicle(null)}
                                            className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Make / Model</p>
                                                <p className="text-xs font-black text-slate-900 dark:text-white uppercase">{selectedVehicle.model || 'Standard Starbus'}</p>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Capacity</p>
                                                <p className="text-xs font-black text-slate-900 dark:text-white uppercase">{selectedVehicle.capacity || 40} Passenger Seats</p>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-2">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Driver Information</p>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 dark:text-white">{selectedVehicle.driver}</p>
                                                    <p className="text-xs font-bold text-slate-500">{selectedVehicle.phone || 'Phone not registered'}</p>
                                                </div>
                                                {selectedVehicle.phone && (
                                                    <a
                                                        href={`tel:${selectedVehicle.phone}`}
                                                        className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-black uppercase flex items-center gap-1.5 shadow-md shadow-primary/20"
                                                    >
                                                        <Phone size={12} />
                                                        <span>Call</span>
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-1.5">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Assigned Route & Telemetry</p>
                                            <p className="text-xs font-black text-slate-900 dark:text-white">{selectedVehicle.route?.name || 'Route 1 - Jaipur Central'}</p>
                                            <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold">
                                                <span>Speed Governor: Active (&le;40 km/h)</span>
                                                <span>•</span>
                                                <span className="text-emerald-500">GPS Calibrated</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 size={16} />
                                                <span className="text-xs font-black uppercase tracking-wider">Fitness & Insurance Valid</span>
                                            </div>
                                            <span className="text-[10px] font-black">EXP: DEC 2027</span>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            onClick={() => setSelectedVehicle(null)}
                                            className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all"
                                        >
                                            Close Inspection
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            </RoleGuard>
        </AuthGuard>
    );
}

VehicleFleet.getLayout = function getLayout(page: React.ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
