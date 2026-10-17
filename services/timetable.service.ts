/**
 * Timetable service
 */

import { apiClient } from '@/utils/api-client';
import { API_ENDPOINTS } from '@/utils/constants';

class TimetableService {
  async create(data: any) {
    const response: any = await apiClient.post(API_ENDPOINTS.TIMETABLE, data);
    return response?.data || response;
  }

  async getAll(params?: any) {
    const response: any = await apiClient.get(API_ENDPOINTS.TIMETABLE, { params });
    return response?.data || response;
  }

  async getByClass(classId: string) {
    const response: any = await apiClient.get(`${API_ENDPOINTS.TIMETABLE}/class/${classId}`);
    return response?.data || response;
  }

  async getByTeacher(teacherId: string) {
    const response: any = await apiClient.get(`${API_ENDPOINTS.TIMETABLE}/teacher/${teacherId}`);
    return response?.data || response;
  }

  async getMyTimetable() {
    const response: any = await apiClient.get(`${API_ENDPOINTS.TIMETABLE}/my-timetable`);
    return response?.data || response;
  }

  async update(id: string, data: any) {
    const response: any = await apiClient.patch(`${API_ENDPOINTS.TIMETABLE}/${id}`, data);
    return response?.data || response;
  }

  async delete(id: string) {
    await apiClient.delete(`${API_ENDPOINTS.TIMETABLE}/${id}`);
  }
}

export const timetableService = new TimetableService();
