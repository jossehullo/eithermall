'use client';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg 
      transition hover:scale-110 hover:bg-purple-700 neon-glow z-50"
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  );
}
