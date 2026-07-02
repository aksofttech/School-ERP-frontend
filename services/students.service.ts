/**
 * Students service
 * Handles all student-related API calls
 */

import { apiClient } from '@/utils/api-client';
import { API_ENDPOINTS } from '@/utils/constants';
import { PaginationParams, PaginatedResponse, Student, CreateStudentDto, UpdateStudentDto, Document } from '@/utils/types';
import { mapStudent, mapArray } from '@/utils/mappers';

class StudentsService {
  /**
   * Get all students
   */
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<Student>> {
    const cleanedParams = params ? Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
    ) : undefined;

    const response = await apiClient.get<any>(API_ENDPOINTS.STUDENTS, { params: cleanedParams });

    // response is directly the body { data: [], meta: { total: ... } }
    const data = response.data || [];
    const meta = response.meta || {};
    
    return {
      data: mapArray(mapStudent)(data),
      total: meta.total || data.length || 0,
      page: meta.page || params?.page || 1,
      limit: meta.limit || params?.limit || 10,
      totalPages: meta.totalPages || 0,
    };
  }

  /**
   * Get student by ID
   */
  async getById(id: string): Promise<Student> {
    const response = await apiClient.get<any>(`${API_ENDPOINTS.STUDENTS}/${id}`);
    const data = response.data || response;
    return mapStudent(data) as Student;
  }

  /**
   * Get students by class ID
   */
  async getByClass(classId: string): Promise<Student[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.STUDENTS}/class/${classId}`);
    return (response as any).data || response;
  }

  /**
   * Create new student
   */
  async create(data: CreateStudentDto): Promise<Student> {
    const response = await apiClient.post(API_ENDPOINTS.STUDENTS, data);
    return mapStudent(response) as Student;
  }

  /**
   * Update student
   */
  async update(id: string, data: UpdateStudentDto): Promise<Student> {
    const response = await apiClient.patch<any>(`${API_ENDPOINTS.STUDENTS}/${id}`, data);
    const resultData = response.data || response;
    return mapStudent(resultData) as Student;
  }

  /**
   * Delete student
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.STUDENTS}/${id}`);
  }

  /**
   * Get student documents
   */
  async getDocuments(studentId: string): Promise<Document[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.STUDENTS}/${studentId}/documents`);
    return response.data || [];
  }

  /**
   * Promote students
   */
  async promote(data: { studentIds: string[]; targetClassId: string }): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.STUDENTS}/promote`, data);
  }
}

export const studentsService = new StudentsService();
