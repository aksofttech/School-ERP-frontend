import { useState, useEffect } from 'react';
import { statsService, DashboardStats } from '@/services/stats.service';
import { useAuthContext } from '@/contexts/AuthContext';

export function useStats() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuthContext();

    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await statsService.getStats(user?.role);
            setStats(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch statistics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchStats();
        }
    }, [user]);

    return { stats, loading, error, refetch: fetchStats };
}
