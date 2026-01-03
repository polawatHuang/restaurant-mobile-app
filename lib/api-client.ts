/**
 * Backend API Client
 * Handles all communication with the backend API
 */

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'https://restaurant.xn--12clh6dc4eub3cdb2qwc.com/api';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
}

async function apiRequest<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { method = 'GET', headers = {}, body, params } = options;

  // Build URL with query params
  let url = `${BACKEND_API_URL}${endpoint}`;
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  // Default headers
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const config: RequestInit = {
    method,
    headers: defaultHeaders,
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
}

// Helper functions for different HTTP methods
export const apiClient = {
  get: <T>(endpoint: string, params?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: 'GET', params }),

  post: <T>(endpoint: string, body?: any) =>
    apiRequest<T>(endpoint, { method: 'POST', body }),

  put: <T>(endpoint: string, body?: any) =>
    apiRequest<T>(endpoint, { method: 'PUT', body }),

  patch: <T>(endpoint: string, body?: any) =>
    apiRequest<T>(endpoint, { method: 'PATCH', body }),

  delete: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }),
};

export { BACKEND_API_URL };

