'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Home,
  ShoppingCart,
  Heart,
  Package,
  User,
  LogOut,
  ArrowLeft,
} from 'lucide-react';

export default function Sidebar() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="w-60 bg-white dark:bg-gray-800 shadow-xl p-6 space-y-6 h-full rounded-r-2xl transition-all">
      <h2 className="text-2xl font-bold text-blue-900 dark:text-gray-100">Eithermall</h2>

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
      >
        <ArrowLeft /> Back
      </button>

      <Link
        href="/"
        className="flex items-center gap-3 text-gray-800 dark:text-gray-200 hover:text-orange-600 transition"
      >
        <Home /> Products
      </Link>

      <Link
        href="/cart"
        className="flex items-center gap-3 text-gray-800 dark:text-gray-200 hover:text-orange-600 transition"
      >
        <ShoppingCart /> Cart
      </Link>

      <Link
        href="/wishlist"
        className="flex items-center gap-3 text-gray-800 dark:text-gray-200 hover:text-orange-600 transition"
      >
        <Heart /> Wishlist
      </Link>

      <Link
        href="/orders"
        className="flex items-center gap-3 text-gray-800 dark:text-gray-200 hover:text-orange-600 transition"
      >
        <Package /> Orders
      </Link>

      <Link
        href="/profile"
        className="flex items-center gap-3 text-gray-800 dark:text-gray-200 hover:text-orange-600 transition"
      >
        <User /> Profile
      </Link>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 text-red-600 hover:text-red-800 transition"
      >
        <LogOut /> Logout
      </button>
    </div>
  );
}
