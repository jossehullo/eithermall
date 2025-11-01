'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function ProductsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts([
      {
        id: 1,
        name: 'Wireless Headphones',
        price: 129.99,
        image: '/images/headphones.jpg',
      },
      { id: 2, name: 'Smart Watch', price: 189.99, image: '/images/watch.jpg' },
      { id: 3, name: 'Gaming Laptop', price: 1299.99, image: '/images/laptop.jpg' },
      { id: 4, name: 'T-Shirt', price: 29.99, image: '/images/tshirt.jpg' },
    ]);
  }, []);

  const handleAddToCart = (id: number) => {
    alert(`Added product ${id} to cart`);
  };

  const handleBack = () => router.back();

  return (
    <div className="page-bg text-white min-h-screen flex relative">
      {/* Sidebar Navigation (Right-Aligned) */}
      <aside className="fixed top-0 right-0 h-full w-48 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] shadow-2xl flex flex-col items-center pt-20 gap-3">
        {!user ? (
          <>
            <button className="nav-btn glow-btn" onClick={() => router.push('/login')}>
              Login
            </button>
            <button className="nav-btn glow-btn" onClick={() => router.push('/register')}>
              Register
            </button>
            <button className="nav-btn glow-btn" onClick={() => router.push('/cart')}>
              Cart
            </button>
          </>
        ) : (
          <>
            <button className="nav-btn glow-btn" onClick={() => router.push('/profile')}>
              Profile
            </button>
            <button className="nav-btn glow-btn" onClick={() => router.push('/orders')}>
              Orders
            </button>
            <button className="nav-btn glow-btn" onClick={() => router.push('/wishlist')}>
              Wishlist
            </button>
            <button className="nav-btn glow-btn" onClick={() => router.push('/cart')}>
              Cart
            </button>
            <button
              className="nav-btn glow-btn text-red-400 hover:text-white"
              onClick={() => {
                logout();
                router.push('/');
              }}
            >
              Logout
            </button>
          </>
        )}
      </aside>

      {/* Floating Back Button (after login) */}
      {user && (
        <button
          onClick={handleBack}
          className="fixed bottom-5 right-6 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:scale-110 transition-all"
        >
          ←
        </button>
      )}

      {/* Main Content */}
      <main className="flex-1 p-10 pr-56">
        <h1 className="text-4xl font-extrabold mb-10 text-center text-yellow-400">
          Explore Our Collection
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-slideIn">
          {products.map(product => (
            <div
              key={product.id}
              className="product-card bg-[rgba(255,255,255,0.05)] p-5 rounded-2xl shadow-xl backdrop-blur-lg hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="relative w-full h-52 mb-4 overflow-hidden rounded-xl">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={e =>
                    ((e.target as HTMLImageElement).src = '/images/placeholder.jpg')
                  }
                />
              </div>
              <h2 className="text-lg font-semibold text-yellow-300 mb-2">
                {product.name}
              </h2>
              <p className="text-sm text-white/80 mb-4">${product.price.toFixed(2)}</p>
              <div className="flex justify-between">
                <button
                  className="gold-btn text-sm px-4 py-2"
                  onClick={() => handleAddToCart(product.id)}
                >
                  Add to Cart
                </button>
                <button className="ghost-white text-sm px-4 py-2">Quick View</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
