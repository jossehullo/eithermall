// client/src/app/layout.tsx
import '../globals.css'; // Adjusted path from app/ to src/
import { AuthProvider } from '../context/AuthContext'; // relative path from app/ to context/

export const metadata = {
  title: 'Eithermall',
  description: 'E-commerce platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
