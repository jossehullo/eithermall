'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ProductsPage() {
  const [products] = useState([
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 45,
      image: '/images/headphones.jpg',
      description: 'High quality audio for music lovers',
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 75,
      image: '/images/watch.jpg',
      description: 'Stay connected on the go',
    },
    {
      id: 3,
      name: 'Bluetooth Speaker',
      price: 60,
      image: '/images/speaker.jpg',
      description: 'Feel the bass anywhere',
    },
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Explore Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition group"
          >
            <Link href={`/product/${product.id}`}>
              <img
                src={product.image}
                alt={product.name}
                className="rounded-t-xl w-full h-48 object-cover group-hover:scale-105 transition"
              />
            </Link>

            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
              <p className="text-gray-600">${product.price}</p>

              <button className="mt-3 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
