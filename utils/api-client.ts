/**
 * Centralized API client for all HTTP requests
 * Handles authentication, error handling, and request/response interceptors
 * Uses HTTP-Only Cookies for authentication (set by backend on login)
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from './constants';
import { ApiResponse } from './types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      // Critical: send HTTP-Only cookies automatically on every cross-domain request
      withCredentials: true,
    });

    // Response interceptor - Handle errors globally
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiResponse>) => {
        if (error.response?.status === 401) {
          // Cookie expired or invalid - redirect to login
          if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            const isAuthPage = currentPath.startsWith('/auth/');
            if (!isAuthPage) {
              window.location.href = '/auth/login';
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): Error {
    if (error.response) {
      const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
      return Error(message);
    } else if (error.request) {
      return Error('Network error. Please check your connection.');
    } else {
      return Error(error.message || 'An unexpected error occurred');
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
