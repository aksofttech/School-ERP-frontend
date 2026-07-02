import { useState, useCallback } from 'react';
import { hostelService } from '@/services/hostel.service';
import { toast } from 'react-hot-toast';

export const useHostel = () => {
    const [loading, setLoading] = useState(false);
    const [hostels, setHostels] = useState<any[]>([]);
    const [allocations, setAllocations] = useState<any[]>([]);

    const fetchHostels = useCallback(async () => {
        setLoading(true);
        try {
            const data = await hostelService.getHostels();
            setHostels(data.data || data);
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch hostels');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAllocations = useCallback(async (params?: any) => {
        setLoading(true);
        try {
            const data = await hostelService.getAllocations(params);
            setAllocations(data.data || data);
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }, []);

    const createHostel = async (data: any) => {
        setLoading(true);
        try {
            await hostelService.createHostel(data);
            toast.success('Hostel registered.');
            fetchHostels();
            return true;
        } catch (error: any) {
            toast.error(error.message || 'Failed to register hostel');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const allocateRoom = async (data: any) => {
        setLoading(true);
        try {
            await hostelService.allocateRoom(data);
            toast.success('Room assigned.');
            fetchAllocations();
            return true;
        } catch (error: any) {
            toast.error(error.message || 'Failed to allocate room');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        hostels,
        allocations,
        fetchHostels,
        fetchAllocations,
        createHostel,
        allocateRoom
    };
};
