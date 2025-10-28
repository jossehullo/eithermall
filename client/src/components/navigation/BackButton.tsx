// client/src/components/navigation/BackButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

export default function BackButton({ className = '' }: { className?: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      aria-label="Go back"
      className={
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition shadow-sm ' +
        'border border-transparent hover:brightness-95 ' +
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ' +
        className
      }
    >
      ← Back
    </button>
  );
}
