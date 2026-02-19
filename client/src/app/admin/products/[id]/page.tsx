'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/api';

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

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #d1d5db',
    fontSize: 14,
  };

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    fetchProduct();
  }, [productId]);

  async function fetchProduct() {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setForm({
        name: data.name,
        category: data.category,
        stock: data.stock ?? '',

        description: data.description || '',
      });

      if (data.image) {
        setPreview(
          data.image?.startsWith('http')
            ? data.image
            : `${API_BASE_URL.replace('/api', '')}/${data.image}`
        );
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
      { name: 'New Unit', piecesPerUnit: 1, price: 0 },
    ]);
  }

  function deleteUOM(index: number) {
    setPackagingOptions(prev => prev.filter((_, i) => i !== index));
  }

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
      await axios.put(`${API_BASE_URL}/products/${productId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Product updated successfully');
      router.push('/admin/products');
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  }

  if (loading || !form) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>;
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

      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 20 }}>Edit Product</h1>

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
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Product Name"
            />

            <input
              style={inputStyle}
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              placeholder="Category"
            />

            <input
              type="number"
              style={inputStyle}
              value={form.stock === 0 ? '' : form.stock}
              onChange={e =>
                setForm({
                  ...form,
                  stock: e.target.value === '' ? '' : Number(e.target.value),
                })
              }
              placeholder="Stock"
            />

            <div />

            <textarea
              style={{
                ...inputStyle,
                gridColumn: '1 / -1',
                minHeight: 90,
              }}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Description"
            />

            <div style={{ gridColumn: '1 / -1' }}>
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
          <h2 style={{ fontWeight: 700, marginBottom: 10 }}>Packaging / Units (UoM)</h2>

          {baseUnit && (
            <div style={{ marginBottom: 16, color: '#666' }}>
              Base Unit: <strong>{baseUnit.name}</strong>
            </div>
          )}

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
              <input
                style={inputStyle}
                value={row.name}
                onChange={e => updateRow(i, { name: e.target.value })}
                placeholder="Unit Name"
              />

              <input
                type="number"
                style={inputStyle}
                value={row.piecesPerUnit}
                onChange={e =>
                  updateRow(i, {
                    piecesPerUnit: Number(e.target.value),
                  })
                }
                placeholder="Pieces per unit"
              />

              <input
                type="number"
                style={inputStyle}
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

          <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={addUOM}
              style={{
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

            <button
              type="button"
              onClick={autoCalculatePrices}
              style={{
                padding: '8px 16px',
                background: '#2563eb',
                color: '#fff',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Auto Calculate Prices
            </button>
          </div>
        </div>

        {/* SUBMIT */}
        <div style={{ marginTop: 30 }}>
          <button
            type="submit"
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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
