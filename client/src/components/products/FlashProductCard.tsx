'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

type FlashProduct = {
  _id: string;
  name: string;
  price: number;
  originalPrice: number;
  stock: number;
  image: string;
};

export default function FlashProductCard({ product }: { product: FlashProduct }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const isSoldOut = product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSoldOut) return;

    addToCart({
      _id: product._id,
      name: product.name,

      // ✅ REQUIRED BY CartItem
      unitName: 'Piece',
      piecesPerUnit: 1,
      unitPrice: product.price,

      qty: 1,
      image: product.image,
      stock: product.stock,
    });
  };

  return (
    <div
      className="rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
      onClick={() => router.push(`/products/${product._id}`)}
    >
      <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
        <img
          src={`http://localhost:5000/uploads/${product.image}`}
          alt={product.name}
          className="object-contain h-full"
        />
      </div>

      <div className="p-3">
        <h2 className="text-sm text-gray-700">{product.name}</h2>

        <p className="font-bold text-red-600 mt-1">
          KSh {product.price.toLocaleString()}
        </p>

        {product.originalPrice && (
          <p className="text-xs line-through text-gray-400">
            KSh {product.originalPrice.toLocaleString()}
          </p>
        )}

        <button
          onClick={handleAddToCart}
          disabled={isSoldOut}
          className={`mt-3 w-full py-2 rounded-md text-white ${
            isSoldOut ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {isSoldOut ? 'Sold Out' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
