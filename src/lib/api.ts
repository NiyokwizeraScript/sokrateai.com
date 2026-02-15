const API_BASE_URL = import.meta.env.VITE_API_URL || ""; // Relative path for proxy

interface ApiOptions extends RequestInit {
    token?: string;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
        // Mock User Profile (Client-side persistence)
        if (endpoint === "/api/user/profile") {
            const sessionStr = localStorage.getItem("sokrate-session");
            if (sessionStr) {
                const session = JSON.parse(sessionStr);
                return session.user as any;
            }
            return {} as T;
        }

        const { token, ...fetchOptions } = options;
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        };

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...fetchOptions,
            headers,
            credentials: "include",
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: "Network error" }));
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        return response.json();
    }

    async get<T>(endpoint: string, options?: ApiOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: "GET" });
    }

    async post<T>(endpoint: string, data?: unknown, options?: ApiOptions): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: "POST",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<T>(endpoint: string, data?: unknown, options?: ApiOptions): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: "PUT",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete<T>(endpoint: string, options?: ApiOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: "DELETE" });
    }

    async upload<T>(endpoint: string, formData: FormData, options?: ApiOptions): Promise<T> {
        const { token, ...fetchOptions } = options || {};

        const headers: HeadersInit = {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...fetchOptions,
            method: "POST",
            headers,
            body: formData,
            credentials: "include",
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: "Upload failed" }));
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        return response.json();
    }
}

export const api = new ApiClient(API_BASE_URL);
