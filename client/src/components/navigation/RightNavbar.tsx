// src/components/navigation/RightNavbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
  Home,
  ShoppingBag,
  Heart,
  ShoppingCart,
  User,
  LogIn,
  LogOut,
  Shield,
} from 'lucide-react';

export default function RightNavbar() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const totalItems = cartItems.length;

  const pathname = usePathname();

  const isActive = (path: string) => pathname.startsWith(path);

  const baseBtn =
    'flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-gray-300 bg-white hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium';

  return (
    <nav
      style={{
        position: 'fixed',
        top: 20,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '14px 20px',
        borderRadius: '9999px',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Link
        href="/"
        className={`${baseBtn} ${isActive('/') ? '!bg-black !text-white !border-black' : ''}`}
      >
        <Home size={17} />
        Home
      </Link>

      <Link
        href="/products"
        className={`${baseBtn} ${isActive('/products') ? '!bg-black !text-white !border-black' : ''}`}
      >
        <ShoppingBag size={17} />
        Products
      </Link>

      <Link
        href="/wishlist"
        className={`${baseBtn} ${isActive('/wishlist') ? '!bg-black !text-white !border-black' : ''}`}
      >
        <Heart size={17} />
        Wishlist
      </Link>

      <Link
        href="/cart"
        className={`relative ${baseBtn} ${isActive('/cart') ? '!bg-black !text-white !border-black' : ''}`}
      >
        <ShoppingCart size={17} />
        Cart
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold animate-pulse shadow-lg">
            {totalItems}
          </span>
        )}
      </Link>

      <Link
        href="/profile"
        className={`${baseBtn} ${isActive('/profile') ? '!bg-black !text-white !border-black' : ''}`}
      >
        <User size={17} />
        Profile
      </Link>

      {/* Admin */}
      {user?.role === 'admin' && (
        <Link
          href="/admin"
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 shadow-md transition"
        >
          <Shield size={17} />
          Admin
        </Link>
      )}

      {/* Login / Logout */}
      {user ? (
        <button
          onClick={logout}
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 shadow-md transition"
        >
          <LogOut size={17} />
          Logout
        </button>
      ) : (
        <Link
          href="/login"
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:shadow-xl transition shadow-md"
        >
          <LogIn size={17} />
          Login
        </Link>
      )}
    </nav>
  );
}
