import React from 'react';

type Product = {
  _id?: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div
      style={{
        border: '1px solid #e6e6e6',
        padding: 12,
        borderRadius: 8,
        width: 260,
        transition: 'transform .14s ease, box-shadow .14s ease',
      }}
      className="product-card"
    >
      <div
        style={{
          height: 160,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <img
          src={product.image || '/placeholder.png'}
          alt={product.name}
          style={{ width: '100%', objectFit: 'cover' }}
        />
      </div>
      <h3 style={{ margin: '8px 0' }}>{product.name}</h3>
      <p style={{ margin: 0, color: '#666' }}>{product.description ?? ''}</p>
      <div
        style={{
          marginTop: 8,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <strong style={{ color: '#072146' }}>Ksh {product.price}</strong>
        <button
          style={{
            background: '#FFA500',
            border: 'none',
            padding: '6px 10px',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          Buy
        </button>
      </div>
    </div>
  );
}
