'use client';

import React from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

function InnerContent({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  // While auth state is loading, just render the page content
  if (loading) {
    return <main>{children}</main>;
  }

  return <main>{children}</main>;
}

export default function InnerApp({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <InnerContent>{children}</InnerContent>
      </CartProvider>
    </AuthProvider>
  );
}
