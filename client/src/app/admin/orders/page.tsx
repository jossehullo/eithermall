'use client';

import { useEffect, useMemo, useState } from 'react';
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
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch(`${API_BASE_URL}/orders`, {
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

  /* ================= FILTER + SORT ================= */
  const processed = useMemo(() => {
    let filtered = orders.filter(order => {
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

  /* ================= STATUS UPDATE ================= */
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

  /* ================= DELETE ================= */
  async function deleteOrder(orderId: string) {
    if (!confirm('Delete this order?')) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();

      setOrders(prev => prev.filter(o => o._id !== orderId));
      toast.success('Order deleted');
    } catch {
      toast.error('Failed to delete order');
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

      {/* SEARCH / FILTER BAR */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <input
          placeholder="Search name or phone..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{ padding: 8, width: 220 }}
        />

        <select
          value={statusFilter}
          onChange={e => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          style={{ padding: 8 }}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="ready_for_delivery">Ready for delivery</option>
          <option value="delivered">Delivered</option>
        </select>

        <select
          value={sort}
          onChange={e => setSort(e.target.value as any)}
          style={{ padding: 8 }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* ORDER CARDS */}
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

          <div
            style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}
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

            <button
              onClick={() => deleteOrder(order._id)}
              style={{
                background: '#ffdddd',
                border: '1px solid #d88',
                color: '#d00',
                cursor: 'pointer',
                padding: '6px 12px',
                borderRadius: 6,
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 8 }}>
          <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              style={{
                fontWeight: page === i + 1 ? 'bold' : 'normal',
              }}
            >
              {i + 1}
            </button>
          ))}

          <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
