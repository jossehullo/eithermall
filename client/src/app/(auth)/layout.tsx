export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)] p-4">
      <div className="w-full max-w-md animate-fadeIn">{children}</div>
    </div>
  );
}
