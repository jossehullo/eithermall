'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

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
      <div className="flex items-center justify-center h-screen text-yellow-400 text-xl">
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
    <div className="flex min-h-screen bg-[var(--background)] text-gray-900">
      {/* SIDEBAR */}
      <aside className="w-64 bg-black/30 backdrop-blur-lg border-r border-yellow-400/20 p-6 flex flex-col text-white">
        <h2 className="text-3xl font-extrabold mb-8 gold-accent">Admin Zone</h2>

        <nav className="flex flex-col gap-2">
          {navItems.map(item => {
            const isActive = pathname === item.href;

            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`text-left px-4 py-2 rounded-lg font-medium transition-all
                  ${
                    isActive
                      ? 'bg-yellow-500 text-black shadow-lg'
                      : 'hover:bg-yellow-500/10'
                  }
                `}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-yellow-500/20">
          <p className="text-sm opacity-60 mb-1">Logged in as</p>
          <p className="font-semibold gold-accent truncate">{user.email}</p>

          <button
            onClick={logout}
            className="w-full mt-4 px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white font-semibold"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
