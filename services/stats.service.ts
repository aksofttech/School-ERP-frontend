/**
 * Stats service
 * Handles dashboard statistics API calls
 */

import { apiClient } from '@/utils/api-client';
import { API_ENDPOINTS } from '@/utils/constants';

export interface DashboardStats {
    totalStudents?: number;
    totalTeachers?: number;
    totalParents?: number;
    totalEarnings?: number;
    totalClasses?: number;
    totalSubjects?: number;
    statistics?: any;
    recentActivities?: any[];
    recentSchools?: any[];
    [key: string]: any;
}

class StatsService {
    /**
     * Get dashboard statistics based on role
     */
    async getStats(role?: string): Promise<any> {
        let endpoint = '/dashboard/admin'; // Default

        if (role === 'SUPER_ADMIN') endpoint = '/dashboard/super-admin';
        else if (role === 'TEACHER') endpoint = '/dashboard/teacher';
        else if (role === 'STUDENT') endpoint = '/dashboard/student';
        else if (role === 'PARENT') endpoint = '/dashboard/parent';
        else if (role === 'SCHOOL_ADMIN') endpoint = '/dashboard/admin';

        const response = await apiClient.get<any>(endpoint);
        return response; // response comes back directly as the object from apiClient.get
    }

    // Individual methods for backward compatibility or direct access
    async getAdminStats(): Promise<DashboardStats> {
        return this.getStats('SCHOOL_ADMIN');
    }

    async getTeacherStats(): Promise<any> {
        return this.getStats('TEACHER');
    }

    async getStudentStats(): Promise<any> {
        return this.getStats('STUDENT');
    }
}

export const statsService = new StatsService();

// Temporary constants to prevent breakage until backend provides these
export const ATTENDANCE_DATA = [
    { name: 'Mon', present: 400, absent: 24 },
    { name: 'Tue', present: 300, absent: 13 },
    { name: 'Wed', present: 200, absent: 98 },
    { name: 'Thu', present: 278, absent: 39 },
    { name: 'Fri', present: 189, absent: 48 },
];

export const FEES_DATA = [
    { name: 'Jan', collected: 4000, pending: 2400 },
    { name: 'Feb', collected: 3000, pending: 1398 },
    { name: 'Mar', collected: 2000, pending: 9800 },
    { name: 'Apr', collected: 2780, pending: 3908 },
    { name: 'May', collected: 1890, pending: 4800 },
    { name: 'Jun', collected: 2390, pending: 3800 },
];
