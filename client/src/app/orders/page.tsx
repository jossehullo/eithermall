'use client';

import BackButton from '@/components/navigation/BackButton';
import { useState } from 'react';

export default function OrdersPage() {
  const [orders] = useState([
    { id: 'ORD-123', date: '2025-10-20', total: 120, status: 'Delivered' },
    { id: 'ORD-124', date: '2025-10-21', total: 85, status: 'Processing' },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Orders</h1>
        <BackButton />
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">Order #{order.id}</h2>
                <p className="text-gray-600">{order.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${order.total}</p>
                <span
                  className={`text-sm ${order.status === 'Delivered' ? 'text-green-600' : 'text-yellow-600'}`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
