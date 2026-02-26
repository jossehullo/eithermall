'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

import HomeIcon from '@/components/icons/HomeIcon';
import ProductsIcon from '@/components/icons/ProductsIcon';
import WishlistIcon from '@/components/icons/WishlistIcon';
import CartIcon from '@/components/icons/CartIcon';
import ProfileIcon from '@/components/icons/ProfileIcon';
import LoginIcon from '@/components/icons/LoginIcon';
import LogoutIcon from '@/components/icons/LogoutIcon';
import AdminIcon from '@/components/icons/AdminIcon';

export default function RightNavbar() {
  const pathname = usePathname() || '';
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [newOrdersCount, setNewOrdersCount] = useState(0);

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  const linkStyle = (path: string) =>
    `flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm transition whitespace-nowrap
     ${isActive(path) ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`;

  /* ================= SOCKET FOR ADMIN ================= */
  useEffect(() => {
    if (user?.role !== 'admin') return;

    const socket = io(API_BASE_URL.replace('/api', ''));

    socket.on('newOrder', () => {
      setNewOrdersCount(prev => prev + 1);
    });

    // ✅ Proper cleanup (returns void)
    return () => {
      socket.disconnect();
    };
  }, [user?.role]);

  useEffect(() => {
    if (pathname.startsWith('/admin')) {
      setNewOrdersCount(0);
    }
  }, [pathname]);

  return (
    <nav
      className="
        fixed top-0 left-0 right-0
        z-50
        bg-white/95 backdrop-blur-md
        shadow-sm
        px-3 md:px-6
        py-2
      "
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* LOGO */}
        <Link href="/" className="font-bold text-lg whitespace-nowrap">
          Eithermall
        </Link>

        {/* NAV LINKS */}
        <div className="flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar">
          <Link href="/" className={linkStyle('/')}>
            <HomeIcon />
            <span className="hidden sm:inline">Home</span>
          </Link>

          <Link href="/products" className={linkStyle('/products')}>
            <ProductsIcon />
            <span className="hidden sm:inline">Products</span>
          </Link>

          <Link href="/wishlist" className={linkStyle('/wishlist')}>
            <WishlistIcon />
            <span className="hidden sm:inline">Wishlist</span>
          </Link>

          <Link href="/cart" className={`relative ${linkStyle('/cart')}`}>
            <CartIcon />
            <span className="hidden sm:inline">Cart</span>

            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-[2px] rounded-full">
                {cartItems.length}
              </span>
            )}
          </Link>

          {user?.role === 'admin' && (
            <Link href="/admin" className={`relative ${linkStyle('/admin')}`}>
              <AdminIcon />
              <span className="hidden sm:inline">Admin</span>

              {newOrdersCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-[2px] rounded-full animate-pulse">
                  {newOrdersCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <>
              <Link href="/profile" className={linkStyle('/profile')}>
                <ProfileIcon />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button
                onClick={logout}
                className="flex items-center gap-1 px-3 py-2 rounded-full
                           bg-red-500 text-white hover:bg-red-600
                           text-xs md:text-sm transition whitespace-nowrap"
              >
                <LogoutIcon />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1 px-3 py-2 rounded-full
                         bg-black text-white hover:opacity-90
                         text-xs md:text-sm transition whitespace-nowrap"
            >
              <LoginIcon />
              <span className="hidden sm:inline">Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
