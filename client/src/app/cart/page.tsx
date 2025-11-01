'use client';

import BackButton from '@/components/navigation/BackButton';
import { useState } from 'react';

export default function CartPage() {
  const [cartItems] = useState([
    { id: 1, name: 'Wireless Headphones', price: 45, quantity: 1 },
    { id: 2, name: 'Smart Watch', price: 75, quantity: 2 },
  ]);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Cart</h1>
        <BackButton />
      </div>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map(item => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white/90 p-4 rounded-xl shadow-sm"
            >
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-gray-600">
                  ${item.price} × {item.quantity}
                </p>
              </div>
              <p className="text-lg font-semibold">${item.price * item.quantity}</p>
            </div>
          ))}
          <div className="flex justify-between items-center mt-6 border-t pt-4 font-bold text-lg">
            <span>Total:</span>
            <span>${total}</span>
          </div>
          <button className="w-full mt-4 bg-gradient-to-r from-[var(--brand-gradient-from)] to-[var(--brand-gradient-to)] text-white py-3 rounded-xl hover:opacity-90 transition-all duration-200">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
