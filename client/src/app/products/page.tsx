'use client';

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { resolveImageUrl } from '@/lib/image';
import { API_BASE_URL } from '@/lib/api';

/* ======================= TYPES ======================= */

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

  /* ======================= FETCH ======================= */

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/products`)
      .then(res => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setProducts([]));
  }, []);

  /* ======================= CATEGORIES ======================= */

  const categories = useMemo(() => {
    const set = new Set<string>(['All']);
    products.forEach(p => p.category && set.add(p.category));
    return Array.from(set);
  }, [products]);

  /* ======================= FILTER ======================= */

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, activeCategory, search]);

  /* ======================= SORT ======================= */

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

  /* ======================= PAGINATION ======================= */

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProducts, page]);

  /* ======================= MODAL ======================= */

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

  /* ======================= UI ======================= */

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontSize: 36, fontWeight: 800 }}>Explore Our Collection</h1>

      {/* SEARCH + SORT */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          margin: '20px 0',
        }}
      >
        <input
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search products..."
          style={{
            flex: 1,
            minWidth: 220,
            padding: '12px 16px',
            borderRadius: 30,
            border: '1px solid #ddd',
          }}
        />

        <select
          value={sortBy}
          onChange={e => {
            setSortBy(e.target.value as any);
            setPage(1);
          }}
          style={{
            padding: '12px 16px',
            borderRadius: 30,
            border: '1px solid #ddd',
            minWidth: 160,
          }}
        >
          <option value="default">Sort by</option>
          <option value="name-asc">Name A → Z</option>
          <option value="price-asc">Price Low → High</option>
          <option value="price-desc">Price High → Low</option>
        </select>
      </div>

      {/* ✅ UPDATED CATEGORIES ONLY */}
      <div className="overflow-x-auto mb-6">
        <div className="flex gap-3 min-w-max pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition ${
                activeCategory === cat
                  ? 'bg-yellow-400 text-black'
                  : 'bg-white border hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedProducts.map(product => (
          <div
            key={product._id}
            className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="w-full h-44 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
              <img
                src={
                  product.image?.startsWith('http')
                    ? product.image
                    : product.imageUrl?.startsWith('http')
                      ? product.imageUrl
                      : resolveImageUrl(product.image) || '/placeholder.png'
                }
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            <h3 className="mt-3 font-semibold text-sm md:text-base">{product.name}</h3>

            <p className="text-red-600 font-bold mt-1">
              From KSh{' '}
              {(product.packagingOptions?.[0]?.price || product.price).toLocaleString()}
            </p>

            <div className="flex gap-2 mt-3">
              <button
                disabled={!product.stock || product.stock <= 0}
                onClick={() => openUomModal(product)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                  product.stock
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
              >
                {product.stock ? 'Choose Unit' : 'Out of Stock'}
              </button>

              <button
                onClick={() => router.push(`/products/${product._id}`)}
                className="flex-1 py-2 rounded-lg border text-sm hover:bg-gray-100"
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
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 10,
            marginTop: 30,
            flexWrap: 'wrap',
          }}
        >
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            ← Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              style={{
                fontWeight: page === i + 1 ? 700 : 400,
              }}
            >
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
            style={{
              width: 420,
              background: '#fff',
              borderRadius: 14,
              padding: 24,
            }}
          >
            <h2 style={{ marginBottom: 12 }}>Choose Unit for {selectedProduct.name}</h2>

            {selectedProduct.packagingOptions?.map(uom => (
              <div
                key={uom.name}
                onClick={() => {
                  setSelectedUom(uom);
                  setQty(1);
                }}
                style={{
                  padding: 14,
                  marginBottom: 10,
                  borderRadius: 10,
                  cursor: 'pointer',
                  border:
                    selectedUom.name === uom.name ? '2px solid green' : '1px solid #ddd',
                }}
              >
                {uom.name} — KSh {uom.price.toLocaleString()}
              </div>
            ))}

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 20,
                margin: 20,
              }}
            >
              <button onClick={() => qty > 1 && setQty(qty - 1)}>−</button>

              <strong>{qty}</strong>

              <button disabled={qty >= maxQty} onClick={() => setQty(q => q + 1)}>
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              style={{
                width: '100%',
                padding: 12,
                background: '#000',
                color: '#fff',
                borderRadius: 10,
              }}
            >
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
