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
  paymentReference?: string;
  status: 'pending' | 'paid' | 'ready_for_delivery' | 'delivered';
  createdAt: string;
  customerName?: string;
  phone?: string;
  county?: string;
  subcounty?: string;
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentRefs, setPaymentRefs] = useState<Record<string, string>>({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch(`${API_BASE_URL}/api/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => setOrders(data))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, [router]);

  async function updateStatus(orderId: string, newStatus: Order['status']) {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          paymentReference: paymentRefs[orderId],
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      const updated = await res.json();
      setOrders(prev => prev.map(o => (o._id === updated._id ? updated : o)));

      toast.success('Order status updated');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    }
  }

  if (loading) {
    return <p style={{ padding: 24 }}>Loading orders...</p>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
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

      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 20 }}>Admin Orders</h1>

      {orders.map(order => (
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
          <div style={{ marginBottom: 8 }}>
            <strong>{order.customerName}</strong>
            <div style={{ fontSize: 13, color: '#555' }}>{order.phone}</div>
            <div style={{ fontSize: 13 }}>
              {order.county}, {order.subcounty}
            </div>
          </div>

          {order.items.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 14,
              }}
            >
              <span>
                {item.name} — {item.unitName ?? 'pcs'} × {item.qty}
              </span>
              <span>KSh {(item.unitPrice * item.qty).toLocaleString()}</span>
            </div>
          ))}

          <div
            style={{
              marginTop: 10,
              fontWeight: 700,
              textAlign: 'right',
            }}
          >
            Total: KSh {order.totalAmount.toLocaleString()}
          </div>

          {order.status === 'pending' && (
            <input
              type="text"
              placeholder="Payment reference (Paybill / Bank)"
              value={paymentRefs[order._id] || ''}
              onChange={e =>
                setPaymentRefs(prev => ({
                  ...prev,
                  [order._id]: e.target.value,
                }))
              }
              style={{
                width: '100%',
                padding: 8,
                marginTop: 10,
              }}
            />
          )}

          <select
            value={order.status}
            onChange={e => updateStatus(order._id, e.target.value as Order['status'])}
            style={{
              marginTop: 10,
              padding: 8,
              width: 220,
            }}
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="ready_for_delivery">Ready for delivery</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      ))}
    </div>
  );
}
