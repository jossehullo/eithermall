'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  const linkStyle = (path: string) =>
    `
    flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200
    ${
      isActive(path) ? 'bg-black text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
    }
  `;

  return (
    <nav
      className="hidden md:flex fixed top-4 right-6 z-50 
                    bg-white/80 backdrop-blur-lg shadow-lg 
                    px-8 py-3 rounded-full"
    >
      <div className="flex items-center gap-6">
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
              className="absolute -top-2 -right-3 
                             bg-red-500 text-white text-xs 
                             px-2 py-[2px] rounded-full"
            >
              {cartItems.length}
            </span>
          )}
        </Link>

        {user && (
          <Link href="/profile" className={linkStyle('/profile')}>
            <ProfileIcon />
            <span>Profile</span>
          </Link>
        )}

        {user?.role === 'admin' && (
          <Link href="/admin" className={linkStyle('/admin')}>
            <AdminIcon />
            <span>Admin</span>
          </Link>
        )}

        {user ? (
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-full
                       bg-red-500 text-white hover:bg-red-600
                       transition-all duration-200"
          >
            <LogoutIcon />
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-full
                       bg-black text-white hover:opacity-90
                       transition-all duration-200"
          >
            <LoginIcon />
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
