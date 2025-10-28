'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navigation/Navbar';

export default function ProductsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products`);
        const data = await res.json();

        if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          throw new Error('Products array missing in response');
        }
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (authLoading || fetchLoading)
    return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  const handleViewProduct = (id: string) => {
    if (!user) {
      router.push(`/login?redirect=/products/${id}`);
      return;
    }
    router.push(`/products/${id}`);
  };

  return (
    <div className="min-h-screen bg-white animate-fadeIn">
      <Navbar />
      <h1 className="text-3xl font-bold text-center mt-6 mb-6">Explore Our Products</h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-6">
        {products.map(p => (
          <div
            key={p._id}
            className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition cursor-pointer"
            onClick={() => handleViewProduct(p._id)}
          >
            <h3 className="font-semibold text-lg">{p.name}</h3>
            <p className="opacity-75">KES {p.price}</p>
            <p className="text-sm opacity-60">Stock: {p.stock}</p>
          </div>
        ))}
      </div>

      {!user && (
        <p className="text-center mt-10 text-sm">
          Login to add to cart or explore full details
        </p>
      )}
    </div>
  );
}
