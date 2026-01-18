// client/src/app/(private)/layout.tsx
'use client';

import React from 'react';

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* This layout only adds top padding for pages that live under (private) */}
      <main className="pt-[76px]">{children}</main>
    </>
  );
}
