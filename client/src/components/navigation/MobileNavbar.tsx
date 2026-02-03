'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Home, ShoppingBag, Heart, ShoppingCart, User, Shield } from 'lucide-react';

export default function MobileNavbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { cartItems } = useCart();

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  const itemBase = 'flex flex-col items-center gap-1 text-[11px] font-medium transition';

  const active = 'text-purple-600';
  const idle = 'text-gray-500';

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-[9999]
        flex justify-around items-center
        bg-white/95 backdrop-blur
        border-t border-gray-200
        py-2
        md:hidden
      "
    >
      <Link href="/" className={`${itemBase} ${isActive('/') ? active : idle}`}>
        <Home size={20} />
        Home
      </Link>

      <Link
        href="/products"
        className={`${itemBase} ${isActive('/products') ? active : idle}`}
      >
        <ShoppingBag size={20} />
        Shop
      </Link>

      <Link
        href="/wishlist"
        className={`${itemBase} ${isActive('/wishlist') ? active : idle}`}
      >
        <Heart size={20} />
        Wish
      </Link>

      <Link
        href="/cart"
        className={`${itemBase} ${isActive('/cart') ? active : idle} relative`}
      >
        <ShoppingCart size={20} />
        Cart
        {cartItems.length > 0 && (
          <span className="absolute -top-1 -right-2 min-w-[16px] rounded-full bg-red-500 px-1 text-[10px] text-white">
            {cartItems.length}
          </span>
        )}
      </Link>

      {user && (
        <Link
          href="/profile"
          className={`${itemBase} ${isActive('/profile') ? active : idle}`}
        >
          <User size={20} />
          Me
        </Link>
      )}

      {/* ✅ ADMIN (mobile) */}
      {user?.role === 'admin' && (
        <Link
          href="/admin"
          className={`${itemBase} ${isActive('/admin') ? active : idle}`}
        >
          <Shield size={20} />
          Admin
        </Link>
      )}
    </nav>
  );
}
