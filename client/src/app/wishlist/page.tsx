'use client';
import Link from 'next/link';
import products from '@/data/products';

export default function Wishlist() {
  return (
    <div className="p-6">
      <h2 className="font-bold text-xl mb-4">Wishlist</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map(item => (
          <Link
            key={item.id}
            href={`/products/${item.id}`}
            className="bg-white dark:bg-gray-800 p-3 rounded shadow transition hover:scale-105"
          >
            <img src={item.image} className="w-full h-32 object-cover rounded" />
            <p className="font-semibold mt-2">{item.name}</p>
            <p className="text-sm opacity-70">KES {item.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
