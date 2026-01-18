'use client';

import React, { useMemo, useState } from 'react';

type Packaging = {
  name: string;
  piecesPerUnit: number;
  price?: number;
  minQty?: number;
  qtyStep?: number;
  maxQty?: number;
  defaultForSale?: boolean;
  sellable?: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  packagingOptions?: Packaging[]; // from product
  fallbackPrice?: number; // product.price fallback (per base piece or per unit depending on your model)
  onAdd: (payload: {
    unitName: string;
    qty: number;
    unitPrice: number;
    piecesPerUnit: number;
  }) => void;
};

export default function UomModal({
  open,
  onClose,
  packagingOptions = [],
  fallbackPrice = 0,
  onAdd,
}: Props) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [qty, setQty] = useState<number>(1);

  React.useEffect(() => {
    if (!open) {
      setSelectedIdx(null);
      setQty(1);
    } else {
      // try pick defaultForSale or first sellable
      const idx =
        packagingOptions.findIndex(p => p.defaultForSale) >= 0
          ? packagingOptions.findIndex(p => p.defaultForSale)
          : packagingOptions.findIndex(p => p.sellable);
      setSelectedIdx(idx >= 0 ? idx : packagingOptions.length ? 0 : null);
    }
  }, [open, packagingOptions]);

  const selected = selectedIdx === null ? null : packagingOptions[selectedIdx] || null;

  const unitPrice = useMemo(() => {
    if (!selected) return fallbackPrice || 0;
    // if packaging option has explicit price use it; else fallback scaling from price per piece if provided.
    if (selected.price && Number.isFinite(selected.price)) return selected.price;
    // fallback: assume fallbackPrice is price per piece, multiply by piecesPerUnit
    return Number(fallbackPrice || 0) * (selected.piecesPerUnit || 1);
  }, [selected, fallbackPrice]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div onClick={onClose} className="absolute inset-0 bg-black/60" />
      <div className="relative w-full md:max-w-2xl bg-white rounded-t-xl md:rounded-xl shadow-2xl overflow-hidden p-6 z-10">
        <h3 className="text-lg font-bold mb-4">Choose packaging & quantity</h3>

        <label className="block mb-2">Unit</label>
        <select
          value={selectedIdx ?? ''}
          onChange={e =>
            setSelectedIdx(e.target.value === '' ? null : Number(e.target.value))
          }
          className="w-full border p-2 rounded mb-4"
        >
          <option value="">Select unit</option>
          {packagingOptions.map((p, i) => (
            <option key={i} value={i}>
              {p.name} — {p.piecesPerUnit} pcs{p.price ? ` — KSh ${p.price}` : ''}
            </option>
          ))}
        </select>

        <div className="mb-4">
          <label className="block mb-2">Quantity (units)</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQty(q => Math.max(1, q - 1))}
              className="px-3 py-1 border rounded"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={e => {
                const v = Number(e.target.value || 1);
                if (!Number.isFinite(v) || v < 1) return;
                setQty(Math.floor(v));
              }}
              className="w-20 text-center border p-1 rounded"
            />
            <button
              type="button"
              onClick={() => setQty(q => q + 1)}
              className="px-3 py-1 border rounded"
            >
              +
            </button>

            <div className="ml-auto font-semibold">
              Unit price: KSh {unitPrice.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button
            onClick={() => {
              if (!selected) {
                alert('Please choose a unit.');
                return;
              }
              onAdd({
                unitName: selected.name,
                qty,
                unitPrice,
                piecesPerUnit: selected.piecesPerUnit,
              });
              onClose();
            }}
            className="px-4 py-2 rounded bg-black text-white"
          >
            Add {qty} × {selected ? selected.name : 'unit'} (KSh{' '}
            {(unitPrice * qty).toLocaleString()})
          </button>
        </div>
      </div>
    </div>
  );
}
