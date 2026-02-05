'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();

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
  }, [id]);

  async function fetchProduct() {
    try {
      const { data } = await axios.get(`${API_BASE}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setForm({
        name: data.name,
        category: data.category,
        price: data.price,
        stock: data.stock,
        description: data.description,
      });

      setPreview(data.image ? `${API_BASE}/${data.image}` : null);
    } catch {
      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    if (image) formData.append('image', image);

    await axios.put(`${API_BASE}/api/products/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    router.push('/admin/products');
  }

  if (loading) return <p>Loading…</p>;

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <button>Save</button>
    </form>
  );
}
