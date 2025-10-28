'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/products';

  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      await login(email, password);
      router.push(redirectTo);
    } catch (error: any) {
      setErrorMessage('Invalid email or password.');
      console.error('Login error:', error);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '1rem',
      }}
      className="animate-fadeIn"
    >
      <form
        onSubmit={handleLogin}
        style={{
          background: 'var(--background)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '2rem',
          borderRadius: '0.75rem',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1.2rem' }}>Login to Continue</h2>

        {errorMessage && (
          <p style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
            {errorMessage}
          </p>
        )}

        <label style={{ fontSize: '0.9rem' }}>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid #ccc',
            marginBottom: '1rem',
          }}
          placeholder="Enter your email"
        />

        <label style={{ fontSize: '0.9rem' }}>Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid #ccc',
            marginBottom: '1.2rem',
          }}
          placeholder="Enter password"
        />

        <button className="brand-btn" style={{ width: '100%' }}>
          Login
        </button>

        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Don't have an account?{' '}
          <a href="/register" style={{ color: 'var(--brand-accent)' }}>
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
