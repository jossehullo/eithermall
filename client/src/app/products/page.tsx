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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const ITEMS_PER_PAGE = 8;

export default function ProductsPage() {
  const { addToCart } = useCart();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<
    'default' | 'name-asc' | 'price-asc' | 'price-desc'
  >('default');
  const [page, setPage] = useState(1);

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
      .catch(() => setProducts([]));
  }, []);

  /* =======================
     CATEGORIES
  ======================= */
  const categories = useMemo(() => {
    const set = new Set<string>(['All']);
    products.forEach(p => p.category && set.add(p.category));
    return Array.from(set);
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
    if (sortBy === 'name-asc') return list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'price-asc')
      return list.sort(
        (a, b) =>
          (a.packagingOptions?.[0]?.price ?? a.price) -
          (b.packagingOptions?.[0]?.price ?? b.price)
      );
    if (sortBy === 'price-desc')
      return list.sort(
        (a, b) =>
          (b.packagingOptions?.[0]?.price ?? b.price) -
          (a.packagingOptions?.[0]?.price ?? a.price)
      );
    return list;
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
     MODAL
  ======================= */
  function openUomModal(product: Product) {
    if (!product.stock) return;
    setSelectedProduct(product);
    setSelectedUom(product.packagingOptions?.[0] ?? null);
    setQty(1);
    setModalVisible(true);
  }

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
      <h1 style={{ fontSize: 36, fontWeight: 800 }}>Explore Our Collection</h1>

      {/* GRID */}
      <div className="products-grid">
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
              src={
                product.imageUrl?.startsWith('http')
                  ? product.imageUrl
                  : `${API_BASE}/${product.imageUrl || product.image}`
              }
              style={{
                width: '100%',
                height: 180,
                objectFit: 'cover',
                borderRadius: 10,
              }}
            />

            <h3 style={{ marginTop: 10 }}>{product.name}</h3>

            <p style={{ color: 'red', fontWeight: 700 }}>
              From KSh{' '}
              {(product.packagingOptions?.[0]?.price || product.price).toLocaleString()}
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => openUomModal(product)}
                disabled={!product.stock}
                style={{
                  flex: 1,
                  background: '#000',
                  color: '#fff',
                  borderRadius: 8,
                }}
              >
                Choose Unit
              </button>

              <button
                onClick={() => router.push(`/products/${product._id}`)}
                style={{ flex: 1 }}
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
