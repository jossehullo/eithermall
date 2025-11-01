'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-[#081028]/90 backdrop-blur-md px-10 py-4 flex justify-end items-center shadow-md">
      <div className="flex gap-4">
        {!user ? (
          <>
            <Link href="/login">
              <button className="nav-btn">Login</button>
            </Link>
            <Link href="/register">
              <button className="nav-btn">Register</button>
            </Link>
            <Link href="/cart">
              <button className="nav-btn">Cart</button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/products">
              <button className="nav-btn">Products</button>
            </Link>
            <Link href="/wishlist">
              <button className="nav-btn">Wishlist</button>
            </Link>
            <Link href="/orders">
              <button className="nav-btn">Orders</button>
            </Link>
            <Link href="/profile">
              <button className="nav-btn">Profile</button>
            </Link>
            <Link href="/cart">
              <button className="nav-btn">Cart</button>
            </Link>
            <button
              className="nav-btn bg-[#ffb347] text-[#081028] font-semibold"
              onClick={() => {
                logout();
                router.push('/');
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
