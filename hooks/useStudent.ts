import { useState, useEffect, useCallback } from 'react';
import { studentsService } from '@/services/students.service';
import { Student } from '@/utils/types';

export function useStudent(id: string | string[] | undefined) {
    const [student, setStudent] = useState<Student | null>(null);
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [docsLoading, setDocsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStudent = useCallback(async () => {
        if (!id || typeof id !== 'string') return;
        setLoading(true);
        setError(null);
        try {
            const data = await studentsService.getById(id);
            setStudent(data);
            
            // Fetch documents
            setDocsLoading(true);
            try {
                const docsResult = await studentsService.getDocuments(id);
                setDocuments(docsResult);
            } catch (docErr) {
                console.error('Failed to fetch documents:', docErr);
            } finally {
                setDocsLoading(false);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch student details');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchStudent();
    }, [fetchStudent]);

    return { student, documents, loading, docsLoading, error, refetch: fetchStudent };
}
