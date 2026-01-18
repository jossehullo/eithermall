'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    fetchProduct();
  }, [productId]);

  async function fetchProduct() {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/products/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setForm({
        name: data.name,
        category: data.category,
        price: data.price,
        stock: data.stock,
        description: data.description,
      });

      setPreview(data.image ? `http://localhost:5000/${data.image}` : null);
    } catch (err) {
      console.error('Failed to load product:', err);
      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  }

  function handleInput(e: any) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleImage(e: any) {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (image) formData.append('image', image);

    try {
      await axios.put(`http://localhost:5000/api/products/${productId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Product updated!');
      router.push('/admin/products');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update product');
    }
  }

  if (loading) {
    return <div className="text-center text-yellow-400 py-10">Loading...</div>;
  }

  return (
    <div className="text-white">
      <h1 className="text-4xl font-bold mb-6 gold-accent">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Product Name"
          className="input"
          value={form.name}
          onChange={handleInput}
          required
        />
        <input
          name="category"
          placeholder="Category"
          className="input"
          value={form.category}
          onChange={handleInput}
          required
        />
        <input
          name="price"
          placeholder="Price"
          type="number"
          className="input"
          value={form.price}
          onChange={handleInput}
          required
        />
        <input
          name="stock"
          placeholder="Stock"
          type="number"
          className="input"
          value={form.stock}
          onChange={handleInput}
        />
        <textarea
          name="description"
          placeholder="Description"
          className="input"
          value={form.description}
          onChange={handleInput}
        />

        {preview && (
          <div className="mb-4">
            <p className="text-sm mb-2 text-gray-300">Current Image:</p>
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded border border-yellow-500"
            />
          </div>
        )}

        <div>
          <label className="block mb-2 text-sm">Replace Image</label>
          <input type="file" onChange={handleImage} accept="image/*" />
        </div>

        <button
          disabled={loading}
          className="px-4 py-2 rounded bg-yellow-500 text-black font-semibold"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
