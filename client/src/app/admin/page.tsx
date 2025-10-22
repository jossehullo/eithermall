'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-[#001f3f]">
        Welcome to the Admin Dashboard
      </h1>
      <p className="text-gray-600">Manage your platform below.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <Link href="/admin/products" className="card">
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-orange-600">🛍️ Products</h2>
            <p className="text-gray-600 mt-2">Manage all your store products.</p>
          </div>
        </Link>

        <Link href="/admin/users" className="card">
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-orange-600">👥 Users</h2>
            <p className="text-gray-600 mt-2">View, edit, or manage users.</p>
          </div>
        </Link>

        <Link href="/admin/orders" className="card">
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-orange-600">📦 Orders</h2>
            <p className="text-gray-600 mt-2">Track and manage orders.</p>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
