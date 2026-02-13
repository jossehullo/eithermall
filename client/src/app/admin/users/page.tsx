'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
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
      .get(`${API_BASE}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setUsers(res.data))
      .finally(() => setLoading(false));
  }, []);

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

  async function demote(id: string) {
    try {
      const res = await axios.patch(
        `${API_BASE}/api/users/${id}/remove-admin`,
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
      await axios.delete(`${API_BASE}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(prev => prev.filter(u => u._id !== id));
    } catch {
      alert('Failed to delete user');
    }
  }

  // 🔍 Filter
  const filtered = useMemo(() => {
    return users.filter(
      u =>
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  // 📄 Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  function changePage(newPage: number) {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  }

  if (loading) {
    return <div style={{ padding: 40 }}>Loading users…</div>;
  }

  return (
    <div style={{ maxWidth: 1100, margin: '20px auto', padding: 20 }}>
      {/* HEADER */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => router.push('/admin')}
          style={{
            marginBottom: 12,
            padding: '8px 14px',
            borderRadius: 6,
            border: '1px solid #ccc',
            background: '#f5f5f5',
            cursor: 'pointer',
          }}
        >
          ← Back to Admin
        </button>

        <h1 style={{ fontSize: 30, fontWeight: 700 }}>Users</h1>

        <span
          style={{
            background: '#111827',
            color: '#fff',
            padding: '4px 10px',
            borderRadius: 20,
            fontSize: 13,
            display: 'inline-block',
            marginTop: 5,
          }}
        >
          {filtered.length} Users
        </span>
      </div>

      {/* SEARCH */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Search users..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{
            padding: 8,
            width: 300,
          }}
        />
      </div>

      {/* TABLE */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map(u => (
              <tr key={u._id}>
                <td>{u.email}</td>

                <td>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 12,
                      fontSize: 13,
                      background: u.role === 'admin' ? '#22c55e' : '#e5e7eb',
                      color: u.role === 'admin' ? '#fff' : '#111827',
                    }}
                  >
                    {u.role}
                  </span>
                </td>

                <td style={{ display: 'flex', gap: 8 }}>
                  {u._id !== decoded?.id && (
                    <>
                      {u.role === 'user' && (
                        <button
                          onClick={() => promote(u._id)}
                          style={{
                            background: '#0ea5a4',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 10px',
                            borderRadius: 6,
                            cursor: 'pointer',
                          }}
                        >
                          Make Admin
                        </button>
                      )}

                      {u.role === 'admin' && (
                        <button
                          onClick={() => demote(u._id)}
                          style={{
                            background: '#f59e0b',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 10px',
                            borderRadius: 6,
                            cursor: 'pointer',
                          }}
                        >
                          Remove Admin
                        </button>
                      )}

                      <button
                        onClick={() => remove(u._id)}
                        style={{
                          background: '#ffdddd',
                          border: '1px solid #d88',
                          color: '#d00',
                          cursor: 'pointer',
                          padding: '6px 10px',
                          borderRadius: 6,
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div
          style={{
            marginTop: 25,
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <button onClick={() => changePage(page - 1)} disabled={page === 1}>
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => changePage(i + 1)}
              style={{
                fontWeight: page === i + 1 ? 'bold' : 'normal',
              }}
            >
              {i + 1}
            </button>
          ))}

          <button onClick={() => changePage(page + 1)} disabled={page === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
