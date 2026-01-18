'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '@/lib/api';

type Stats = {
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch(`${API_BASE_URL}/orders/admin/stats`, {
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
  }, [router]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 6 }}>Admin Dashboard</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Executive overview of store performance
      </p>

      {loading ? (
        <p>Loading stats…</p>
      ) : stats ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          <StatCard title="Total Orders" value={stats.totalOrders} />
          <StatCard
            title="Pending Payments"
            value={stats.pendingOrders}
            accent="#fde68a"
          />
          <StatCard title="Paid Orders" value={stats.paidOrders} accent="#bbf7d0" />
          <StatCard title="Delivered" value={stats.deliveredOrders} accent="#bfdbfe" />
          <StatCard
            title="Revenue"
            value={`KSh ${stats.totalRevenue.toLocaleString()}`}
            accent="#e9d5ff"
          />
        </div>
      ) : (
        <p>No data available</p>
      )}

      {/* Quick Actions */}
      <div style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Quick Actions</h2>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <ActionButton
            label="Manage Orders"
            onClick={() => router.push('/admin/orders')}
          />
          <ActionButton label="Products" onClick={() => router.push('/admin/products')} />
          <ActionButton label="Users" onClick={() => router.push('/admin/users')} />
        </div>
      </div>
    </div>
  );
}

/* ============================
   SMALL COMPONENTS
   ============================ */

function StatCard({
  title,
  value,
  accent = '#f3f4f6',
}: {
  title: string;
  value: number | string;
  accent?: string;
}) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 14,
        padding: 18,
        boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
        borderTop: `4px solid ${accent}`,
      }}
    >
      <div style={{ fontSize: 14, color: '#666' }}>{title}</div>
      <div style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>{value}</div>
    </div>
  );
}

function ActionButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 18px',
        borderRadius: 10,
        border: '1px solid #ddd',
        background: '#fff',
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
}
