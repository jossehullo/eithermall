'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import RightNavbar from '@/components/navigation/RightNavbar';

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNavbar = pathname !== '/';

  return (
    <AuthProvider>
      <CartProvider>
        {showNavbar && <RightNavbar />}
        <div className={showNavbar ? 'pt-32' : ''}>{children}</div>
      </CartProvider>
    </AuthProvider>
  );
}
