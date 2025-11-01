// client/src/components/products/ProductModal.tsx
'use client';

import React from 'react';
import { X } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};

export default function ProductModal({ open, onClose, children }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full md:max-w-2xl bg-[var(--card-bg)] rounded-t-xl md:rounded-xl shadow-2xl overflow-hidden animate-slideIn p-6 z-10">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[var(--brand-muted)] hover:text-[var(--foreground)]"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}
