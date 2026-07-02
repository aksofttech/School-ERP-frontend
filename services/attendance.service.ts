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
    const { classId, date } = params;
    const response = await apiClient.get<any>(`${API_ENDPOINTS.ATTENDANCE}`, { 
      params: { 
        classId, 
        startDate: date, 
        endDate: date 
      } 
    });
    return response;
  }

  async getTeacherAttendance(params: any) {
    const response = await apiClient.get(`${API_ENDPOINTS.ATTENDANCE}/teachers`, { params });
    return response;
  }

  async getReports(params: any) {
    const response = await apiClient.get(`${API_ENDPOINTS.ATTENDANCE}/reports`, { params });
    return response.data!;
  }
}

export const attendanceService = new AttendanceService();
