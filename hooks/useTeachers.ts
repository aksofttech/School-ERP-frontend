import { useState, useEffect, useCallback } from 'react';
import { teachersService } from '@/services/teachers.service';
import { Teacher, PaginationParams } from '@/utils/types';

export function useTeachers(initialParams: PaginationParams = { page: 1, limit: 10 }) {
    const [data, setData] = useState<Teacher[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [params, setParams] = useState<PaginationParams>(initialParams);

    const fetchTeachers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await teachersService.getAll(params);
            setData(response.data || []);
            setTotal(response.total || 0);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch teachers');
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchTeachers();
    }, [fetchTeachers]);

    const setPage = (page: number) => setParams(prev => ({ ...prev, page }));
    const setLimit = (limit: number) => setParams(prev => ({ ...prev, limit, page: 1 }));
    const setSearch = (search: string) => setParams(prev => ({ ...prev, search, page: 1 }));
    const setFilter = (filters: any) => setParams(prev => ({ ...prev, ...filters, page: 1 }));

    return {
        teachers: data,
        total,
        loading,
        error,
        params,
        setPage,
        setLimit,
        setSearch,
        setFilter,
        refetch: fetchTeachers
    };
}
