/**
 * Library service
 */

import { apiClient } from '@/utils/api-client';
import { API_ENDPOINTS } from '@/utils/constants';

class LibraryService {
  async getBooks(params?: any) {
    const response = await apiClient.get(`${API_ENDPOINTS.LIBRARY}/books`, { params });
    return response.data!;
  }

  async getBookById(id: string) {
    const response = await apiClient.get(`${API_ENDPOINTS.LIBRARY}/books/${id}`);
    return response.data;
  }

  async createBook(data: any) {
    const response = await apiClient.post(`${API_ENDPOINTS.LIBRARY}/books`, data);
    return response.data;
  }

  async updateBook(id: string, data: any) {
    const response = await apiClient.patch(`${API_ENDPOINTS.LIBRARY}/books/${id}`, data);
    return response.data;
  }

  async deleteBook(id: string) {
    await apiClient.delete(`${API_ENDPOINTS.LIBRARY}/books/${id}`);
  }

  async issueBook(data: any) {
    const response = await apiClient.post(`${API_ENDPOINTS.LIBRARY}/issue`, data);
    return response.data;
  }

  async returnBook(data: any) {
    const response = await apiClient.post(`${API_ENDPOINTS.LIBRARY}/returns`, data);
    return response.data;
  }

  async getFines(params?: any) {
    const response = await apiClient.get(`${API_ENDPOINTS.LIBRARY}/fines`, { params });
    return response.data!;
  }
}

export const libraryService = new LibraryService();
