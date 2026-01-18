'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';

export default function CartPage() {
  const { cartItems, incrementQty, decrementQty, removeItem } = useCart();

  const router = useRouter();
  const { showToast } = useToast();

  /* =============================
     TOTAL PRICE
  ============================= */
  const total = cartItems.reduce((sum, item) => {
    return sum + item.unitPrice * item.qty;
  }, 0);

  return (
    <div style={{ padding: '20px 30px' }}>
      <h1 style={{ fontSize: 32, fontWeight: 800 }}>Your Cart</h1>

      <button
        onClick={() => router.push('/products')}
        style={{
          margin: '15px 0',
          padding: '8px 14px',
          background: '#eee',
          borderRadius: 8,
        }}
      >
        ← Back to Shop
      </button>

      {cartItems.length === 0 && (
        <p style={{ marginTop: 30, fontSize: 18 }}>Your cart is empty.</p>
      )}

      {cartItems.map(item => {
        const maxQty = item.stock
          ? Math.floor(item.stock / item.piecesPerUnit)
          : Infinity;

        const isMaxed = item.qty >= maxQty;

        return (
          <div
            key={`${item._id}_${item.unitName}`}
            style={{
              background: '#fff',
              padding: 16,
              borderRadius: 12,
              marginBottom: 20,
              display: 'flex',
              gap: 20,
              alignItems: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
          >
            <img
              src={item.image || '/images/placeholder.png'}
              alt={item.name}
              style={{
                width: 80,
                height: 80,
                borderRadius: 8,
                objectFit: 'cover',
              }}
            />

            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: 4 }}>
                {item.name} ({item.unitName})
              </h3>

              <div style={{ fontSize: 16 }}>KSh {item.unitPrice.toLocaleString()}</div>

              <div
                style={{
                  marginTop: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <button onClick={() => decrementQty(item._id, item.unitName)}>−</button>

                <div>{item.qty}</div>

                <button
                  onClick={() => incrementQty(item._id, item.unitName)}
                  disabled={isMaxed}
                  style={{
                    opacity: isMaxed ? 0.4 : 1,
                    cursor: isMaxed ? 'not-allowed' : 'pointer',
                  }}
                >
                  +
                </button>
              </div>

              {isMaxed && (
                <div style={{ fontSize: 13, color: '#c92a2a', marginTop: 4 }}>
                  Max stock reached
                </div>
              )}
            </div>

            <button
              style={{
                background: '#ff4d4d',
                padding: '8px 12px',
                color: '#fff',
                borderRadius: 6,
              }}
              onClick={() => {
                removeItem(item._id, item.unitName);
                showToast('Item removed from cart');
              }}
            >
              Remove
            </button>
          </div>
        );
      })}

      {/* TOTAL */}
      {cartItems.length > 0 && (
        <>
          <h2 style={{ marginTop: 20 }}>Total: KSh {total.toLocaleString()}</h2>

          <button
            onClick={() => router.push('/checkout')}
            style={{
              marginTop: 20,
              padding: '14px 22px',
              background: '#0a0',
              color: '#fff',
              fontWeight: 700,
              fontSize: 18,
              borderRadius: 10,
            }}
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}
