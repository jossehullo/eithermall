'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '@/lib/api';

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
      setLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/admin/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => setStats(data))
      .catch(() => toast.error('Failed to load dashboard stats'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 mb-8 text-lg">
        Executive overview of platform activity
      </p>

      {loading ? (
        <p className="text-yellow-600">Loading dashboard stats…</p>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          <StatCard title="Total Products" value={stats.products} />
          <StatCard title="Total Orders" value={stats.orders} />
          <StatCard title="Total Users" value={stats.users} />
        </div>
      ) : (
        <p className="text-gray-500">No data available</p>
      )}
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow border">
      <h2 className="text-lg font-medium text-gray-500 mb-2">{title}</h2>
      <p className="text-4xl font-extrabold">{value}</p>
    </div>
  );
}
