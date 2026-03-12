'use client';

import { useEffect, useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface ToastMessage {
  id: number;
  message: string;
  duration: number;
}

export function ErrorToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>();

  useEffect(() => {
    const handleError = (event: CustomEvent) => {
      const { message, duration = 3000 } = event.detail;
      const id = Date.now();
      
      setToasts((prev) => [...(prev || []), { id, message, duration }]);

      // Auto-remove toast after duration
      setTimeout(() => {
        setToasts((prev) => (prev || []).filter((toast) => toast.id !== id));
      }, duration);
    };

    window.addEventListener('app-error', handleError as EventListener);
    return () => {
      window.removeEventListener('app-error', handleError as EventListener);
    };
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => (prev || []).filter((toast) => toast.id !== id));
  };

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[9999] space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-start gap-3 max-w-md animate-slide-in"
        >
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <p className="text-sm flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-white/80 hover:text-white transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

// Add to globals.css:
// @keyframes slide-in {
//   from {
//     transform: translateX(100%);
//     opacity: 0;
//   }
//   to {
//     transform: translateX(0);
//     opacity: 1;
//   }
// }
// .animate-slide-in {
//   animation: slide-in 0.3s ease-out;
// }
