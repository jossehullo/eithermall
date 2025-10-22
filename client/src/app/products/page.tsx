'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data.products || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product: any) => {
    if (!user) {
      alert('Please log in to add items to your cart.');
      return;
    }
    alert(`🛒 Added "${product.name}" to cart (not functional yet)`);
  };

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">🛍️ Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((p: any) => (
            <div
              key={p._id}
              className="border rounded-xl p-4 shadow-md hover:shadow-lg flex flex-col"
            >
              <img
                src={p.image || 'https://via.placeholder.com/300x300?text=No+Image'}
                alt={p.name}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h2 className="text-xl font-semibold">{p.name}</h2>
              <p className="text-gray-600 text-sm flex-grow">{p.description}</p>
              <p className="text-lg font-bold mt-2 mb-3">KES {p.price}</p>

              <button
                onClick={() => handleAddToCart(p)}
                className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
              >
                🛒 Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </main>
  );
}
