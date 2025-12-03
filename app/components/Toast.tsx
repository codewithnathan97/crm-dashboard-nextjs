'use client';

import { useEffect } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';

export interface ToastProps {
  message: string;
  type: 'success' | 'error';
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, type === 'success' ? duration : duration + 2000);

    return () => clearTimeout(timer);
  }, [duration, type, onClose]);

  const bgColor = type === 'success' ? 'bg-green-50 dark:bg-green-900' : 'bg-red-50 dark:bg-red-900';
  const textColor = type === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200';
  const iconColor = type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

  return (
    <div
      className={`${bgColor} ${textColor} rounded-lg shadow-lg p-4 flex items-start gap-3 min-w-[300px] max-w-md animate-in slide-in-from-right duration-300`}
      role="alert"
    >
      {type === 'success' ? (
        <CheckCircle className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
      ) : (
        <XCircle className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
      )}
      <div className="flex-1 text-sm font-medium">{message}</div>
      <button
        onClick={onClose}
        className={`${textColor} hover:opacity-70 transition-opacity flex-shrink-0`}
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}