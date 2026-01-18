// client/src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import ClientRoot from '@/components/ClientRoot';
import { ToastProvider } from '@/components/ui/Toast';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Eithermall',
  description: 'Warm store theme',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              marginTop: '90px',
            },
          }}
          containerStyle={{
            zIndex: 99999,
          }}
        />

        <ToastProvider>
          <ClientRoot>{children}</ClientRoot>
        </ToastProvider>
      </body>
    </html>
  );
}
