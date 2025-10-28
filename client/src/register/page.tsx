'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

export default function RegisterPage() {
  const { login } = useAuth(); // Reuse login to set token/user post-registration
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      });
      if (data?.token) {
        // Automatically log in after registration
        await login(email, password); // Reuse login logic to set token/user
        router.push('/products'); // Redirect to products page
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 animate-fadeIn">
      <div className="w-full max-w-md p-6 bg-gray-50 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-brand-navy">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-navy">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-2 border border-brand-navy rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gradient-from"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-navy">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2 border border-brand-navy rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gradient-from"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-navy">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-2 border border-brand-navy rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gradient-from"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full brand-btn text-brand-foreground disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <p className="text-sm text-brand-navy">
            Already have an account?{' '}
            <a href="/login" className="brand-accent hover:underline">
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
