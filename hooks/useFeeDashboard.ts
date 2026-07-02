import { useState, useEffect, useCallback } from 'react';
import { feesService } from '@/services/fees.service';

export function useFeeDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await feesService.getDashboardStats();
      setData(response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch fee statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    data,
    loading,
    error,
    refresh: fetchStats
  };
}
