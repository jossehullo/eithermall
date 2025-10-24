'use client';
import BackButton from '@/components/BackButton';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'admin') {
      router.push('/profile');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="flex justify-between items-center bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200"
        >
          Logout
        </button>
      </nav>

      <main className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-2">Manage Products</h2>
          <p className="text-gray-600">Add, edit, or remove products in store.</p>
          <button
            onClick={() => router.push('/admin/products')}
            className="mt-3 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-2">Manage Users</h2>
          <p className="text-gray-600">View or update registered users.</p>
          <button
            onClick={() => router.push('/admin/users')}
            className="mt-3 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-2">Orders</h2>
          <p className="text-gray-600">Track and manage customer orders.</p>
          <button
            onClick={() => router.push('/admin/orders')}
            className="mt-3 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go
          </button>
        </div>
      </main>
    </div>
  );
}
