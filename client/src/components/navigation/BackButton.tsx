'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-[#ffdb4d] to-[#ffb347] 
                 text-[#081028] font-bold py-3 px-6 rounded-full shadow-lg
                 hover:shadow-[0_0_20px_rgba(255,180,40,0.4)]
                 transition-transform hover:-translate-y-1"
    >
      <ArrowLeft className="inline-block w-5 h-5 mr-2" />
      Back
    </button>
  );
}
