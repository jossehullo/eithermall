'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

import HomeIcon from '@/components/icons/HomeIcon';
import ProductsIcon from '@/components/icons/ProductsIcon';
import WishlistIcon from '@/components/icons/WishlistIcon';
import CartIcon from '@/components/icons/CartIcon';
import ProfileIcon from '@/components/icons/ProfileIcon';
import LoginIcon from '@/components/icons/LoginIcon';
import AdminIcon from '@/components/icons/AdminIcon';

export default function MobileNavbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { cartItems } = useCart();

  const [newOrdersCount, setNewOrdersCount] = useState(0);

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  const linkStyle = (path: string) =>
    `flex flex-col items-center justify-center text-xs transition ${
      isActive(path) ? 'text-black font-semibold' : 'text-gray-500'
    }`;

  /* ================= SOCKET FOR ADMIN ================= */
  useEffect(() => {
    if (user?.role !== 'admin') return;

    const socket: Socket = io(API_BASE_URL.replace('/api', ''));

    socket.on('newOrder', () => {
      setNewOrdersCount(prev => prev + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (pathname.startsWith('/admin')) {
      setNewOrdersCount(0);
    }
  }, [pathname]);

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 
                    bg-white border-t shadow-md"
    >
      <div className="flex justify-around items-center py-2">
        <Link href="/" className={linkStyle('/')}>
          <HomeIcon />
          <span>Home</span>
        </Link>

        <Link href="/products" className={linkStyle('/products')}>
          <ProductsIcon />
          <span>Products</span>
        </Link>

        <Link href="/wishlist" className={linkStyle('/wishlist')}>
          <WishlistIcon />
          <span>Wishlist</span>
        </Link>

        <Link href="/cart" className={`relative ${linkStyle('/cart')}`}>
          <CartIcon />
          <span>Cart</span>

          {cartItems.length > 0 && (
            <span
              className="absolute -top-1 -right-3 
                             bg-red-500 text-white text-[10px] 
                             px-1.5 py-[2px] rounded-full"
            >
              {cartItems.length}
            </span>
          )}
        </Link>

        {user?.role === 'admin' && (
          <Link href="/admin" className={`relative ${linkStyle('/admin')}`}>
            <AdminIcon />
            <span>Admin</span>

            {newOrdersCount > 0 && (
              <span
                className="absolute -top-1 -right-3 
                               bg-red-500 text-white text-[10px] 
                               px-1.5 py-[2px] rounded-full animate-pulse"
              >
                {newOrdersCount}
              </span>
            )}
          </Link>
        )}

        {user ? (
          <Link href="/profile" className={linkStyle('/profile')}>
            <ProfileIcon />
            <span>Profile</span>
          </Link>
        ) : (
          <Link href="/login" className={linkStyle('/login')}>
            <LoginIcon />
            <span>Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
