// src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata = {
  title: 'Eithermall',
  description: 'Premium e-commerce store',
  icons: { icon: '/icons/logo-icon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
