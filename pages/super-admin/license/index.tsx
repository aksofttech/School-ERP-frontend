import Head from 'next/head';
import SuperAdminLayout from '@/components/layouts/SuperAdminLayout';
import LicenseManagement from '@/modules/super-admin/license/LicenseManagement';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function LicenseManagementPage() {
    return (
        <SuperAdminLayout title="License Management">
            <Head>
                <title>License Management - Vikas ERP</title>
            </Head>

            <div className="flex flex-col gap-1 pb-4">
                <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <Link href="/super-admin" className="hover:text-indigo-600 transition-colors">
                        Super Admin
                    </Link>
                    <ChevronRight size={13} className="text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-300">Licenses</span>
                    <ChevronRight size={13} className="text-slate-400" />
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        Asset Explorer
                    </span>
                </nav>
            </div>

            <LicenseManagement />
        </SuperAdminLayout>
    );
}
