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
            // Fallback for demo
            setSettings({
                institutionName: 'EduCore International',
                address: '123 Academic Blvd, Tech City',
                contactEmail: 'admin@educore.inst',
                phone: '+1 (555) 123-4567',
                accreditationNo: 'EDU-2024-X99',
                currency: 'USD'
            });
            setAcademicYears([
                { id: '1', name: '2023-24', startDate: '2023-04-01', endDate: '2024-03-31', isActive: true },
                { id: '2', name: '2024-25', startDate: '2024-04-01', endDate: '2025-03-31', isActive: false }
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
