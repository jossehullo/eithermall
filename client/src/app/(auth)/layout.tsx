'use client';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center page-bg p-6">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
