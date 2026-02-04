'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import AvatarCropper from '@/components/AvatarCropper';

type User = {
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function EditProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('/default-avatar.png');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [cropImage, setCropImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    axios
      .get(`${API_BASE}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        const userData: User = data.user || data;
        setUser(userData);

        setAvatarPreview(
          userData.avatar ? `${API_BASE}/${userData.avatar}` : '/default-avatar.png'
        );
      })
      .catch(() => {
        setError('Failed to load profile.');
      })
      .finally(() => setInitialLoading(false));
  }, [router]);

  /* ================= FILE PICK ================= */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCropImage(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(selected);
  };

  /* ================= SAVE PROFILE ================= */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setSuccess('');
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', user.username);
      formData.append('phone', user.phone || '');
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const { data } = await axios.put(`${API_BASE}/api/auth/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updated: User = data.user || data;
      setUser(updated);

      setAvatarPreview(
        updated.avatar ? `${API_BASE}/${updated.avatar}` : '/default-avatar.png'
      );

      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-600 font-medium">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ paddingTop: 88 }}>
      <div className="bg-white shadow px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Edit Profile</h1>
        <button onClick={() => router.back()}>← Back</button>
      </div>

      <motion.form
        onSubmit={handleSave}
        className="flex flex-col items-center p-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <label className="cursor-pointer">
          <div className="w-28 h-28 rounded-full overflow-hidden border shadow">
            <img src={avatarPreview} className="w-full h-full object-cover" />
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <p className="text-sm text-gray-500 text-center mt-2">Tap to change avatar</p>
        </label>

        {showCropper && cropImage && (
          <AvatarCropper
            image={cropImage}
            onCancel={() => setShowCropper(false)}
            onCropped={(file, preview) => {
              setAvatarFile(file);
              setAvatarPreview(preview);
              setShowCropper(false);
            }}
          />
        )}

        <div className="bg-white p-6 rounded-xl shadow w-full max-w-md mt-6 space-y-4">
          <input
            value={user.username}
            onChange={e => setUser({ ...user, username: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            value={user.email}
            readOnly
            className="w-full border bg-gray-100 px-3 py-2 rounded"
          />

          <input
            value={user.phone || ''}
            onChange={e => setUser({ ...user, phone: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />

          {success && <p className="text-green-600">{success}</p>}
          {error && <p className="text-red-600">{error}</p>}

          <button disabled={loading} className="w-full bg-black text-white py-2 rounded">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
