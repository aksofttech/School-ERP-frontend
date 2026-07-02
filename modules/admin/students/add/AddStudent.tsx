import Head from 'next/head';
import React, { useState, forwardRef } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useClasses } from '@/hooks/useClasses';
import { studentSchema, StudentSchema } from '@/utils/validation';
import { studentsService } from '@/services/students.service';
import { APP_NAME } from '@/utils/constants';
import {
  UserPlus,
  School,
  Users,
  FileText,
  ChevronRight,
  Save,
  X,
  Camera,
  AlertCircle,
  CheckCircle2,
  Lock,
  Fingerprint,
  Loader2,
  Calendar,
  Hash,
  Mail,
  User as UserIcon,
  Phone,
  MapPin
} from 'lucide-react';

const tabs = [
  { id: 'personal', label: 'Personal Information', icon: Fingerprint },
  { id: 'academic', label: 'Academic Details', icon: School },
  { id: 'guardian', label: 'Parent Information', icon: Users },
  { id: 'documents', label: 'Documents', icon: FileText },
];

export default function AddStudent() {
  const router = useRouter();
  const { classes, loading: classesLoading } = useClasses();

  const [activeTab, setActiveTab] = useState('personal');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      rollNumber: 'ROLL-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      gender: 'MALE',
      password: 'Student@' + Math.floor(1e7 + Math.random() * 9e7),
    }
  });

  const selectedClassId = watch('classId');
  const selectedClass = classes.find(c => c.id === selectedClassId);
  const sections = selectedClass?.sections || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const onCommit = async (data: StudentSchema) => {
    console.log('Committing student data:', data);
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // 1. Create the student record
      const student = await studentsService.create(data);
      console.log('Student created successfully:', student);

      // 2. Upload documents if any are selected
      if (selectedFiles.length > 0 && student.id) {
        const { documentsService } = await import('@/services/documents.service');
        
        for (const file of selectedFiles) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('studentId', student.id);
          formData.append('fileName', file.name);
          formData.append('fileType', file.type);
          formData.append('documentType', 'IDENTITY'); // Defaulting to IDENTITY for now
          formData.append('description', `Uploaded during registration: ${file.name}`);

          try {
            await documentsService.upload(formData);
            console.log(`Uploaded: ${file.name}`);
          } catch (uploadErr) {
            console.error(`Failed to upload ${file.name}:`, uploadErr);
          }
        }
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        router.push('/admin/students');
      }, 1500);
    } catch (err: any) {
      const message = Array.isArray(err.response?.data?.message) 
        ? err.response.data.message.join(', ') 
        : err.message || 'Failed to add student.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <>
        
      <Head>
        <title>Add Student - {APP_NAME}</title>
      </Head>

      <form onSubmit={handleSubmit(onCommit)} className="space-y-8 max-w-6xl mx-auto pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/20 dark:shadow-none mb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-primary">
              <div className="p-2 bg-primary/10 rounded-lg">
                <UserPlus size={20} className="animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.25em]">Portal Administration</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Add Student</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium italic text-sm">Fill in the details to register a new student.</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all active:scale-95 group"
            >
              <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || classesLoading}
              className="flex items-center gap-3 px-10 py-3.5 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-2xl text-sm font-black shadow-2xl shadow-primary/30 hover:-translate-y-1 hover:shadow-primary/40 active:scale-95 transition-all disabled:opacity-50 disabled:translate-y-0"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (classesLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />)}
              {isSubmitting ? 'Saving...' : (classesLoading ? 'Loading Classes...' : 'Add Student')}
            </button>
          </div>
        </div>

        {/* Status Messages */}
        <div className="px-2">
          {submitSuccess && (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-4 animate-in zoom-in-95 duration-500">
              <div className="p-2 bg-emerald-500 rounded-full text-white">
                <CheckCircle2 size={16} />
              </div>
              <span className="text-sm font-black italic tracking-wide">Success: Student identity committed to database. Redirecting...</span>
            </div>
          )}

          {submitError && (
            <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center gap-4 animate-in slide-in-from-left-4 duration-500">
              <div className="p-2 bg-rose-500 rounded-lg text-white">
                <AlertCircle size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">System Error Response</span>
                <span className="text-sm font-bold line-clamp-2 italic">{submitError}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Enhanced Vertical Tabs */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-[2.5rem] p-4 space-y-3 sticky top-24 shadow-2xl shadow-slate-200/10">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const hasError = (tab.id === 'personal' && (
                  errors.firstName || errors.lastName || errors.email || 
                  errors.rollNumber || errors.password || 
                  errors.dob || errors.gender
                )) || (tab.id === 'academic' && (
                  errors.classId || errors.sectionId
                )) || (tab.id === 'guardian' && (
                  errors.parentFirstName || errors.parentLastName || errors.parentEmail ||
                  errors.parentFatherName || errors.parentMotherName || errors.parentAddress || errors.parentSecondaryPhone
                ));

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-between gap-4 w-full px-6 py-5 rounded-[1.5rem] text-sm font-black transition-all duration-300 relative group ${isActive
                        ? 'bg-primary text-white shadow-xl shadow-primary/25 translate-x-2'
                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-primary'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10'}`}>
                        <Icon size={18} />
                      </div>
                      {tab.label}
                    </div>
                    {hasError && (
                      <div className="size-2.5 bg-rose-500 rounded-full animate-ping shadow-lg shadow-rose-500/50 ring-2 ring-white dark:ring-slate-900" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Content Area */}
          <div className="flex-grow perspective-1000">
            {activeTab === 'personal' && (
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/60 dark:border-slate-800/60 rounded-[3rem] p-12 shadow-2xl shadow-slate-200/10 space-y-12 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex items-center gap-8">
                  <div className="relative group">
                    <div className="size-24 rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center font-black text-3xl text-slate-300 dark:text-slate-700 overflow-hidden border border-slate-200/50 dark:border-slate-700/50 shadow-inner group-hover:shadow-primary/5 transition-all">
                      <UserIcon size={40} />
                    </div>
                    <button type="button" className="absolute -bottom-3 -right-3 p-3 bg-primary text-white rounded-2xl border-[6px] border-white dark:border-slate-900 shadow-2xl scale-90 hover:scale-110 transition-transform rotate-3 hover:rotate-0">
                      <Camera size={16} />
                    </button>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Personal Details</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Basic Student Info</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
                  <FormInput label="First Name" {...register('firstName')} placeholder="Enter first name" icon={UserIcon} error={errors.firstName?.message} />
                  <FormInput label="Last Name" {...register('lastName')} placeholder="Enter last name" icon={UserIcon} error={errors.lastName?.message} />
                  <FormInput label="Email Address" type="email" {...register('email')} placeholder="email@school.com" icon={Mail} error={errors.email?.message} />
                  <FormInput label="Phone Number" type="tel" {...register('phone')} placeholder="Phone number" icon={Phone} error={errors.phone?.message} />
                  <FormInput label="Roll Number" {...register('rollNumber')} icon={Hash} error={errors.rollNumber?.message} />
                  <FormInput label="Password" type="text" {...register('password')} placeholder="Set password" icon={Lock} error={errors.password?.message} />
                  <FormInput label="Date of Birth" type="date" {...register('dob')} icon={Calendar} error={errors.dob?.message} />
                  <FormSelect
                    label="Gender"
                    {...register('gender')}
                    options={[
                      { value: 'MALE', label: 'Male' },
                      { value: 'FEMALE', label: 'Female' },
                      { value: 'OTHER', label: 'Other' }
                    ]}
                    error={errors.gender?.message}
                  />
                </div>
              </div>
            )}

            {activeTab === 'academic' && (
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/60 dark:border-slate-800/60 rounded-[3rem] p-12 shadow-2xl shadow-slate-200/10 space-y-12 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex items-center gap-8">
                  <div className="p-4 rounded-[1.5rem] bg-sky-500/10 text-sky-500 border border-sky-500/20 shadow-xl shadow-sky-500/5">
                    <School size={32} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Class & Section</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">School Placement</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
                  <FormSelect
                    label="Select Class"
                    {...register('classId')}
                    options={classes.map(c => ({ value: c.id, label: c.name }))}
                    error={errors.classId?.message}
                    disabled={classesLoading}
                  />
                  <FormSelect
                    label="Select Section"
                    {...register('sectionId')}
                    options={sections.map(s => ({ value: s.id, label: s.name }))}
                    error={errors.sectionId?.message}
                    disabled={!selectedClassId || sections.length === 0}
                  />
                </div>
                
                <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 text-center">
                  <p className="text-sm font-bold text-slate-400 italic">Attendance and grades will be tracked for this class.</p>
                </div>
              </div>
            )}

            {activeTab === 'guardian' && (
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/60 dark:border-slate-800/60 rounded-[3rem] p-12 shadow-2xl shadow-slate-200/10 space-y-12 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex items-center gap-8">
                  <div className="p-4 rounded-[1.5rem] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-xl shadow-emerald-500/5">
                    <Users size={32} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Parent Information</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Parent Details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
                  <FormInput label="Father's Name" {...register('parentFatherName')} placeholder="Enter father's name" icon={UserIcon} error={errors.parentFatherName?.message} />
                  <FormInput label="Mother's Name" {...register('parentMotherName')} placeholder="Enter mother's name" icon={UserIcon} error={errors.parentMotherName?.message} />
                  <FormInput label="Parent Email" type="email" {...register('parentEmail')} placeholder="parent@example.com" icon={Mail} error={errors.parentEmail?.message} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Mobile 1 (Primary)" type="tel" {...register('parentPhone')} placeholder="Mobile 1" icon={Phone} error={errors.parentPhone?.message} />
                    <FormInput label="Mobile 2 (Secondary)" type="tel" {...register('parentSecondaryPhone')} placeholder="Mobile 2" icon={Phone} error={errors.parentSecondaryPhone?.message} />
                  </div>
                  <div className="md:col-span-2">
                    <FormInput label="Parent Address" {...register('parentAddress')} placeholder="Enter complete home address" icon={MapPin} error={errors.parentAddress?.message} />
                  </div>
                </div>

                <div className="p-8 rounded-3xl bg-amber-50 dark:bg-amber-950/20 border border-dashed border-amber-200 dark:border-amber-800/50 flex items-start gap-4">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg text-amber-600 dark:text-amber-400">
                    <AlertCircle size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-amber-900 dark:text-amber-100 mb-1 leading-none uppercase tracking-widest text-[10px]">Information Protocol</p>
                    <p className="text-xs font-medium text-amber-700/80 dark:text-amber-400/80 italic">Providing parent details will automatically create a secure parent portal account. The student will be linked to this parent upon identity commitment.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/60 dark:border-slate-800/60 rounded-[3rem] p-12 shadow-2xl shadow-slate-200/10 space-y-12 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex items-center gap-8">
                  <div className="p-4 rounded-[1.5rem] bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-xl shadow-amber-500/5">
                    <FileText size={32} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Documents</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Identity Verification Files</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="p-12 text-center border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem] flex flex-col items-center justify-center gap-6 group hover:border-primary/20 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-500">
                    <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-[1.5rem] text-slate-300 group-hover:scale-110 group-hover:text-primary transition-all duration-500 shadow-inner">
                      <FileText size={48} />
                    </div>
                    <div className="max-w-sm space-y-3">
                      <p className="text-lg font-black text-slate-800 dark:text-slate-200 tracking-tight">Upload Documents</p>
                      <p className="text-xs font-bold text-slate-400 leading-relaxed italic">Select previous report cards, identity proofs, or medical records to associate with this student.</p>
                    </div>
                    
                    <label className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-black text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary cursor-pointer transition-all active:scale-95 shadow-lg shadow-slate-200/50 dark:shadow-none">
                      <FileText size={18} />
                      Choose Files
                      <input type="file" multiple className="hidden" onChange={handleFileChange} />
                    </label>

                    {selectedFiles.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {selectedFiles.map((file, idx) => (
                          <div key={idx} className="px-4 py-2 bg-primary/5 border border-primary/20 rounded-xl text-[10px] font-black text-primary flex items-center gap-2">
                            <FileText size={12} />
                            {file.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 text-primary rounded-xl">
                          <Fingerprint size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1">ID Proof</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Passport or Aadhar</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Required</span>
                    </div>

                    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
                          <CheckCircle2 size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1">Report Card</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Previous Academic Year</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Optional</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    
      </>
    );
}


const FormInput = forwardRef(({ label, error, icon: Icon, ...props }: any, ref: any) => (
  <div className="flex flex-col gap-3 group">
    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.25em] ml-4 group-focus-within:text-primary transition-colors">{label}</label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-all duration-300">
          <Icon size={18} />
        </div>
      )}
      <input
        ref={ref}
        {...props}
        className={`w-full px-6 py-4 bg-slate-100/50 dark:bg-slate-800/50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-primary/50 focus:ring-8 focus:ring-primary/5 transition-all ${Icon ? 'pl-14' : ''} ${error ? 'border-rose-500/50 bg-rose-50/50 dark:bg-rose-950/20' : ''}`}
      />
      {error && (
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-rose-500 animate-in fade-in duration-300">
          <AlertCircle size={18} />
        </div>
      )}
    </div>
    {error && <p className="text-[10px] font-black text-rose-500 uppercase tracking-tight ml-4 flex items-center gap-1">
      <span className="animate-pulse">•</span> {error}
    </p>}
  </div>
));
FormInput.displayName = 'FormInput';

const FormSelect = forwardRef(({ label, options, error, ...props }: any, ref: any) => (
  <div className="flex flex-col gap-3 group">
    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.25em] ml-4 group-focus-within:text-primary transition-colors">{label}</label>
    <div className="relative">
      <select
        ref={ref}
        {...props}
        className={`w-full px-6 py-4 bg-slate-100/50 dark:bg-slate-800/50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none appearance-none focus:bg-white dark:focus:bg-slate-800 focus:border-primary/50 focus:ring-8 focus:ring-primary/5 transition-all ${error ? 'border-rose-500/50 bg-rose-50/50 dark:bg-rose-950/20' : ''}`}
      >
        <option value="">Select Option</option>
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-primary transition-all">
        <ChevronRight size={18} className="rotate-90" />
      </div>
    </div>
    {error && <p className="text-[10px] font-black text-rose-500 uppercase tracking-tight ml-4 flex items-center gap-1">
      <span className="animate-pulse">•</span> {error}
    </p>}
  </div>
));
FormSelect.displayName = 'FormSelect';




AddStudent.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
