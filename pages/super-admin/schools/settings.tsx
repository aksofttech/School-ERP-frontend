/**
 * School Settings Page
 * Super admin page for managing school settings
 * 
 * This page is automatically protected by SuperAdminLayout which includes:
 * - AuthGuard (authentication check)
 * - RoleGuard (SUPER_ADMIN role authorization)
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import SuperAdminLayout from '@/components/layouts/SuperAdminLayout';
import { superAdminService } from '@/services/super-admin.service';

export default function SchoolSettings() {
  const router = useRouter();
  const { id } = router.query;
  const [school, setSchool] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchSchool = async () => {
        try {
          const data = await superAdminService.getSchoolById(id as string);
          setSchool(data);
        } catch (err: any) {
          setError(err.message || 'Failed to load school');
        } finally {
          setLoading(false);
        }
      };
      fetchSchool();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    setError('');
    try {
      await superAdminService.updateSchool(id as string, school);
      router.push('/super-admin/schools');
    } catch (err: any) {
      setError(err.message || 'Failed to update school');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="text-center py-8">Loading...</div>
      </SuperAdminLayout>
    );
  }

  if (!school) {
    return (
      <SuperAdminLayout>
        <div className="text-center py-8 text-red-600">School not found</div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <Head>
        <title>School Configuration - EduCore</title>
      </Head>

      <div className="flex flex-col gap-1 pb-6 max-w-7xl mx-auto">
        <nav className="flex items-center gap-2 text-sm mb-4 text-slate-500 dark:text-slate-400">
          <span className="hover:text-primary transition-colors cursor-pointer">Super Admin</span>
          <span className="material-icons-round text-[16px]">chevron_right</span>
          <span className="hover:text-primary transition-colors cursor-pointer" onClick={() => router.push('/super-admin/schools')}>Schools Directory</span>
          <span className="material-icons-round text-[16px]">chevron_right</span>
          <span className="font-medium text-slate-900 dark:text-white underline decoration-primary decoration-2 underline-offset-4">School Protocol</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">School Configuration</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Manage branding, operational parameters, and modules for {school.name}.</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-card-dark hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-sm transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-8 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-xl shadow-primary/20 transition-all flex items-center gap-2 transform hover:-translate-y-1 active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <span className="animate-pulse">Saving...</span>
              ) : (
                <>
                  <span className="material-icons-round text-lg">save</span>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 dark:bg-rose-900/10 border-l-4 border-rose-500 p-5 rounded-2xl flex items-center gap-4 mb-8 animate-in shake duration-500">
            <span className="material-icons-round text-rose-500">error_outline</span>
            <p className="text-sm font-bold text-rose-700 dark:text-rose-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-card-dark rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700 overflow-hidden sticky top-24">
              <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl">
                    {school.name?.[0]}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[120px]">{school.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {school.id?.slice(-8)}</p>
                  </div>
                </div>
              </div>
              <nav className="p-3 space-y-1">
                {['General Info', 'Branding', 'Academic Defaults', 'Module Activation', 'Security'].map((item) => (
                  <button
                    key={item}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-2xl transition-all ${item === 'General Info'
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                  >
                    <span className="material-icons-round text-lg">
                      {item === 'General Info' ? 'tune' :
                        item === 'Branding' ? 'palette' :
                          item === 'Academic Defaults' ? 'school' :
                            item === 'Module Activation' ? 'extension' : 'security'}
                    </span>
                    {item}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Areas */}
          <div className="lg:col-span-3 space-y-10">
            {/* General Info Section */}
            <div className="bg-white dark:bg-card-dark rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-8 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">General Information</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Core institution profile data</p>
                </div>
                <span className="material-icons-round text-slate-300">business</span>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">School Name</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all"
                    value={school.name || ''}
                    onChange={(e) => setSchool({ ...school, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Contact Email</label>
                  <input
                    type="email"
                    className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all"
                    value={school.email || ''}
                    onChange={(e) => setSchool({ ...school, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all"
                    value={school.phone || ''}
                    placeholder="+1 (555) 012-3456"
                  />
                </div>
              </div>
            </div>

            {/* Branding Section */}
            <div className="bg-white dark:bg-card-dark rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-8 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">Branding & Theme</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Identity and visual preferences</p>
                </div>
                <span className="material-icons-round text-slate-300">palette</span>
              </div>
              <div className="p-8 space-y-8">
                <div className="flex flex-col md:flex-row gap-10">
                  <div className="flex-1">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Institution Logo</label>
                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-10 flex flex-col items-center justify-center hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all cursor-pointer group">
                      <span className="material-icons-round text-4xl text-slate-300 group-hover:text-primary transition-all mb-4">cloud_upload</span>
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Replace Logo</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-6">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Primary Color</label>
                      <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 rounded-2xl px-4 py-3">
                        <input type="color" className="h-10 w-10 rounded-xl border-none p-0 cursor-pointer bg-transparent" value="#10B981" />
                        <span className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase">#10B981</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Interface Mode</label>
                      <div className="flex gap-4">
                        {['Light', 'Dark', 'System'].map((mode) => (
                          <button key={mode} className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'Light' ? 'bg-slate-900 text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-500'}`}>
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-rose-50 dark:bg-rose-900/10 rounded-3xl border border-rose-200 dark:border-rose-900/50 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h3 className="text-lg font-black text-rose-900 dark:text-rose-400">Danger Zone</h3>
                <p className="text-sm font-medium text-rose-700 dark:text-rose-300/80">Permanent actions regarding this institution&apos;s data.</p>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <button className="flex-1 px-6 py-3 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 font-bold text-sm bg-white dark:bg-card-dark hover:bg-rose-50 transition-all">
                  Deactivate
                </button>
                <button className="flex-1 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-all shadow-lg shadow-rose-600/20">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
