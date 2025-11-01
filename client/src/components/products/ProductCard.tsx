// client/src/components/products/ProductCard.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type Product = {
  _id: string;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  stock?: number;
};

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { user } = useAuth();

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Quick View requires login (per your spec)
    if (!user) {
      router.push(`/login?redirect=/products`);
      return;
    }
    // open modal handled by parent; here we'll navigate to product page for example
    router.push(`/products/${product._id}`);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add to cart allowed without login
    try {
      const saved =
        typeof window !== 'undefined' ? localStorage.getItem('eithermall-cart') : null;
      const arr = saved ? JSON.parse(saved) : [];
      const next = Array.isArray(arr) ? [...arr, product] : [product];
      if (typeof window !== 'undefined')
        localStorage.setItem('eithermall-cart', JSON.stringify(next));
      // dispatch storage event fallback
      window.dispatchEvent(new Event('storage'));
      // small in-page feedback (placeholder)
      alert('Added to cart');
    } catch {
      alert('Could not add to cart');
    }
  };

  return (
    <article
      onClick={() => router.push(`/products/${product._id}`)}
      className="rounded-xl overflow-hidden shadow-lg bg-[var(--card-bg)] hover:shadow-2xl transition cursor-pointer"
    >
      <div className="h-52 bg-gray-100 flex items-center justify-center">
        <img
          src={product.image || '/images/placeholder.png'}
          alt={product.name}
          className="object-cover w-full h-full"
          onError={e => (e.currentTarget.src = '/images/placeholder.png')}
        />
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">{product.name}</h3>
        <p className="text-sm text-[var(--brand-muted)]">KES {product.price ?? '—'}</p>

        <div className="flex items-center justify-between mt-3">
          <button
            onClick={handleAdd}
            className="px-3 py-1 rounded-md text-sm brand-btn flex items-center gap-2"
            title="Add to cart"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6h15l-1.5 9h-12z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="hidden sm:inline">Add</span>
          </button>

          <button
            onClick={handleQuickView}
            className="px-3 py-1 rounded-md text-sm border border-gray-200 hover:bg-gray-50"
            title="Quick view (login required)"
          >
            Quick View
          </button>
        </div>
      </div>
    </article>
  );
}
