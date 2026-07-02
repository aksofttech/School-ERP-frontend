/**
 * Reports service
 */

import { apiClient } from '@/utils/api-client';
import { API_ENDPOINTS } from '@/utils/constants';

class ReportsService {
  async getAttendanceReport(params: any) {
    const response = await apiClient.get(`${API_ENDPOINTS.REPORTS}/attendance`, { params });
    return response.data!;
  }

  async getAcademicReport(params: any) {
    const response = await apiClient.get(`${API_ENDPOINTS.REPORTS}/academic`, { params });
    return response.data!;
  }

  async getFeesReport(params: any) {
    const response = await apiClient.get(`${API_ENDPOINTS.REPORTS}/fees`, { params });
    return response.data!;
  }

  async generateCustomReport(data: any) {
    const response = await apiClient.post(`${API_ENDPOINTS.REPORTS}/custom`, data);
    return response.data;
  }
}

export const reportsService = new ReportsService();
