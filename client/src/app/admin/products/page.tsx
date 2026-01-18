'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

const ITEMS_PER_PAGE = 10;

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔍 Search & filter state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
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
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm('Are you sure? This cannot be undone.')) return;

    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(prev => prev.filter(p => p._id !== id));
    } catch {
      alert('Failed to delete product');
    }
  }

  /* ============================
     DERIVED DATA
     ============================ */

  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category))).filter(Boolean);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = category ? p.category === category : true;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  /* ============================
     UI
     ============================ */

  if (loading) {
    return (
      <div className="text-center text-yellow-400 text-lg py-10">Loading products…</div>
    );
  }

  return (
    <div className="text-white">
      {/* HEADER */}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold gold-accent">Products</h1>

        <button
          onClick={() => router.push('/admin/products/new')}
          className="px-5 py-2 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-400"
        >
          + Add Product
        </button>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 rounded-lg bg-black/30 border border-white/20 focus:outline-none focus:border-yellow-400"
        />

        <select
          value={category}
          onChange={e => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 rounded-lg bg-black/30 border border-white/20"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-black/20 p-4 rounded-xl border border-yellow-500/20">
        <table className="w-full text-left">
          <thead>
            <tr className="text-yellow-400 border-b border-yellow-500/30">
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Category</th>
              <th className="py-2 px-3">Price</th>
              <th className="py-2 px-3">Stock</th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map(product => (
                <tr
                  key={product._id}
                  className="border-b border-gray-700 hover:bg-white/5"
                >
                  <td className="py-2 px-3">{product.name}</td>
                  <td className="py-2 px-3">{product.category}</td>
                  <td className="py-2 px-3">KSh {product.price.toLocaleString()}</td>
                  <td className="py-2 px-3">{product.stock}</td>

                  <td className="py-2 px-3 flex gap-2">
                    <button
                      onClick={() => router.push(`/admin/products/${product._id}`)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-6 text-center text-white/50" colSpan={5}>
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded-lg border ${
                page === i + 1
                  ? 'bg-yellow-500 text-black font-bold'
                  : 'border-white/30 hover:bg-white/10'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
