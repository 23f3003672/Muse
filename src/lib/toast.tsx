"use client";

import { useState, useEffect } from 'react';

type ToastType = 'success' | 'error';
type ToastMessage = { id: number; message: string; type: ToastType };

let nextId = 0;
let toasts: ToastMessage[] = [];
let listeners: ((t: ToastMessage[]) => void)[] = [];

const notify = () => {
  listeners.forEach(l => l([...toasts]));
};

const toast = {
  success: (message: string) => {
    const id = ++nextId;
    toasts = [...toasts, { id, message, type: 'success' }];
    notify();
    setTimeout(() => {
      toasts = toasts.filter(t => t.id !== id);
      notify();
    }, 3000);
  },
  error: (message: string) => {
    const id = ++nextId;
    toasts = [...toasts, { id, message, type: 'error' }];
    notify();
    setTimeout(() => {
      toasts = toasts.filter(t => t.id !== id);
      notify();
    }, 4000);
  }
};

export function Toaster() {
  const [activeToasts, setActiveToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener = (newToasts: ToastMessage[]) => setActiveToasts(newToasts);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {activeToasts.map(t => (
        <div 
          key={t.id} 
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 min-w-[300px] max-w-md rounded-lg shadow-xl border text-sm font-medium transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in ${
            t.type === 'error' 
              ? 'bg-red-50 border-red-200 text-red-800' 
              : 'bg-surface border-border text-foreground'
          }`}
        >
          {t.type === 'success' ? (
            <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          )}
          <p>{t.message}</p>
        </div>
      ))}
    </div>
  );
}

export default toast;
