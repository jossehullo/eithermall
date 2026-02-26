'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

const ITEMS_PER_PAGE = 8;

interface AdminUser {
  _id: string;
  name?: string;
  email: string;
  role: 'admin' | 'user';
}

interface TokenPayload {
  id: string;
  email: string;
}

export default function AdminUsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const decoded: TokenPayload | null = token ? jwtDecode(token) : null;

  useEffect(() => {
    if (!token) return setLoading(false);

    axios
      .get(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setUsers(res.data))
      .finally(() => setLoading(false));
  }, []);

  async function promote(id: string) {
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/users/${id}/make-admin`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(prev => prev.map(u => (u._id === id ? res.data.user : u)));
    } catch {
      alert('Failed to promote user');
    }
  }

  async function demote(id: string) {
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/users/${id}/remove-admin`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(prev => prev.map(u => (u._id === id ? res.data.user : u)));
    } catch {
      alert('Failed to demote user');
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this user?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(prev => prev.filter(u => u._id !== id));
    } catch {
      alert('Failed to delete user');
    }
  }

  const filtered = useMemo(() => {
    return users.filter(
      u =>
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  function changePage(newPage: number) {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  }

  if (loading) {
    return <div className="py-10 text-center">Loading users…</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
      {/* ================= HEADER ================= */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/admin')}
          className="mb-3 px-4 py-2 rounded border bg-gray-100 hover:bg-gray-200"
        >
          ← Back to Admin
        </button>

        <h1 className="text-3xl font-bold">Users</h1>

        <span className="inline-block mt-2 bg-gray-900 text-white px-3 py-1 rounded-full text-sm">
          {filtered.length} Users
        </span>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="mb-6">
        <input
          placeholder="Search users..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border rounded-md w-full md:w-72"
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b bg-gray-100 text-left">
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map(u => (
              <tr key={u._id} className="border-b">
                <td className="p-3 break-all">{u.email}</td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      u.role === 'admin'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>

                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {u._id !== decoded?.id && (
                      <>
                        {u.role === 'user' && (
                          <button
                            onClick={() => promote(u._id)}
                            className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700"
                          >
                            Make Admin
                          </button>
                        )}

                        {u.role === 'admin' && (
                          <button
                            onClick={() => demote(u._id)}
                            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                          >
                            Remove Admin
                          </button>
                        )}

                        <button
                          onClick={() => remove(u._id)}
                          className="px-3 py-1 bg-red-100 border border-red-300 text-red-700 rounded hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2 flex-wrap">
          <button
            onClick={() => changePage(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => changePage(i + 1)}
              className={`px-3 py-1 border rounded ${
                page === i + 1 ? 'bg-gray-900 text-white' : ''
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => changePage(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
