'use client';

import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(
    (message, type = 'info', duration = 3000) => {
      const id = Date.now();
      const toast = { id, message, type, duration };

      setToasts((prev) => [...prev, toast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    []
  );

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = (message, duration) =>
    addToast(message, 'success', duration);
  const showError = (message, duration) => addToast(message, 'error', duration);
  const showInfo = (message, duration) => addToast(message, 'info', duration);
  const showWarning = (message, duration) =>
    addToast(message, 'warning', duration);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        showSuccess,
        showError,
        showInfo,
        showWarning,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  
  // Fallback if not in provider
  if (!context) {
    return {
      toasts: [],
      addToast: () => {},
      removeToast: () => {},
      showSuccess: () => {},
      showError: () => console.error,
      showInfo: () => {},
      showWarning: () => {},
    };
  }
  
  return context;
};
