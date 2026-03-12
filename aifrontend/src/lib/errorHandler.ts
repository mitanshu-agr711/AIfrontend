// Centralized error handling utilities

export interface ErrorConfig {
  showToast?: boolean;
  toastDuration?: number;
  logToConsole?: boolean;
  customMessage?: string;
  redirectOnAuth?: boolean;
}

const DEFAULT_ERROR_MESSAGE = "Sorry, we'll be right back. Please try again in a moment.";
const AUTH_ERROR_MESSAGE = "Session expired. Please login again.";

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return DEFAULT_ERROR_MESSAGE;
}

export function isAuthError(error: unknown): boolean {
  const message = getErrorMessage(error);
  return (
    message.toLowerCase().includes('unauthorized') ||
    message.toLowerCase().includes('authentication') ||
    message.toLowerCase().includes('token') ||
    message.toLowerCase().includes('session expired') ||
    (error instanceof AppError && error.statusCode === 401)
  );
}

export function isNetworkError(error: unknown): boolean {
  const message = getErrorMessage(error);
  return (
    message.toLowerCase().includes('network') ||
    message.toLowerCase().includes('fetch') ||
    message.toLowerCase().includes('connection')
  );
}

export function handleError(error: unknown, config: ErrorConfig = {}): string {
  const {
    showToast = true,
    toastDuration = 3000,
    logToConsole = true,
    customMessage,
    redirectOnAuth = false,
  } = config;

  let errorMessage: string;

  if (customMessage) {
    errorMessage = customMessage;
  } else if (isAuthError(error)) {
    errorMessage = AUTH_ERROR_MESSAGE;
    
    // Auto logout on auth errors if needed
    if (redirectOnAuth && typeof window !== 'undefined') {
      setTimeout(() => {
        window.location.href = '/register';
      }, 1500);
    }
  } else if (isNetworkError(error)) {
    errorMessage = "Network error. Please check your connection and try again.";
  } else {
    errorMessage = getErrorMessage(error);
    
    // Fallback to default message if error message is too technical
    if (errorMessage.includes('HTTP') || errorMessage.includes('undefined')) {
      errorMessage = DEFAULT_ERROR_MESSAGE;
    }
  }

  if (logToConsole) {
    console.error('[Error Handler]:', {
      message: errorMessage,
      originalError: error,
      timestamp: new Date().toISOString(),
    });
  }

  if (showToast && typeof window !== 'undefined') {
    // Dispatch custom event for toast notification
    window.dispatchEvent(
      new CustomEvent('app-error', {
        detail: { message: errorMessage, duration: toastDuration },
      })
    );
  }

  return errorMessage;
}

// Helper to wrap async functions with error handling
export function withErrorHandling<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  config?: ErrorConfig
): T {
  return (async (...args: unknown[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, config);
      throw error;
    }
  }) as T;
}
