'use client';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-8 text-blue-800">Eithermall</h2>
        <nav className="flex-1 space-y-3">
          <button
            onClick={() => router.push('/')}
            className="block text-left w-full hover:text-orange-600"
          >
            🏠 Products
          </button>
          <button
            onClick={() => router.push('/profile')}
            className="block text-left w-full hover:text-orange-600"
          >
            👤 Profile
          </button>
          <button className="block text-left w-full hover:text-orange-600">
            ❤️ Wishlist
          </button>
          <button className="block text-left w-full hover:text-orange-600">
            🛒 Cart
          </button>
          <button className="block text-left w-full hover:text-orange-600">
            📦 Orders
          </button>
        </nav>
        <div className="space-y-2 mt-auto">
          <button
            onClick={() => router.back()}
            className="bg-gray-300 text-gray-800 w-full py-2 rounded-lg hover:bg-gray-400"
          >
            ← Back
          </button>
          <button
            onClick={logout}
            className="bg-red-500 text-white w-full py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">Welcome, {user.name}</h1>
        <p className="text-gray-600 mb-4">Email: {user.email}</p>
        <p className="text-gray-600">Role: {user.role}</p>
      </main>
    </div>
  );
}
