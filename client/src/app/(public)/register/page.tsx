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

    const cleanPhone = phone.replace(/\s+/g, '');
    await register(username, email, password, cleanPhone);

    router.push('/login');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, '');

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

  const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedText = e.clipboardData.getData('text').replace(/\D/g, '');
    let input = pastedText;

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
      <div className="max-w-md w-full p-8 rounded-2xl shadow-2xl bg-white text-gray-900">
        <h1 className="text-3xl font-bold mb-2">Create an Account</h1>

        <p className="text-gray-600 mb-8">Join the Eithermall experience today</p>

        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none"
            required
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={handlePhoneChange}
            onPaste={handlePhonePaste}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none"
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-semibold transition-all duration-300"
          >
            Register
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-600 text-center">
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
