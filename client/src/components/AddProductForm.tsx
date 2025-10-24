'use client';

import React, { useState } from 'react';
import { apiFetch } from '../utils/api';

export default function AddProductForm({ onCreated }: { onCreated?: () => void }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const payload = { name, price, category, image, stock, description: '' };
      await apiFetch('http://localhost:5000/api/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setMsg('Product added successfully');
      setName('');
      setPrice(0);
      setCategory('');
      setImage('');
      setStock(0);
      onCreated?.();
    } catch (err: any) {
      setMsg(err?.data?.message || 'Error creating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 8, maxWidth: 520 }}>
      <input
        placeholder="Name"
        required
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        placeholder="Price"
        required
        type="number"
        value={price}
        onChange={e => setPrice(Number(e.target.value))}
      />
      <input
        placeholder="Category"
        value={category}
        onChange={e => setCategory(e.target.value)}
      />
      <input
        placeholder="Image URL"
        value={image}
        onChange={e => setImage(e.target.value)}
      />
      <input
        placeholder="Stock"
        type="number"
        value={stock}
        onChange={e => setStock(Number(e.target.value))}
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            background: '#072146',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: 6,
          }}
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </div>
      {msg && <div style={{ marginTop: 6, color: '#072146' }}>{msg}</div>}
    </form>
  );
}
