'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type PackagingRow = {
  name: string;
  piecesPerUnit: number;
  price: number;
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [form, setForm] = useState<any>(null);
  const [packagingOptions, setPackagingOptions] = useState<PackagingRow[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
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
        stock: data.stock,
        description: data.description || '',
      });

      if (data.image) {
        setPreview(`${API_BASE}/${data.image}`);
      }

      const sorted = (data.packagingOptions || []).sort(
        (a: any, b: any) => a.piecesPerUnit - b.piecesPerUnit
      );

      setPackagingOptions(sorted);
    } catch (err) {
      console.error(err);
      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  }

  // 🔥 Auto detect smallest unit
  const baseUnit = useMemo(() => {
    if (!packagingOptions.length) return null;
    return packagingOptions.reduce((smallest, current) =>
      current.piecesPerUnit < smallest.piecesPerUnit ? current : smallest
    );
  }, [packagingOptions]);

  function updateRow(i: number, patch: Partial<PackagingRow>) {
    setPackagingOptions(prev => {
      const copy = [...prev];
      copy[i] = { ...copy[i], ...patch };
      return copy.sort((a, b) => a.piecesPerUnit - b.piecesPerUnit);
    });
  }

  function addUOM() {
    setPackagingOptions(prev => [
      ...prev,
      {
        name: 'New Unit',
        piecesPerUnit: 1,
        price: 0,
      },
    ]);
  }

  function deleteUOM(index: number) {
    setPackagingOptions(prev => prev.filter((_, i) => i !== index));
  }

  // 🔥 Auto-calc based on smallest unit
  function autoCalculatePrices() {
    if (!baseUnit) return;

    const basePrice = baseUnit.price / baseUnit.piecesPerUnit;

    const recalculated = packagingOptions.map(unit => ({
      ...unit,
      price: Math.round(unit.piecesPerUnit * basePrice),
    }));

    setPackagingOptions(recalculated);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();

    formData.append('name', form.name);
    formData.append('category', form.category);
    formData.append('stock', form.stock);
    formData.append('description', form.description);
    formData.append('packagingOptions', JSON.stringify(packagingOptions));

    if (image) formData.append('image', image);

    try {
      await axios.put(`${API_BASE}/api/products/${productId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Product updated!');
      router.push('/admin/products');
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  }

  if (loading || !form) {
    return <div className="py-10 text-center">Loading…</div>;
  }

  return (
    <div style={{ maxWidth: 1000, margin: '20px auto', padding: 20 }}>
      {/* Back */}
      <button
        onClick={() => router.push('/admin/products')}
        style={{
          marginBottom: 20,
          padding: '8px 16px',
          background: '#eee',
          borderRadius: 6,
          border: '1px solid #ccc',
          cursor: 'pointer',
        }}
      >
        ← Back to Products
      </button>

      <h1 style={{ fontSize: 30, fontWeight: 700, marginBottom: 20 }}>Edit Product</h1>

      <form onSubmit={handleSubmit}>
        {/* IMAGE */}
        <div style={{ marginBottom: 25 }}>
          <h3>Product Image</h3>

          {preview && (
            <img
              src={preview}
              style={{
                width: 180,
                height: 180,
                objectFit: 'cover',
                borderRadius: 10,
                marginBottom: 10,
              }}
            />
          )}

          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        {/* BASIC INFO */}
        <div style={{ marginBottom: 25 }}>
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Product Name"
          />

          <input
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            placeholder="Category"
          />

          <input
            type="number"
            value={form.stock}
            onChange={e => setForm({ ...form, stock: Number(e.target.value) })}
            placeholder="Stock"
          />

          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
          />
        </div>

        {/* UOM SECTION */}
        <div style={{ marginBottom: 20 }}>
          <h2>Units (Small → Large)</h2>

          {baseUnit && (
            <div style={{ marginBottom: 10, color: '#666' }}>
              Base Unit: <strong>{baseUnit.name}</strong>
            </div>
          )}

          {packagingOptions.map((row, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 10,
                marginBottom: 8,
                alignItems: 'center',
              }}
            >
              <input
                value={row.name}
                onChange={e => updateRow(i, { name: e.target.value })}
                placeholder="Unit Name"
              />

              <input
                type="number"
                value={row.piecesPerUnit}
                onChange={e =>
                  updateRow(i, {
                    piecesPerUnit: Number(e.target.value),
                  })
                }
                placeholder="Pieces"
              />

              <input
                type="number"
                value={row.price}
                onChange={e =>
                  updateRow(i, {
                    price: Number(e.target.value),
                  })
                }
                placeholder="Price"
              />

              <button
                type="button"
                onClick={() => deleteUOM(i)}
                style={{
                  background: '#ffdddd',
                  border: '1px solid #cc0000',
                  padding: '6px 10px',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>
          ))}

          <div style={{ marginTop: 15, display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={addUOM}
              style={{
                padding: '8px 14px',
                background: '#0ea5a4',
                color: '#fff',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              + Add UOM
            </button>

            <button
              type="button"
              onClick={autoCalculatePrices}
              style={{
                padding: '8px 14px',
                background: '#2563eb',
                color: '#fff',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Auto Calculate Prices
            </button>
          </div>
        </div>

        <button
          type="submit"
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
          Save Changes
        </button>
      </form>
    </div>
  );
}
