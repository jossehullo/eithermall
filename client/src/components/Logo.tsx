// client/src/components/Logo.tsx
'use client';

import React from 'react';

export function LogoHorizontal({
  className = '',
  width = 220,
}: {
  className?: string;
  width?: number;
}) {
  return (
    <img
      src="/icons/logo-horizontal.svg"
      alt="Eithermall"
      width={width}
      className={className}
      style={{ height: 'auto' }}
    />
  );
}

export function LogoStacked({
  className = '',
  size = 120,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <img
      src="/icons/logo-stacked.svg"
      alt="Eithermall"
      width={size}
      height={size}
      className={className}
      style={{ height: 'auto' }}
    />
  );
}

export function IconOnly({
  className = '',
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <img
      src="/icons/logo-icon.svg"
      alt="Eithermall icon"
      width={size}
      height={size}
      className={className}
    />
  );
}

export default LogoHorizontal;
