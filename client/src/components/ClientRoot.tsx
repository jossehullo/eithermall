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

        {/* 🔽 RESERVED SPACE FOR NAVBARS */}
        <main className="pt-[88px] pb-[72px]">{children}</main>
      </CartProvider>
    </AuthProvider>
  );
}
