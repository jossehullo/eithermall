'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      // Save token and user (you can just save token)
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setLoading(false);
      router.push('/profile'); // redirect to profile page
    } catch (err) {
      setError('Network error');
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: 'Arial' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
        <label>
          Email
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            required
            style={{ width: '100%', padding: 8, margin: '8px 0' }}
          />
        </label>

        <label>
          Password
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            required
            style={{ width: '100%', padding: 8, margin: '8px 0' }}
          />
        </label>

        <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <p style={{ marginTop: 16 }}>
        Test credentials (example): <br />
        <code>testuser@example.com / mypassword123</code>
      </p>
    </main>
  );
}
