/**
 * Hostel service
 */

import { apiClient } from '@/utils/api-client';
import { API_ENDPOINTS } from '@/utils/constants';

class HostelService {
  async getHostels() {
    const response = await apiClient.get(`${API_ENDPOINTS.HOSTEL}`);
    return response.data!;
  }

  async createHostel(data: any) {
    const response = await apiClient.post(API_ENDPOINTS.HOSTEL, data);
    return response.data;
  }

  async getRooms(hostelId: string) {
    const response = await apiClient.get(`${API_ENDPOINTS.HOSTEL}/${hostelId}/rooms`);
    return response.data || [];
  }

  async createRoom(hostelId: string, data: any) {
    const response = await apiClient.post(`${API_ENDPOINTS.HOSTEL}/${hostelId}/rooms`, data);
    return response.data;
  }

  async allocateRoom(data: any) {
    const response = await apiClient.post(`${API_ENDPOINTS.HOSTEL}/allocate`, data);
    return response.data;
  }

  async getAllocations(params?: any) {
    const response = await apiClient.get(`${API_ENDPOINTS.HOSTEL}/allocations`, { params });
    return response.data!;
  }
}

export const hostelService = new HostelService();
