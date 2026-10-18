/**
 * Attendance service
 */

import { apiClient } from '@/utils/api-client';
import { API_ENDPOINTS } from '@/utils/constants';

class AttendanceService {
  async markStudentAttendance(data: any) {
    const response = await apiClient.post(`${API_ENDPOINTS.ATTENDANCE}/students`, data);
    return response.data;
  }

  async markTeacherAttendance(data: any) {
    const response = await apiClient.post(`${API_ENDPOINTS.ATTENDANCE}/teachers`, data);
    return response.data;
  }

  async markBulkAttendance(data: any) {
    const response = await apiClient.post(`${API_ENDPOINTS.ATTENDANCE}/mark`, data);
    return response;
  }

  async getStudentAttendance(params: any) {
    let queryParams: any = {};
    if (typeof params === 'string') {
      queryParams = { studentId: params, limit: 100 };
    } else if (params && typeof params === 'object') {
      const { studentId, classId, date, startDate, endDate, limit = 100, page = 1 } = params;
      queryParams = {
        studentId,
        classId,
        startDate: startDate || date,
        endDate: endDate || date,
        limit,
        page,
      };
      Object.keys(queryParams).forEach(key => queryParams[key] === undefined && delete queryParams[key]);
    }
    const response = await apiClient.get<any>(`${API_ENDPOINTS.ATTENDANCE}`, { 
      params: queryParams 
    });
    return response;
  }

  async getMonthlyReport(studentId: string, month: string) {
    const response = await apiClient.get<any>(`${API_ENDPOINTS.ATTENDANCE}/monthly-report`, {
      params: { studentId, month }
    });
    return response.data || response;
  }

  async getTeacherAttendance(params: any) {
    const response = await apiClient.get(`${API_ENDPOINTS.ATTENDANCE}/teachers`, { params });
    return response;
  }

  async getOverview() {
    const response = await apiClient.get<any>(`${API_ENDPOINTS.ATTENDANCE}/overview`);
    return response.data || response;
  }

  async getReports(params: any) {
    const response = await apiClient.get<any>(`${API_ENDPOINTS.ATTENDANCE}/reports`, { params });
    return response.data || response;
  }
}

export const attendanceService = new AttendanceService();
