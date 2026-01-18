'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  // 🧩 Fetch profile when page loads
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const { data } = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data.user);
      } catch (error: any) {
        const msg = error.response?.data?.message;
        if (msg?.toLowerCase().includes('expired')) {
          localStorage.removeItem('token');
          router.push('/login');
        } else {
          setMessage({ type: 'error', text: msg || 'Error fetching profile' });
        }
      }
    };
    fetchProfile();
  }, [router]);

  // 🧩 Handle password change
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage({ type: 'error', text: 'You must be logged in' });
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.put(
        'http://localhost:5000/api/auth/change-password',
        { currentPassword, newPassword, confirmPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ type: 'success', text: data.message });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Error updating password. Try again.';
      setMessage({ type: 'error', text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 flex flex-col">
      {/* --- Top Bar --- */}
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">Change Password</h1>
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-600 hover:text-black transition"
        >
          ← Back
        </button>
      </div>

      {/* --- Profile Info --- */}
      <div className="text-center mt-4">
        {user ? (
          <>
            <p className="text-gray-700 font-medium">{user.name}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </>
        ) : (
          <p className="text-gray-500 text-sm">Loading profile...</p>
        )}
      </div>

      {/* --- Form --- */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center flex-grow p-6"
      >
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-800 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-800 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-800 outline-none"
              required
            />
          </div>

          {message && (
            <p
              className={`text-center text-sm ${
                message.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {message.text}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="w-full mt-2 bg-gray-900 text-white py-2 rounded-full hover:bg-gray-800 transition disabled:opacity-70"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}
