'use client';

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
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

export default function ProductsClient({ page }: { page: number }) {
  const { addToCart } = useCart();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const [sortBy, setSortBy] = useState<
    'default' | 'name-asc' | 'price-asc' | 'price-desc'
  >('default');

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedUom, setSelectedUom] = useState<PackagingOption | null>(null);
  const [qty, setQty] = useState(1);

  /* ================= FETCH PRODUCTS ================= */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/products?page=${page}&limit=8&search=${search}&category=${activeCategory}`
        );

        setProducts(res.data.products || []);
        setTotalPages(res.data.totalPages || 1);
      } catch {
        setProducts([]);
        setTotalPages(1);
      }
    };

    fetchProducts();
  }, [page, search, activeCategory]);

  /* ================= SORT ================= */

  const sortedProducts = useMemo(() => {
    const list = [...products];

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
  }, [products, sortBy]);

  /* ================= CATEGORIES ================= */

  const categories = useMemo(() => {
    const set = new Set<string>(['All']);
    products.forEach(p => p.category && set.add(p.category));
    return Array.from(set);
  }, [products]);

  /* ================= PAGINATION LOGIC ================= */

  const getVisiblePages = () => {
    const pages: number[] = [];

    let start = Math.max(1, page - 1);
    let end = Math.min(totalPages, page + 1);

    if (page <= 2) {
      start = 1;
      end = Math.min(3, totalPages);
    }

    if (page >= totalPages - 1) {
      start = Math.max(1, totalPages - 2);
      end = totalPages;
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

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
          onChange={e => {
            setSearch(e.target.value);
            router.push(`/products?page=1`);
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
            onClick={() => {
              setActiveCategory(cat);
              router.push(`/products?page=1`);
            }}
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
        {sortedProducts.map(product => (
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
          <Link href={`/products?page=${page - 1}`} prefetch>
            <button
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border bg-white disabled:opacity-40"
            >
              ← Prev
            </button>
          </Link>

          {getVisiblePages().map(p => (
            <Link key={p} href={`/products?page=${p}`} prefetch>
              <button
                className={`px-4 py-2 rounded-lg border font-semibold ${
                  p === page ? 'bg-black text-white' : 'bg-white'
                }`}
              >
                {p}
              </button>
            </Link>
          ))}

          <Link href={`/products?page=${page + 1}`} prefetch>
            <button
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border bg-white disabled:opacity-40"
            >
              Next →
            </button>
          </Link>
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
              <button onClick={() => qty > 1 && setQty(qty - 1)}>-</button>
              <strong>{qty}</strong>
              <button onClick={() => qty < maxQty && setQty(qty + 1)}>+</button>
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
