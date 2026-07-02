import { useState, useCallback } from 'react';
import { transportService } from '@/services/transport.service';
import { toast } from 'react-hot-toast';

export const useTransport = () => {
    const [loading, setLoading] = useState(false);
    const [routes, setRoutes] = useState<any[]>([]);
    const [vehicles, setVehicles] = useState<any[]>([]);

    const fetchRoutes = useCallback(async () => {
        setLoading(true);
        try {
            const data = await transportService.getRoutes();
            setRoutes(data.data || data);
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch transport routes');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchVehicles = useCallback(async () => {
        setLoading(true);
        try {
            const data = await transportService.getVehicles();
            setVehicles(data.data || data);
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch vehicle fleet data');
        } finally {
            setLoading(false);
        }
    }, []);

    const createRoute = async (data: any) => {
        setLoading(true);
        try {
            await transportService.createRoute(data);
            toast.success('New route added.');
            fetchRoutes();
            return true;
        } catch (error: any) {
            toast.error(error.message || 'Failed to register route');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const createVehicle = async (data: any) => {
        setLoading(true);
        try {
            await transportService.createVehicle(data);
            toast.success('New vehicle added.');
            fetchVehicles();
            return true;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to add vehicle';
            toast.error(typeof errorMessage === 'object' ? errorMessage[0] : errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        routes,
        vehicles,
        fetchRoutes,
        fetchVehicles,
        createRoute,
        createVehicle
    };
};
