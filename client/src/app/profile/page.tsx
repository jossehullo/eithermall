'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  createdAt?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    async function fetchProfile() {
      try {
        const res = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          // token invalid / expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'Failed to fetch profile');
          setLoading(false);
          return;
        }

        setUser(data.user);
        setLoading(false);
      } catch (err) {
        setError('Network error');
        setLoading(false);
      }
    }

    fetchProfile();
  }, [router]);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  }

  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;
  if (error) return <p style={{ color: 'red', padding: 24 }}>{error}</p>;

  return (
    <main style={{ padding: 24, fontFamily: 'Arial' }}>
      <h1>Your Profile</h1>
      {user ? (
        <div
          style={{
            border: '1px solid #ddd',
            padding: 16,
            borderRadius: 8,
            maxWidth: 520,
          }}
        >
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          {user.createdAt && (
            <p>
              <strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}
            </p>
          )}
          <button onClick={handleLogout} style={{ marginTop: 12, padding: '8px 12px' }}>
            Logout
          </button>
        </div>
      ) : (
        <p>No user data</p>
      )}
    </main>
  );
}
