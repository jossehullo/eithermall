'use client';

import RightNavbar from '@/components/navigation/RightNavbar';
import BackButton from '@/components/navigation/BackButton';
import { usePathname } from 'next/navigation';

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide back button on pages where it makes no sense
  const hideBack =
    pathname.startsWith('/profile') ||
    pathname.startsWith('/admin') ||
    pathname === '/products';

  return (
    <div>
      <RightNavbar />
      {!hideBack && <BackButton />}

      <div className="pt-20 px-6">{children}</div>
    </div>
  );
}
