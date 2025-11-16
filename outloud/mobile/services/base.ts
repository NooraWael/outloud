import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { getToken, removeToken } from './storage';
import { APIError } from './types';
import { router } from 'expo-router';

const API_BASE_URL = __DEV__
  ? 'http://10.10.4.13:3000' // Development
  : 'https://tbd.com'; // Production

export class BaseAPI {
  protected client: AxiosInstance;

  constructor(baseURL: string = API_BASE_URL) {
    this.client = axios.create({
      baseURL,
      timeout: 30000, // 30 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<APIError>) => {
        if (error.response) {
          const { status, data } = error.response;

          // Handle 401 - Unauthorized (token expired/invalid)
          if (status === 401) {
            await removeToken();
            router.replace('/login');
          }

          // Format error message
          const message = data?.message || 'An error occurred';
          throw {
            message,
            statusCode: status,
          } as APIError;
        } else if (error.request) {
          // Network error
          throw {
            message: 'Network error. Please check your connection.',
          } as APIError;
        } else {
          throw {
            message: 'An unexpected error occurred',
          } as APIError;
        }
      }
    );
  }

  // Helper methods
  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  protected async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  protected async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // Upload file (for voice messages)
  protected async upload<T>(
    url: string,
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const response = await this.client.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
    return response.data;
  }
}