// API wrapper with error handling
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';

export interface APIOptions extends RequestInit {
  timeout?: number;
}

async function fetchWithTimeout(url: string, options: APIOptions = {}) {
  const { timeout = 5000, ...fetchOptions } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${API_BASE}${url}`, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(id);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(id);
    console.error('[v0] API Error:', error);
    throw error;
  }
}

export const api = {
  post: (url: string, data: any, options?: APIOptions) =>
    fetchWithTimeout(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(data),
    }),

  get: (url: string, options?: APIOptions) =>
    fetchWithTimeout(url, { ...options, method: 'GET' }),

  put: (url: string, data: any, options?: APIOptions) =>
    fetchWithTimeout(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(data),
    }),

  delete: (url: string, options?: APIOptions) =>
    fetchWithTimeout(url, { ...options, method: 'DELETE' }),
};
