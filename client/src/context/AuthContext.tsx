'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  phone?: string;
  avatar?: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>; // ✅ changed
  register: (
    username: string,
    email: string,
    password: string,
    phone?: string
  ) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  /* ===================== LOGIN ===================== */
  const login = async (email: string, password: string): Promise<void> => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      if (!data.token || !data.user) {
        throw new Error('Invalid server response');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
    } catch (err: any) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      throw new Error(err.message || 'Network error. Please try again.');
    }
  };

  /* ===================== REGISTER ===================== */
  const register = async (
    username: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<AuthResponse> => {
    if (!username || !email || !password || !phone) {
      return { success: false, message: 'All fields are required' };
    }

    if (password.length < 6) {
      return {
        success: false,
        message: 'Password must be at least 6 characters',
      };
    }

    let cleanPhone = phone.replace(/[^0-9+]/g, '');

    if (cleanPhone.startsWith('0')) cleanPhone = '254' + cleanPhone.slice(1);
    if (cleanPhone.startsWith('254')) cleanPhone = '+' + cleanPhone;
    if (!cleanPhone.startsWith('+254'))
      cleanPhone = '+254' + cleanPhone.replace(/^\+?0?/, '');

    if (!/^\+254\d{9}$/.test(cleanPhone)) {
      return {
        success: false,
        message: 'Phone must be in format +254XXXXXXXXX',
      };
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
          phone: cleanPhone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data.message || 'Registration failed',
        };
      }

      return { success: true, message: 'Registration successful' };
    } catch (err) {
      console.error('Register network error:', err);
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
