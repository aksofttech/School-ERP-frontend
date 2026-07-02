import { useState, useEffect, useCallback } from 'react';
import { Fee, PaginationParams } from '@/utils/types';
import { feesService } from '@/services/fees.service';
import { toast } from 'react-hot-toast';

export const useFees = (initialParams?: PaginationParams & { studentId?: string; status?: string }) => {
    const [fees, setFees] = useState<Fee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    });

    const [params, setParams] = useState(initialParams || { page: 1, limit: 10 });

    const fetchFees = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await feesService.getFees(params);
            setFees(response.data);
            setPagination({
                total: response.total,
                page: response.page,
                limit: response.limit,
                totalPages: response.totalPages,
            });
        } catch (err: any) {
            const message = err.message || 'Failed to fetch financial records';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchFees();
    }, [fetchFees]);

    const recordPayment = async (feeId: string, paymentData: any) => {
        try {
            await feesService.recordPayment(feeId, paymentData);
            toast.success('Financial transaction recorded and synchronized.');
            fetchFees();
        } catch (err: any) {
            toast.error(err.message || 'Payment synchronization failed');
        }
    };

    const deleteFee = async (id: string) => {
        try {
            await feesService.deleteFee(id);
            toast.success('Fee record removed from ledger');
            fetchFees();
        } catch (err: any) {
            toast.error(err.message || 'Ledger entry removal failed');
        }
    };

    return {
        fees,
        loading,
        error,
        pagination,
        params,
        setParams,
        refetch: fetchFees,
        recordPayment,
        deleteFee,
    };
};
