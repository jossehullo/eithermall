// client/src/components/icons/IconWrapper.tsx
'use client';
import React from 'react';

type IconWrapperProps = {
  children: React.ReactNode;
  size?: number;
  className?: string;
};

export default function IconWrapper({
  children,
  size = 24,
  className = '',
}: IconWrapperProps) {
  return (
    <span
      style={{ width: size, height: size }}
      className={`inline-flex items-center justify-center transition-all duration-300 hover:scale-110 hover:opacity-80 ${className}`}
    >
      {children}
    </span>
  );
}
