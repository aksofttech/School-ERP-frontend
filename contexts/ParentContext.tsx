import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { statsService } from '@/services/stats.service';
import { useAuthContext } from '@/contexts/AuthContext';

interface ParentContextType {
    selectedChildId: string | 'ALL';
    setSelectedChildId: (id: string | 'ALL') => void;
    childrenList: Array<{ id: string; name: string; avatar?: string; class?: string; pendingFees?: number; attendanceRate?: number }>;
    loading: boolean;
    refresh: () => Promise<void>;
}

const ParentContext = createContext<ParentContextType | undefined>(undefined);

export function ParentProvider({ children }: { children: ReactNode }) {
    const { user } = useAuthContext();
    const [selectedChildId, setSelectedChildId] = useState<string | 'ALL'>('ALL');
    const [childrenList, setChildrenList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchChildren = async () => {
        if (!user || user.role !== 'PARENT') {
            setLoading(false);
            return;
        }
        
        try {
            setLoading(true);
            const data = await statsService.getStats('PARENT');
            if (data && data.children) {
                setChildrenList(data.children);
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
