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
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('You must be logged in as admin');
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/api/admin/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async res => {
        if (res.status === 401 || res.status === 403) {
          throw new Error('Unauthorized');
        }
        if (!res.ok) {
          throw new Error('Failed request');
        }
        return res.json();
      })
      .then(data => {
        setStats(data);
      })
      .catch(err => {
        console.error('Admin stats error:', err);
        toast.error('Failed to load dashboard stats');
        setStats(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="text-white">
      {/* HEADER */}
      <h1 className="text-4xl font-extrabold mb-2 gold-accent">Admin Dashboard</h1>
      <p className="text-white/60 mb-8 text-lg">
        Executive overview of platform activity
      </p>

      {/* STATS */}
      {loading ? (
        <p className="text-yellow-400 text-lg">Loading dashboard stats…</p>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          <StatCard
            title="Total Products"
            value={stats.products}
            accent="border-yellow-400"
          />
          <StatCard title="Total Orders" value={stats.orders} accent="border-blue-400" />
          <StatCard title="Total Users" value={stats.users} accent="border-green-400" />
        </div>
      ) : (
        <p className="text-white/60">No data available</p>
      )}

      {/* WELCOME */}
      <div className="mt-12 p-6 bg-white/5 backdrop-blur-xl rounded-xl border border-yellow-500/10 shadow">
        <h3 className="text-2xl font-bold mb-2 gold-accent">Welcome, Admin 👋</h3>
        <p className="text-white/70 text-lg">
          Manage products, orders, and users using the admin sidebar.
        </p>
      </div>
    </div>
  );
}

/* =========================
   STAT CARD
========================= */
function StatCard({
  title,
  value,
  accent,
}: {
  title: string;
  value: number;
  accent: string;
}) {
  return (
    <div
      className={`p-6 bg-white/10 backdrop-blur-xl rounded-xl shadow-lg border ${accent}/30`}
    >
      <h2 className="text-lg font-medium text-white/70 mb-2">{title}</h2>
      <p className="text-4xl font-extrabold gold-accent">{value}</p>
    </div>
  );
}
