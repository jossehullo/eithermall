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
    { name: 'Pcs', piecesPerUnit: '', price: '', defaultForSale: true },
  ]);

  const [loading, setLoading] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #d1d5db',
    fontSize: 14,
  };

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

      alert('Product created successfully');
      router.push('/admin/products');
    } catch (err) {
      console.error(err);
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 1100, margin: '40px auto', padding: 20 }}>
      {/* Back Button */}
      <button
        onClick={() => router.push('/admin/products')}
        style={{
          marginBottom: 20,
          padding: '8px 14px',
          borderRadius: 6,
          border: '1px solid #ddd',
          background: '#f9fafb',
          cursor: 'pointer',
        }}
      >
        ← Back to Products
      </button>

      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 20 }}>Add New Product</h1>

      <form onSubmit={handleSubmit}>
        {/* BASIC INFO CARD */}
        <div
          style={{
            background: '#ffffff',
            padding: 24,
            borderRadius: 14,
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            marginBottom: 30,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
            }}
          >
            <input
              style={inputStyle}
              placeholder="Product Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />

            <input
              style={inputStyle}
              placeholder="Category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
            />

            <input
              type="number"
              style={inputStyle}
              placeholder="Fallback Price"
              value={price}
              onChange={e =>
                setPrice(e.target.value === '' ? '' : Number(e.target.value))
              }
            />

            <input
              type="number"
              style={inputStyle}
              placeholder="Stock"
              value={stock}
              onChange={e =>
                setStock(e.target.value === '' ? '' : Number(e.target.value))
              }
            />

            <textarea
              style={{
                ...inputStyle,
                gridColumn: '1 / -1',
                minHeight: 90,
              }}
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />

            <input
              type="file"
              accept="image/*"
              onChange={e => setImageFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>

        {/* UOM CARD */}
        <div
          style={{
            background: '#ffffff',
            padding: 24,
            borderRadius: 14,
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          }}
        >
          <h2 style={{ fontWeight: 700, marginBottom: 18 }}>Packaging / Units (UoM)</h2>

          {packagingOptions.map((row, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr auto',
                gap: 10,
                marginBottom: 12,
              }}
            >
              <select
                value={row.name}
                onChange={e => updateRow(i, { name: e.target.value })}
                style={inputStyle}
              >
                {UOM_PRESETS.map(u => (
                  <option key={u}>{u}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Pieces per unit"
                style={inputStyle}
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
                style={inputStyle}
                value={row.price}
                onChange={e =>
                  updateRow(i, {
                    price: e.target.value === '' ? '' : Number(e.target.value),
                  })
                }
              />

              <button
                type="button"
                onClick={() => removeRow(i)}
                style={{
                  background: '#ffe2e2',
                  border: '1px solid #ff9b9b',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addRow}
            style={{
              marginTop: 10,
              padding: '8px 16px',
              background: '#0ea5a4',
              color: '#fff',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            + Add UoM
          </button>
        </div>

        {/* SUBMIT */}
        <div style={{ marginTop: 30 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 24px',
              background: '#111827',
              color: '#fff',
              borderRadius: 10,
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {loading ? 'Saving…' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
