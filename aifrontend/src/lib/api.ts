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

type ApiWorkspace = {
  _id?: string;
  id?: string;
  title: string;
  Interviews?: string[];
  interviews?: string[];
  createdBy: string;
  isShared?: boolean;
  shareToken?: string | null;
  createdAt: string;
  updatedAt: string;
};

type ApiInterview = {
  _id?: string;
  id?: string;
  title?: string;
  topic: string;
  status?: string;
  createdAt: string;
};

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

const normalizeWorkspace = (workspace: ApiWorkspace) => ({
  ...workspace,
  _id: workspace._id || workspace.id || '',
  Interviews: workspace.Interviews || workspace.interviews || [],
  isShared: Boolean(workspace.isShared),
  shareToken: workspace.shareToken || null,
});

const normalizeInterview = (interview: ApiInterview) => ({
  ...interview,
  _id: interview._id || interview.id || '',
  status: interview.status || 'not-started',
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

// Refresh access token using httpOnly cookie (refresh token sent automatically by browser)
async function refreshAccessToken(): Promise<string> {
  // If already refreshing, wait for that refresh to complete
  if (isRefreshing && refreshPromise) {
    console.log('⏳ Token refresh already in progress, waiting...');
    return refreshPromise;
  }

  isRefreshing = true;
  
  refreshPromise = (async () => {
    try {
      console.log('🔄 Refreshing access token...');
      
      // Call refresh endpoint - browser automatically sends httpOnly refresh cookie
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // Important: sends httpOnly cookies
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new AppError(
          errorData.message || 'Token refresh failed', 
          res.status
        );
      }

      const data = await res.json() as { accessToken: string };
      
      if (!data.accessToken) {
        throw new AppError('No access token in refresh response', 400);
      }

      // Update access token in store
      useAuthStore.getState().updateAccessToken(data.accessToken);
      
      // console.log('✅ Token refreshed successfully');
      // console.log('🔑 New token (first 20 chars):', data.accessToken.substring(0, 20) + '...');
      
      return data.accessToken;

    } catch (error) {
      // console.error('❌ Token refresh failed:', error);
      
      // Refresh token expired or invalid - logout user
      useAuthStore.getState().logout();
      // if (typeof window !== 'undefined') {
      //   window.location.href = '/register';
      // }
      
      throw error;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// Authenticated fetch with automatic token refresh on 401/403
async function authFetch<T>(url: string, init?: RequestInit, retryCount = 0): Promise<T> {
  // Verify token exists before making request
  const token = useAuthStore.getState().getAccessToken();
  if (!token) {
    console.warn('No access token found, trying refresh token flow...');

    if (retryCount === 0) {
      try {
        await refreshAccessToken();
        return authFetch<T>(url, init, retryCount + 1);
      } catch (error) {
        throw error;
      }
    }

    console.error('No access token found after refresh attempt');
    useAuthStore.getState().logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/register';
    }
    throw new AppError('Authentication required', 401);
  }

  console.log('🔑 Making authenticated request to:', url);
  console.log('🔑 Token (first 20 chars):', token.substring(0, 20) + '...');

  // Include credentials to send httpOnly cookies
  const headers = { ...getAuthHeader(), ...(init?.headers || {}) };
  const res = await fetch(url, { ...init, headers, credentials: 'include' });

  console.log('📡 Response status:', res.status);

  // If 401 or 403 and first attempt, try to refresh token
  if ((res.status === 401 || res.status === 403) && retryCount === 0) {
    console.log('⚠️ Access token expired (status ' + res.status + '), attempting refresh...');
    
    try {
      // Refresh access token (uses httpOnly cookie)
      await refreshAccessToken();
      
      // Retry original request with new token
      console.log('🔁 Retrying original request with new token...');
      return authFetch<T>(url, init, retryCount + 1);
      
    } catch (error) {
      // Refresh failed, user logged out in refreshAccessToken
      console.error('❌ Refresh failed, user logged out');
      throw error;
    }
  }

  // If 401/403 on retry, or other error, handle normally
  if (res.status === 401 || res.status === 403) {
    console.error('❌ Authentication failed even after refresh attempt');
    useAuthStore.getState().logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/register';
    }
  }

  return handle<T>(res);
}

export const api = {

  async restoreSession(): Promise<boolean> {
    try {
      await refreshAccessToken();
      return true;
    } catch {
      return false;
    }
  },

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
      
      // console.log('✅ Login successful');
      // console.log('📦 Backend response:', { 
      //   hasToken: !!data.accessToken, 
      //   tokenPreview: data.accessToken?.substring(0, 20) + '...',
      //   user: data.user 
      // });
      
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
      const authHeaders = getAuthHeader();
      await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        }
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
      const result = await authFetch<{ success?: boolean; workspace?: ApiWorkspace }>(
        `${BASE_URL}/api/workspace/create`,
        withJson({ method: 'POST', body: { title } })
      );

      if (!result.workspace) return result;
      return {
        ...result,
        workspace: normalizeWorkspace(result.workspace),
      };
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
      const result = await authFetch<{ workspaces?: ApiWorkspace[] }>(`${BASE_URL}/api/workspace`);
      return {
        ...result,
        workspaces: (result.workspaces || []).map(normalizeWorkspace),
      };
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
      const result = await authFetch<{ workspace?: ApiWorkspace }>(`${BASE_URL}/api/workspace/${id}`);
      if (!result.workspace) return result;
      return {
        ...result,
        workspace: normalizeWorkspace(result.workspace),
      };
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  async shareWorkspace(id: string) {
    try {
      return await authFetch<{ success?: boolean; isShared?: boolean; shareToken?: string; shareLink?: string }>(
        `${BASE_URL}/api/workspace/${id}/share`,
        withJson({ method: 'POST' })
      );
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  async unshareWorkspace(id: string) {
    try {
      return await authFetch<{ success?: boolean; isShared?: boolean; shareToken?: string | null }>(
        `${BASE_URL}/api/workspace/${id}/unshare`,
        withJson({ method: 'POST' })
      );
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  async getSharedWorkspace(token: string) {
    try {
      const res = await fetch(`${BASE_URL}/api/workspace/shared/${token}`, {
        method: 'GET',
        credentials: 'include',
      });
      const result = await handle<{
        workspace?: (ApiWorkspace & { interviews?: ApiInterview[]; Interviews?: ApiInterview[] });
        interviews?: ApiInterview[];
        Interviews?: ApiInterview[];
      }>(res);

      const rawInterviews =
        result.interviews ||
        result.Interviews ||
        result.workspace?.interviews ||
        result.workspace?.Interviews ||
        [];

      const normalizedInterviews = rawInterviews
        .filter((item): item is ApiInterview => typeof item === 'object' && item !== null)
        .map(normalizeInterview);

      return {
        ...result,
        workspace: result.workspace ? normalizeWorkspace(result.workspace) : undefined,
        interviews: normalizedInterviews,
      };
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Interview - with auto token refresh
  async createInterview(payload: { workspaceId: string; title?: string; description?: string; topic: string }) {
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
      const result = await authFetch<{ interviews?: ApiInterview[] }>(`${BASE_URL}/api/interview/workspace/${workspaceId}`);
      return {
        ...result,
        interviews: (result.interviews || []).map(normalizeInterview),
      };
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