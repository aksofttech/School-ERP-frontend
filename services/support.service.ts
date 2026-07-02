/**
 * Support service
 */

import { apiClient } from '@/utils/api-client';
import { API_ENDPOINTS } from '@/utils/constants';

class SupportService {
  async getTickets(params?: any) {
    const response = await apiClient.get(API_ENDPOINTS.SUPPORT, { params });
    return response.data!;
  }

  async getTicketById(id: string) {
    const response = await apiClient.get(`${API_ENDPOINTS.SUPPORT}/${id}`);
    return response.data;
  }

  async createTicket(data: any) {
    const response = await apiClient.post(API_ENDPOINTS.SUPPORT, data);
    return response.data;
  }

  async updateTicket(id: string, data: any) {
    const response = await apiClient.patch(`${API_ENDPOINTS.SUPPORT}/${id}`, data);
    return response.data;
  }

  async getFAQ() {
    const response = await apiClient.get(`${API_ENDPOINTS.SUPPORT}/faq`);
    return response.data!;
  }
}

export const supportService = new SupportService();
