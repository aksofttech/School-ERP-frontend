import { useState, useEffect, useCallback } from 'react';
import { classesService } from '@/services/classes.service';
import { Class } from '@/utils/types';

export function useClasses() {
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchClasses = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await classesService.getAll();
            setClasses(data || []);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch classes');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchClasses();
    }, [fetchClasses]);

    return { classes, loading, error, refetch: fetchClasses };
}
