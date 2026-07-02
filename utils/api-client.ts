/**
 * Centralized API client for all HTTP requests
 * Handles authentication, error handling, and request/response interceptors
 * Uses localStorage for token storage
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from './constants';
import { ApiResponse } from './types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - Add auth token to requests from localStorage/sessionStorage
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
          // Check both storages for the token using the centralized key
          const localToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
          const sessionToken = sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

          // Prioritize local token (Remember Me) or fall back to session token
          const token = localToken || sessionToken;

          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle errors globally
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiResponse>) => {
        if (error.response?.status === 401) {
          // Token expired or invalid - clear storage and redirect to login
          if (typeof window !== 'undefined') {
            // Prevent redirect loops
            const currentPath = window.location.pathname;
            const isAuthPage = currentPath.startsWith('/auth/');

            if (!isAuthPage) {
              localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
              localStorage.removeItem(STORAGE_KEYS.USER);
              sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
              sessionStorage.removeItem(STORAGE_KEYS.USER);
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
   * Backend returns direct object, not wrapped in ApiResponse
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
      // Server responded with error
      const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
      return Error(message);
    } else if (error.request) {
      // Request made but no response
      return Error('Network error. Please check your connection.');
    } else {
      // Error in request setup
      return Error(error.message || 'An unexpected error occurred');
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
