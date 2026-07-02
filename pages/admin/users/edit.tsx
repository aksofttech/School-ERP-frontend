/**
 * Edit User Page
 * 
 * This page is automatically protected by AdminLayout which includes:
 * - AuthGuard (authentication check)
 * - RoleGuard (SCHOOL_ADMIN role authorization)
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import { usersService } from '@/services/users.service';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function EditUser() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      usersService.getById(id as string)
        .then(setUser)
        .catch((err: any) => {
          console.error(err);
          setError('User not found');
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    setError('');
    try {
      await usersService.update(id as string, user);
      router.push('/admin/users');
    } catch (err: any) {
      setError(err.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!user && !loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-red-600 font-medium">User not found</p>
          <button onClick={() => router.back()} className="mt-4 text-brand-600 hover:text-brand-800">Go Back</button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="mb-6 flex items-center gap-4">
          <Link href="/admin/users" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Edit User</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">First Name *</label>
                <input 
                  type="text" 
                  required 
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm" 
                  value={user.firstName} 
                  onChange={(e) => setUser({ ...user, firstName: e.target.value })} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Last Name *</label>
                <input 
                  type="text" 
                  required 
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm" 
                  value={user.lastName} 
                  onChange={(e) => setUser({ ...user, lastName: e.target.value })} 
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700">Email Address *</label>
                <input type="email" required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Role *</label>
                <select className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm" value={user.role} onChange={(e) => setUser({ ...user, role: e.target.value })}>
                  <option value="STUDENT">Student</option>
                  <option value="TEACHER">Teacher</option>

                  <option value="PARENT">Parent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Status</label>
                <select className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm" value={user.status || 'ACTIVE'} onChange={(e) => setUser({ ...user, status: e.target.value })}>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium">Cancel</button>
              <button type="submit" disabled={saving} className="inline-flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50">
                <Save size={18} className="mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}