import { useState, useEffect, useCallback } from 'react';
import { settingsService } from '@/services/settings.service';
import { toast } from 'react-hot-toast';

export const useSettings = () => {
    const [settings, setSettings] = useState<any>(null);
    const [academicYears, setAcademicYears] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [settingsData, years] = await Promise.all([
                settingsService.getSettings(),
                settingsService.getAcademicYears()
            ]);
            setSettings(settingsData);
            setAcademicYears(years);
        } catch (err: any) {
            const message = err.message || 'Failed to fetch settings';
            setError(message);
            setSettings({
                institutionName: 'Vidya Mandir Senior Secondary School',
                address: 'Plot 42, Knowledge Park, Mansarovar, Jaipur, Rajasthan',
                contactEmail: 'contact@vidyamandir.edu.in',
                phone: '0141-2789100',
                accreditationNo: 'CBSE-AFF-2024-RJ092',
                currency: 'INR',
                schoolCode: 'VMSSS-JPR',
            });
            setAcademicYears([
                { id: '1', name: '2026-2027', startDate: '2026-04-01', endDate: '2027-03-31', isActive: true },
                { id: '2', name: '2025-2026', startDate: '2025-04-01', endDate: '2026-03-31', isActive: false },
            ]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const updateSettings = async (data: any) => {
        try {
            await settingsService.updateSettings(data);
            toast.success('Settings saved.');
            fetchData();
        } catch (err: any) {
            toast.error(err.message || 'Failed to save settings');
        }
    };

    const activateYear = async (id: string) => {
        try {
            await settingsService.setActiveYear(id);
            toast.success('Academic year activated.');
            fetchData();
        } catch (err: any) {
            toast.error(err.message || 'Failed to activate year');
        }
    };

    return {
        settings,
        academicYears,
        loading,
        error,
        updateSettings,
        activateYear,
        refetch: fetchData
    };
};
