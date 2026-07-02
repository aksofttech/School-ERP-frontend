import { useState } from 'react';
import {
    Check,
    CreditCard,
    Shield,
    Zap,
    Users,
    Database,
    Globe,
    MoreHorizontal
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function LicenseManager() {
    const [plans] = useState([
        {
            id: 'basic',
            name: 'Starter Plan',
            price: '₹499',
            period: '/mo',
            description: 'Essential features for small institutions.',
            features: ['Up to 500 Students', 'Basic Reporting', 'Email Support', 'Cloud Storage (50GB)'],
            color: 'bg-slate-900',
            popular: false
        },
        {
            id: 'pro',
            name: 'Professional',
            price: '₹999',
            period: '/mo',
            description: 'Advanced tools for growing schools.',
            features: ['Up to 2,000 Students', 'Advanced Analytics', 'Priority Support', 'Cloud Storage (500GB)', 'API Access'],
            color: 'bg-indigo-600',
            popular: true
        },
        {
            id: 'enterprise',
            name: 'Campus Enterprise',
            price: 'Custom',
            period: '',
            description: 'Unlimited scale for large universities.',
            features: ['Unlimited Students', 'Custom BI Dashboard', '24/7 Dedicated Support', 'Unlimited Storage', 'On-Premise Option'],
            color: 'bg-emerald-600',
            popular: false
        }
    ]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-2 mb-2 text-indigo-500 border-indigo-200 bg-indigo-50">
                        REVENUE_OPS: LICENSING
                    </Badge>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        Subscription Plans
                    </h1>
                    <p className="text-sm font-medium text-slate-500 italic">
                        Configure pricing tiers and feature gates for tenants.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Button className="bg-indigo-600 text-white rounded-xl px-4 py-2 h-auto font-bold text-xs uppercase tracking-wide hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 gap-2">
                        <Zap size={16} />
                        Create New Plan
                    </Button>
                </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <div key={plan.id} className={`relative rounded-[2.5rem] p-8 border ${plan.popular ? 'border-indigo-500 shadow-2xl shadow-indigo-500/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'}`}>
                        {plan.popular && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                Most Popular
                            </div>
                        )}

                        <div className="mb-8">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{plan.price}</span>
                                <span className="text-sm font-medium text-slate-500">{plan.period}</span>
                            </div>
                            <p className="text-xs font-medium text-slate-500 mt-4 leading-relaxed">
                                {plan.description}
                            </p>
                        </div>

                        <div className="space-y-4 mb-8">
                            {plan.features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="size-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <Button variant="outline" className="w-full rounded-xl border-2 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800">
                            Edit Configuration
                        </Button>
                    </div>
                ))}
            </div>

            {/* Feature Usage Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6">Resource Allocation</h3>
                    <div className="space-y-6">
                        {[
                            { label: 'Storage Usage', value: '78%', color: 'bg-indigo-500' },
                            { label: 'API Requests', value: '45%', color: 'bg-emerald-500' },
                            { label: 'Active Users', value: '92%', color: 'bg-rose-500' },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                                    <span>{item.label}</span>
                                    <span>{item.value}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color} rounded-full`} style={{ width: item.value }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Globe size={120} />
                    </div>
                    <div className="relative z-10">
                        <Badge className="bg-indigo-500 text-white border-none mb-4">Beta Feature</Badge>
                        <h3 className="text-2xl font-black uppercase tracking-tight mb-2">AI Grading Engine</h3>
                        <p className="text-sm text-slate-400 mb-8 max-w-xs">
                            Currently deployed to 12 Enterprise tenants. processing 50k+ papers daily.
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="size-8 rounded-full bg-slate-700 border-2 border-slate-900" />
                                ))}
                            </div>
                            <span className="text-xs font-bold text-slate-400">Deployed to 12 schools</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
