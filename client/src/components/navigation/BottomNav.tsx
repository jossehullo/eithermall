'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import HomeIcon from '../icons/HomeIcon';
import CartIcon from '../icons/CartIcon';
import WishlistIcon from '../icons/WishlistIcon';
import OrdersIcon from '../icons/OrdersIcon';
import ProfileIcon from '../icons/ProfileIcon';

const navItems = [
  { href: '/', icon: <HomeIcon />, label: 'Home' },
  { href: '/cart', icon: <CartIcon />, label: 'Cart' },
  { href: '/wishlist', icon: <WishlistIcon />, label: 'Wishlist' },
  { href: '/orders', icon: <OrdersIcon />, label: 'Orders' },
  { href: '/profile', icon: <ProfileIcon />, label: 'Profile' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-neutral-900 text-white py-2 shadow-lg z-50">
      <ul className="flex justify-around items-center">
        {navItems.map(item => {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link href={item.href}>
                <div
                  className={`flex flex-col items-center text-sm transition-all ${
                    active
                      ? 'text-indigo-400 scale-110 font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="mt-1">{item.label}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
