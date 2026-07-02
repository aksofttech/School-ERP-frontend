/**
 * Parent Management service
 * Handles guardian registry, student linking, and profile management
 */

import { apiClient } from '@/utils/api-client';
import { API_ENDPOINTS } from '@/utils/constants';
import { Parent, PaginationParams, PaginatedResponse } from '@/utils/types';

class ParentsService {
  /**
   * Get all parents with optional filtering
   */
  async getParents(params?: PaginationParams & { search?: string }): Promise<PaginatedResponse<Parent>> {
    const response = await apiClient.get<PaginatedResponse<Parent>>(API_ENDPOINTS.PARENTS, { params });
    return (response as any).data || response;
  }

  /**
   * Get parent by ID
   */
  async getParentById(id: string): Promise<Parent> {
    const response = await apiClient.get<Parent>(`${API_ENDPOINTS.PARENTS}/${id}`);
    return (response as any).data || response;
  }

  /**
   * Create a new parent record
   */
  async createParent(data: Partial<Parent>): Promise<Parent> {
    const response = await apiClient.post<Parent>(API_ENDPOINTS.PARENTS, data);
    return (response as any).data || response;
  }

  /**
   * Update parent details
   */
  async updateParent(id: string, data: Partial<Parent>): Promise<Parent> {
    const response = await apiClient.put<Parent>(`${API_ENDPOINTS.PARENTS}/${id}`, data);
    return (response as any).data || response;
  }

  /**
   * Delete parent record
   */
  async deleteParent(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.PARENTS}/${id}`);
  }

  /**
   * Link a student to a parent
   */
  async linkStudent(parentId: string, studentId: string): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.PARENTS}/${parentId}/students`, { studentId });
  }

  /**
   * Unlink a student from a parent
   */
  async unlinkStudent(parentId: string, studentId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.PARENTS}/${parentId}/students/${studentId}`);
  }
}

export const parentsService = new ParentsService();
