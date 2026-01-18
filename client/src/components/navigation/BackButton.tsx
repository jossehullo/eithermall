'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="mt-16 ml-4 px-4 py-2 bg-white text-black rounded shadow flex items-center gap-2 hover:bg-gray-100"
    >
      <ArrowLeft size={18} />
      Back
    </button>
  );
}
