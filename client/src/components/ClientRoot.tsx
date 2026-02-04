'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import RightNavbar from '@/components/navigation/RightNavbar';
import MobileNavbar from '@/components/navigation/MobileNavbar';

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideNav = pathname === '/' || pathname === '/login' || pathname === '/register';

  return (
    <AuthProvider>
      <CartProvider>
        {!hideNav && <RightNavbar />}
        {!hideNav && <MobileNavbar />}
        {children}
      </CartProvider>
    </AuthProvider>
  );
}
