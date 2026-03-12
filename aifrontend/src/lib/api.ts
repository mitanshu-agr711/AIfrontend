
import { useAuthStore, type User } from '@/stores/authStore';
import { handleError, AppError } from './errorHandler';

const BASE_URL = process.env.NEXT_PUBLIC_API as string;

type JsonInit = Omit<RequestInit, 'body'> & { body?: unknown };

// Backend response types
interface BackendAuthResponse {
  accessToken: string;
  user: {
    id?: string;
    _id?: string;
    username?: string;
    name?: string;
    email: string;
    avatar?: string;
  };
  message?: string;
}

const withJson = (init?: JsonInit) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init?.headers || {}),
  };
  const { body, ...rest } = init || {};
  const finalInit: RequestInit = { 
    ...rest, 
    headers,
    credentials: init?.credentials || 'include' 
  };
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
    throw new AppError(String(message), res.status);
  }
  return data as T;
}


// Removed token refresh - using httpOnly cookies for session management

async function authFetch<T>(url: string, init?: RequestInit): Promise<T> {
  // Verify token exists before making request
  const token = useAuthStore.getState().getAccessToken();
  if (!token) {
    console.error('No access token found - user not authenticated');
    useAuthStore.getState().logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/register';
    }
    throw new AppError('Authentication required', 401);
  }

  // Debug: Log token being sent
  console.log('🔑 Making authenticated request to:', url);
  console.log('🔑 Token (first 20 chars):', token.substring(0, 20) + '...');

  // Include credentials to send httpOnly cookies
  const headers = { ...getAuthHeader(), ...(init?.headers || {}) };
  const res = await fetch(url, { ...init, headers, credentials: 'include' });

  // Debug: Log response status
  console.log('📡 Response status:', res.status);

  // If 401, logout user (session expired)
  if (res.status === 401) {
    console.error('❌ Authentication failed - token invalid or expired');
    console.error('Token that failed:', token.substring(0, 20) + '...');
    useAuthStore.getState().logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/register';
    }
  }

  return handle<T>(res);
}

export const api = {

  async getAvatars(): Promise<{ success?: boolean; data: Array<{ avatar: string }> }> {
    try {
      const res = await fetch(`${BASE_URL}/image/images`);
      return handle(res);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Auth
  async register(payload: { username: string; name: string; email: string; password: string; avatar: string }): Promise<{ token: string; user: User }> {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, withJson({ method: 'POST', body: payload }));
      const data = await handle<BackendAuthResponse>(res);
      return {
        token: data.accessToken,
        user: {
          _id: data.user.id || data.user._id || '',
          username: data.user.username || data.user.email?.split('@')[0] || '',
          name: data.user.name || data.user.username || '',
          email: data.user.email,
          avatar: data.user.avatar || ''
        }
      };
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  async login(payload: { username: string; password: string }): Promise<{ token: string; user: User }> {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, withJson({ method: 'POST', body: payload }));
      const data = await handle<BackendAuthResponse>(res);
      
      console.log('✅ Login successful');
      console.log('📦 Backend response:', { 
        hasToken: !!data.accessToken, 
        tokenPreview: data.accessToken?.substring(0, 20) + '...',
        user: data.user 
      });
      
      return {
        token: data.accessToken,
        user: {
          _id: data.user.id || data.user._id || '',
          username: data.user.username || data.user.email?.split('@')[0] || '',
          name: data.user.name || data.user.username || '',
          email: data.user.email,
          avatar: data.user.avatar || ''
        }
      };
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Auth logout - clears httpOnly cookies on backend
  async logout() {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      useAuthStore.getState().logout();
    } catch (error) {
      // Logout locally even if backend call fails
      console.error('Logout error:', error);
      useAuthStore.getState().logout();
    }
  },

  // Workspace - with auto token refresh
  async createWorkspace(title: string) {
    try {
      return await authFetch(`${BASE_URL}/api/workspace/create`, withJson({ method: 'POST', body: { title } }));
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  async renameWorkspace(id: string, title: string) {
    try {
      return await authFetch(`${BASE_URL}/api/workspace/${id}/rename`, withJson({ method: 'PUT', body: { title } }));
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  async deleteWorkspace(id: string) {
    try {
      return await authFetch(`${BASE_URL}/api/workspace/${id}/delete`, { method: 'DELETE', headers: getAuthHeader() });
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  async getWorkspaces() {
    try {
      return await authFetch(`${BASE_URL}/api/workspace`);
    } catch (error) {
      // If 404, it means no workspaces exist yet - return empty array (don't show error toast)
      if (error instanceof AppError && error.statusCode === 404) {
        console.log('No workspaces found, starting fresh!');
        return { workspaces: [] };
      }
      handleError(error);
      throw error;
    }
  },
  async getWorkspaceById(id: string) {
    try {
      return await authFetch(`${BASE_URL}/api/workspace/${id}`);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Interview - with auto token refresh
  async createInterview(payload: { workspaceId: string; title?: string; description?: string; topic: string; difficulty: string; numberOfQuestions: number }) {
    try {
      return await authFetch(`${BASE_URL}/api/interview/create`, withJson({ method: 'POST', body: payload }));
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  async startInterview(interviewId: string) {
    try {
      return await authFetch(`${BASE_URL}/api/interview/${interviewId}/start`, withJson({ method: 'POST' }));
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  async submitAnswer(payload: { interviewId: string; questionId: string; userAnswer: string; timeTaken?: number }) {
    try {
      return await authFetch(`${BASE_URL}/api/interview/submit-answer`, withJson({ method: 'POST', body: payload }));
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  async completeInterview(interviewId: string) {
    try {
      return await authFetch(`${BASE_URL}/api/interview/${interviewId}/complete`, withJson({ method: 'POST' }));
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  async getInterviewDetails(interviewId: string) {
    try {
      return await authFetch(`${BASE_URL}/api/interview/${interviewId}`);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  async getWorkspaceInterviews(workspaceId: string) {
    try {
      return await authFetch(`${BASE_URL}/api/interview/workspace/${workspaceId}`);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  async getUserAnalytics() {
    try {
      return await authFetch(`${BASE_URL}/api/interview/analytics/user`);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
};

export type ApiClient = typeof api;