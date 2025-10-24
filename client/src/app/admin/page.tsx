'use client';
import AdminRoute from '@/components/AdminRoute';

export default function AdminDashboard() {
  return (
    <AdminRoute>
      <div style={{ padding: '20px' }}>
        <h1>Admin Dashboard ✅</h1>
        <p>Only admins can view this page.</p>
      </div>
    </AdminRoute>
  );
}
