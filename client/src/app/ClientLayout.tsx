'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import BottomNav from '@/components/navigation/BottomNav';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const initialRedirected = useRef(false);

  useEffect(() => {
    if (!initialRedirected.current && pathname === '/') {
      initialRedirected.current = true;
      router.push('/products');
    }
  }, [pathname, router]);

  return (
    <>
      {children}
      {/* Show bottom nav only on user side */}
      {!pathname?.startsWith('/admin') && <BottomNav />}
    </>
  );
}
