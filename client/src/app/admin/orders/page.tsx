'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '@/lib/api';
import { io } from 'socket.io-client';

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
  status: 'pending' | 'paid' | 'ready_for_delivery' | 'delivered' | 'cancelled';
  createdAt: string;
  customerName?: string;
  phone?: string;
  county?: string;
  subcounty?: string;
};

const ITEMS_PER_PAGE = 5;

export default function AdminOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentRefs, setPaymentRefs] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [page, setPage] = useState(1);

  /* ================= FETCH ================= */
  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch(`${API_BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error();
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchOrders()
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, [router]);

  /* ================= SOCKET ================= */
  useEffect(() => {
    const socket = io(API_BASE_URL.replace('/api', ''));

    socket.on('newOrder', (newOrder: Order) => {
      setOrders(prev => [newOrder, ...prev]);
      toast.success('🛎️ New order received!');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  /* ================= FILTER ================= */
  const processed = useMemo(() => {
    let filtered = orders.filter(order => {
      // ❌ Hide cancelled orders completely
      if (order.status === 'cancelled') return false;

      const matchesSearch =
        order.customerName?.toLowerCase().includes(search.toLowerCase()) ||
        order.phone?.includes(search);

      const matchesStatus = statusFilter ? order.status === statusFilter : true;

      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) =>
      sort === 'newest'
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return filtered;
  }, [orders, search, statusFilter, sort]);

  const totalPages = Math.ceil(processed.length / ITEMS_PER_PAGE);
  const paginated = processed.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  /* ================= UPDATE STATUS ================= */
  async function updateStatus(orderId: string, newStatus: Order['status']) {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
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

  /* ================= CANCEL ORDER ================= */
  async function cancelOrder(orderId: string) {
    if (!confirm('Cancel this order and restore stock?')) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      const updated = await res.json();
      setOrders(prev => prev.map(o => (o._id === updated._id ? updated : o)));

      toast.success('Order cancelled & stock restored');
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel order');
    }
  }

  if (loading) {
    return <div style={{ padding: 24 }}>Loading orders...</div>;
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

      {paginated.map(order => (
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
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
              🕒 {new Date(order.createdAt).toLocaleString()}
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
            <>
              <input
                type="text"
                placeholder="Payment reference"
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

              <button
                onClick={() => cancelOrder(order._id)}
                style={{
                  marginTop: 10,
                  background: '#f59e0b',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                Cancel Order
              </button>
            </>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 10,
            }}
          >
            <select
              value={order.status}
              onChange={e => updateStatus(order._id, e.target.value as Order['status'])}
              style={{ padding: 8, width: 220 }}
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="ready_for_delivery">Ready for delivery</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
