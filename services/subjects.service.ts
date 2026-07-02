/**
 * Subjects service
 */

import { apiClient } from '@/utils/api-client';
import { API_ENDPOINTS } from '@/utils/constants';
import { Subject, CreateSubjectDto, UpdateSubjectDto } from '@/utils/types';

interface AssignSubjectDto {
  subjectId: string;
  teacherId: string;
  classId?: string;
}

class SubjectsService {
  async getAll(): Promise<Subject[]> {
    const response = await apiClient.get(API_ENDPOINTS.SUBJECTS);
    return response.data!;
  }

  async getById(id: string): Promise<Subject> {
    const response = await apiClient.get(`${API_ENDPOINTS.SUBJECTS}/${id}`);
    return response.data;
  }

  async create(data: CreateSubjectDto): Promise<Subject> {
    const response = await apiClient.post(API_ENDPOINTS.SUBJECTS, data);
    return response.data;
  }

  async update(id: string, data: UpdateSubjectDto): Promise<Subject> {
    const response = await apiClient.patch(`${API_ENDPOINTS.SUBJECTS}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.SUBJECTS}/${id}`);
  }

  async assign(data: AssignSubjectDto): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.SUBJECTS}/assign`, data);
  }
}

export const subjectsService = new SubjectsService();
