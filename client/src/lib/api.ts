const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, data: any, message?: string) {
    super(message || "An API error occurred");
    this.status = status;
    this.data = data;
  }
}

async function request(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = null;
    }
    throw new ApiError(response.status, errorData, errorData?.detail || response.statusText);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  get: (endpoint: string, options?: RequestInit) => request(endpoint, { ...options, method: "GET" }),
  post: (endpoint: string, body?: any, options?: RequestInit) => 
    request(endpoint, { ...options, method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: (endpoint: string, body?: any, options?: RequestInit) => 
    request(endpoint, { ...options, method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  delete: (endpoint: string, options?: RequestInit) => request(endpoint, { ...options, method: "DELETE" }),
  patch: (endpoint: string, body?: any, options?: RequestInit) => 
    request(endpoint, { ...options, method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  getReviews: (slug: string, page: number = 1, size: number = 20, source?: string) => {
    let url = `/reviews/${slug}?page=${page}&size=${size}`;
    if (source && source !== "all") url += `&source=${source}`;
    return request(url, { method: "GET" });
  }
};
