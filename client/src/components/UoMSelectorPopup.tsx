'use client';

import React, { useState } from 'react';

export default function UoMSelectorPopup({ product, onSelectUnit, onClose }) {
  const [selected, setSelected] = useState(null);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: 380,
          background: '#fff',
          borderRadius: 16,
          padding: 20,
        }}
      >
        <h3 style={{ marginBottom: 10, fontWeight: 700 }}>
          Choose Unit for {product.name}
        </h3>

        {product.packagingOptions?.map((opt, i) => (
          <div
            key={i}
            onClick={() => setSelected(opt)}
            style={{
              padding: 12,
              marginBottom: 10,
              borderRadius: 10,
              cursor: 'pointer',
              border: selected === opt ? '2px solid #28a745' : '1px solid #ddd',
              background: selected === opt ? '#e9f9ee' : '#fff',
            }}
          >
            <strong>{opt.name}</strong> — {opt.piecesPerUnit} pcs
            <div style={{ color: '#b12704', fontWeight: 700 }}>
              KSh {opt.price.toLocaleString()}
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 8,
              background: '#ddd',
            }}
          >
            Cancel
          </button>

          <button
            disabled={!selected}
            onClick={() => {
              onSelectUnit(product, selected);
              onClose();
            }}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 8,
              background: selected ? '#28a745' : '#999',
              color: '#fff',
              cursor: selected ? 'pointer' : 'not-allowed',
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
