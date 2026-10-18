import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { statsService } from '@/services/stats.service';
import { useAuthContext } from '@/contexts/AuthContext';

export interface ParentChild {
    id: string;
    name: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    class?: string;
    section?: string;
    rollNumber?: string;
    admissionNo?: string;
    pendingFees?: number;
    paidFees?: number;
    attendanceRate?: number;
    presentDays?: number;
    absentDays?: number;
    totalAttendanceRecorded?: number;
    recentAttendance?: any[];
    examResults?: any[];
    examAverage?: number;
    homeworkTasks?: any[];
    [key: string]: any;
}

interface ParentContextType {
    selectedChildId: string | 'ALL';
    setSelectedChildId: (id: string | 'ALL') => void;
    childrenList: ParentChild[];
    loading: boolean;
    refresh: () => Promise<void>;
}

const ParentContext = createContext<ParentContextType | undefined>(undefined);

export function ParentProvider({ children }: { children: ReactNode }) {
    const existing = useContext(ParentContext);
    if (existing) {
        return <>{children}</>;
    }

    return <ParentProviderInner>{children}</ParentProviderInner>;
}

function ParentProviderInner({ children }: { children: ReactNode }) {
    const { user } = useAuthContext();
    const [selectedChildId, setSelectedChildIdState] = useState<string | 'ALL'>('ALL');
    const [childrenList, setChildrenList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = sessionStorage.getItem('parent_selected_child_id');
            if (saved) {
                setSelectedChildIdState(saved);
            }
        }
    }, []);

    const setSelectedChildId = (id: string | 'ALL') => {
        setSelectedChildIdState(id);
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('parent_selected_child_id', id);
        }
    };

    const fetchChildren = async () => {
        if (!user || user.role !== 'PARENT') {
            setLoading(false);
            return;
        }
        
        try {
            setLoading(true);
            const data = await statsService.getStats('PARENT');
            const payload = (data as any)?.data || data;
            if (payload && payload.children) {
                setChildrenList(payload.children);
            }
        } catch (error) {
            console.error('Error fetching parent children:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChildren();
    }, [user]);

    return (
        <ParentContext.Provider value={{ 
            selectedChildId, 
            setSelectedChildId, 
            childrenList, 
            loading,
            refresh: fetchChildren 
        }}>
            {children}
        </ParentContext.Provider>
    );
}

export function useParent() {
    const context = useContext(ParentContext);
    if (context === undefined) {
        throw new Error('useParent must be used within a ParentProvider');
    }
    return context;
}
