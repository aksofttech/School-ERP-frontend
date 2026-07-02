import { useState, useEffect, useCallback } from 'react';
import { Parent, PaginationParams } from '@/utils/types';
import { parentsService } from '@/services/parents.service';
import { toast } from 'react-hot-toast';

export const useParents = (initialParams?: PaginationParams & { search?: string }) => {
    const [parents, setParents] = useState<Parent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    });

    const [params, setParams] = useState(initialParams || { page: 1, limit: 10 });

    const fetchParents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await parentsService.getParents(params);
            setParents(response.data);
            setPagination({
                total: response.total,
                page: response.page,
                limit: response.limit,
                totalPages: response.totalPages,
            });
        } catch (err: any) {
            const message = err.message || 'Failed to fetch parents';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchParents();
    }, [fetchParents]);

    const deleteParent = async (id: string) => {
        try {
            await parentsService.deleteParent(id);
            toast.success('Parent removed');
            fetchParents();
        } catch (err: any) {
            toast.error(err.message || 'Failed to remove parent');
        }
    };

    return {
        parents,
        loading,
        error,
        pagination,
        params,
        setParams,
        refetch: fetchParents,
        deleteParent,
    };
};
