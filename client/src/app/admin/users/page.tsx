'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface AdminUser {
  _id: string;
  name?: string;
  email: string;
  role: 'admin' | 'user';
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) return setLoading(false);

    axios
      .get(`${API_BASE}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setUsers(res.data))
      .finally(() => setLoading(false));
  }, []);

  const me = users.find(u => u.email === 'admin@example.com'); // OR decode JWT later

  async function promote(id: string) {
    try {
      const res = await axios.patch(
        `${API_BASE}/api/users/${id}/make-admin`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(prev => prev.map(u => (u._id === id ? res.data.user : u)));
    } catch {
      alert('Failed to promote user');
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this user?')) return;

    await axios.delete(`${API_BASE}/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUsers(prev => prev.filter(u => u._id !== id));
  }

  const filtered = useMemo(
    () =>
      users.filter(
        u =>
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          u.name?.toLowerCase().includes(search.toLowerCase())
      ),
    [users, search]
  );

  if (loading) return <p>Loading users…</p>;

  return (
    <div>
      <h1>Users</h1>

      <input
        placeholder="Search users..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map(u => (
            <tr key={u._id}>
              <td>{u.email}</td>
              <td>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: 12,
                    background: u.role === 'admin' ? '#22c55e' : '#e5e7eb',
                  }}
                >
                  {u.role}
                </span>
              </td>
              <td>
                {u.role === 'user' && (
                  <button onClick={() => promote(u._id)}>Make Admin</button>
                )}
                {me?._id !== u._id && (
                  <button onClick={() => remove(u._id)}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
