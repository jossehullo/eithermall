'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

/* =======================
   TYPES
======================= */
type PackagingOption = {
  name: string;
  piecesPerUnit: number;
  price: number;
};

type Product = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  image?: string;
  imageUrl?: string;
  packagingOptions?: PackagingOption[];
};

const API_BASE = 'http://localhost:5000';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedUom, setSelectedUom] = useState<PackagingOption | null>(null);
  const [qty, setQty] = useState(1);

  /* =======================
     FETCH PRODUCT
  ======================= */
  useEffect(() => {
    axios
      .get(`${API_BASE}/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setSelectedUom(res.data.packagingOptions?.[0] ?? null);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  /* =======================
     MAX QTY (STOCK SAFE)
  ======================= */
  const maxQty = useMemo(() => {
    if (!product || !selectedUom || !product.stock) return 0;
    return Math.floor(product.stock / selectedUom.piecesPerUnit);
  }, [product, selectedUom]);

  /* =======================
     ADD TO CART
  ======================= */
  function handleAddToCart() {
    if (!product || !selectedUom || product.stock === 0) return;

    addToCart({
      _id: product._id,
      name: product.name,
      qty,
      unitName: selectedUom.name,
      piecesPerUnit: selectedUom.piecesPerUnit,
      unitPrice: selectedUom.price,
      stock: product.stock,
      image: product.imageUrl || product.image || null,
    });
  }

  if (loading) return <p style={{ padding: 40 }}>Loading…</p>;
  if (!product) return <p style={{ padding: 40 }}>Product not found</p>;

  const outOfStock = !product.stock || product.stock <= 0;

  return (
    <div style={{ padding: 40, maxWidth: 1000, margin: 'auto' }}>
      <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
        {/* IMAGE */}
        <img
          src={product.imageUrl || product.image}
          style={{
            width: 360,
            height: 360,
            objectFit: 'contain',
            borderRadius: 12,
            background: '#f5f5f5',
          }}
        />

        {/* DETAILS */}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800 }}>{product.name}</h1>

          <p style={{ fontSize: 22, color: '#c92a2a', fontWeight: 700 }}>
            KSh {selectedUom?.price.toLocaleString() ?? product.price}
          </p>

          <p style={{ marginTop: 12 }}>{product.description}</p>

          {/* STOCK */}
          <p style={{ marginTop: 10, fontWeight: 600 }}>
            {outOfStock ? (
              <span style={{ color: 'red' }}>Out of Stock</span>
            ) : (
              <span style={{ color: 'green' }}>In Stock</span>
            )}
          </p>

          {/* PACKAGING */}
          {!outOfStock && (
            <>
              <h3 style={{ marginTop: 20 }}>Choose packaging</h3>

              <select
                value={selectedUom?.name}
                onChange={e => {
                  const uom = product.packagingOptions?.find(
                    u => u.name === e.target.value
                  );
                  setSelectedUom(uom ?? null);
                  setQty(1);
                }}
                style={{ padding: 10, marginTop: 8 }}
              >
                {product.packagingOptions?.map(uom => (
                  <option key={uom.name} value={uom.name}>
                    {uom.name} — KSh {uom.price}
                  </option>
                ))}
              </select>

              {/* QTY */}
              <div style={{ marginTop: 20 }}>
                <strong>Quantity</strong>
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button onClick={() => qty > 1 && setQty(qty - 1)}>−</button>
                  <span>{qty}</span>
                  <button
                    onClick={() => setQty(q => q + 1)}
                    disabled={qty >= maxQty}
                    style={{
                      opacity: qty >= maxQty ? 0.4 : 1,
                      cursor: qty >= maxQty ? 'not-allowed' : 'pointer',
                    }}
                  >
                    +
                  </button>
                </div>

                {qty >= maxQty && (
                  <p style={{ color: 'red', fontSize: 13, marginTop: 4 }}>
                    Stock limit reached
                  </p>
                )}
              </div>
            </>
          )}

          {/* ACTIONS */}
          <div style={{ display: 'flex', gap: 12, marginTop: 30 }}>
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              style={{
                padding: '12px 20px',
                background: outOfStock ? '#aaa' : '#0a0',
                color: '#fff',
                borderRadius: 8,
                fontWeight: 700,
                cursor: outOfStock ? 'not-allowed' : 'pointer',
              }}
            >
              Add to Cart
            </button>

            <button
              onClick={() => router.push('/products')}
              style={{
                padding: '12px 20px',
                borderRadius: 8,
                border: '1px solid #ccc',
              }}
            >
              Back to Shop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
