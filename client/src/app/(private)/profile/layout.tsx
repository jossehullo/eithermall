// client/src/app/(private)/profile/layout.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, User, Heart, ShoppingBag, MapPin, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const menuItems = [
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Orders', href: '/profile/orders', icon: ShoppingBag },
  { name: 'Wishlist', href: '/profile/wishlist', icon: Heart },
  { name: 'Addresses', href: '/profile/addresses', icon: MapPin },
  { name: 'Settings', href: '/profile/settings', icon: Settings },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/profile';
  const { logout } = useAuth();

  // don't show the right sidebar on the top-level /profile page
  const showSidebar = pathname !== '/profile';

  // classes: main expands if sidebar present, otherwise full width
  const mainClass = showSidebar ? 'flex-1 p-6' : 'w-full p-6';

  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      <main className={mainClass}>{children}</main>

      {/* Sidebar Right — rendered only when showSidebar === true */}
      {showSidebar && (
        <aside className="hidden lg:flex lg:flex-col w-64 bg-white shadow-xl border-l">
          <h2 className="text-xl font-semibold text-[var(--foreground)] p-6 border-b">
            My Account
          </h2>

          <nav className="flex-1 p-3 space-y-2">
            {menuItems.map(({ name, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
                    ${
                      active
                        ? 'bg-gradient-to-r from-[var(--brand-gradient-from)] to-[var(--brand-gradient-to)] text-white font-semibold'
                        : 'text-[var(--foreground)] hover:bg-gray-100'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  {name}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 font-medium border-t"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </aside>
      )}
    </div>
  );
}
