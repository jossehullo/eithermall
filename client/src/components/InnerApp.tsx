// client/src/components/InnerApp.tsx
'use client';

import React from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import PublicNavbar from '@/components/PublicNavbar';
import UserNavbar from '@/components/UserNavbar';
import { CartProvider } from '@/context/CartContext';

function InnerContent({ children }: { children: React.ReactNode }) {
  // This is client side so useAuth() is safe here
  const { user, loading } = useAuth();

  // while we are loading auth, show the public navbar to avoid flicker
  if (loading)
    return (
      <>
        <PublicNavbar />
        <main style={{ paddingTop: 72 }}>{children}</main>
      </>
    );

  // if logged in, render UserNavbar; otherwise public
  return (
    <>
      {user ? <UserNavbar /> : <PublicNavbar />}
      <main style={{ paddingTop: 72 }}>{children}</main>
    </>
  );
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
