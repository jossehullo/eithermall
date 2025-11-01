// src/app/admin/products/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });

  // Safe localStorage access
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  async function fetchProducts() {
    const res = await fetch('http://localhost:5000/api/products');
    const data = await res.json();
    setProducts(data.products || []);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return alert('Not authenticated');

    const res = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        image: 'https://via.placeholder.com/300',
      }),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ name: '', description: '', price: '', category: '', stock: '' });
      fetchProducts();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?') || !token) return;
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#001f3f]">Products</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition"
        >
          + Add Product
        </button>
      </div>

      <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-[#001f3f] text-white">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Stock</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id} className="border-b hover:bg-gray-50">
              <td className="p-3">{p.name}</td>
              <td className="p-3">{p.category}</td>
              <td className="p-3">KSh {p.price}</td>
              <td className="p-3">{p.stock}</td>
              <td className="p-3">
                <button
                  onClick={() => handleDelete(p._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.form
              onSubmit={handleSubmit}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-6 rounded-xl w-96 shadow-lg space-y-3"
            >
              <h2 className="text-xl font-bold text-[#001f3f] mb-2">Add New Product</h2>
              {['name', 'description', 'category', 'price', 'stock'].map(f => (
                <input
                  key={f}
                  placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                  value={(form as any)[f]}
                  onChange={e => setForm({ ...form, [f]: e.target.value })}
                  required
                  className="border p-2 w-full rounded-md focus:ring-2 focus:ring-orange-400"
                />
              ))}
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-3 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-orange-500 text-white"
                >
                  Save
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
