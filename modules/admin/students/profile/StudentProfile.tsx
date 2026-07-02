import React from 'react';
import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useStudent } from '@/hooks/useStudent';
import Skeleton from '@/components/ui/Skeleton';
import {
  Fingerprint,
  School,
  Users,
  FileText,
  Receipt,
  Printer,
  Edit3,
  Mail,
  Phone,
  Calendar,
  MapPin,
  MoreVertical,
  AlertCircle,
  Activity,
  Award,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';

const tabs = [
  { id: 'identity', label: 'Personal Details', icon: Fingerprint },
  { id: 'academic', label: 'Academic Details', icon: School },
  { id: 'parent', label: 'Parent Details', icon: Users },
  { id: 'archives', label: 'Documents', icon: FileText },
  { id: 'ledger', label: 'Fees', icon: Receipt },
];

export default function StudentProfile() {
  const router = useRouter();
  const { id } = router.query;
  const { student, documents, loading, error, refetch } = useStudent(id);
  const [activeTab, setActiveTab] = useState('identity');

  const handleDownload = (doc: any) => {
    if (!doc.s3Url) return;
    // For local files, the URL might need to be prefixed with the API base URL
    const url = doc.s3Url.startsWith('http') ? doc.s3Url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${doc.s3Url}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <>
        
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-8">
            <Skeleton className="size-48 rounded-[2.5rem]" />
            <div className="flex-1 space-y-4 pt-4">
              <Skeleton className="h-10 w-64 rounded-xl" />
              <Skeleton className="h-6 w-48 rounded-lg" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            </div>
          </div>
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
        </div>
      
      </>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <div className="p-4 rounded-full bg-rose-500/10 text-rose-500">
          <AlertCircle size={48} />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Access Denied</h2>
        <p className="text-slate-500 max-w-sm italic">{error}</p>
        <button onClick={() => refetch()} className="px-6 py-2 bg-primary text-white rounded-xl font-bold">Retry Authorization</button>
      </div>
    );
  }

  const name = `${student?.firstName} ${student?.lastName}`;

  return (
    <>
      <Head>
        <title>Entity Profile - {name} - EduCore</title>
      </Head>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Fingerprint size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Student Record</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Student Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic">Full profile details for student {student?.rollNumber}.</p>
        </div>
        <div className="flex gap-4">
          <button className="h-14 w-14 rounded-2xl bg-white dark:bg-slate-900 text-slate-500 hover:text-primary transition-all active:scale-95 flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-sm">
            <Printer size={20} />
          </button>
          <button
            onClick={() => router.push(`/admin/students/edit/${student?.id}`)}
            className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-2"
          >
            <Edit3 size={18} />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Identity Card */}
        <div className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-10 flex flex-col items-center text-center shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/5 to-indigo-500/5"></div>

            <div className="relative mb-6">
              <div className="size-32 rounded-[2.5rem] border-4 border-white dark:border-slate-900 overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-2xl relative z-10 font-black text-4xl flex items-center justify-center text-slate-300">
                {student?.firstName?.charAt(0)}{student?.lastName?.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 size-8 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-2xl z-20 shadow-lg" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1 leading-tight">{name}</h2>
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-6">{student?.rollNumber}</p>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-wider">{student?.class?.name || 'Unassigned'}</span>
              <span className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-wider border border-emerald-500/20">{student?.status}</span>
            </div>

            <div className="w-full grid grid-cols-2 gap-4 pt-8 border-t border-slate-100 dark:border-slate-800">
              <div className="text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <div className="flex items-center gap-2 text-emerald-500">
                  <Activity size={12} className="animate-pulse" />
                  <span className="text-xs font-black uppercase">Active</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Performance</p>
                <div className="flex items-center justify-end gap-1 text-slate-900 dark:text-white">
                  <Award size={12} className="text-amber-500" />
                  <span className="text-sm font-black text-slate-900 dark:text-white">Average</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Content */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-10">
          {/* Tabs Container */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-2 shadow-sm overflow-x-auto no-scrollbar">
            <div className="flex gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] whitespace-nowrap transition-all ${isActive
                      ? 'bg-primary text-white shadow-xl shadow-primary/20 translate-y-[-2px]'
                      : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="page-transition min-h-[500px]">
            {activeTab === 'identity' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 lg:p-12 shadow-sm space-y-12">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <Fingerprint size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Personal Details</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Basic Information</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
                  <Metric icon={Mail} label="Email Address" value={student?.email || 'N/A'} isPrimary />
                  <Metric icon={Phone} label="Phone Number" value={student?.phone || 'N/A'} />
                  <Metric icon={Calendar} label="Date of Birth" value={student?.dob ? format(new Date(student.dob), 'MMMM d, yyyy') : 'N/A'} />
                  <Metric icon={Activity} label="Gender" value={student?.gender || 'N/A'} />
                </div>
              </div>
            )}

            {activeTab === 'academic' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 lg:p-12 shadow-sm space-y-12">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-500">
                    <School size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Academic Details</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Class and Enrollment</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 space-y-6">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center text-primary shadow-sm">
                        <Award size={16} />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Enrollment</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{student?.class?.name || 'Class not assigned'}</p>
                      <p className="text-xs font-bold text-slate-400 italic">Confirmed class placement.</p>
                    </div>
                  </div>

                  <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 space-y-6">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center text-sky-500 shadow-sm">
                        <Clock size={16} />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registration Date</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{student?.createdAt ? format(new Date(student.createdAt), 'MMMM d, yyyy') : 'Unknown'}</p>
                      <p className="text-xs font-bold text-slate-400 italic">Date student was added.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'parent' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 lg:p-12 shadow-sm space-y-12">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Parent Information</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Family Contact Details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {student?.parents && student.parents.length > 0 ? (
                    student.parents.map((parent: any) => (
                      <div key={parent.id} className="p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="size-14 rounded-2xl bg-indigo-500 text-white flex items-center justify-center font-black text-lg">
                            {parent.user?.firstName?.[0]}{parent.user?.lastName?.[0]}
                          </div>
                          <div>
                            <p className="text-lg font-black text-slate-900 dark:text-white">{parent.user?.firstName} {parent.user?.lastName}</p>
                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Primary Parent</p>
                          </div>
                        </div>
                        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Father's Name</span>
                              <span className="text-sm font-bold text-slate-900 dark:text-white">{parent.fatherName || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Mother's Name</span>
                              <span className="text-sm font-bold text-slate-900 dark:text-white">{parent.motherName || 'N/A'}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{parent.user?.email}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile (Primary)</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{parent.user?.phone || 'N/A'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile (Secondary)</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{parent.secondaryPhone || 'N/A'}</span>
                          </div>
                          <div className="pt-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Permanent Address</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">{parent.address || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 p-16 text-center border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem] space-y-4">
                      <Users size={48} className="mx-auto text-slate-200" />
                      <div className="space-y-1">
                        <p className="text-sm font-black text-slate-800 dark:text-slate-200">No Parent Linked</p>
                        <p className="text-xs font-bold text-slate-400 italic">No parent record is currently associated with this student profile.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'archives' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 lg:p-12 shadow-sm space-y-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Identity & Archives</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Verification Documents</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {documents && documents.length > 0 ? (
                    documents.map((doc: any) => (
                      <div key={doc.id} className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 flex items-center justify-between group hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm text-slate-400 group-hover:text-primary transition-colors">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1">{doc.fileName}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doc.documentType}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDownload(doc)}
                          className="p-3 rounded-xl bg-white dark:bg-slate-900 text-slate-400 hover:text-primary hover:shadow-lg transition-all border border-slate-200 dark:border-slate-800"
                        >
                          <Clock size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 p-16 text-center border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem] space-y-4">
                      <FileText size={48} className="mx-auto text-slate-200" />
                      <div className="space-y-1">
                        <p className="text-sm font-black text-slate-800 dark:text-slate-200">No Documents Found</p>
                        <p className="text-xs font-bold text-slate-400 italic">This student record has no associated digital identity assets.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'ledger' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 lg:p-12 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                <div className="h-20 w-20 rounded-[2rem] bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-6">
                  <AlertCircle size={40} />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-widest">Locked</h3>
                <p className="text-slate-500 dark:text-slate-400 text-center max-w-xs font-medium italic">Information for the Fees section is currently being updated.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Metric({ icon: Icon, label, value, isPrimary, className = "" }: any) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-slate-400" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
      </div>
      <p className={`text-sm font-black break-all ${isPrimary ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{value}</p>
    </div>
  );
}


StudentProfile.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
