'use client';
import PublicNavbar from './PublicNavbar';
import AdminNavbar from './AdminNavbar';
import UserNavbar from './UserNavbar';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();

  if (!user) return <PublicNavbar />;
  if (user.role === 'admin') return <AdminNavbar />;
  return <UserNavbar />;
}
