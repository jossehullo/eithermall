'use client';

import React from 'react';
import { X } from 'lucide-react';

interface QuickViewModalProps {
  product: any;
  onClose: () => void;
  onAddToCart: (product: any) => void;
}

export default function QuickViewModal({
  product,
  onClose,
  onAddToCart,
}: QuickViewModalProps) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center animate-slideIn">
      <div className="bg-[var(--card-bg)] rounded-2xl w-[90%] max-w-2xl shadow-xl overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="flex items-center justify-center">
            <img
              src={product.image || '/images/placeholder.jpg'}
              alt={product.name}
              className="w-full h-60 object-cover rounded-xl"
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-2">
              {product.name}
            </h2>
            <p className="text-[var(--brand-accent)] font-bold text-xl mb-3">
              Ksh {product.price.toLocaleString()}
            </p>
            <p className="text-gray-600 text-sm mb-6">
              A brief product description can go here — beautiful, minimal, and aligned
              with Eithermall’s modern layout.
            </p>

            <button onClick={() => onAddToCart(product)} className="brand-btn w-full">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
