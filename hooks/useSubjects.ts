import { useState, useEffect, useCallback } from 'react';
import { subjectsService } from '@/services/subjects.service';
import { Subject } from '@/utils/types';

export function useSubjects() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSubjects = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await subjectsService.getAll();
            setSubjects(data || []);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch subjects');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    return { subjects, loading, error, refetch: fetchSubjects };
}
