/**
 * Authentication service
 * Handles all authentication-related API calls
 */

import { apiClient } from '@/utils/api-client';
import { API_ENDPOINTS } from '@/utils/constants';
import { LoginCredentials, LoginResponse, User } from '@/utils/types';

class AuthService {
  /**
   * Login user
   * Backend returns: { access_token: string, user: User }
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response;
  }

  /**
   * Register new school/user
   */
  async register(data: any): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, password });
  }

  /**
   * Verify OTP
   */
  async verifyOTP(otp: string): Promise<boolean> {
    // Assuming backend returns { valid: boolean } or similar
    // Adjust endpoint as necessary, assuming /auth/verify-otp exists or similar
    try {
      await apiClient.post('/auth/verify-otp', { otp });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Change password
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, { oldPassword, newPassword });
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<{ data: User }>(API_ENDPOINTS.AUTH.PROFILE);
    // Backend might return wrapped or direct, handle both
    return (response as any).data || response;
  }

  /**
   * Update current user profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.patch<{ data: User }>(API_ENDPOINTS.AUTH.PROFILE, data);
    return (response as any).data || response;
  }

  /**
   * Logout - clears localStorage
   */
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('user');
    }
  }
}

export const authService = new AuthService();
