// client/src/components/navigation/NavActions.tsx
'use client';

import Link from 'next/link';
import React from 'react';
import { useAuth } from '@/context/AuthContext';

function Pill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        display: 'inline-block',
        padding: '8px 12px',
        marginLeft: 8,
        borderRadius: 999,
        border: '1px solid #e6e6e6',
        background: '#fff',
        textDecoration: 'none',
        color: '#111',
        fontWeight: 600,
      }}
    >
      {children}
    </Link>
  );
}

export default function NavActions() {
  const { user, logout } = useAuth();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Pill href="/wishlist">Wishlist</Pill>
      <Pill href="/orders">Orders</Pill>
      <Pill href="/cart">Cart</Pill>
      {user ? (
        <>
          <Pill href="/profile">Profile</Pill>
          {user?.role === 'admin' && <Pill href="/admin">Admin</Pill>}
          <button
            onClick={() => logout()}
            style={{
              marginLeft: 8,
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #ddd',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <Pill href="/login">Login</Pill>
      )}
    </div>
  );
}
