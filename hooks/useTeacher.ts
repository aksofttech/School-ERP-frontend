import { useState, useEffect, useCallback } from 'react';
import { teachersService } from '@/services/teachers.service';
import { Teacher } from '@/utils/types';

export function useTeacher(id: string | string[] | undefined) {
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTeacher = useCallback(async () => {
        if (!id || typeof id !== 'string') return;
        setLoading(true);
        setError(null);
        try {
            const data = await teachersService.getById(id);
            setTeacher(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch teacher details');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchTeacher();
    }, [fetchTeacher]);

    return { teacher, loading, error, refetch: fetchTeacher };
}
