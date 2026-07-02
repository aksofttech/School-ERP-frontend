import { useState, useEffect, useCallback } from 'react';
import { Exam, PaginationParams } from '@/utils/types';
import { examsService } from '@/services/exams.service';
import { toast } from 'react-hot-toast';

export const useExams = (initialParams?: PaginationParams & { status?: string; search?: string }) => {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    });

    const [params, setParams] = useState(initialParams || { page: 1, limit: 10 });

    const fetchExams = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await examsService.getExams(params);
            setExams(response.data);
            setPagination({
                total: response.total,
                page: response.page,
                limit: response.limit,
                totalPages: response.totalPages,
            });
        } catch (err: any) {
            const message = err.message || 'Failed to fetch exams';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchExams();
    }, [fetchExams]);

    const deleteExam = async (id: string) => {
        try {
            await examsService.deleteExam(id);
            toast.success('Exam deleted.');
            fetchExams();
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete exam');
        }
    };

    return {
        exams,
        loading,
        error,
        pagination,
        params,
        setParams,
        refetch: fetchExams,
        deleteExam,
    };
};
