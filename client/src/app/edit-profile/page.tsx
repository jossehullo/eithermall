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

  /* LOAD PROFILE */
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
        const userData: User = data.user;

        const normalizedPhone = userData.phone ? userData.phone.replace('+254', '') : '';

        setUser({
          ...userData,
          phone: normalizedPhone,
        });

        // ✅ Cloudinary full URL
        setAvatarPreview(
          userData.avatar && userData.avatar.startsWith('http')
            ? userData.avatar
            : '/default-avatar.png'
        );
      })
      .catch(() => {
        setError('Failed to load profile.');
      })
      .finally(() => setInitialLoading(false));
  }, [router]);

  const digitsOnly = user?.phone?.replace(/\D/g, '') || '';

  const formatPhone = (digits: string) => {
    const clean = digits.slice(0, 9);
    const p1 = clean.slice(0, 3);
    const p2 = clean.slice(3, 6);
    const p3 = clean.slice(6, 9);
    return [p1, p2, p3].filter(Boolean).join(' ');
  };

  const isPhoneValid = digitsOnly.length === 9 || digitsOnly.length === 0;

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!isPhoneValid) {
      setError('Phone must be 9 digits.');
      return;
    }

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

      if (digitsOnly.length === 9) {
        formData.append('phone', `+254${digitsOnly}`);
      }

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const { data } = await axios.put(`${API_BASE}/api/auth/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updated: User = data.user;

      setUser({
        ...updated,
        phone: updated.phone ? updated.phone.replace('+254', '') : '',
      });

      setAvatarPreview(
        updated.avatar && updated.avatar.startsWith('http')
          ? updated.avatar
          : '/default-avatar.png'
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
        Loading your profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
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
        {/* Avatar */}
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
            onChange={e =>
              setUser({
                ...user,
                username: e.target.value,
              })
            }
            className="w-full border px-3 py-2 rounded"
          />

          <input
            value={user.email}
            readOnly
            className="w-full border bg-gray-100 px-3 py-2 rounded"
          />

          <div>
            <div className="flex">
              <div className="px-3 py-2 bg-gray-100 border border-r-0 rounded-l text-gray-600">
                +254
              </div>

              <input
                type="tel"
                value={formatPhone(digitsOnly)}
                onChange={e => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 9);

                  setUser({
                    ...user,
                    phone: digits,
                  });
                }}
                placeholder="701 123 456"
                className="w-full border px-3 py-2 rounded-r"
              />
            </div>

            {digitsOnly.length > 0 && digitsOnly.length < 9 && (
              <p className="text-red-600 text-sm mt-1">Phone must be 9 digits</p>
            )}
          </div>

          {success && <p className="text-green-600">{success}</p>}

          {error && <p className="text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full border py-2 rounded"
            >
              Cancel
            </button>

            <button
              disabled={loading || !isPhoneValid}
              className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </motion.form>
    </div>
  );
}
