/**
 * Examinations & Results service
 * Handles exam scheduling, marks entry, and report card generation
 */

import { apiClient } from '@/utils/api-client';
import { API_ENDPOINTS } from '@/utils/constants';
import { Exam, PaginationParams, PaginatedResponse } from '@/utils/types';

class ExamsService {
  /**
   * Get all exams with optional filtering
   */
  async getExams(params?: PaginationParams & { status?: string; classId?: string }): Promise<PaginatedResponse<Exam>> {
    const response = await apiClient.get<PaginatedResponse<Exam>>(API_ENDPOINTS.EXAMS, { params });
    // Handle both { data: [], total: 0 } and direct array responses
    return (response as any).data && Array.isArray((response as any).data) ? (response as any) : { data: response as any, total: (response as any).length || 0, page: 1, limit: 10, totalPages: 1 };
  }

  /**
   * Get exam by ID
   */
  async getExamById(id: string): Promise<Exam> {
    const response = await apiClient.get<Exam>(`${API_ENDPOINTS.EXAMS}/${id}`);
    return (response as any).data || response;
  }

  /**
   * Create a new exam
   */
  async createExam(data: Partial<Exam>): Promise<Exam> {
    const response = await apiClient.post<Exam>(API_ENDPOINTS.EXAMS, data);
    return (response as any).data || response;
  }

  /**
   * Update exam details
   */
  async updateExam(id: string, data: Partial<Exam>): Promise<Exam> {
    const response = await apiClient.patch<Exam>(`${API_ENDPOINTS.EXAMS}/${id}`, data);
    return (response as any).data || response;
  }

  /**
   * Delete exam
   */
  async deleteExam(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.EXAMS}/${id}`);
  }

  /**
   * Save marks for an exam in bulk
   */
  async saveMarks(examId: string, marksData: { studentId: string; marks: number }[]): Promise<void> {
    await apiClient.post(`/marks/bulk`, { examId, marks: marksData });
  }

  /**
   * Get marks for an exam
   */
  async getMarks(examId: string): Promise<any> {
    const response = await apiClient.get(`/marks/exam/${examId}`);
    return (response as any).data || response;
  }

  /**
   * Generate/View results for an exam
   */
  async getExamResults(examId: string): Promise<any> {
    const response = await apiClient.get(`/results/exam/${examId}`);
    return (response as any).data || response;
  }

  /**
   * Generate report card for a student
   */
  async generateReportCard(studentId: string, academicYearId: string): Promise<any> {
    const response = await apiClient.get(`/results/student/${studentId}`, { params: { academicYearId } });
    return (response as any).data || response;
  }
}

export const examsService = new ExamsService();
