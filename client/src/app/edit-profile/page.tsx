// client/src/app/edit-profile/page.tsx
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

  // Load current profile
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    axios
      .get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        const userData: User = data.user || data;
        setUser(userData);
        setAvatarPreview(
          userData.avatar
            ? `http://localhost:5000/${userData.avatar}`
            : '/default-avatar.png'
        );
      })
      .catch(err => {
        console.error('Error loading profile:', err);
        setError('Failed to load profile.');
      })
      .finally(() => setInitialLoading(false));
  }, [router]);

  // When picking a file, open the cropper overlay
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

  // Save profile
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

      const { data } = await axios.put(
        'http://localhost:5000/api/auth/profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const updated: User = data.user || data;
      setUser(updated);
      setAvatarPreview(
        updated.avatar ? `http://localhost:5000/${updated.avatar}` : '/default-avatar.png'
      );
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      console.error('Update error:', err);
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
    <div
      className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 flex flex-col"
      // push content down so it’s not under the fixed navbar
      style={{ paddingTop: 88 }}
    >
      {/* Top bar */}
      <div className="bg-white shadow-md px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">Edit Profile</h1>
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-600 hover:text-black transition"
        >
          ← Back
        </button>
      </div>

      {/* Form */}
      <motion.form
        onSubmit={handleSave}
        className="flex flex-col items-center justify-center flex-grow p-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Avatar picker */}
        <label className="relative cursor-pointer">
          <div className="w-28 h-28 rounded-full overflow-hidden border border-gray-300 shadow-md flex items-center justify-center bg-white">
            <motion.img
              src={avatarPreview}
              alt="Profile"
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
            />
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <p className="text-sm text-gray-500 mt-2 text-center">Tap to change avatar</p>
        </label>

        {/* CROP OVERLAY (uses your new AvatarCropper) */}
        {showCropper && cropImage && (
          <AvatarCropper
            key={cropImage} // force fresh instance per image
            image={cropImage}
            onCancel={() => {
              setShowCropper(false);
              setCropImage(null);
            }}
            onCropped={(croppedFile, previewUrl) => {
              setAvatarFile(croppedFile);
              setAvatarPreview(previewUrl);
              setShowCropper(false);
            }}
          />
        )}

        {/* Fields */}
        <div className="mt-6 bg-white p-6 rounded-2xl shadow-lg w-full max-w-md space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={user.username}
              onChange={e => setUser({ ...user, username: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-800 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={user.phone || ''}
              onChange={e => setUser({ ...user, phone: e.target.value })}
              placeholder="+2547..., no leading 0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-800 outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              Use international format, e.g. <strong>+2547…</strong> (no leading 0).
            </p>
          </div>

          {success && <p className="text-green-600 text-center">{success}</p>}
          {error && <p className="text-red-600 text-center">{error}</p>}

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="w-full mt-2 bg-gray-900 text-white py-2 rounded-full hover:bg-gray-800 transition disabled:opacity-70"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </motion.button>

          <div className="text-center mt-3">
            <button
              type="button"
              onClick={() => router.push('/change-password')}
              className="text-sm text-gray-600 hover:text-black transition"
            >
              Change Password
            </button>
          </div>
        </div>
      </motion.form>
    </div>
  );
}
