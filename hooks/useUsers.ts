import { useState, useEffect, useCallback } from 'react';
import { User, PaginationParams } from '@/utils/types';
import { usersService } from '@/services/users.service';
import { toast } from 'react-hot-toast';

export const useUsers = (initialParams?: PaginationParams & { role?: string; search?: string }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    });

    const [params, setParams] = useState(initialParams || { page: 1, limit: 10 });

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await usersService.getAll(params);
            setUsers(response.data);
            setPagination({
                total: response.total,
                page: response.page,
                limit: response.limit,
                totalPages: response.totalPages,
            });
        } catch (err: any) {
            const message = err.message || 'Failed to fetch user directory';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const updateUserRole = async (userId: string, role: string) => {
        try {
            await usersService.updateRole(userId, role);
            toast.success('User role updated');
            fetchUsers();
        } catch (err: any) {
            toast.error(err.message || 'Failed to update user role');
        }
    };

    const deleteUser = async (id: string) => {
        try {
            await usersService.delete(id);
            toast.success('User removed');
            fetchUsers();
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete user');
        }
    };

    return {
        users,
        loading,
        error,
        pagination,
        params,
        setParams,
        refetch: fetchUsers,
        updateUserRole,
        deleteUser,
    };
};
