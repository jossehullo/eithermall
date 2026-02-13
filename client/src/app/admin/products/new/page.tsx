'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type PackagingRow = {
  name: string;
  piecesPerUnit: number | '';
  price?: number | '';
  minQty?: number;
  qtyStep?: number;
  maxQty?: number;
  defaultForSale?: boolean;
  sellable?: boolean;
  customName?: string;
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

export default function AdminNewProductPage() {
  const router = useRouter();

  const raw = (process.env.NEXT_PUBLIC_API_BASE_URL as string) || 'http://localhost:5000';
  const API_BASE = raw.replace(/\/+$/, '').replace(/\/api$/, '');

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [baseUnitName, setBaseUnitName] = useState('');
  const [defaultSaleUnit, setDefaultSaleUnit] = useState('');

  const [packagingOptions, setPackagingOptions] = useState<PackagingRow[]>([
    {
      name: 'Pkt',
      piecesPerUnit: '',
      price: '',
      defaultForSale: true,
    },
    {
      name: 'Carton',
      piecesPerUnit: '',
      price: '',
    },
  ]);

  const [loading, setLoading] = useState(false);

  function addRow() {
    setPackagingOptions(prev => [
      ...prev,
      {
        name: 'Pcs',
        piecesPerUnit: '',
        price: '',
      },
    ]);
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

    const baseUnit = baseUnitName || cleaned[0].name;
    const defaultUnit =
      defaultSaleUnit || (cleaned.find(p => p.defaultForSale) || cleaned[0]).name;

    const fd = new FormData();
    fd.append('name', name);
    fd.append('category', category);
    fd.append('price', String(price || 0));
    fd.append('stock', String(stock || 0));
    fd.append('description', description);
    fd.append('baseUnitName', baseUnit);
    fd.append('defaultSaleUnit', defaultUnit);
    fd.append('packagingOptions', JSON.stringify(cleaned));
    if (imageFile) fd.append('image', imageFile);

    const url = `${API_BASE}/api/products`;

    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      await axios.post(url, fd, {
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

  const inputStyle = {
    width: '100%',
    padding: '8px',
    borderRadius: 6,
    border: '1px solid #ccc',
  };

  return (
    <div style={{ maxWidth: 1100, margin: '20px auto', padding: 20 }}>
      {/* 🔹 TOP BACK BUTTON */}
      <button
        onClick={() => router.push('/admin/products')}
        style={{
          marginBottom: 20,
          padding: '8px 14px',
          borderRadius: 6,
          border: '1px solid #ccc',
          background: '#f5f5f5',
          cursor: 'pointer',
        }}
      >
        ← Back to Products
      </button>

      <h1 style={{ fontSize: 30, fontWeight: 700, marginBottom: 16 }}>Add New Product</h1>

      <form onSubmit={handleSubmit}>
        {/* BASIC INFO */}
        <div
          style={{
            background: '#fff',
            padding: 20,
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            marginBottom: 24,
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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
              placeholder="Fallback Price"
              style={inputStyle}
              value={price}
              onChange={e =>
                setPrice(e.target.value === '' ? '' : Number(e.target.value))
              }
            />

            <input
              type="number"
              placeholder="Stock"
              style={inputStyle}
              value={stock}
              onChange={e =>
                setStock(e.target.value === '' ? '' : Number(e.target.value))
              }
            />

            <textarea
              style={{ ...inputStyle, gridColumn: '1 / -1', minHeight: 80 }}
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

        {/* UOM SECTION */}
        <div
          style={{
            background: '#fff',
            padding: 20,
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <h2 style={{ fontWeight: 700, marginBottom: 16 }}>Packaging / Units (UoM)</h2>

          {packagingOptions.map((row, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr auto',
                gap: 10,
                marginBottom: 10,
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
                  background: '#ffdddd',
                  border: '1px solid #d88',
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
              marginTop: 12,
              padding: '8px 14px',
              background: '#0ea5a4',
              color: '#fff',
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            + Add UoM
          </button>
        </div>

        {/* SUBMIT */}
        <div style={{ marginTop: 24 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 20px',
              background: '#111827',
              color: '#fff',
              borderRadius: 8,
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
