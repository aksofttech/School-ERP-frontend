import {
    Settings,
    Globe,
    Mail,
    Lock,
    Save
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function GlobalSettings() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-2 mb-2 text-indigo-500 border-indigo-200 bg-indigo-50">
                        CONFIG: CORE
                    </Badge>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        Global Settings
                    </h1>
                    <p className="text-sm font-medium text-slate-500 italic">
                        System-wide configuration and defaults.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Button className="bg-indigo-600 text-white rounded-xl px-6 py-3 h-auto font-bold text-xs uppercase tracking-wide hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 gap-2">
                        <Save size={16} />
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* General Settings */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-indigo-500">
                            <Globe size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">General</h3>
                            <p className="text-xs text-slate-400">Localization and branding.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Platform Name</label>
                            <input type="text" defaultValue="EduNexus ERP" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Default Timezone</label>
                            <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                                <option>UTC (Coordinated Universal Time)</option>
                                <option>EST (Eastern Standard Time)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Email Settings */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-emerald-500">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">SMTP Gateway</h3>
                            <p className="text-xs text-slate-400">Email delivery configuration.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">SMTP Host</label>
                            <input type="text" defaultValue="smtp.sendgrid.net" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Sender Email</label>
                            <input type="text" defaultValue="no-reply@edunexus.app" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
