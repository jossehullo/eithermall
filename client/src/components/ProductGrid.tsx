'use client';

import Link from 'next/link';

const dummyProducts = [
  { id: 1, name: 'Smart Watch', price: 150 },
  { id: 2, name: 'Headphones', price: 80 },
  { id: 3, name: 'Speaker', price: 120 },
];

export default function ProductGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {dummyProducts.map(product => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          className="p-5 bg-white rounded-xl shadow-md hover:shadow-xl transition border border-gray-200"
        >
          <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
          <p className="text-gray-700 font-medium">${product.price}</p>
        </Link>
      ))}
    </div>
  );
}
