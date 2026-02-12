'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import RightNavbar from '@/components/navigation/RightNavbar';

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideNav = pathname === '/' || pathname === '/login' || pathname === '/register';

  return (
    <AuthProvider>
      <CartProvider>
        {!hideNav && <RightNavbar />}

        <main className={!hideNav ? 'pt-[110px]' : ''}>{children}</main>
      </CartProvider>
    </AuthProvider>
  );
}
