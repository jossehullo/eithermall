'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="page-bg text-white min-h-screen flex flex-col">
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="hero-card-glow max-w-2xl w-full p-10 rounded-2xl shadow-2xl animate-slideIn">
          <h1 className="text-5xl font-extrabold mb-4 text-center">
            Welcome to <span className="gold-accent">Eithermall</span>
          </h1>
          <p className="text-lg text-white/85 mb-8 text-center">
            Energetic, bold and unmistakable — shop products that stand out.
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/products" className="no-underline">
              <button className="gold-btn">Shop Now</button>
            </Link>
            <Link href="/login" className="no-underline">
              <button className="ghost-white">Login</button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="text-center py-6 text-white/70 text-sm">
        © {new Date().getFullYear()} Eithermall. All rights reserved.
      </footer>
    </div>
  );
}
