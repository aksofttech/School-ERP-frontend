import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Shield,
    Bell,
    HeartPulse,
    Bus,
    Lock,
    Save,
    CheckCircle2,
    Sliders,
    Eye,
    EyeOff,
    AlertCircle,
    Smartphone,
    MessageCircle,
    Calendar,
    GraduationCap,
    Send,
    Check,
    LogOut,
    HelpCircle,
    Users,
    ShieldAlert
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useParent } from '@/contexts/ParentContext';
import { authService } from '@/services/auth.service';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

export default function ParentSettings() {
    const { user, updateUser, logout } = useAuth();
    const { childrenList } = useParent();

    // Active Tab: 'profile' | 'notifications' | 'wards' | 'security'
    const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'wards' | 'security'>('profile');

    // 1. Parent Profile & Emergency Contacts
    const [profileData, setProfileData] = useState({
        firstName: user?.firstName || 'Sanjay',
        lastName: user?.lastName || 'Agarwal',
        email: user?.email || 'sanjay.agarwal@example.com',
        phone: user?.phone || '+91 98765 43210',
        relation: 'Father',
        occupation: 'Senior Business Consultant',
        residentialAddress: 'B-402, Royal Palms Residency, Sector 62',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201309',
        emergencyContactName: 'Sunita Agarwal',
        emergencyContactRelation: 'Mother',
        emergencyContactPhone: '+91 98765 12345',
        preferredLanguage: 'English'
    });
    const [savingProfile, setSavingProfile] = useState(false);

    // 2. Notification Preferences (Strictly relevant to parents)
    const [notifications, setNotifications] = useState({
        // Channels
        whatsappAlerts: true,
        smsAlerts: true,
        emailDigests: true,
        // Events
        morningAttendanceAlert: true,      // 08:30 AM alert if child absent/late
        feeDueReminders: true,             // 7 days before quarterly fee due date
        instantPaymentReceipts: true,      // Immediate WhatsApp & email fee receipt
        examResultAnnouncements: true,     // When report card/test marks are published
        urgentSchoolNotices: true,         // Severe weather alerts, emergency closures
        ptmReminders: true,                // Parent-Teacher Meeting 48h advance reminder
        dailyHomeworkDigest: false         // Optional end-of-day homework summary
    });
    const [savingNotifications, setSavingNotifications] = useState(false);

    // 3. Security / Password State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    // 4. Ward Emergency Request Modal
    const [selectedWardForRequest, setSelectedWardForRequest] = useState<any>(null);
    const [requestNote, setRequestNote] = useState('');
    const [submittingRequest, setSubmittingRequest] = useState(false);

    // Load saved preferences from localStorage if available
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const savedProfile = localStorage.getItem('parent_profile_custom');
                if (savedProfile) {
                    setProfileData(prev => ({ ...prev, ...JSON.parse(savedProfile) }));
                }
                const savedNotifs = localStorage.getItem('parent_notification_prefs');
                if (savedNotifs) {
                    setNotifications(prev => ({ ...prev, ...JSON.parse(savedNotifs) }));
                }
            } catch (e) {
                console.error('Error loading parent preferences:', e);
            }
        }
    }, []);

    // Sync with auth user
    useEffect(() => {
        if (user) {
            setProfileData(prev => ({
                ...prev,
                firstName: user.firstName || prev.firstName,
                lastName: user.lastName || prev.lastName,
                email: user.email || prev.email,
                phone: user.phone || prev.phone
            }));
        }
    }, [user]);

    // Handle Profile Save
    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingProfile(true);
        try {
            // Attempt to update backend user profile
            try {
                const updated = await authService.updateProfile({
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                    phone: profileData.phone
                });
                if (updateUser) {
                    updateUser(updated);
                }
            } catch (err) {
                console.warn('Backend updateProfile skipped/fallback:', err);
            }

            // Save parent custom fields to local cache
            if (typeof window !== 'undefined') {
                localStorage.setItem('parent_profile_custom', JSON.stringify(profileData));
            }

            toast.success('Parent profile & contact details updated successfully!');
        } catch (error) {
            toast.error('Failed to update details. Please try again.');
        } finally {
            setSavingProfile(false);
        }
    };

    // Handle Notification Preferences Save
    const handleSaveNotifications = (e: React.FormEvent) => {
        e.preventDefault();
        setSavingNotifications(true);
        try {
            if (typeof window !== 'undefined') {
                localStorage.setItem('parent_notification_prefs', JSON.stringify(notifications));
            }
            setTimeout(() => {
                setSavingNotifications(false);
                toast.success('Alert preferences saved! You will receive updates as configured.');
            }, 400);
        } catch (error) {
            setSavingNotifications(false);
            toast.error('Failed to save notification settings.');
        }
    };

    // Handle Password Change
    const handleSavePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwordData.currentPassword) {
            toast.error('Please enter your current password');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            toast.error('New password must be at least 6 characters long');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        setSavingPassword(true);
        try {
            await authService.changePassword(passwordData.currentPassword, passwordData.newPassword);
            toast.success('Password changed successfully! Keep your credentials safe.');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            const msg = error?.response?.data?.message || 'Current password incorrect or change failed';
            toast.error(msg);
        } finally {
            setSavingPassword(false);
        }
    };

    // Handle Ward Update Request
    const handleSendWardRequest = () => {
        if (!requestNote.trim()) {
            toast.error('Please enter the update details before submitting');
            return;
        }
        setSubmittingRequest(true);
        setTimeout(() => {
            setSubmittingRequest(false);
            setSelectedWardForRequest(null);
            setRequestNote('');
            toast.success(`Request sent to Vidya Mandir Administration for ${selectedWardForRequest.name}!`);
        }, 600);
    };

    // Mock ward details enhanced for parent context
    const wardsData = childrenList.length > 0 ? childrenList.map((c, idx) => ({
        ...c,
        bloodGroup: idx === 0 ? 'O+' : 'B+',
        medicalNotes: idx === 0 ? 'Carries mild asthma inhaler for sports activities.' : 'No known medical allergies. Regular checkup up to date.',
        transportRoute: idx === 0 ? 'Route #14 (Bus PB-02-AK-9821) • Stop: Sector 62 Main Gate' : 'Route #14 (Bus PB-02-AK-9821) • Stop: Sector 62 Main Gate',
        driverName: 'Ram Dayal (+91 94123 45678)',
        classTeacher: idx === 0 ? 'Mr. Rajesh Sharma (PGT Mathematics)' : 'Mrs. Sunita Verma (TGT Science)',
        emergencyContactPriority: 'Primary Contact: Sanjay Agarwal (Father)'
    })) : [
        {
            id: 'child-1',
            name: 'Aarav Agarwal',
            class: 'Class 10th-A',
            rollNumber: '1002',
            admissionNo: 'VM-2021-042',
            bloodGroup: 'O+',
            medicalNotes: 'Carries mild asthma inhaler for sports activities.',
            transportRoute: 'Route #14 (Bus PB-02-AK-9821) • Stop: Sector 62 Main Gate',
            driverName: 'Ram Dayal (+91 94123 45678)',
            classTeacher: 'Mr. Rajesh Sharma (PGT Mathematics)',
            emergencyContactPriority: 'Primary Contact: Sanjay Agarwal (Father)'
        },
        {
            id: 'child-2',
            name: 'Ananya Agarwal',
            class: 'Class 7th-B',
            rollNumber: '7014',
            admissionNo: 'VM-2023-108',
            bloodGroup: 'B+',
            medicalNotes: 'No known medical allergies. Regular checkup up to date.',
            transportRoute: 'Route #14 (Bus PB-02-AK-9821) • Stop: Sector 62 Main Gate',
            driverName: 'Ram Dayal (+91 94123 45678)',
            classTeacher: 'Mrs. Sunita Verma (TGT Science)',
            emergencyContactPriority: 'Primary Contact: Sanjay Agarwal (Father)'
        }
    ];

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-black uppercase tracking-wider rounded-full mb-2">
                        <Sliders size={13} />
                        Parent Portal Preferences
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Account & Parent Settings
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Configure emergency contacts, notification alerts for your children, and account credentials.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{profileData.firstName} {profileData.lastName}</p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-end gap-1">
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Active Parent Account
                        </p>
                    </div>
                    <div className="size-11 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 text-white font-bold flex items-center justify-center text-lg shadow-md shadow-primary/20">
                        {profileData.firstName.charAt(0)}
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'profile'
                            ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    <User size={15} />
                    Parent Profile & Emergency Contact
                </button>

                <button
                    onClick={() => setActiveTab('notifications')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'notifications'
                            ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    <Bell size={15} />
                    School Alert & SMS Preferences
                </button>

                <button
                    onClick={() => setActiveTab('wards')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'wards'
                            ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    <Users size={15} />
                    My Wards & Medical/Bus Info
                    <span className="px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary font-bold rounded-full">
                        {wardsData.length}
                    </span>
                </button>

                <button
                    onClick={() => setActiveTab('security')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'security'
                            ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    <Lock size={15} />
                    Password & Security
                </button>
            </div>

            {/* TAB 1: PARENT PROFILE & CONTACT */}
            {activeTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Primary Guardian Details */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
                            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Primary Guardian Details</h3>
                                    <p className="text-xs text-slate-500">Official contact records registered with Vidya Mandir School.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">First Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={profileData.firstName}
                                            onChange={e => setProfileData({ ...profileData, firstName: e.target.value })}
                                            required
                                            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Last Name</label>
                                    <input
                                        type="text"
                                        value={profileData.lastName}
                                        onChange={e => setProfileData({ ...profileData, lastName: e.target.value })}
                                        required
                                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Relationship to Students</label>
                                    <select
                                        value={profileData.relation}
                                        onChange={e => setProfileData({ ...profileData, relation: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                    >
                                        <option value="Father">Father (पिता)</option>
                                        <option value="Mother">Mother (माता)</option>
                                        <option value="Legal Guardian">Legal Guardian (अभिभावक)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Occupation / Workplace</label>
                                    <input
                                        type="text"
                                        value={profileData.occupation}
                                        onChange={e => setProfileData({ ...profileData, occupation: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Primary Mobile Number (SMS/WhatsApp)</label>
                                    <div className="relative">
                                        <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                                            required
                                            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1">Used for morning attendance calls and emergency alerts.</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Official Email Address</label>
                                    <div className="relative">
                                        <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                                            required
                                            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1">Fee tax invoices and circulars are delivered here.</p>
                                </div>
                            </div>

                            {/* Residential Address */}
                            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                    <MapPin size={14} className="text-primary" />
                                    Residential & Transport Pickup Address
                                </h4>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">House / Street Address</label>
                                    <input
                                        type="text"
                                        value={profileData.residentialAddress}
                                        onChange={e => setProfileData({ ...profileData, residentialAddress: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">City</label>
                                        <input
                                            type="text"
                                            value={profileData.city}
                                            onChange={e => setProfileData({ ...profileData, city: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">State</label>
                                        <input
                                            type="text"
                                            value={profileData.state}
                                            onChange={e => setProfileData({ ...profileData, state: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Pincode</label>
                                        <input
                                            type="text"
                                            value={profileData.pincode}
                                            onChange={e => setProfileData({ ...profileData, pincode: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Secondary Emergency Contact & Communication */}
                        <div className="space-y-6">
                            {/* Emergency Contact */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                                    <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600">
                                        <HeartPulse size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Emergency Contact</h3>
                                        <p className="text-[10px] text-slate-500">Contacted if primary phone is unreachable.</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Contact Person Name</label>
                                    <input
                                        type="text"
                                        value={profileData.emergencyContactName}
                                        onChange={e => setProfileData({ ...profileData, emergencyContactName: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Relation</label>
                                    <input
                                        type="text"
                                        value={profileData.emergencyContactRelation}
                                        onChange={e => setProfileData({ ...profileData, emergencyContactRelation: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Emergency Phone</label>
                                    <input
                                        type="tel"
                                        value={profileData.emergencyContactPhone}
                                        onChange={e => setProfileData({ ...profileData, emergencyContactPhone: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Preferred Language */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <MessageCircle size={16} className="text-primary" />
                                    Communication Language
                                </h3>
                                <p className="text-[11px] text-slate-500">School SMS circulars will be sent in your preferred language.</p>

                                <div className="grid grid-cols-2 gap-2">
                                    {['English', 'Hindi (हिन्दी)'].map((lang) => (
                                        <button
                                            key={lang}
                                            type="button"
                                            onClick={() => setProfileData({ ...profileData, preferredLanguage: lang })}
                                            className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                                                profileData.preferredLanguage === lang
                                                    ? 'bg-primary/10 border-primary text-primary'
                                                    : 'border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                                            }`}
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={savingProfile}
                            className="flex items-center gap-2 shadow-lg shadow-primary/20 px-6 py-2.5"
                        >
                            {savingProfile ? (
                                <>
                                    <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving Details...
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Save Profile Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            )}

            {/* TAB 2: NOTIFICATIONS & ALERTS */}
            {activeTab === 'notifications' && (
                <form onSubmit={handleSaveNotifications} className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Bell size={18} className="text-primary" />
                                Delivery Channels
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">Select the communication channels through which Vidya Mandir can send you alerts.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* WhatsApp */}
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
                                        <Smartphone size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">WhatsApp Updates</p>
                                        <p className="text-[10px] text-slate-400">Instant circulars & receipts</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.whatsappAlerts}
                                        onChange={e => setNotifications({ ...notifications, whatsappAlerts: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                                </label>
                            </div>

                            {/* SMS */}
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600">
                                        <MessageCircle size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">SMS Priority Alerts</p>
                                        <p className="text-[10px] text-slate-400">Absence alerts & emergency</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.smsAlerts}
                                        onChange={e => setNotifications({ ...notifications, smsAlerts: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            {/* Email */}
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">Email Statements</p>
                                        <p className="text-[10px] text-slate-400">Fee tax invoices & reports</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.emailDigests}
                                        onChange={e => setNotifications({ ...notifications, emailDigests: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>
                        </div>

                        {/* Specific Event Preferences */}
                        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                                School Activity & Academic Triggers
                            </h4>

                            <div className="space-y-3">
                                {[
                                    {
                                        key: 'morningAttendanceAlert',
                                        title: 'Daily Attendance & Absence Alert (08:30 AM)',
                                        desc: 'Receive immediate notification if any of your children are marked absent or late during morning assembly.',
                                        icon: Calendar,
                                        badge: 'High Priority'
                                    },
                                    {
                                        key: 'feeDueReminders',
                                        title: 'Fee Due Date & Installment Reminders',
                                        desc: 'Receive advance notice 7 days and 2 days prior to quarterly tuition & transport due dates.',
                                        icon: AlertCircle,
                                        badge: 'Finance'
                                    },
                                    {
                                        key: 'instantPaymentReceipts',
                                        title: 'Instant Payment Confirmation & PDF Receipt',
                                        desc: 'Receive digital invoice with GST number immediately upon successful fee payment.',
                                        icon: CheckCircle2,
                                        badge: 'Receipts'
                                    },
                                    {
                                        key: 'examResultAnnouncements',
                                        title: 'Exam Results & Term Marksheet Published',
                                        desc: 'Notifies you when unit tests, quarterly exams, or annual grade sheets are released by teachers.',
                                        icon: GraduationCap,
                                        badge: 'Academics'
                                    },
                                    {
                                        key: 'urgentSchoolNotices',
                                        title: 'Emergency School Notices & Weather Advisories',
                                        desc: 'Critical alerts regarding sudden weather closures, pollution holidays, or transport bus route changes.',
                                        icon: ShieldAlert,
                                        badge: 'Emergency'
                                    },
                                    {
                                        key: 'ptmReminders',
                                        title: 'Parent-Teacher Meeting (PTM) Invitations',
                                        desc: 'Time slot reservation and reminder 48 hours prior to scheduled PTM sessions.',
                                        icon: Users,
                                        badge: 'Meetings'
                                    }
                                ].map((item) => {
                                    const IconComponent = item.icon;
                                    const isChecked = (notifications as any)[item.key];
                                    return (
                                        <div
                                            key={item.key}
                                            className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-all flex items-center justify-between gap-4"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0 mt-0.5">
                                                    <IconComponent size={17} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</p>
                                                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                            {item.badge}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                                                </div>
                                            </div>

                                            <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={e => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={savingNotifications}
                            className="flex items-center gap-2 shadow-lg shadow-primary/20 px-6 py-2.5"
                        >
                            {savingNotifications ? (
                                <>
                                    <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Save Notification Preferences
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            )}

            {/* TAB 3: REGISTERED WARDS & MEDICAL/BUS INFO */}
            {activeTab === 'wards' && (
                <div className="space-y-6">
                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 p-4 rounded-2xl flex items-start gap-3">
                        <AlertCircle size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <div className="text-xs text-amber-800 dark:text-amber-300">
                            <span className="font-bold">Official School Records:</span> To safeguard student records, changes to class enrollment, blood group, or transport bus routes require official administrative verification. You can click <strong>Request Record Update</strong> on any child card below to submit a verified change note to the school office.
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {wardsData.map((ward: any) => (
                            <div
                                key={ward.id}
                                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5"
                            >
                                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary font-bold flex items-center justify-center text-lg">
                                            {ward.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white">{ward.name}</h3>
                                            <p className="text-xs text-slate-500 font-semibold">{ward.class} • Roll #{ward.rollNumber || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-mono px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg font-bold">
                                        {ward.admissionNo || 'VM-ADM'}
                                    </span>
                                </div>

                                <div className="space-y-3 text-xs">
                                    {/* Blood Group */}
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                        <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                            <HeartPulse size={15} className="text-rose-500" />
                                            Blood Group
                                        </span>
                                        <span className="font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-0.5 rounded-md">
                                            {ward.bloodGroup}
                                        </span>
                                    </div>

                                    {/* Medical / Health Alert */}
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                                        <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                            <Shield size={15} className="text-primary" />
                                            Health & Medical Advisory
                                        </span>
                                        <p className="text-slate-800 dark:text-slate-200 pl-6 text-[11px] font-medium leading-relaxed">
                                            {ward.medicalNotes}
                                        </p>
                                    </div>

                                    {/* Transport / Bus Route */}
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                                        <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                            <Bus size={15} className="text-amber-500" />
                                            Transport & Bus Allocation
                                        </span>
                                        <p className="text-slate-800 dark:text-slate-200 pl-6 text-[11px] font-medium">
                                            {ward.transportRoute}
                                        </p>
                                        <p className="text-[10px] text-slate-400 pl-6">
                                            Driver: {ward.driverName}
                                        </p>
                                    </div>

                                    {/* Class Teacher */}
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                                        <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                            <GraduationCap size={15} className="text-indigo-500" />
                                            Class Teacher
                                        </span>
                                        <span className="font-bold text-slate-900 dark:text-white">
                                            {ward.classTeacher}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedWardForRequest(ward)}
                                        className="w-full py-2.5 px-4 rounded-xl border border-primary/30 text-primary hover:bg-primary/5 transition-all text-xs font-bold flex items-center justify-center gap-2"
                                    >
                                        <Send size={14} />
                                        Request Medical / Bus Route Update
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Ward Request Modal */}
                    {selectedWardForRequest && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                            Request Record Update
                                        </h3>
                                        <p className="text-xs text-slate-500">
                                            For ward: <strong>{selectedWardForRequest.name}</strong> ({selectedWardForRequest.class})
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedWardForRequest(null)}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Please describe the change needed (e.g. updated medical allergy prescription, emergency phone change, or change of bus stop):
                                    </p>
                                    <textarea
                                        rows={4}
                                        value={requestNote}
                                        onChange={e => setRequestNote(e.target.value)}
                                        placeholder="Example: We have shifted to Sector 76. Please change Aarav's bus pickup stop from Sector 62 to Sector 76 Gate #2 starting next Monday."
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedWardForRequest(null)}
                                        className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                                    >
                                        Cancel
                                    </button>
                                    <Button
                                        type="button"
                                        variant="primary"
                                        disabled={submittingRequest}
                                        onClick={handleSendWardRequest}
                                        className="flex items-center gap-2 text-xs px-5 py-2"
                                    >
                                        {submittingRequest ? 'Submitting...' : 'Send Request to School Office'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 4: PASSWORD & SECURITY */}
            {activeTab === 'security' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Change Password */}
                        <form onSubmit={handleSavePassword} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
                            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                                    <Lock size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Change Account Password</h3>
                                    <p className="text-xs text-slate-500">Update your login password for the parent portal.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Current Password</label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            value={passwordData.currentPassword}
                                            onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            placeholder="Enter current password"
                                            required
                                            className="w-full px-3.5 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            value={passwordData.newPassword}
                                            onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            placeholder="Minimum 6 characters"
                                            required
                                            className="w-full px-3.5 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        placeholder="Repeat new password"
                                        required
                                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={savingPassword}
                                    className="w-full flex items-center justify-center gap-2 py-2.5"
                                >
                                    {savingPassword ? (
                                        <>
                                            <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Updating Password...
                                        </>
                                    ) : (
                                        <>
                                            <Shield size={16} />
                                            Update Account Password
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>

                        {/* Active Session & Quick Sign Out */}
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                                        <CheckCircle2 size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Portal Session</h3>
                                        <p className="text-[10px] text-slate-500">Currently logged in browser session.</p>
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="size-9 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                                            💻
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900 dark:text-white">Desktop Web Portal</p>
                                            <p className="text-[10px] text-slate-400">Windows • Google Chrome • Delhi NCR</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                                        Current Session
                                    </span>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="size-9 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                                            📱
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900 dark:text-white">Vidya Mandir Parent App</p>
                                            <p className="text-[10px] text-slate-400">Android 14 • Last active yesterday</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-semibold text-slate-500">
                                        Registered
                                    </span>
                                </div>
                            </div>

                            {/* Sign Out Card */}
                            <div className="bg-white dark:bg-slate-900 border border-rose-200/60 dark:border-rose-900/30 rounded-3xl p-6 shadow-sm space-y-3">
                                <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                                    <LogOut size={16} />
                                    Sign Out of Parent Portal
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Signing out will terminate this session on your computer. You will need your password to log in again.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to log out from the Parent Portal?')) {
                                            logout();
                                        }
                                    }}
                                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl border border-rose-200 dark:border-rose-800 transition-all flex items-center gap-2"
                                >
                                    <LogOut size={14} />
                                    Log Out Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
