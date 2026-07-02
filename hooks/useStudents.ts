import { useState, useEffect, useCallback } from 'react';
import { studentsService } from '@/services/students.service';
import { Student, PaginationParams } from '@/utils/types';

export function useStudents(initialParams: PaginationParams = { page: 1, limit: 10 }) {
    const [data, setData] = useState<Student[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [params, setParams] = useState<PaginationParams>(initialParams);

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await studentsService.getAll(params);
            setData(response.data || []);
            setTotal(response.total || 0);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch students');
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const setPage = (page: number) => setParams(prev => ({ ...prev, page }));
    const setLimit = (limit: number) => setParams(prev => ({ ...prev, limit, page: 1 }));
    const setSearch = (search: string) => setParams(prev => ({ ...prev, search, page: 1 }));
    const setFilter = (filters: any) => setParams(prev => ({ ...prev, ...filters, page: 1 }));

    const deleteStudent = async (id: string) => {
        try {
            await studentsService.delete(id);
            await fetchStudents();
            return true;
        } catch (err: any) {
            setError(err.message || 'Failed to delete student');
            return false;
        }
    };

    const toggleSort = (field: string) => {
        setParams(prev => ({
            ...prev,
            sortBy: field,
            sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
            page: 1
        }));
    };

    return {
        students: data,
        total,
        loading,
        error,
        params,
        setPage,
        setLimit,
        setSearch,
        setFilter,
        toggleSort,
        deleteStudent,
        refetch: fetchStudents
    };
}
