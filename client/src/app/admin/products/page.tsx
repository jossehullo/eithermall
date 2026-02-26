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

  const categories = useMemo(
    () => Array.from(new Set(products.map(p => p.category))).filter(Boolean),
    [products]
  );

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category ? p.category === category : true;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

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
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-6">
        <div>
          <button
            onClick={() => router.push('/admin')}
            className="mb-3 px-4 py-2 rounded border bg-gray-100 hover:bg-gray-200"
          >
            ← Back to Admin
          </button>

          <h1 className="text-3xl font-bold">Products</h1>

          <span className="inline-block mt-2 bg-gray-900 text-white px-3 py-1 rounded-full text-sm">
            {filtered.length} Products
          </span>
        </div>

        <button
          onClick={() => router.push('/admin/products/new')}
          className="px-5 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700"
        >
          + Add New Product
        </button>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          placeholder="Search products…"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border rounded-md w-full md:w-64"
        />

        <select
          value={category}
          onChange={e => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border rounded-md w-full md:w-48"
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
          className="px-3 py-2 border rounded-md w-full md:w-48"
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="stock">Sort by Stock</option>
        </select>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b bg-gray-100 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map(p => (
              <tr key={p._id} className="border-b">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">KSh {p.price}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => router.push(`/admin/products/${p._id}`)}
                      className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(p._id)}
                      className="px-3 py-1 bg-red-100 border border-red-300 text-red-700 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2 flex-wrap">
          <button
            onClick={() => changePage(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          {Array.from({
            length: totalPages,
          }).map((_, i) => (
            <button
              key={i}
              onClick={() => changePage(i + 1)}
              className={`px-3 py-1 border rounded ${
                page === i + 1 ? 'bg-gray-900 text-white' : ''
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => changePage(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
