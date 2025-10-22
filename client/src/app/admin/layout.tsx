'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Restrict access to admin only
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || user.role !== 'admin') {
      router.push('/login');
    }
  }, [router]);

  const links = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/products', label: 'Products' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/orders', label: 'Orders' },
    { href: '/admin/settings', label: 'Settings' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-[#001f3f] text-white flex flex-col">
        <div className="px-4 py-6 text-2xl font-bold border-b border-gray-700">
          Eithermall Admin
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 rounded-md transition-all duration-200 ${
                pathname === link.href
                  ? 'bg-orange-500 text-white'
                  : 'hover:bg-orange-400 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/login');
          }}
          className="m-4 bg-orange-600 hover:bg-orange-500 text-white rounded-md py-2 transition"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
