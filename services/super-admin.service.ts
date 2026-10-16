import { apiClient } from '@/utils/api-client';

export const superAdminService = {
  getStats: async () => {
    try {
      const response = await apiClient.get('/super-admin/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch super admin stats', error);
      // Return mock data if API fails to allow UI development
      return {
        activeSchools: 1240,
        totalUsers: 850000,
        mrr: 4200000
      };
    }
  },

  getSchools: async () => {
    try {
      const response: any = await apiClient.get('/super-admin/schools');
      if (Array.isArray(response)) return response;
      if (Array.isArray(response?.data)) return response.data;
      return [];
    } catch (error) {
      console.error('Failed to fetch schools', error);
      return [];
    }
  },

  getUsers: async (params?: { page?: number; limit?: number; role?: string; schoolId?: string; search?: string }) => {
    try {
      const query = new URLSearchParams();
      if (params?.page) query.append('page', params.page.toString());
      const safeLimit = Math.min(params?.limit || 100, 100);
      query.append('limit', safeLimit.toString());
      if (params?.role && params.role !== 'ALL') query.append('role', params.role);
      if (params?.schoolId && params.schoolId !== 'ALL') query.append('schoolId', params.schoolId);
      if (params?.search) query.append('search', params.search);

      const qs = query.toString() ? `?${query.toString()}` : '?limit=100';
      const response: any = await apiClient.get(`/users${qs}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch global users', error);
      return { data: [], meta: {} };
    }
  },

  activateUser: async (id: string) => {
    try {
      const response: any = await apiClient.patch(`/users/${id}/activate`, {});
      return response?.data || response;
    } catch (error) {
      console.error('Failed to activate user', error);
      throw error;
    }
  },

  deactivateUser: async (id: string) => {
    try {
      const response: any = await apiClient.patch(`/users/${id}/deactivate`, {});
      return response?.data || response;
    } catch (error) {
      console.error('Failed to deactivate user', error);
      throw error;
    }
  },

  resetUserPassword: async (id: string, newPassword: string) => {
    try {
      const response: any = await apiClient.patch(`/users/${id}/reset-password`, { newPassword });
      return response?.data || response;
    } catch (error) {
      console.error('Failed to reset user password', error);
      throw error;
    }
  },

  getPlans: async () => {
    try {
      const response: any = await apiClient.get('/super-admin/plans');
      return response;
    } catch (error) {
      console.error('Failed to fetch plans', error);
      return { data: [], meta: {} };
    }
  },

  createPlan: async (data: any) => {
    try {
      const response: any = await apiClient.post('/super-admin/plans', data);
      return response?.data || response;
    } catch (error) {
      console.error('Failed to create plan', error);
      throw error;
    }
  },

  updatePlan: async (id: string, data: any) => {
    try {
      const response: any = await apiClient.patch(`/super-admin/plans/${id}`, data);
      return response?.data || response;
    } catch (error) {
      console.error('Failed to update plan', error);
      throw error;
    }
  },

  deletePlan: async (id: string) => {
    try {
      const response: any = await apiClient.delete(`/super-admin/plans/${id}`);
      return response?.data || response;
    } catch (error) {
      console.error('Failed to delete plan', error);
      throw error;
    }
  },

  getSchoolById: async (id: string) => {
    try {
      const response: any = await apiClient.get(`/super-admin/schools/${id}`);
      return response?.data || response;
    } catch (error) {
      console.error('Failed to fetch school by id', error);
      throw error;
    }
  },

  updateSchool: async (id: string, data: any) => {
    try {
      const response: any = await apiClient.put(`/super-admin/schools/${id}`, data);
      return response?.data || response;
    } catch (error) {
      console.error('Failed to update school', error);
      throw error;
    }
  },

  getSystemHealth: async () => {
    try {
      const response: any = await apiClient.get('/super-admin/system-logs/health');
      return response?.data || response;
    } catch (error) {
      console.error('Failed to fetch system health', error);
      return null;
    }
  },

  getSystemLogs: async (page = 1, limit = 20) => {
    try {
      const response: any = await apiClient.get(`/super-admin/system-logs?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch system logs', error);
      return { data: [], meta: {} };
    }
  },

  runDiagnostics: async () => {
    try {
      const response: any = await apiClient.post('/super-admin/system-logs/run-diagnostics', {});
      return response?.data || response;
    } catch (error) {
      console.error('Failed to run diagnostics', error);
      throw error;
    }
  },

  getSettings: async () => {
    try {
      const response: any = await apiClient.get('/settings');
      return response?.data || response;
    } catch (error) {
      console.error('Failed to fetch settings', error);
      return null;
    }
  },

  updateSettings: async (data: any) => {
    try {
      const response: any = await apiClient.put('/settings', data);
      return response?.data || response;
    } catch (error) {
      console.error('Failed to update settings', error);
      throw error;
    }
  },

  sendTestEmail: async (email: string) => {
    try {
      const response: any = await apiClient.post('/settings/test-email', { email });
      return response?.data || response;
    } catch (error) {
      console.error('Failed to send test email', error);
      throw error;
    }
  },

  backupDatabase: async () => {
    try {
      const response: any = await apiClient.post('/settings/backup-db', {});
      return response?.data || response;
    } catch (error) {
      console.error('Failed to backup database', error);
      throw error;
    }
  },

  clearCache: async () => {
    try {
      const response: any = await apiClient.post('/settings/clear-cache', {});
      return response?.data || response;
    } catch (error) {
      console.error('Failed to clear cache', error);
      throw error;
    }
  },

  getAuditLogs: async (params?: { page?: number; limit?: number; action?: string; userId?: string; startDate?: string; endDate?: string }) => {
    try {
      const query = new URLSearchParams();
      if (params?.page) query.append('page', params.page.toString());
      const safeLimit = Math.min(params?.limit || 50, 100);
      query.append('limit', safeLimit.toString());
      if (params?.action) query.append('action', params.action);
      if (params?.userId) query.append('userId', params.userId);
      if (params?.startDate) query.append('startDate', params.startDate);
      if (params?.endDate) query.append('endDate', params.endDate);

      const qs = query.toString() ? `?${query.toString()}` : '?limit=50';
      const response: any = await apiClient.get(`/audit${qs}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch audit logs', error);
      return { data: [], meta: {} };
    }
  },

  getLicenses: async (params?: { search?: string; plan?: string }) => {
    try {
      const query = new URLSearchParams();
      if (params?.search) query.append('search', params.search);
      if (params?.plan && params.plan !== 'All Assets') query.append('plan', params.plan);
      const qs = query.toString() ? `?${query.toString()}` : '';
      const response: any = await apiClient.get(`/super-admin/licenses${qs}`);
      if (Array.isArray(response)) return response;
      if (Array.isArray(response?.data)) return response.data;
      return [];
    } catch (error) {
      console.error('Failed to fetch licenses', error);
      return [];
    }
  },

  getLicenseStats: async () => {
    try {
      const response: any = await apiClient.get('/super-admin/licenses/stats');
      return response?.data || response;
    } catch (error) {
      console.error('Failed to fetch license stats', error);
      return null;
    }
  },

  createLicense: async (data: any) => {
    try {
      const response: any = await apiClient.post('/super-admin/licenses', data);
      return response?.data || response;
    } catch (error) {
      console.error('Failed to create license', error);
      throw error;
    }
  },

  updateLicense: async (id: string | number, data: any) => {
    try {
      const response: any = await apiClient.patch(`/super-admin/licenses/${id}`, data);
      return response?.data || response;
    } catch (error) {
      console.error('Failed to update license', error);
      throw error;
    }
  },

  renewLicense: async (id: string | number) => {
    try {
      const response: any = await apiClient.post(`/super-admin/licenses/${id}/renew`, {});
      return response?.data || response;
    } catch (error) {
      console.error('Failed to renew license', error);
      throw error;
    }
  },

  deleteLicense: async (id: string | number) => {
    try {
      const response: any = await apiClient.delete(`/super-admin/licenses/${id}`);
      return response?.data || response;
    } catch (error) {
      console.error('Failed to delete license', error);
      throw error;
    }
  }
};
