/**
 * Transport service
 */

import { apiClient } from '@/utils/api-client';
import { API_ENDPOINTS } from '@/utils/constants';

class TransportService {
  async getRoutes() {
    const response = await apiClient.get(`${API_ENDPOINTS.TRANSPORT}/routes`);
    return response.data!;
  }

  async createRoute(data: any) {
    const response = await apiClient.post(`${API_ENDPOINTS.TRANSPORT}/routes`, data);
    return response.data;
  }

  async getVehicles() {
    const response = await apiClient.get(`${API_ENDPOINTS.TRANSPORT}/vehicles`);
    return response.data!;
  }

  async createVehicle(data: any) {
    const response = await apiClient.post(`${API_ENDPOINTS.TRANSPORT}/vehicles`, data);
    return response.data;
  }

  async assignStudent(data: any) {
    const response = await apiClient.post(`${API_ENDPOINTS.TRANSPORT}/assign`, data);
    return response.data;
  }

  async getStudentMapping(studentId: string) {
    const response = await apiClient.get(`${API_ENDPOINTS.TRANSPORT}/student/${studentId}`);
    return response.data;
  }
}

export const transportService = new TransportService();
