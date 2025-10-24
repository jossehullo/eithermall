'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ProductDetails() {
  const { id } = useParams();

  return (
    <div>
      <Link href="/products" className="text-blue-600 hover:underline">
        ← Back to Products
      </Link>

      <h1 className="text-3xl font-bold mt-4">Product {id}</h1>
      <p className="text-gray-700 mt-2">
        Detailed description for this product will appear here...
      </p>
    </div>
  );
}
