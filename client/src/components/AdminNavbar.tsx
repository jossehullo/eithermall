'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const AdminNavbar = () => {
  const { logout } = useAuth();

  return (
    <nav className="fixed top-0 w-full bg-black text-white px-6 py-3 flex justify-between items-center z-50 shadow-lg">
      <Link href="/admin" className="font-bold text-xl">
        Admin Panel
      </Link>

      <div className="flex gap-6">
        <Link href="/admin/products">Products</Link>
        <Link href="/admin/orders">Orders</Link>
        <Link href="/admin/users">Users</Link>
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
