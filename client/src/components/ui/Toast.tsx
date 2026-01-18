'use client';
import React, { createContext, useContext, useState } from 'react';

type ToastContextType = {
  showToast: (msg: string) => void;
};

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  function showToast(msg: string) {
    setMessage(msg);
    setVisible(true);
    setTimeout(() => setVisible(false), 2500);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast UI */}
      <div
        style={{
          position: 'fixed',
          right: 20,
          bottom: 20,
          padding: '14px 22px',
          background: '#111',
          color: '#fff',
          borderRadius: 10,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all .3s ease',
          zIndex: 99999,
          boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
        }}
      >
        {message}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
