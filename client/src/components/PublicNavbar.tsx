'use client';
import Link from 'next/link';

const PublicNavbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-black text-white px-6 py-3 flex justify-between items-center z-50 shadow-lg">
      <Link href="/" className="font-bold text-xl">
        EitherMall
      </Link>

      <div className="flex gap-6">
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
      </div>
    </nav>
  );
};

export default PublicNavbar;
