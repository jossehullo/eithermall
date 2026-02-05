'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface AdminUser {
  _id: string;
  username?: string;
  name?: string;
  email: string;
  role: string;
  phone?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (token) fetchUsers();
    else setLoading(false);
  }, []);

  async function fetchUsers() {
    try {
      const { data } = await axios.get(`${API_BASE}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this user?')) return;
    await axios.delete(`${API_BASE}/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(prev => prev.filter(u => u._id !== id));
  }

  async function handlePromote(id: string) {
    const { data } = await axios.patch(
      `${API_BASE}/api/users/${id}/make-admin`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setUsers(prev => prev.map(u => (u._id === id ? { ...u, role: data.user.role } : u)));
  }

  if (loading) return <p>Loading users…</p>;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Users</h1>
      {/* table unchanged */}
    </div>
  );
}
