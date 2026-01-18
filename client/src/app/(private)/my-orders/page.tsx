'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '@/lib/api';

type OrderItem = {
  productId?: string;
  name: string;
  unitName?: string;
  piecesPerUnit?: number;
  qty: number;
  unitPrice: number;
};

type Order = {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'equity' | 'kcb';
  status: 'pending' | 'paid' | 'ready_for_delivery' | 'delivered';
  createdAt: string;
};

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to view your orders');
      router.push('/login');
      return;
    }

    fetch(`${API_BASE_URL}/orders/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => setOrders(data))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return <p style={{ padding: 24 }}>Loading orders...</p>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      {/* 🔙 BACK BUTTON */}
      <button
        onClick={() => router.back()}
        style={{
          marginBottom: 16,
          padding: '8px 16px',
          borderRadius: 8,
          border: '1px solid #ccc',
          background: '#f8f8f8',
          cursor: 'pointer',
        }}
      >
        ← Back
      </button>

      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 20 }}>My Orders</h1>

      {orders.length === 0 ? (
        <p>You have not placed any orders yet.</p>
      ) : (
        orders.map(order => (
          <div
            key={order._id}
            style={{
              background: '#fff',
              padding: 16,
              borderRadius: 12,
              marginBottom: 16,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
          >
            {/* HEADER */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}
            >
              <div>
                <strong>{new Date(order.createdAt).toLocaleDateString()}</strong>
                <div style={{ fontSize: 14, color: '#666' }}>
                  Payment: {order.paymentMethod.toUpperCase()}
                </div>
              </div>

              <span
                style={{
                  padding: '6px 12px',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 700,
                  textTransform: 'capitalize',
                  background:
                    order.status === 'pending'
                      ? '#fff3cd'
                      : order.status === 'paid'
                        ? '#d1e7dd'
                        : order.status === 'ready_for_delivery'
                          ? '#cff4fc'
                          : '#e2e3e5',
                  color: '#000',
                }}
              >
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>

            {/* ITEMS */}
            <div style={{ fontSize: 14 }}>
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 4,
                  }}
                >
                  <span>
                    {item.name} — {item.unitName ?? 'pcs'} × {item.qty}
                  </span>
                  <span>KSh {(item.unitPrice * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div
              style={{
                marginTop: 10,
                fontWeight: 700,
                textAlign: 'right',
                fontSize: 16,
              }}
            >
              Total: KSh {order.totalAmount.toLocaleString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
