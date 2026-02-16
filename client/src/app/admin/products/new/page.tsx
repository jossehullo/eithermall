'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type PackagingRow = {
  name: string;
  piecesPerUnit: number | '';
  price?: number | '';
  customName?: string;
  defaultForSale?: boolean;
};

const UOM_PRESETS = [
  'Pcs',
  'Pkt',
  'Dozen',
  'Gross',
  'Carton',
  'Bale',
  'Outer',
  'Kg(s)',
  'Pc(s)',
  'Other',
];

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '').replace(/\/api$/, '') ||
  'http://localhost:5000';

export default function AdminNewProductPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [packagingOptions, setPackagingOptions] = useState<PackagingRow[]>([
    { name: 'Pkt', piecesPerUnit: '', price: '', defaultForSale: true },
    { name: 'Carton', piecesPerUnit: '', price: '' },
  ]);

  const [loading, setLoading] = useState(false);

  function addRow() {
    setPackagingOptions(prev => [...prev, { name: 'Pcs', piecesPerUnit: '', price: '' }]);
  }

  function removeRow(i: number) {
    setPackagingOptions(prev => prev.filter((_, idx) => idx !== i));
  }

  function updateRow(i: number, patch: Partial<PackagingRow>) {
    setPackagingOptions(prev => {
      const copy = [...prev];
      copy[i] = { ...copy[i], ...patch };
      return copy;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !category.trim()) {
      return alert('Please fill name and category');
    }

    const cleaned = packagingOptions.map(p => ({
      name: p.name === 'Other' ? (p.customName || '').trim() : p.name,
      piecesPerUnit: Number(p.piecesPerUnit) || 1,
      price: Number(p.price) || 0,
      defaultForSale: !!p.defaultForSale,
      sellable: true,
    }));

    const fd = new FormData();
    fd.append('name', name);
    fd.append('category', category);
    fd.append('price', String(price || 0));
    fd.append('stock', String(stock || 0));
    fd.append('description', description);
    fd.append('packagingOptions', JSON.stringify(cleaned));

    if (imageFile) fd.append('image', imageFile);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    setLoading(true);

    try {
      await axios.post(`${API_BASE}/api/products`, fd, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Product created');
      router.push('/admin/products');
    } catch (err) {
      console.error(err);
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 1100, margin: '20px auto', padding: 20 }}>
      <button onClick={() => router.push('/admin/products')}>← Back to Products</button>

      <h1>Add New Product</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Product Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          placeholder="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
        />

        <input
          type="number"
          placeholder="Fallback Price"
          value={price}
          onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={e => setStock(e.target.value === '' ? '' : Number(e.target.value))}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={e => setImageFile(e.target.files?.[0] || null)}
        />

        {packagingOptions.map((row, i) => (
          <div key={i}>
            <select
              value={row.name}
              onChange={e =>
                updateRow(i, {
                  name: e.target.value,
                })
              }
            >
              {UOM_PRESETS.map(u => (
                <option key={u}>{u}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Pieces per unit"
              value={row.piecesPerUnit}
              onChange={e =>
                updateRow(i, {
                  piecesPerUnit: e.target.value === '' ? '' : Number(e.target.value),
                })
              }
            />

            <input
              type="number"
              placeholder="Price"
              value={row.price}
              onChange={e =>
                updateRow(i, {
                  price: e.target.value === '' ? '' : Number(e.target.value),
                })
              }
            />

            <button type="button" onClick={() => removeRow(i)}>
              ✕
            </button>
          </div>
        ))}

        <button type="button" onClick={addRow}>
          + Add UoM
        </button>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving…' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}
