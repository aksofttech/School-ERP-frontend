/**
 * Communication service - Strictly for Announcements (Notices)
 */

import { apiClient } from '@/utils/api-client';
import { API_ENDPOINTS } from '@/utils/constants';

class CommunicationService {
  // Notices
  async getNotices(params?: any) {
    const response = await apiClient.get(API_ENDPOINTS.COMMUNICATION.NOTICES, { params });
    return (response as any).data || response;
  }

  async createNotice(data: any) {
    const response = await apiClient.post(API_ENDPOINTS.COMMUNICATION.NOTICES, data);
    return (response as any).data || response;
  }

  async updateNotice(id: string, data: any) {
    const response = await apiClient.patch(`${API_ENDPOINTS.COMMUNICATION.NOTICES}/${id}`, data);
    return (response as any).data || response;
  }

  async deleteNotice(id: string) {
    const response = await apiClient.delete(`${API_ENDPOINTS.COMMUNICATION.NOTICES}/${id}`);
    return (response as any).data || response;
  }
}

export const communicationService = new CommunicationService();
