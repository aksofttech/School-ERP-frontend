/**
 * General Settings & Configuration service
 * Handles institutional parameters, branding, and academic year configuration
 */

import { apiClient } from '@/utils/api-client';
import { API_ENDPOINTS } from '@/utils/constants';

class SettingsService {
  /**
   * Get institutional profile/settings
   */
  async getSettings(): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.SETTINGS);
    return (response as any).data || response;
  }

  /**
   * Update institutional settings
   */
  async updateSettings(data: any): Promise<any> {
    const response = await apiClient.put(API_ENDPOINTS.SETTINGS, data);
    return (response as any).data || response;
  }

  /**
   * Get academic years
   */
  async getAcademicYears(): Promise<any[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.SETTINGS}/academic-years`);
    return (response as any).data || response;
  }

  /**
   * Create academic year
   */
  async createAcademicYear(data: any): Promise<any> {
    const response = await apiClient.post(`${API_ENDPOINTS.SETTINGS}/academic-years`, data);
    return (response as any).data || response;
  }

  /**
   * Set active academic year
   */
  async setActiveYear(id: string): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.SETTINGS}/academic-years/${id}/activate`);
  }

  /**
   * Upload institutional branding (Logo)
   */
  async uploadBranding(formData: FormData): Promise<any> {
    const response = await apiClient.post(`${API_ENDPOINTS.SETTINGS}/branding`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return (response as any).data || response;
  }
}

export const settingsService = new SettingsService();
