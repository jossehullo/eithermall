// src/app/(auth)/layout.tsx

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 page-bg text-[var(--foreground)]">
      <div className="w-full max-w-md animate-fadeIn">{children}</div>
    </div>
  );
}
