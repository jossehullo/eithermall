'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 text-center max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to Eithermall</h1>

        <p className="mt-6 text-lg text-gray-600">
          Discover amazing products at unbeatable prices.
        </p>

        <p className="mt-4 text-gray-500">
          Create an account to enjoy faster checkout, order tracking, and exclusive offers
          — or jump straight in and start shopping now.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-8">
          <button
            onClick={() => router.push('/login')}
            className="px-10 py-4 bg-white text-blue-600 font-semibold text-lg rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Login
          </button>

          <button
            onClick={() => router.push('/register')}
            className="px-10 py-4 bg-white text-blue-600 font-semibold text-lg rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Register
          </button>

          <button
            onClick={() => router.push('/products')}
            className="px-12 py-4 bg-orange-500 text-white font-semibold text-lg rounded-xl shadow-md hover:bg-orange-600 hover:scale-105 transition-all duration-200"
          >
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
}
