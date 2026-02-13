'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [avatarPreview, setAvatarPreview] = useState(
    'https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar.png'
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const u = data.user;
        setUser(u);
        setAvatarPreview(
          u.avatarUrl ||
            'https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar.png'
        );
      } catch (err: any) {
        const msg = err.response?.data?.message?.toLowerCase() || '';
        if (msg.includes('expired') || msg.includes('token')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
          return;
        }
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-20">{error}</div>;

  return (
    <div className="min-h-screen p-6" style={{ paddingTop: 88 }}>
      <div className="max-w-md mx-auto p-6 rounded-2xl shadow-xl text-center bg-white">
        {/* ✅ FIXED AVATAR SIZE */}
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-400 shadow-md">
            <img
              src={avatarPreview}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-1">{user?.username ?? 'User'}</h2>

        <p className="text-gray-600">{user?.email}</p>
        <p className="text-gray-600">{user?.phone || 'No phone added'}</p>

        {/* MY ORDERS */}
        <button
          onClick={() => router.push('/my-orders')}
          className="mt-5 w-full py-3 rounded-lg bg-black text-white font-semibold"
        >
          📦 My Orders
        </button>

        <button
          onClick={() => router.push('/edit-profile')}
          className="mt-3 w-full py-3 border rounded-lg"
        >
          Edit Profile
        </button>

        <button
          onClick={() => router.push('/change-password')}
          className="mt-3 w-full py-3 border rounded-lg"
        >
          Change Password
        </button>

        <button
          onClick={() => router.back()}
          className="mt-6 w-full py-2 rounded-lg bg-yellow-400 text-black font-semibold"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
