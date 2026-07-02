/**
 * Teachers service
 */

import { apiClient } from '@/utils/api-client';
import { API_ENDPOINTS } from '@/utils/constants';
import { PaginationParams, PaginatedResponse, Teacher, CreateTeacherDto, UpdateTeacherDto, Document } from '@/utils/types';
import { mapTeacher, mapArray } from '@/utils/mappers';

class TeachersService {
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<Teacher>> {
    const response = await apiClient.get<any>(API_ENDPOINTS.TEACHERS, { params });
    const data = response.data || [];
    const meta = response.meta || {};
    
    return {
      data: mapArray(mapTeacher)(data),
      total: meta.total || data.length || 0,
      page: meta.page || params?.page || 1,
      limit: meta.limit || params?.limit || 10,
      totalPages: meta.totalPages || 0,
    };
  }

  async getById(id: string): Promise<Teacher> {
    const response = await apiClient.get(`${API_ENDPOINTS.TEACHERS}/${id}`);
    return mapTeacher(response.data) as Teacher;
  }

  async create(data: CreateTeacherDto): Promise<Teacher> {
    const response = await apiClient.post(API_ENDPOINTS.TEACHERS, data);
    return mapTeacher(response.data) as Teacher;
  }

  async update(id: string, data: UpdateTeacherDto): Promise<Teacher> {
    const response = await apiClient.patch(`${API_ENDPOINTS.TEACHERS}/${id}`, data);
    return mapTeacher(response.data) as Teacher;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.TEACHERS}/${id}`);
  }

  async getDocuments(teacherId: string): Promise<Document[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.TEACHERS}/${teacherId}/documents`);
    return response.data || [];
  }
}

export const teachersService = new TeachersService();
