'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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
      const { data } = await axios.get(`${API_BASE}/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setForm({
        name: data.name,
        category: data.category,
        price: String(data.price),
        stock: String(data.stock),
        description: data.description || '',
      });

      setPreview(data.image ? `${API_BASE}/${data.image}` : null);
    } catch (err) {
      console.error('Failed to load product:', err);
      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (image) formData.append('image', image);

    try {
      await axios.put(`${API_BASE}/api/products/${productId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
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
    return <div className="py-10 text-center">Loading…</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input name="name" value={form.name} onChange={handleInput} required />
        <input name="category" value={form.category} onChange={handleInput} required />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleInput}
          required
        />
        <input name="stock" type="number" value={form.stock} onChange={handleInput} />
        <textarea name="description" value={form.description} onChange={handleInput} />

        {preview && <img src={preview} className="w-32 h-32 object-cover" />}

        <input type="file" accept="image/*" onChange={handleImage} />

        <button type="submit">Save</button>
      </form>
    </div>
  );
}
