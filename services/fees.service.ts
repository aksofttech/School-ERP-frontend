/**
 * Fees Management service
 * Handles fee structures, student assignments, and payment tracking
 */

import { apiClient } from '@/utils/api-client';
import { API_ENDPOINTS } from '@/utils/constants';
import { Fee, PaginationParams, PaginatedResponse } from '@/utils/types';

class FeesService {
  /**
   * Get all fees with optional filtering
   */
  async getFees(params?: PaginationParams & { studentId?: string; status?: string }): Promise<PaginatedResponse<Fee>> {
    const response: any = await apiClient.get<any>(API_ENDPOINTS.FEES, { params });
    // Map backend { data, meta } structure to PaginatedResponse structure
    return {
      data: response?.data || [],
      total: response?.meta?.total || 0,
      page: response?.meta?.page || 1,
      limit: response?.meta?.limit || 10,
      totalPages: response?.meta?.totalPages || 0,
    };
  }

  /**
   * Get fee dashboard statistics
   */
  async getDashboardStats(): Promise<any> {
    const response = await apiClient.get<any>(`${API_ENDPOINTS.FEES}/dashboard`);
    return response.data || response;
  }

  /**
   * Get fee by ID
   */
  async getFeeById(id: string): Promise<Fee> {
    const response = await apiClient.get<Fee>(`${API_ENDPOINTS.FEES}/${id}`);
    return (response as any).data || response;
  }

  /**
   * Create a new fee entry/assignment
   */
  async createFee(data: Partial<Fee>): Promise<Fee> {
    const response = await apiClient.post<Fee>(API_ENDPOINTS.FEES, data);
    return (response as any).data || response;
  }

  /**
   * Update fee details
   */
  async updateFee(id: string, data: Partial<Fee>): Promise<Fee> {
    const response = await apiClient.put<Fee>(`${API_ENDPOINTS.FEES}/${id}`, data);
    return (response as any).data || response;
  }

  /**
   * Delete fee record
   */
  async deleteFee(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.FEES}/${id}`);
  }

  /**
   * Record a payment for an invoice/fee
   */
  async recordPayment(id: string, paymentData?: any): Promise<void> {
    await apiClient.patch(`${API_ENDPOINTS.FEES}/${id}/mark-paid`);
  }

  /**
   * Get fee structures/types
   */
  async getFeeStructures(): Promise<any[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.FEES}/structures`);
    return (response as any).data || response;
  }
}

export const feesService = new FeesService();
