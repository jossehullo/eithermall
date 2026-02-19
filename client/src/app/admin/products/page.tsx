'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

const ITEMS_PER_PAGE = 8;

export default function AdminProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name');
  const [page, setPage] = useState(1);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmDelete = confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(prev => prev.filter(p => p._id !== id));
      alert('Product deleted');
    } catch (err) {
      console.error(err);
      alert('Failed to delete product');
    }
  }

  // Unique categories
  const categories = useMemo(
    () => Array.from(new Set(products.map(p => p.category))).filter(Boolean),
    [products]
  );

  // Filter
  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category ? p.category === category : true;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  // Sort
  const sorted = useMemo(() => {
    const list = [...filtered];

    switch (sortBy) {
      case 'price':
        return list.sort((a, b) => a.price - b.price);
      case 'stock':
        return list.sort((a, b) => a.stock - b.stock);
      default:
        return list.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [filtered, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);

  const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  function changePage(newPage: number) {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  }

  if (loading) {
    return <div className="py-10 text-center">Loading products…</div>;
  }

  return (
    <div style={{ maxWidth: 1100, margin: '20px auto', padding: 20 }}>
      {/* ================= HEADER ================= */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <div>
          {/* ✅ Correct Back Button */}
          <button
            onClick={() => router.push('/admin')}
            style={{
              marginBottom: 12,
              padding: '8px 14px',
              borderRadius: 6,
              border: '1px solid #ccc',
              background: '#f5f5f5',
              cursor: 'pointer',
            }}
          >
            ← Back to Admin
          </button>

          <h1 style={{ fontSize: 30, fontWeight: 700 }}>Products</h1>

          {/* Product count badge */}
          <span
            style={{
              background: '#111827',
              color: '#fff',
              padding: '4px 10px',
              borderRadius: 20,
              fontSize: 13,
              marginTop: 5,
              display: 'inline-block',
            }}
          >
            {filtered.length} Products
          </span>
        </div>

        <button
          onClick={() => router.push('/admin/products/new')}
          style={{
            padding: '10px 18px',
            background: '#0ea5a4',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          + Add New Product
        </button>
      </div>

      {/* ================= FILTERS ================= */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 20,
          flexWrap: 'wrap',
        }}
      >
        <input
          placeholder="Search products…"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{ padding: 8 }}
        />

        <select
          value={category}
          onChange={e => {
            setCategory(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={e => {
            setSortBy(e.target.value as any);
            setPage(1);
          }}
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="stock">Sort by Stock</option>
        </select>
      </div>

      {/* ================= TABLE ================= */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map(p => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>KSh {p.price}</td>
                <td>{p.stock}</td>
                <td style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => router.push(`/admin/products/${p._id}`)}>
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p._id)}
                    style={{
                      background: '#ffdddd',
                      border: '1px solid #d88',
                      color: '#d00',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div
          style={{
            marginTop: 25,
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <button onClick={() => changePage(page - 1)} disabled={page === 1}>
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => changePage(i + 1)}
              style={{
                fontWeight: page === i + 1 ? 'bold' : 'normal',
              }}
            >
              {i + 1}
            </button>
          ))}

          <button onClick={() => changePage(page + 1)} disabled={page === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
