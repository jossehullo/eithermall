// client/src/components/ProductCard.tsx
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

  const handleClick = () => {
    if (!user) {
      // redirect to login and keep intended redirect
      router.push(`/login?redirect=/products/${product._id}`);
      return;
    }
    // logged in => go to product details page
    router.push(`/products/${product._id}`);
  };

  return (
    <article
      className="rounded-xl overflow-hidden shadow-lg bg-white hover:shadow-2xl transition cursor-pointer"
      onClick={handleClick}
      role="button"
    >
      <div className="h-48 bg-gray-100 flex items-center justify-center">
        <img
          src={product.image || '/images/placeholder.png'}
          alt={product.name}
          className="object-contain max-h-48 w-full"
        />
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">{product.name}</h3>
        <p className="text-sm text-[var(--muted)]">KES {product.price ?? '—'}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-[var(--muted)]">Stock: {product.stock ?? 0}</span>
          <button
            onClick={e => {
              e.stopPropagation();
              // if not logged in, redirect
              if (!user) return router.push(`/login?redirect=/products/${product._id}`);
              // add to cart placeholder
              alert('Add to cart (to implement)');
            }}
            className="px-3 py-1 rounded-md text-sm brand-btn"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
