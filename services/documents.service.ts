/**
 * Documents service
 */

import { apiClient } from '@/utils/api-client';
import { API_ENDPOINTS } from '@/utils/constants';

class DocumentsService {
  async upload(data: FormData) {
    const response = await apiClient.post(`${API_ENDPOINTS.DOCUMENTS}/upload`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  async getAll(params?: any) {
    const response = await apiClient.get(API_ENDPOINTS.DOCUMENTS, { params });
    return response.data!;
  }

  async getById(id: string) {
    const response = await apiClient.get(`${API_ENDPOINTS.DOCUMENTS}/${id}`);
    return response.data;
  }

  async delete(id: string) {
    await apiClient.delete(`${API_ENDPOINTS.DOCUMENTS}/${id}`);
  }

  async getCertificates(params?: any) {
    const response = await apiClient.get(`${API_ENDPOINTS.DOCUMENTS}/certificates`, { params });
    return response.data!;
  }

  async download(id: string) {
    const response = await apiClient.get(`${API_ENDPOINTS.DOCUMENTS}/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  }
}

export const documentsService = new DocumentsService();
