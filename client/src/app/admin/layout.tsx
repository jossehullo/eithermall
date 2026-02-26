'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  /* =============================
     AUTH & ROLE GUARD
  ============================= */
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (user.role !== 'admin') {
      router.replace('/not-authorized');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-yellow-500 text-xl">
        Checking Admin Access…
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  const navItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Products', href: '/admin/products' },
    { label: 'Orders', href: '/admin/orders' },
    { label: 'Users', href: '/admin/users' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* ================= SIDEBAR ================= */}
      <aside
        className="
        w-full md:w-64
        bg-white
        border-b md:border-b-0 md:border-r
        p-4 md:p-6
        shadow-sm
      "
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Zone</h2>

        <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          {navItems.map(item => {
            const isActive = pathname === item.href;

            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition
                  ${
                    isActive
                      ? 'bg-yellow-400 text-black'
                      : 'hover:bg-gray-100 text-gray-700'
                  }
                `}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* FOOTER (Desktop only) */}
        <div className="hidden md:block mt-auto pt-6 border-t">
          <p className="text-sm text-gray-500 mb-1">Logged in as</p>
          <p className="font-semibold truncate">{user.email}</p>

          <button
            onClick={logout}
            className="w-full mt-4 px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-semibold"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
