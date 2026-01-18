'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type PackagingRow = {
  name: string;
  piecesPerUnit: number;
  price?: number;
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

  // Form states
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
      piecesPerUnit: 1,
      price: 0,
      minQty: 1,
      qtyStep: 1,
      maxQty: 0,
      defaultForSale: true,
    },
    { name: 'Carton', piecesPerUnit: 80, price: 0, minQty: 1, qtyStep: 1, maxQty: 0 },
  ]);

  const [loading, setLoading] = useState(false);

  function addRow() {
    setPackagingOptions(prev => [
      ...prev,
      {
        name: 'Pcs',
        piecesPerUnit: 1,
        price: 0,
        minQty: 1,
        qtyStep: 1,
        maxQty: 0,
      },
    ]);
  }

  function removeRow(i: number) {
    setPackagingOptions(prev => prev.filter((_, idx) => idx !== i));
  }

  function updateRow(i: number, patch: Partial<PackagingRow>) {
    setPackagingOptions(prev => {
      const c = [...prev];
      c[i] = { ...c[i], ...patch };
      return c;
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
      price: p.price ? Number(p.price) : 0,
      minQty: p.minQty ? Number(p.minQty) : 1,
      qtyStep: p.qtyStep ? Number(p.qtyStep) : 1,
      maxQty: p.maxQty ? Number(p.maxQty) : 0,
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
    } catch (err: any) {
      console.error(err);
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  }

  // Reusable styles
  const input = {
    width: '100%',
    padding: '8px',
    borderRadius: 6,
    border: '1px solid #ccc',
  };

  const label = {
    fontWeight: 600,
    marginBottom: 6,
    display: 'block',
  };

  const tableCell: React.CSSProperties = {
    padding: '10px',
    borderBottom: '1px solid #f0f0f0',
  };

  const tableHead: React.CSSProperties = {
    padding: '10px',
    borderBottom: '2px solid #ddd',
    background: '#fafafa',
    fontWeight: 600,
    fontSize: 14,
  };

  return (
    <div style={{ maxWidth: 1100, margin: '20px auto', padding: 20 }}>
      <h1 style={{ fontSize: 30, fontWeight: 700, marginBottom: 16 }}>Add New Product</h1>

      <form onSubmit={handleSubmit}>
        {/* ───────────────────────────── PRODUCT BASIC INFO ───────────────────────────── */}
        <div
          style={{
            background: '#fff',
            padding: 20,
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
            Basic Information
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={label}>Product Name</label>
              <input
                style={input}
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={label}>Category</label>
              <input
                style={input}
                value={category}
                onChange={e => setCategory(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={label}>Fallback Price</label>
              <input
                type="number"
                style={input}
                value={price}
                onChange={e =>
                  setPrice(e.target.value === '' ? '' : Number(e.target.value))
                }
              />
            </div>

            <div>
              <label style={label}>Stock (pieces)</label>
              <input
                type="number"
                style={input}
                value={stock}
                onChange={e =>
                  setStock(e.target.value === '' ? '' : Number(e.target.value))
                }
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={label}>Description</label>
              <textarea
                style={{ ...input, minHeight: 80 }}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label style={label}>Base Unit Name (optional)</label>
              <input
                style={input}
                value={baseUnitName}
                onChange={e => setBaseUnitName(e.target.value)}
              />
            </div>

            <div>
              <label style={label}>Default Sale Unit (optional)</label>
              <input
                style={input}
                value={defaultSaleUnit}
                onChange={e => setDefaultSaleUnit(e.target.value)}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={label}>Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setImageFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>
        </div>

        {/* ───────────────────────────── PACKAGING OPTIONS ───────────────────────────── */}
        <div
          style={{
            background: '#fff',
            padding: 20,
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>
            Packaging / Units (UoM)
          </h2>
          <p style={{ color: '#666', marginBottom: 16 }}>
            <strong>piecesPerUnit</strong> = how many pieces are inside this packaging.
          </p>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHead}>Unit</th>
                <th style={tableHead}>Custom Name</th>
                <th style={tableHead}>Pieces / Unit</th>
                <th style={tableHead}>Price</th>
                <th style={tableHead}>Default</th>
                <th style={tableHead}>Remove</th>
              </tr>
            </thead>

            <tbody>
              {packagingOptions.map((row, i) => (
                <tr key={i}>
                  <td style={tableCell}>
                    <select
                      value={row.name}
                      onChange={e => updateRow(i, { name: e.target.value })}
                      style={input}
                    >
                      {UOM_PRESETS.map(u => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td style={tableCell}>
                    {row.name === 'Other' ? (
                      <input
                        style={input}
                        value={row.customName ?? ''}
                        onChange={e => updateRow(i, { customName: e.target.value })}
                      />
                    ) : (
                      <div style={{ padding: '8px', color: '#666' }}>{row.name}</div>
                    )}
                  </td>

                  <td style={tableCell}>
                    <input
                      type="number"
                      style={input}
                      value={row.piecesPerUnit}
                      onChange={e =>
                        updateRow(i, { piecesPerUnit: Number(e.target.value) || 1 })
                      }
                    />
                  </td>

                  <td style={tableCell}>
                    <input
                      type="number"
                      style={input}
                      value={row.price ?? ''}
                      onChange={e => updateRow(i, { price: Number(e.target.value) || 0 })}
                    />
                  </td>

                  <td style={tableCell}>
                    <input
                      type="checkbox"
                      checked={!!row.defaultForSale}
                      onChange={e => {
                        if (e.target.checked) {
                          setPackagingOptions(prev =>
                            prev.map((p, idx) => ({
                              ...p,
                              defaultForSale: idx === i,
                            }))
                          );
                        } else {
                          updateRow(i, { defaultForSale: false });
                        }
                      }}
                    />
                  </td>

                  <td style={tableCell}>
                    <button
                      type="button"
                      onClick={() => removeRow(i)}
                      style={{
                        background: '#ffdddd',
                        color: '#d00',
                        border: '1px solid #d88',
                        padding: '6px 10px',
                        borderRadius: 6,
                        cursor: 'pointer',
                      }}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            type="button"
            onClick={addRow}
            style={{
              marginTop: 16,
              padding: '10px 18px',
              background: '#0ea5a4',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            + Add UoM
          </button>
        </div>

        {/* ───────────────────────────── SUBMIT BUTTONS ───────────────────────────── */}
        <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
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

          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            style={{
              padding: '12px 20px',
              borderRadius: 8,
              border: '1px solid #ccc',
              background: '#f9f9f9',
              cursor: 'pointer',
            }}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}
