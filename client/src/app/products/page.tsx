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
     MODAL HELPERS
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
    <div className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto pt-24">
      <h1 className="text-3xl font-extrabold mb-6">Explore Our Collection</h1>

      {/* SEARCH + SORT */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search products…"
          className="flex-1 max-w-md rounded-full border px-5 py-3"
        />

        <select
          value={sortBy}
          onChange={e => {
            setSortBy(e.target.value as any);
            setPage(1);
          }}
          className="rounded-full border px-5 py-3"
        >
          <option value="default">Sort by</option>
          <option value="name-asc">Name A → Z</option>
          <option value="price-asc">Price Low → High</option>
          <option value="price-desc">Price High → Low</option>
        </select>
      </div>

      {/* CATEGORIES */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-full border text-sm ${
              activeCategory === cat ? 'bg-yellow-400' : 'bg-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {paginatedProducts.map(product => (
          <div
            key={product._id}
            className="bg-white rounded-xl p-3 shadow hover:shadow-lg transition"
          >
            <img
              src={
                product.imageUrl?.startsWith('http')
                  ? product.imageUrl
                  : `${API_BASE}/${product.imageUrl || product.image}`
              }
              className="w-full aspect-square object-cover rounded-lg"
            />

            <h3 className="mt-3 font-semibold">{product.name}</h3>

            <p className="text-red-600 font-bold">
              From KSh{' '}
              {(product.packagingOptions?.[0]?.price || product.price).toLocaleString()}
            </p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => openUomModal(product)}
                disabled={!product.stock}
                className="flex-1 rounded-lg bg-black text-white py-2 text-sm disabled:bg-gray-400"
              >
                Choose Unit
              </button>

              <button
                onClick={() => router.push(`/products/${product._id}`)}
                className="flex-1 rounded-lg border py-2 text-sm"
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
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

      {/* MODAL (unchanged logic) */}
      {modalVisible && selectedProduct && selectedUom && (
        <div
          onClick={() => setModalVisible(false)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-xl p-6 w-[380px]"
          >
            <h2 className="font-bold mb-4">Choose Unit for {selectedProduct.name}</h2>

            {selectedProduct.packagingOptions?.map(uom => (
              <div
                key={uom.name}
                onClick={() => {
                  setSelectedUom(uom);
                  setQty(1);
                }}
                className={`p-3 rounded-lg border mb-2 cursor-pointer ${
                  selectedUom.name === uom.name ? 'border-green-500' : ''
                }`}
              >
                {uom.name} — KSh {uom.price.toLocaleString()}
              </div>
            ))}

            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-2 rounded-lg mt-4"
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
