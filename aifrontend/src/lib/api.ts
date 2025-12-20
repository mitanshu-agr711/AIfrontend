// Centralized API client using NEXT_PUBLIC_API base URL
// Provides typed helpers for backend routes with automatic token management
import { useAuthStore } from '@/stores/authStore';

const BASE_URL = process.env.NEXT_PUBLIC_API as string;

type JsonInit = Omit<RequestInit, 'body'> & { body?: unknown };

const withJson = (init?: JsonInit) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init?.headers || {}),
  };
  const { body, ...rest } = init || {};
  const finalInit: RequestInit = { ...rest, headers };
  if (body !== undefined) finalInit.body = JSON.stringify(body as unknown as string);
  return finalInit;
};

// Get current access token from store
const getAuthHeader = (): HeadersInit => {
  if (typeof window === 'undefined') return {};
  const token = useAuthStore.getState().getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function handle<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `HTTP ${res.status}`;
    throw new Error(String(message));
  }
  return data as T;
}

// Token refresh logic
async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = useAuthStore.getState().getRefreshToken();
    if (!refreshToken) return null;

    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      useAuthStore.getState().logout();
      return null;
    }

    const data = await res.json();
    if (data.accessToken) {
      useAuthStore.getState().updateAccessToken(data.accessToken);
      return data.accessToken;
    }

    return null;
  } catch (err) {
    console.error('Token refresh failed:', err);
    useAuthStore.getState().logout();
    return null;
  }
}

// Enhanced fetch with auto token refresh
async function authFetch<T>(url: string, init?: RequestInit): Promise<T> {
  // First attempt with current access token
  let headers = { ...getAuthHeader(), ...(init?.headers || {}) };
  let res = await fetch(url, { ...init, headers });

  // If unauthorized, try to refresh token and retry
  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers = { Authorization: `Bearer ${newToken}`, ...(init?.headers || {}) };
      res = await fetch(url, { ...init, headers });
    }
  }

  return handle<T>(res);
}

export const api = {
  // Images
  async getAvatars(): Promise<{ success?: boolean; data: Array<{ avatar: string }> }> {
    const res = await fetch(`${BASE_URL}/image/images`);
    return handle(res);
  },

  // Auth
  async register(payload: { username: string; name: string; email: string; password: string; avatar: string }): Promise<{ token: string; refreshToken: string; user: any }> {
    const res = await fetch(`${BASE_URL}/auth/register`, withJson({ method: 'POST', body: payload }));
    return handle(res);
  },
  async login(payload: { username: string; password: string }): Promise<{ token: string; refreshToken: string; user: any }> {
    const res = await fetch(`${BASE_URL}/auth/login`, withJson({ method: 'POST', body: payload }));
    return handle(res);
  },

  // Workspace - with auto token refresh
  async createWorkspace(title: string) {
    return authFetch(`${BASE_URL}/api/workspace/create`, withJson({ method: 'POST', body: { title } }));
  },
  async renameWorkspace(id: string, title: string) {
    return authFetch(`${BASE_URL}/api/workspace/${id}/rename`, withJson({ method: 'PUT', body: { title } }));
  },
  async deleteWorkspace(id: string) {
    return authFetch(`${BASE_URL}/api/workspace/${id}/delete`, { method: 'DELETE', headers: getAuthHeader() });
  },
  async getWorkspaces() {
    return authFetch(`${BASE_URL}/api/workspace/`);
  },
  async getWorkspaceById(id: string) {
    return authFetch(`${BASE_URL}/api/workspace/${id}`);
  },

  // Interview - with auto token refresh
  async createInterview(payload: { workspaceId: string; title?: string; description?: string; topic: string; difficulty: string; numberOfQuestions: number }) {
    return authFetch(`${BASE_URL}/api/interview/create`, withJson({ method: 'POST', body: payload }));
  },
  async startInterview(interviewId: string) {
    return authFetch(`${BASE_URL}/api/interview/${interviewId}/start`, withJson({ method: 'POST' }));
  },
  async submitAnswer(payload: { interviewId: string; questionId: string; userAnswer: string; timeTaken?: number }) {
    return authFetch(`${BASE_URL}/api/interview/submit-answer`, withJson({ method: 'POST', body: payload }));
  },
  async completeInterview(interviewId: string) {
    return authFetch(`${BASE_URL}/api/interview/${interviewId}/complete`, withJson({ method: 'POST' }));
  },
  async getInterviewDetails(interviewId: string) {
    return authFetch(`${BASE_URL}/api/interview/${interviewId}`);
  },
  async getWorkspaceInterviews(workspaceId: string) {
    return authFetch(`${BASE_URL}/api/interview/workspace/${workspaceId}`);
  },
  async getUserAnalytics() {
    return authFetch(`${BASE_URL}/api/interview/analytics/user`);
  },
};

export type ApiClient = typeof api;
