'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Stats {
  products: number;
  orders: number;
  users: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Always run client-side only
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');

    if (!token) {
      console.warn('[ADMIN] No auth token found');
      toast.error('Please log in again');
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/api/admin/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async res => {
        if (res.status === 401 || res.status === 403) {
          throw new Error('Unauthorized');
        }

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Failed request');
        }

        return res.json();
      })
      .then(data => {
        setStats(data);
      })
      .catch(err => {
        console.error('[ADMIN DASHBOARD ERROR]', err);
        toast.error('Failed to load dashboard stats');
        setStats(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* HEADER */}
      <h1 className="text-4xl font-extrabold mb-2">Admin Dashboard</h1>

      <p className="text-gray-500 mb-8 text-lg">
        Executive overview of platform activity
      </p>

      {/* STATS */}
      {loading ? (
        <p className="text-yellow-600 text-lg">Loading dashboard stats…</p>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          <StatCard title="Total Products" value={stats.products} />
          <StatCard title="Total Orders" value={stats.orders} />
          <StatCard title="Total Users" value={stats.users} />
        </div>
      ) : (
        <p className="text-gray-500">No data available</p>
      )}

      {/* WELCOME */}
      <div className="mt-12 p-6 bg-gray-50 rounded-xl border shadow-sm">
        <h3 className="text-2xl font-bold mb-2">Welcome, Admin 👋</h3>
        <p className="text-gray-600 text-lg">
          Manage products, orders, and users using the admin panel.
        </p>
      </div>
    </div>
  );
}

/* =========================
   STAT CARD
========================= */
function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow border">
      <h2 className="text-lg font-medium text-gray-500 mb-2">{title}</h2>
      <p className="text-4xl font-extrabold">{value}</p>
    </div>
  );
}
