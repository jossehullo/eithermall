'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

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

    const token = localStorage.getItem('token');

    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/products`, fd, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'Content-Type': 'multipart/form-data',
        },
      });

      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
      <button
        onClick={() => router.push('/admin/products')}
        className="mb-6 px-4 py-2 rounded border bg-gray-100 hover:bg-gray-200"
      >
        ← Back to Products
      </button>

      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit}>
        {/* BASIC INFO */}
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              style={{ ...inputStyle, gridColumn: '1 / -1', minHeight: 90 }}
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

        {/* UOM */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold mb-4">Packaging / Units (UoM)</h2>

          {packagingOptions.map((row, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
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
                className="bg-red-100 border border-red-300 rounded px-3"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addRow}
            className="mt-3 px-4 py-2 bg-teal-600 text-white rounded"
          >
            + Add UoM
          </button>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg"
          >
            {loading ? 'Saving…' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
