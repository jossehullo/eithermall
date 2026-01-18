// client/src/components/products/FlashProductCard.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

type FlashProduct = {
  _id: string;
  name: string;
  price: number;
  originalPrice: number; // Required for the flash sale look
  stock: number;
  image: string;
};

export default function FlashProductCard({ product }: { product: FlashProduct }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const isSoldOut = product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card navigation
    if (isSoldOut) return;

    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      qty: 1,
      image: product.image,
    });
    alert(`${product.name} added to cart`);
  };

  return (
    <div
      key={product._id}
      className="rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
      onClick={() => router.push(`/products/${product._id}`)}
    >
      {/* PRODUCT IMAGE */}
      <div className="w-full h-40 sm:h-48 bg-gray-100 overflow-hidden flex items-center justify-center">
        <img
          src={`http://localhost:5000/uploads/${product.image}`}
          alt={product.name}
          className="object-contain w-full h-full p-2"
          onError={e => ((e.target as HTMLImageElement).src = '/fallback.jpg')}
        />
      </div>

      {/* PRODUCT INFO */}
      <div className="p-3">
        <h2 className="text-sm font-normal h-10 overflow-hidden text-gray-700 hover:text-red-600 transition-colors">
          {product.name}
        </h2>

        {/* Price Block */}
        <div className="mt-2">
          <p className="font-bold text-lg text-red-600">
            KSh {product.price.toLocaleString()}
          </p>
          {/* Original Price (Strikethrough) */}
          {product.originalPrice && (
            <p className="text-xs text-gray-400 line-through">
              KSh {product.originalPrice.toLocaleString()}
            </p>
          )}
        </div>

        {/* Sold Out Bar (Kilimall style) */}
        <div
          className={`
            mt-3 text-center py-1 rounded-md text-sm font-semibold transition-opacity duration-500
            ${isSoldOut ? 'bg-red-100 text-red-600 opacity-100' : 'opacity-0'}
          `}
        >
          {isSoldOut ? 'Sold Out' : '---'}
        </div>

        <div className="mt-3">
          <button
            onClick={handleAddToCart}
            disabled={isSoldOut}
            className={`
                    w-full py-2 text-white rounded-md text-sm font-semibold transition-colors
                    ${
                      isSoldOut
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700'
                    }
                `}
          >
            {isSoldOut ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
