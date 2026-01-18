'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

type Props = { children: React.ReactNode };

/**
 * Wraps client-only providers.
 * Kept intentionally small so app/layout.tsx can remain a server component.
 */
export default function Providers({ children }: Props) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}
