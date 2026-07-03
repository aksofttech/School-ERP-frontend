/**
 * Authentication service
 * Handles all authentication-related API calls
 * Token is managed server-side via HTTP-Only cookies
 */

import { apiClient } from '@/utils/api-client';
import { API_ENDPOINTS } from '@/utils/constants';
import { LoginCredentials, User } from '@/utils/types';

// Shape of the new cookie-based login response
interface CookieLoginResponse {
  message: string;
  user: User;
}

class AuthService {
  /**
   * Login user.
   * Backend sets the JWT as an HTTP-Only cookie and returns user data only.
   */
  async login(credentials: LoginCredentials): Promise<CookieLoginResponse> {
    const response = await apiClient.post<CookieLoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
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
    await apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      oldPassword,
      newPassword,
    });
  }

  /**
   * Get current user profile.
   * Works because the HTTP-Only cookie is automatically sent with the request.
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<{ data: User }>(API_ENDPOINTS.AUTH.PROFILE);
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
   * Logout - calls backend to clear the HTTP-Only cookie.
   * Also clears any cached user data from localStorage.
   */
  async logout(): Promise<void> {
    try {
      // Tell the backend to clear the HTTP-Only cookie (only the backend can do this)
      await apiClient.post('/auth/logout');
    } finally {
      // Clear any locally cached user data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
      }
    }
  }
}

export const authService = new AuthService();
