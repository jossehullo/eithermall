'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const UserNavbar = () => {
  const { logout } = useAuth();

  return (
    <nav className="fixed top-0 w-full bg-black text-white px-6 py-3 flex justify-between items-center z-50 shadow-lg">
      <Link href="/" className="font-bold text-xl">
        EitherMall
      </Link>

      <div className="flex gap-6">
        <Link href="/products">Products</Link>
        <Link href="/wishlist">Wishlist</Link>
        <Link href="/orders">Orders</Link>
        <Link href="/profile">Profile</Link>
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
};

export default UserNavbar;
