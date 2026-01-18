// client/src/components/navigation/PrivateNavbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function PrivateNavbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname() ?? '/';

  // small utility to highlight active link
  const isActive = (p: string) => pathname.startsWith(p);

  const btnClass = (active = false) =>
    `inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border transition
     ${active ? 'bg-yellow-400 border-yellow-500' : 'bg-white border-gray-200'}
     hover:shadow-sm`;

  return (
    <nav
      aria-label="site-navigation"
      className="fixed top-4 right-4 z-50 flex items-center gap-2"
      style={{ transform: 'translateZ(0)' }}
    >
      <Link href="/" className={btnClass(isActive('/'))} title="Home">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M3 11.5L12 4l9 7.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 11.5v7a1 1 0 001 1h3v-5h6v5h3a1 1 0 001-1v-7"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="sr-only">Home</span>
      </Link>

      <Link href="/products" className={btnClass(isActive('/products'))} title="Products">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect
            x="3"
            y="3"
            width="18"
            height="6"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <rect
            x="3"
            y="13"
            width="18"
            height="8"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        <span className="sr-only">Products</span>
      </Link>

      <Link href="/wishlist" className={btnClass(isActive('/wishlist'))} title="Wishlist">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M20.8 8.6c0 6.2-8.8 12-8.8 12S3.2 14.8 3.2 8.6A4.4 4.4 0 017.6 4.2c1.2 0 2.4.5 3.2 1.4.8-.9 2-1.4 3.2-1.4a4.4 4.4 0 014.8 4.4z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="sr-only">Wishlist</span>
      </Link>

      <Link href="/cart" className={btnClass(isActive('/cart'))} title="Cart">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M3 3h2l1 9h12l2-6H8"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="10" cy="20" r="1" fill="currentColor" />
          <circle cx="18" cy="20" r="1" fill="currentColor" />
        </svg>
        <span className="sr-only">Cart</span>
      </Link>

      <Link href="/profile" className={btnClass(isActive('/profile'))} title="Profile">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 12a4 4 0 100-8 4 4 0 000 8z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 20v-1a4 4 0 014-4h8a4 4 0 014 4v1"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="sr-only">Profile</span>
      </Link>

      {user ? (
        <button
          onClick={() => logout()}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border bg-white border-gray-200 hover:bg-red-50"
          title="Logout"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M16 17l5-5-5-5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 12H9"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13 19H6a2 2 0 01-2-2V7a2 2 0 012-2h7"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="sr-only">Logout</span>
        </button>
      ) : (
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border bg-white border-gray-200 hover:shadow-sm"
          title="Login"
        >
          Login
        </Link>
      )}
    </nav>
  );
}
