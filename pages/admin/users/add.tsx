/**
 * Add User Page
 * 
 * This page is automatically protected by AdminLayout which includes:
 * - AuthGuard (authentication check)
 * - RoleGuard (SCHOOL_ADMIN role authorization)
 */

import { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import { usersService } from '@/services/users.service';
import { ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function AddUser() {
  const router = useRouter();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', role: 'STUDENT', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await usersService.create(formData);
      router.push('/admin/users');
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="mb-6 flex items-center gap-4">
          <Link href="/admin/users" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Add New User</h1>
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
                  value={formData.firstName} 
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} 
                  placeholder="John" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Last Name *</label>
                <input 
                  type="text" 
                  required 
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm" 
                  value={formData.lastName} 
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} 
                  placeholder="Doe" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Email Address *</label>
                <input type="email" required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Mobile Number</label>
                <input 
                  type="text" 
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                  placeholder="+91 9876543210" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Role *</label>
                <select className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                  <option value="STUDENT">Student</option>
                  <option value="TEACHER">Teacher</option>

                  <option value="PARENT">Parent</option>
                </select>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-slate-700">Default Password *</label>
                <div className="relative mt-1">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm pr-10" 
                    value={formData.password} 
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium">Cancel</button>
              <button type="submit" disabled={loading} className="inline-flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50">
                <Save size={18} className="mr-2" />
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
