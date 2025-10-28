'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Home,
  ShoppingCart,
  Heart,
  Package,
  User,
  LogOut,
  LogIn,
  UserPlus,
} from 'lucide-react';

/**
 * Navbar component (top-right)
 * - Logged out: Login, Register, Cart
 * - Logged in: My Account, Orders, Wishlist, Cart, Logout
 *
 * Icons: navy/black outline, labels are pale-orange per theme.
 */

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    // send user to public home / products page
    router.push('/');
  };

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-items">
        {/* If logged in show account links */}
        {user ? (
          <>
            <Link href="/profile" className="nav-item" aria-label="My Account">
              <User />
              <span className="label">My Account</span>
            </Link>

            <Link href="/orders" className="nav-item" aria-label="Orders">
              <Package />
              <span className="label">Orders</span>
            </Link>

            <Link href="/wishlist" className="nav-item" aria-label="Wishlist">
              <Heart />
              <span className="label">Wishlist</span>
            </Link>

            <Link href="/cart" className="nav-item" aria-label="Cart">
              <ShoppingCart />
              <span className="label">Cart</span>
            </Link>

            <button
              onClick={handleLogout}
              className="nav-item"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut />
              <span className="label">Logout</span>
            </button>
          </>
        ) : (
          /* Logged out */
          <>
            <Link href="/login" className="nav-item" aria-label="Login">
              <LogIn />
              <span className="label">Login</span>
            </Link>

            <Link href="/register" className="nav-item" aria-label="Register">
              <UserPlus />
              <span className="label">Register</span>
            </Link>

            <Link href="/cart" className="nav-item" aria-label="Cart">
              <ShoppingCart />
              <span className="label">Cart</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
