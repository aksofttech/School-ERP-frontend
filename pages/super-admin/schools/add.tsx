import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import SuperAdminLayout from '@/components/layouts/SuperAdminLayout';
import { superAdminService } from '@/services/super-admin.service';

export default function AddSchool() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Identity
    name: '',
    registrationNo: '',
    affiliationBoard: '',
    brandColor: '#2563EB',
    schoolCode: '',
    // Location & Contact
    address: '',
    city: '',
    state: '',
    zipCode: '',
    email: '',
    phone: '',
    website: '',
    // System Config
    adminName: '',
    adminEmail: '',
    customDomain: '',
    isActive: true,
    isDemo: false
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.name || !formData.email || !formData.adminEmail) {
        throw new Error('Please fill in all required fields (Name, School Email, Admin Email)');
      }

      await superAdminService.createSchool(formData);
      setSuccess(true);
      // Auto redirect after success
      setTimeout(() => {
        router.push('/super-admin/schools');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create school');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SuperAdminLayout>
      <Head>
        <title>Onboard New School - EduCore</title>
      </Head>

      <div className="flex flex-col gap-1 pb-6 max-w-5xl mx-auto">
        <nav className="flex items-center gap-2 text-sm mb-4 text-slate-500 dark:text-slate-400">
          <span className="hover:text-primary transition-colors cursor-pointer">Super Admin</span>
          <span className="material-icons-round text-[16px]">chevron_right</span>
          <span className="hover:text-primary transition-colors cursor-pointer" onClick={() => router.push('/super-admin/schools')}>Schools Directory</span>
          <span className="material-icons-round text-[16px]">chevron_right</span>
          <span className="font-medium text-slate-900 dark:text-white underline decoration-primary decoration-2 underline-offset-4">Onboard Institution</span>
        </nav>
      </div>

      <div className="max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Top Hero Section with Quick Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Register New School</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Onboard a new educational institution to your global network.</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-card-dark hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-sm transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-xl shadow-primary/20 transition-all flex items-center gap-2 transform hover:-translate-y-1 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>
                    <span className="material-icons-round text-lg">save</span>
                    Finalize Registration
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 dark:bg-rose-900/10 border-l-4 border-rose-500 p-5 rounded-2xl flex items-center gap-4 animate-in shake duration-500">
              <span className="material-icons-round text-rose-500">error_outline</span>
              <p className="text-sm font-bold text-rose-700 dark:text-rose-400">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column: Form Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Institution Details Card */}
              <div className="bg-white dark:bg-card-dark rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-8">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                    <span className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <span className="material-icons-round text-lg">business</span>
                    </span>
                    Institution Identity
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Legal School Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 outline-none"
                        placeholder="e.g. Springfield International School"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Registration No.</label>
                      <input
                        type="text"
                        name="registrationNo"
                        value={formData.registrationNo}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 outline-none"
                        placeholder="CBSE-123456"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">School Code</label>
                      <input
                        type="text"
                        name="schoolCode"
                        value={formData.schoolCode}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 outline-none"
                        placeholder="SIHS-NYC"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Education Board</label>
                      <select
                        name="affiliationBoard"
                        value={formData.affiliationBoard}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      >
                        <option value="">Select Board</option>
                        <option value="cbse">CBSE</option>
                        <option value="icse">ICSE</option>
                        <option value="ib">IB</option>
                        <option value="state">State Board</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Brand Identity</label>
                      <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 rounded-2xl px-5 py-3 flex-1">
                        <input
                          type="color"
                          name="brandColor"
                          value={formData.brandColor}
                          onChange={handleChange}
                          className="w-8 h-8 rounded-full border-none p-0 cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          name="brandColor"
                          value={formData.brandColor}
                          onChange={handleChange}
                          className="bg-transparent border-none text-sm font-bold text-slate-500 focus:ring-0 p-0 w-20"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact & Location Card */}
              <div className="bg-white dark:bg-card-dark rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-8">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                    <span className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <span className="material-icons-round text-lg">location_on</span>
                    </span>
                    Communication
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Street Address</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={2}
                        className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 outline-none resize-none"
                        placeholder="123 Academic Drive, Knowledge Square..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 outline-none"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Postal Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 outline-none"
                        placeholder="10001"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Official Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 outline-none"
                        placeholder="admin@school.edu"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Contact Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 outline-none"
                        placeholder="+1-555-0123"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sidebar Options */}
            <div className="space-y-8">
              {/* Logo Upload Card */}
              <div className="bg-white dark:bg-card-dark rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700 p-8">
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <span className="material-icons-round text-lg">photo_camera</span>
                  </span>
                  Visual Profile
                </h2>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 hover:border-primary group cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-900/30">
                  <div className="h-20 w-20 rounded-2xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center text-slate-300 group-hover:scale-110 group-hover:text-primary transition-all duration-300 mb-4">
                    <span className="material-icons-round text-4xl">add_photo_alternate</span>
                  </div>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Upload Institution Logo</p>
                  <p className="text-[10px] font-black uppercase text-slate-400 mt-2 tracking-widest">PNG or JPG • Max 2MB</p>
                </div>
              </div>

              {/* Initial Administrator Card */}
              <div className="bg-white dark:bg-card-dark rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700 p-8">
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                  <span className="h-10 w-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                    <span className="material-icons-round text-lg">admin_panel_settings</span>
                  </span>
                  Super Admin
                </h2>
                <p className="text-xs font-medium text-slate-400 mb-6">Create the primary administrator account.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Full Name</label>
                    <input
                      type="text"
                      name="adminName"
                      value={formData.adminName}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Login Email</label>
                    <input
                      type="email"
                      name="adminEmail"
                      value={formData.adminEmail}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="admin@school.edu"
                    />
                  </div>
                </div>
              </div>

              {/* Status & Options Card */}
              <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl shadow-slate-900/40">
                <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                  <span className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <span className="material-icons-round text-lg text-primary">toggle_on</span>
                  </span>
                  Activation
                </h2>
                <div className="space-y-6">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">Instantly Active</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Live access for users</span>
                    </div>
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleCheckboxChange}
                      className="peer hidden"
                    />
                    <div className="h-6 w-11 bg-slate-700 rounded-full peer-checked:bg-primary relative transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:h-4 after:w-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5 shadow-inner"></div>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">Demo Instance</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Preloaded sample data</span>
                    </div>
                    <input
                      type="checkbox"
                      name="isDemo"
                      checked={formData.isDemo}
                      onChange={handleCheckboxChange}
                      className="peer hidden"
                    />
                    <div className="h-6 w-11 bg-slate-700 rounded-full peer-checked:bg-amber-500 relative transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:h-4 after:w-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5 shadow-inner"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Modern Toast Notification */}
      {success && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-emerald-500 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-10 fade-in duration-500">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-icons-round text-lg">check</span>
            </div>
            <p className="font-black text-sm uppercase tracking-widest">School Registered Successfully!</p>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
}
