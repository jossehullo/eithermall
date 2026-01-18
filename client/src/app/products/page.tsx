'use client';

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

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
  price: number;
  category?: string;
  description?: string;
  stock?: number;
  image?: string;
  imageUrl?: string;
  packagingOptions?: PackagingOption[];
};

const API_BASE = 'http://localhost:5000';
const ITEMS_PER_PAGE = 8;

export default function ProductsPage() {
  const { addToCart } = useCart();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<
    'default' | 'name-asc' | 'price-asc' | 'price-desc'
  >('default');
  const [page, setPage] = useState(1);

  /* MODAL */
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedUom, setSelectedUom] = useState<PackagingOption | null>(null);
  const [qty, setQty] = useState(1);

  /* =======================
     FETCH PRODUCTS
  ======================= */
  useEffect(() => {
    axios
      .get(`${API_BASE}/api/products`)
      .then(res => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  /* =======================
     CATEGORIES (FIXED ERROR)
  ======================= */
  const categories = useMemo(() => {
    const s = new Set<string>(['All']);
    if (!Array.isArray(products)) return ['All'];

    products.forEach(p => {
      if (p?.category) s.add(p.category);
    });

    return Array.from(s);
  }, [products]);

  /* =======================
     FILTER + SEARCH
  ======================= */
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, activeCategory, search]);

  /* =======================
     SORT
  ======================= */
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'name-asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'price-asc':
        return list.sort(
          (a, b) =>
            (a.packagingOptions?.[0]?.price ?? a.price) -
            (b.packagingOptions?.[0]?.price ?? b.price)
        );
      case 'price-desc':
        return list.sort(
          (a, b) =>
            (b.packagingOptions?.[0]?.price ?? b.price) -
            (a.packagingOptions?.[0]?.price ?? a.price)
        );
      default:
        return list;
    }
  }, [filteredProducts, sortBy]);

  /* =======================
     PAGINATION
  ======================= */
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProducts, page]);

  /* =======================
     MODAL HELPERS
  ======================= */
  function openUomModal(product: Product) {
    if (!product.stock || product.stock <= 0) return;
    setSelectedProduct(product);
    setSelectedUom(product.packagingOptions?.[0] ?? null);
    setQty(1);
    setModalVisible(true);
  }

  const maxQty =
    selectedProduct && selectedUom && selectedProduct.stock
      ? Math.floor(selectedProduct.stock / selectedUom.piecesPerUnit)
      : Infinity;

  /* =======================
     ADD TO CART
  ======================= */
  function handleAddToCart() {
    if (!selectedProduct || !selectedUom) return;

    addToCart({
      _id: selectedProduct._id,
      name: selectedProduct.name,
      qty,
      unitName: selectedUom.name,
      piecesPerUnit: selectedUom.piecesPerUnit,
      unitPrice: selectedUom.price,
      stock: selectedProduct.stock,
      image: selectedProduct.imageUrl || selectedProduct.image || null,
    });

    setModalVisible(false);
  }

  /* =======================
     UI
  ======================= */
  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>
        Explore Our Collection
      </h1>

      {/* SEARCH + SORT */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        <input
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search products…"
          style={{
            maxWidth: 400,
            padding: '12px 18px',
            borderRadius: 30,
            border: '1px solid #ccc',
            flex: 1,
          }}
        />

        <select
          value={sortBy}
          onChange={e => {
            setSortBy(e.target.value as any);
            setPage(1);
          }}
          style={{
            padding: '12px 18px',
            borderRadius: 30,
            border: '1px solid #ccc',
          }}
        >
          <option value="default">Sort by</option>
          <option value="name-asc">Name A → Z</option>
          <option value="price-asc">Price Low → High</option>
          <option value="price-desc">Price High → Low</option>
        </select>
      </div>

      {/* CATEGORIES */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 25, flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setPage(1);
            }}
            style={{
              padding: '10px 20px',
              borderRadius: 30,
              background: activeCategory === cat ? '#f6c23e' : '#fff',
              border: '1px solid #ddd',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div
        style={{
          display: 'grid',
          gap: 25,
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        }}
      >
        {paginatedProducts.map(product => (
          <div
            key={product._id}
            style={{
              background: '#fff',
              borderRadius: 14,
              padding: 14,
              boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
            }}
          >
            <img
              src={product.imageUrl || product.image}
              style={{
                width: '100%',
                height: 200,
                objectFit: 'cover',
                borderRadius: 10,
              }}
            />

            <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 12 }}>
              {product.name}
            </h3>

            <p style={{ color: '#c92a2a', fontSize: 18, fontWeight: 700 }}>
              From KSh{' '}
              {(product.packagingOptions?.[0]?.price || product.price).toLocaleString()}
            </p>

            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button
                disabled={!product.stock || product.stock <= 0}
                onClick={() => openUomModal(product)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 10,
                  background: product.stock ? '#000' : '#aaa',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: product.stock ? 'pointer' : 'not-allowed',
                }}
              >
                {product.stock ? 'Choose Unit' : 'Out of Stock'}
              </button>

              <button
                onClick={() => router.push(`/products/${product._id}`)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 10,
                  border: '1px solid #ccc',
                }}
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div
          style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 30 }}
        >
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            ← Prev
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}>
              {i + 1}
            </button>
          ))}
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
            Next →
          </button>
        </div>
      )}

      {/* MODAL */}
      {modalVisible && selectedProduct && selectedUom && (
        <div
          onClick={() => setModalVisible(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ width: 420, background: '#fff', borderRadius: 14, padding: 24 }}
          >
            <h2>Choose Unit for {selectedProduct.name}</h2>

            {selectedProduct.packagingOptions?.map(uom => (
              <div
                key={uom.name}
                onClick={() => {
                  setSelectedUom(uom);
                  setQty(1);
                }}
                style={{
                  padding: 14,
                  marginTop: 10,
                  borderRadius: 10,
                  border:
                    selectedUom.name === uom.name ? '2px solid green' : '1px solid #ddd',
                  cursor: 'pointer',
                }}
              >
                {uom.name} — KSh {uom.price.toLocaleString()}
              </div>
            ))}

            <div
              style={{ display: 'flex', justifyContent: 'center', gap: 20, margin: 20 }}
            >
              <button onClick={() => qty > 1 && setQty(qty - 1)}>−</button>
              <strong>{qty}</strong>
              <button disabled={qty >= maxQty} onClick={() => setQty(qty + 1)}>
                +
              </button>
            </div>

            <button onClick={handleAddToCart} style={{ width: '100%', padding: 12 }}>
              Add to Cart
            </button>

            <button
              onClick={() => setModalVisible(false)}
              style={{ width: '100%', marginTop: 10 }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
