// client/src/app/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/navigation/Navbar';
import ProductCard from '@/components/ProductCard';
import BackButton from '@/components/navigation/BackButton';

type Product = {
  _id: string;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  stock?: number;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch(`${apiBase}/products`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        // API can return either { products: [...] } or an array
        setProducts(Array.isArray(data) ? data : (data.products ?? []));
      } catch (err: any) {
        setError(err.message || 'Unable to load products');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />

      <main className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <BackButton />
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Products</h1>
          <div /> {/* spacer */}
        </div>

        {loading ? (
          <div className="text-center py-12 text-[var(--foreground)]">
            Loading products...
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-[var(--foreground)]">
            No products yet.
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {products.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
