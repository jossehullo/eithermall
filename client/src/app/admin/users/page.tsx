'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface AdminUser {
  _id: string;
  username?: string;
  name?: string;
  email: string;
  role: string;
  phone?: string;
  createdAt?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get<AdminUser[]>('http://localhost:5000/api/users', {
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
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      console.error('Delete user failed:', err);
      alert('Failed to delete user');
    }
  }

  async function handlePromote(id: string) {
    try {
      const { data } = await axios.patch(
        `http://localhost:5000/api/users/${id}/make-admin`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(prev =>
        prev.map(u => (u._id === id ? { ...u, role: data.user.role } : u))
      );
    } catch (err) {
      console.error('Promote failed:', err);
      alert('Failed to promote user');
    }
  }

  if (loading) {
    return (
      <div className="text-center text-yellow-400 text-lg py-10">Loading users…</div>
    );
  }

  return (
    <div className="text-white">
      <h1 className="text-4xl font-bold gold-accent mb-6">Users</h1>

      <div className="overflow-x-auto bg-black/20 p-4 rounded-xl border border-yellow-500/20">
        <table className="w-full text-left">
          <thead>
            <tr className="text-yellow-400 border-b border-yellow-500/30">
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Email</th>
              <th className="py-2 px-3">Role</th>
              <th className="py-2 px-3">Phone</th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(user => (
                <tr key={user._id} className="border-b border-gray-700">
                  <td className="py-2 px-3">{user.username || user.name || '—'}</td>
                  <td className="py-2 px-3">{user.email}</td>
                  <td className="py-2 px-3 capitalize">{user.role}</td>
                  <td className="py-2 px-3">{user.phone || '—'}</td>
                  <td className="py-2 px-3 flex gap-2">
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handlePromote(user._id)}
                        className="px-3 py-1 bg-yellow-500 text-black text-sm rounded hover:bg-yellow-400"
                      >
                        Make Admin
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="px-3 py-1 bg-red-600 text-sm rounded hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-400 font-medium">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
