/**
 * Homework service
 */

import { apiClient } from '@/utils/api-client';
import { API_ENDPOINTS } from '@/utils/constants';

class HomeworkService {
  async getAll(params?: any) {
    const response = await apiClient.get(API_ENDPOINTS.HOMEWORK, { params });
    return response.data!;
  }

  async getHomework(params?: any) {
    return this.getAll(params);
  }

  async getById(id: string) {
    const response = await apiClient.get(`${API_ENDPOINTS.HOMEWORK}/${id}`);
    return response.data;
  }

  async create(data: any) {
    const response = await apiClient.post(API_ENDPOINTS.HOMEWORK, data);
    return response.data;
  }

  async update(id: string, data: any) {
    const response = await apiClient.patch(`${API_ENDPOINTS.HOMEWORK}/${id}`, data);
    return response.data;
  }

  async delete(id: string) {
    await apiClient.delete(`${API_ENDPOINTS.HOMEWORK}/${id}`);
  }

  async getSubmissions(homeworkId: string) {
    const response = await apiClient.get(`${API_ENDPOINTS.HOMEWORK}/${homeworkId}/submissions`);
    return response.data || [];
  }

  async submit(data: any) {
    const response = await apiClient.post(`${API_ENDPOINTS.HOMEWORK}/submit`, data);
    return response.data;
  }
}

export const homeworkService = new HomeworkService();
