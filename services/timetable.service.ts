/**
 * Timetable service
 */

import { apiClient } from '@/utils/api-client';
import { API_ENDPOINTS } from '@/utils/constants';

class TimetableService {
  async create(data: any) {
    const response = await apiClient.post(API_ENDPOINTS.TIMETABLE, data);
    return response.data;
  }

  async getByClass(classId: string) {
    const response = await apiClient.get(`${API_ENDPOINTS.TIMETABLE}/class/${classId}`);
    return response.data;
  }

  async getByTeacher(teacherId: string) {
    const response = await apiClient.get(`${API_ENDPOINTS.TIMETABLE}/teacher/${teacherId}`);
    return response.data;
  }

  async getMyTimetable() {
    const response = await apiClient.get(`${API_ENDPOINTS.TIMETABLE}/my-timetable`);
    return response.data;
  }

  async update(id: string, data: any) {
    const response = await apiClient.patch(`${API_ENDPOINTS.TIMETABLE}/${id}`, data);
    return response.data;
  }

  async delete(id: string) {
    await apiClient.delete(`${API_ENDPOINTS.TIMETABLE}/${id}`);
  }
}

export const timetableService = new TimetableService();
