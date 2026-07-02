import Head from 'next/head';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import { USER_ROLES } from '@/utils/role-config';

export default function SchoolProfile() {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
        <AdminLayout>
          <Head>
            <title>School Settings - School ERP</title>
          </Head>

          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex flex-col gap-2 max-w-2xl">
                <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">School Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Manage general information, academic configuration, branding, and permissions.</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="h-10 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e2936] text-slate-700 dark:text-slate-300 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  Cancel
                </button>
                <button className="h-10 px-6 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-bold shadow-md transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Save Changes
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="w-full overflow-x-auto pb-2">
              <div className="flex border-b border-slate-200 dark:border-slate-700 min-w-max">
                <button className="group flex flex-col items-center justify-center border-b-[3px] border-primary pb-3 pt-4 px-6 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">feed</span>
                    <span className="text-primary text-sm font-bold">General Info</span>
                  </div>
                </button>
                <button className="group flex flex-col items-center justify-center border-b-[3px] border-transparent hover:border-slate-300 dark:hover:border-slate-600 pb-3 pt-4 px-6 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200 text-[20px]">calendar_month</span>
                    <span className="text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200 text-sm font-bold">Academic Config</span>
                  </div>
                </button>
                <button className="group flex flex-col items-center justify-center border-b-[3px] border-transparent hover:border-slate-300 dark:hover:border-slate-600 pb-3 pt-4 px-6 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200 text-[20px]">palette</span>
                    <span className="text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200 text-sm font-bold">Branding</span>
                  </div>
                </button>
                <button className="group flex flex-col items-center justify-center border-b-[3px] border-transparent hover:border-slate-300 dark:hover:border-slate-600 pb-3 pt-4 px-6 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200 text-[20px]">lock_person</span>
                    <span className="text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200 text-sm font-bold">Permissions</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* School Profile Card */}
              <div className="rounded-xl bg-white dark:bg-[#1e2936] p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-primary">
                    <span className="material-symbols-outlined">domain</span>
                  </div>
                  <div>
                    <h3 className="text-slate-900 dark:text-white text-lg font-bold">School Profile</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Basic identification details.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">School Name</label>
                    <input className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400" type="text" defaultValue="Lincoln High School" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">School Code</label>
                      <input className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" type="text" defaultValue="LHS-2023" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Affiliation Board</label>
                      <div className="relative">
                        <select className="w-full appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all">
                          <option>State Board</option>
                          <option defaultValue="selected">CBSE</option>
                          <option>ICSE</option>
                          <option>IB</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-500 pointer-events-none text-[20px]">expand_more</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Website URL</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm text-slate-500 bg-slate-100 dark:bg-slate-700 border border-r-0 border-slate-200 dark:border-slate-600 rounded-l-lg">
                        https://
                      </span>
                      <input className="w-full rounded-r-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" type="text" defaultValue="www.lincolnhigh.edu" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Contact Card */}
              <div className="rounded-xl bg-white dark:bg-[#1e2936] p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <h3 className="text-slate-900 dark:text-white text-lg font-bold">Location & Contact</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Address and communication details.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Address Line 1</label>
                    <input className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" type="text" defaultValue="1234 Education Lane" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">City</label>
                      <input className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" type="text" defaultValue="Springfield" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Zip Code</label>
                      <input className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" type="text" defaultValue="62704" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Official Email</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">mail</span>
                      <input className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-10 pr-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" type="email" defaultValue="admin@lincolnhigh.edu" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Branding Card */}
              <div className="rounded-xl bg-white dark:bg-[#1e2936] p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600">
                    <span className="material-symbols-outlined">brush</span>
                  </div>
                  <div>
                    <h3 className="text-slate-900 dark:text-white text-lg font-bold">Branding</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Logo and theme customization.</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">School Logo</label>
                    <div className="flex items-start gap-4">
                      <div className="size-20 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                        <span className="material-symbols-outlined text-4xl text-slate-400">school</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-center rounded-lg border border-dashed border-slate-300 dark:border-slate-600 px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                          <div className="text-center">
                            <span className="material-symbols-outlined mx-auto text-slate-400 text-[24px]">cloud_upload</span>
                            <div className="mt-2 flex text-sm leading-6 text-slate-600 dark:text-slate-400">
                              <label className="relative cursor-pointer rounded-md bg-transparent font-semibold text-primary hover:text-blue-500">
                                <span>Upload a file</span>
                                <input className="sr-only" type="file" />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs leading-5 text-slate-500 dark:text-slate-500">PNG, JPG, GIF up to 5MB</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Theme Color</label>
                    <div className="flex items-center gap-3">
                      <input className="h-10 w-14 cursor-pointer rounded border border-slate-200 dark:border-slate-700 bg-transparent p-0.5" type="color" defaultValue="#137fec" />
                      <input className="w-28 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm uppercase text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none" type="text" defaultValue="#137fec" />
                      <span className="text-xs text-slate-500">This color will be used for buttons and active states.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Configuration Card */}
              <div className="rounded-xl bg-white dark:bg-[#1e2936] p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600">
                    <span className="material-symbols-outlined">settings_suggest</span>
                  </div>
                  <div>
                    <h3 className="text-slate-900 dark:text-white text-lg font-bold">System Configuration</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Academic year and regional settings.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Current Academic Year</label>
                    <div className="relative">
                      <select className="w-full appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all">
                        <option>2022 - 2023</option>
                        <option defaultValue="selected">2023 - 2024</option>
                        <option>2024 - 2025</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-500 pointer-events-none text-[20px]">expand_more</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">Changing this will update the dashboard view for all staff.</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Timezone</label>
                    <div className="relative">
                      <select className="w-full appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all">
                        <option defaultValue="selected">(GMT-06:00) Central Time (US & Canada)</option>
                        <option>(GMT-05:00) Eastern Time (US & Canada)</option>
                        <option>(GMT-08:00) Pacific Time (US & Canada)</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-500 pointer-events-none text-[20px]">schedule</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Permissions Teaser */}
              <div className="rounded-xl bg-white dark:bg-[#1e2936] p-6 shadow-sm border border-slate-200 dark:border-slate-700 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded-lg text-rose-600">
                      <span className="material-symbols-outlined">admin_panel_settings</span>
                    </div>
                    <div>
                      <h3 className="text-slate-900 dark:text-white text-lg font-bold">Quick Permissions</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">Global feature toggles for the school.</p>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Parent Portal Access</p>
                      <p className="text-xs text-slate-500">Allow parents to log in and view student progress.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input defaultChecked className="sr-only peer" type="checkbox" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Teacher Messaging</p>
                      <p className="text-xs text-slate-500">Enable direct messaging between teachers and students.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input className="sr-only peer" type="checkbox" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AdminLayout>
      </RoleGuard>
    </AuthGuard>
  );
}
