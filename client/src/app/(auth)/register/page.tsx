'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || 'Registration failed');
      } else {
        // success -> redirect to login for sign-in
        router.push('/login');
      }
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)]">
      <div className="w-full max-w-md">
        <div className="bg-[var(--brand-foreground,white)] rounded-2xl shadow-xl overflow-hidden">
          <div className="flex">
            <Link
              href="/login"
              className="flex-1 text-center py-4 bg-white text-[var(--foreground)] hover:bg-gray-50 transition font-semibold"
            >
              Login
            </Link>
            <div className="flex-1 text-center py-4 bg-gradient-to-r from-[var(--brand-gradient-from)] to-[var(--brand-gradient-to)] text-white font-semibold">
              Create account
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2 text-[var(--foreground)]">
              Create your account
            </h2>
            <p className="text-sm text-[var(--muted,#6b7280)] mb-6">
              Join Eithermall — internal store for our team
            </p>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative">
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder=" "
                  className="peer block w-full rounded-lg border border-gray-200 px-3 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
                />
                <label className="absolute left-3 -top-2 text-xs bg-[var(--brand-foreground,white)] px-1 text-[var(--muted,#6b7280)] transition-all">
                  Full name
                </label>
              </div>

              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder=" "
                  className="peer block w-full rounded-lg border border-gray-200 px-3 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
                />
                <label className="absolute left-3 -top-2 text-xs bg-[var(--brand-foreground,white)] px-1 text-[var(--muted,#6b7280)] transition-all">
                  Email
                </label>
              </div>

              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder=" "
                  className="peer block w-full rounded-lg border border-gray-200 px-3 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
                />
                <label className="absolute left-3 -top-2 text-xs bg-[var(--brand-foreground,white)] px-1 text-[var(--muted,#6b7280)] transition-all">
                  Password
                </label>
              </div>

              <div className="relative">
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  placeholder=" "
                  className="peer block w-full rounded-lg border border-gray-200 px-3 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
                />
                <label className="absolute left-3 -top-2 text-xs bg-[var(--brand-foreground,white)] px-1 text-[var(--muted,#6b7280)] transition-all">
                  Confirm password
                </label>
              </div>

              {error && <p className="text-red-600 text-sm text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full brand-btn py-3 rounded-lg text-white font-semibold shadow"
              >
                {loading ? 'Creating…' : 'Create account'}
              </button>

              <div className="text-center text-sm text-[var(--muted,#6b7280)]">
                Already have an account?{' '}
                <Link href="/login" className="text-[var(--brand-accent)] font-semibold">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-[var(--muted,#6b7280)]">
          Eithermall — Premium internal e-commerce
        </p>
      </div>
    </div>
  );
}
