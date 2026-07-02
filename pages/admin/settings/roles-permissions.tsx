import Head from 'next/head';
import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import { USER_ROLES } from '@/utils/role-config';
import { useState } from 'react';

export default function RolesPermissions() {
  const [selectedRole, setSelectedRole] = useState('Super Administrator');

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
        <AdminLayout>
          <Head>
            <title>Role Management - School ERP</title>
          </Head>

          <div className="flex flex-col h-[calc(100vh-6rem)] overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Role Management</h1>
                <p className="text-slate-500 mt-1">Manage user roles and configure detailed access permissions.</p>
              </div>
              <div className="flex gap-3">
                <button className="hidden md:flex items-center justify-center h-10 px-4 bg-white dark:bg-[#1e2936] border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  View Audit Log
                </button>
              </div>
            </div>

            {/* Dashboard Split View */}
            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
              {/* LEFT COLUMN: Role List */}
              <div className="w-full lg:w-80 flex-shrink-0 flex flex-col bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                    <input className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-sm focus:ring-1 focus:ring-primary placeholder:text-slate-400" placeholder="Filter roles..." type="text" />
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Create New Role
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {['Super Administrator', 'School Administrator', 'Teacher', 'Student', 'Parent'].map((role) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors group ${selectedRole === role ? 'bg-primary/5 border border-primary/20 text-primary' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-bold text-sm group-hover:text-primary transition-colors">{role}</span>
                        <span className="text-xs opacity-80">{role === 'Super Administrator' ? 'All permissions granted' : 'Restricted access'}</span>
                      </div>
                      {selectedRole === role && <span className="material-symbols-outlined text-[18px]">chevron_right</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* RIGHT COLUMN: Editor */}
              <div className="flex-1 flex flex-col bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                {/* Form Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Role Name</label>
                      <input className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium focus:ring-primary focus:border-primary" type="text" value={selectedRole} readOnly />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Description</label>
                      <input className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-500 focus:ring-primary focus:border-primary" type="text" defaultValue="Access configuration for this role." />
                    </div>
                  </div>
                </div>

                {/* Permissions Scroll Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-black/20">
                  <div className="max-w-4xl mx-auto space-y-6">
                    {/* Module Card: Student Info */}
                    <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <span className="material-symbols-outlined text-[20px]">badge</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Student Information System</h3>
                            <p className="text-xs text-slate-500">Manage student profiles and enrollment</p>
                          </div>
                        </div>
                        <label className="flex items-center cursor-pointer gap-2">
                          <span className="text-xs font-semibold text-slate-500">Enable Module</span>
                          <div className="relative inline-flex items-center cursor-pointer">
                            <input defaultChecked className="sr-only peer" type="checkbox" />
                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                          </div>
                        </label>
                      </div>
                      <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {['View Profiles', 'Edit Bio', 'Archive Student', 'Enrollment'].map((perm) => (
                          <label key={perm} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer">
                            <input defaultChecked className="mt-1 rounded border-slate-300 text-primary focus:ring-primary bg-slate-50 dark:bg-slate-800 dark:border-slate-600" type="checkbox" />
                            <div>
                              <span className="block text-sm font-semibold text-slate-700 dark:text-slate-300">{perm}</span>
                              <span className="block text-xs text-slate-500 mt-0.5">Permission details</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Module Card: Finance */}
                    <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                            <span className="material-symbols-outlined text-[20px]">payments</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Finance & Accounting</h3>
                            <p className="text-xs text-slate-500">Fee collection and payroll</p>
                          </div>
                        </div>
                        <label className="flex items-center cursor-pointer gap-2">
                          <span className="text-xs font-semibold text-slate-500">Enable Module</span>
                          <div className="relative inline-flex items-center cursor-pointer">
                            <input defaultChecked className="sr-only peer" type="checkbox" />
                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                          </div>
                        </label>
                      </div>
                      <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {['View Fees', 'Process Payments', 'Generate Reports'].map((perm) => (
                          <label key={perm} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer">
                            <input defaultChecked className="mt-1 rounded border-slate-300 text-primary focus:ring-primary bg-slate-50 dark:bg-slate-800 dark:border-slate-600" type="checkbox" />
                            <div>
                              <span className="block text-sm font-semibold text-slate-700 dark:text-slate-300">{perm}</span>
                              <span className="block text-xs text-slate-500 mt-0.5">Permission details</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-[#1e2936] z-10">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-bold transition-colors">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    Delete Role
                  </button>
                  <div className="flex items-center gap-3">
                    <button className="px-5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      Cancel
                    </button>
                    <button className="px-6 py-2 rounded-lg bg-primary text-white font-bold text-sm shadow-sm hover:bg-blue-600 transition-colors">
                      Save Changes
                    </button>
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
