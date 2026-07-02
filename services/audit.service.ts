/**
 * Audit service - READ ONLY
 * All audit operations are read-only as per requirements
 */

import { apiClient } from '@/utils/api-client';
import { API_ENDPOINTS } from '@/utils/constants';

class AuditService {
  /**
   * Get activity logs
   * READ ONLY - No mutations allowed
   */
  async getActivityLogs(params?: any) {
    const response = await apiClient.get(`${API_ENDPOINTS.AUDIT}/activity-logs`, { params });
    return response.data!;
  }

  /**
   * Get data history
   * READ ONLY - No mutations allowed
   */
  async getDataHistory(params?: any) {
    const response = await apiClient.get(`${API_ENDPOINTS.AUDIT}/data-history`, { params });
    return response.data!;
  }
}

export const auditService = new AuditService();
