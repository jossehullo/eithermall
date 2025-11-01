// src/app/profile/page.tsx
'use client';

import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <p>
        <strong>Name:</strong> {user?.name || 'Unknown'}
      </p>
      <p>
        <strong>Email:</strong> {user?.email}
      </p>
    </div>
  );
}
