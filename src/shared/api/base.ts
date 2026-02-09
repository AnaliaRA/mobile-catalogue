import { API_CONFIG } from '@/shared/config';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Check if an error is retryable (5xx server errors)
 */
function isRetryableStatus(status: number): boolean {
  return status >= 500 && status < 600;
}

/**
 * Delay helper for retry backoff
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const RETRY_CONFIG = {
  maxRetries: 2,
  baseDelayMs: 1000, // 1 second
} as const;

export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit & { next?: NextFetchRequestConfig } = {},
  retryCount = 0
): Promise<T> {
  const url = `${API_CONFIG.baseUrl}${endpoint}`;
  const { next: nextOptions, ...fetchOptions } = options;

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      'x-api-key': API_CONFIG.apiKey,
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
    ...(nextOptions ? { next: nextOptions } : {}),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    if (isRetryableStatus(response.status) && retryCount < RETRY_CONFIG.maxRetries) {
      const delayMs = RETRY_CONFIG.baseDelayMs * Math.pow(2, retryCount);
      await delay(delayMs);
      return fetchAPI<T>(endpoint, options, retryCount + 1);
    }

    throw new ApiError(
      response.status,
      `API Error: ${response.status} ${response.statusText}`,
      errorData
    );
  }

  return response.json();
}

export async function apiGet<T>(
  endpoint: string,
  options?: { next?: NextFetchRequestConfig }
): Promise<T> {
  return fetchAPI<T>(endpoint, { method: 'GET', ...options });
}

export async function apiPost<T>(endpoint: string, body: unknown): Promise<T> {
  return fetchAPI<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
