'use client';

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { resolveImageUrl } from '@/lib/image';
import { API_BASE_URL } from '@/lib/api';

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

export default function ProductsClient({ page }: { page: number }) {
  const { addToCart } = useCart();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<
    'default' | 'name-asc' | 'price-asc' | 'price-desc'
  >('default');

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedUom, setSelectedUom] = useState<PackagingOption | null>(null);
  const [qty, setQty] = useState(1);

  /* ================= FETCH ================= */

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/products`)
      .then(res => setProducts(res.data || []))
      .catch(() => setProducts([]));
  }, []);

  /* ================= FILTER ================= */

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCategory = activeCategory === 'All' || p.category === activeCategory;

      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [products, activeCategory, search]);

  /* ================= SORT ================= */

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

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProducts, page]);

  /* ================= CATEGORIES ================= */

  const categories = useMemo(() => {
    const set = new Set<string>(['All']);
    products.forEach(p => p.category && set.add(p.category));
    return Array.from(set);
  }, [products]);

  /* ================= MODAL ================= */

  function openUomModal(product: Product) {
    if (!product.stock) return;

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

  /* ================= UI ================= */

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
          onChange={e => setSearch(e.target.value)}
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
          onChange={e => setSortBy(e.target.value as any)}
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

      {/* CATEGORIES */}

      <div className="flex gap-3 mb-6 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm ${
              activeCategory === cat ? 'bg-yellow-400 text-black' : 'bg-white border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID */}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedProducts.map(product => (
          <div key={product._id} className="bg-white rounded-2xl p-4 shadow-md">
            <div className="w-full h-44 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
              <img
                src={resolveImageUrl(product.image) || '/placeholder.png'}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            <h3 className="mt-3 font-semibold">{product.name}</h3>

            <p className="text-red-600 font-bold mt-1">
              From KSh{' '}
              {(product.packagingOptions?.[0]?.price || product.price).toLocaleString()}
            </p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => openUomModal(product)}
                className="flex-1 py-2 rounded-lg bg-black text-white"
              >
                Choose Unit
              </button>

              <button
                onClick={() => router.push(`/products/${product._id}?page=${page}`)}
                className="flex-1 py-2 rounded-lg border"
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10 flex-wrap">
          {/* PREV */}
          <button
            disabled={page === 1}
            onClick={() => router.push(`/products?page=${page - 1}`)}
            className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-40"
          >
            ← Prev
          </button>

          {/* PAGE NUMBERS */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(Math.max(0, page - 2), page + 1)
            .map(p => (
              <button
                key={p}
                onClick={() => router.push(`/products?page=${p}`)}
                className={`px-4 py-2 rounded-lg border font-semibold transition
          ${p === page ? 'bg-black text-white border-black' : 'bg-white hover:bg-gray-100'}`}
              >
                {p}
              </button>
            ))}

          {/* NEXT */}
          <button
            disabled={page === totalPages}
            onClick={() => router.push(`/products?page=${page + 1}`)}
            className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}

      {/* MODAL */}

      {modalVisible && selectedProduct && selectedUom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2>Choose Unit for {selectedProduct.name}</h2>

            {selectedProduct.packagingOptions?.map(u => (
              <div
                key={u.name}
                onClick={() => setSelectedUom(u)}
                className={`p-3 border rounded mt-2 cursor-pointer ${
                  selectedUom.name === u.name ? 'border-green-500' : ''
                }`}
              >
                {u.name} — KSh {u.price}
              </div>
            ))}

            <div className="flex justify-center gap-4 mt-4">
              <button onClick={() => setQty(qty - 1)}>-</button>
              <strong>{qty}</strong>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white p-3 rounded mt-4"
            >
              Add to Cart
            </button>

            <button onClick={() => setModalVisible(false)} className="w-full mt-2">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
