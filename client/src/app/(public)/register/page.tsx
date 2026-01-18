'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Remove spaces before submitting
    const cleanPhone = phone.replace(/\s+/g, '');

    await register(username, email, password, cleanPhone);
    router.push('/login');
  };

  // Phone number formatter for Kenya (+254 7xx xxx xxx)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, ''); // remove non-digits
    if (input.startsWith('0')) input = '254' + input.slice(1);
    if (!input.startsWith('254')) input = '254' + input;
    if (input.length > 12) input = input.slice(0, 12);

    const formatted =
      '+' +
      input.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,3}).*/, (_, a, b, c, d) =>
        d ? `${a} ${b} ${c} ${d}` : `${a} ${b} ${c}`
      );

    setPhone(formatted);
  };

  return (
    <div className="page-bg flex items-center justify-center min-h-screen p-6">
      <div className="hero-card-glow max-w-md w-full p-8 rounded-2xl text-center shadow-2xl animate-slideIn">
        <h1 className="text-3xl font-bold gold-accent mb-6">Create an Account</h1>
        <p className="text-white/80 mb-8">Join the Eithermall experience today</p>

        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={handlePhoneChange}
            onPaste={handlePhoneChange}
            className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />

          <button type="submit" className="gold-btn w-full py-3 font-semibold text-lg">
            Register
          </button>
        </form>

        <div className="mt-6 text-sm text-white/70 flex flex-col items-center">
          <p>Already have an account?</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-2 px-6 py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition-all duration-300"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
