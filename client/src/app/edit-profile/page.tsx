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
  const [originalUser, setOriginalUser] = useState<User | null>(null);

  const [avatarPreview, setAvatarPreview] = useState('/default-avatar.png');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [cropImage, setCropImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    axios
      .get(`${API_BASE}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        const userData: User = data.user || data;

        setUser(userData);
        setOriginalUser(userData);

        setAvatarPreview(
          userData.avatar
            ? `${API_BASE}/uploads/${userData.avatar}`
            : '/default-avatar.png'
        );
      })
      .catch(() => {
        setError('Failed to load profile.');
      })
      .finally(() => setInitialLoading(false));
  }, [router]);

  /* ================= PHONE FORMATTER ================= */

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 9);

    const parts = [];
    if (cleaned.length > 0) parts.push(cleaned.substring(0, 1));
    if (cleaned.length > 1) parts.push(cleaned.substring(1, 4));
    if (cleaned.length > 4) parts.push(cleaned.substring(4, 7));
    if (cleaned.length > 7) parts.push(cleaned.substring(7, 9));

    return parts.join(' ');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 9);

    if (digits.length > 0 && digits[0] !== '7') {
      setPhoneError('Phone must start with 7');
    } else if (digits.length > 0 && digits.length < 9) {
      setPhoneError('Phone must be 9 digits');
    } else {
      setPhoneError(null);
    }

    setUser({
      ...user!,
      phone: digits,
    });
  };

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

  /* ================= SAVE ================= */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    if (phoneError) return;

    if (user.phone && user.phone.length !== 9) {
      setPhoneError('Phone must be 9 digits');
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

      if (user.phone) {
        formData.append('phone', `+254${user.phone}`);
      }

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const { data } = await axios.put(`${API_BASE}/api/auth/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updated = data.user || data;

      setUser(updated);
      setOriginalUser(updated);

      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  /* ================= CANCEL ================= */
  const handleCancel = () => {
    if (!originalUser) return;

    setUser(originalUser);
    setAvatarPreview(
      originalUser.avatar
        ? `${API_BASE}/uploads/${originalUser.avatar}`
        : '/default-avatar.png'
    );
    setPhoneError(null);
    setSuccess('');
    setError('');
  };

  /* ================= LOADING ================= */
  if (initialLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        Loading profile...
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50" style={{ paddingTop: 88 }}>
      <div className="bg-white shadow px-4 py-3 flex justify-between">
        <h1 className="font-semibold">Edit Profile</h1>
        <button onClick={() => router.back()}>← Back</button>
      </div>

      <motion.form
        onSubmit={handleSave}
        className="flex flex-col items-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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

        {/* Form */}
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

          {/* PHONE INPUT */}
          <div>
            <div className="flex">
              <div className="px-3 py-2 bg-gray-100 border border-r-0 rounded-l text-gray-600">
                +254
              </div>
              <input
                type="tel"
                value={user.phone ? formatPhone(user.phone) : ''}
                onChange={handlePhoneChange}
                placeholder="7 000 000 00"
                className="w-full border px-3 py-2 rounded-r"
              />
            </div>

            {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
          </div>

          {success && <p className="text-green-600">{success}</p>}
          {error && <p className="text-red-600">{error}</p>}

          {/* BUTTONS */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full border py-2 rounded"
            >
              Cancel
            </button>

            <button
              disabled={loading || !!phoneError}
              className="w-full bg-black text-white py-2 rounded"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </motion.form>
    </div>
  );
}
