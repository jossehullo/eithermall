'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { useAuth } from './AuthContext';

export type CartItem = {
  _id: string;
  name: string;
  qty: number;
  unitName: string;
  piecesPerUnit: number;
  unitPrice: number;
  image?: string | null;
  stock?: number; // product stock
};

interface CartContextType {
  cartItems: CartItem[];
  totalItems: number; // 🔹 DISTINCT LINES
  addToCart: (item: CartItem) => void;
  incrementQty: (id: string, unitName: string) => void;
  decrementQty: (id: string, unitName: string) => void;
  removeItem: (id: string, unitName: string) => void;
  clearCart: () => void;
  canIncrement: (item: CartItem) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const cartKey = useMemo(
    () => (user?.id ? `cart_user_${user.id}` : 'cart_guest'),
    [user]
  );

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  /* ================= LOAD CART ================= */
  useEffect(() => {
    const stored = localStorage.getItem(cartKey);
    setCartItems(stored ? JSON.parse(stored) : []);
  }, [cartKey]);

  /* ================= SAVE CART ================= */
  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems, cartKey]);

  /* ================= HELPERS ================= */
  function maxQty(item: CartItem) {
    if (!item.stock || item.stock <= 0) return 0;
    return Math.floor(item.stock / item.piecesPerUnit);
  }

  function canIncrement(item: CartItem) {
    return item.qty < maxQty(item);
  }

  /* ================= ACTIONS ================= */
  function addToCart(item: CartItem) {
    if (maxQty(item) === 0) return; // 🔒 OUT OF STOCK

    setCartItems(prev => {
      const existing = prev.find(i => i._id === item._id && i.unitName === item.unitName);

      if (!existing) {
        return [...prev, { ...item, qty: Math.min(item.qty, maxQty(item)) }];
      }

      if (!canIncrement(existing)) return prev;

      return prev.map(i => (i === existing ? { ...i, qty: i.qty + item.qty } : i));
    });
  }

  function incrementQty(id: string, unitName: string) {
    setCartItems(prev =>
      prev.map(item => {
        if (item._id !== id || item.unitName !== unitName) return item;
        if (!canIncrement(item)) return item;
        return { ...item, qty: item.qty + 1 };
      })
    );
  }

  function decrementQty(id: string, unitName: string) {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item._id !== id || item.unitName !== unitName) return item;
          return { ...item, qty: item.qty - 1 };
        })
        .filter(item => item.qty > 0)
    );
  }

  function removeItem(id: string, unitName: string) {
    setCartItems(prev => prev.filter(i => !(i._id === id && i.unitName === unitName)));
  }

  function clearCart() {
    setCartItems([]);
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems: cartItems.length, // 🔥 DISTINCT COUNT
        addToCart,
        incrementQty,
        decrementQty,
        removeItem,
        clearCart,
        canIncrement,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
