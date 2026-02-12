'use client';

import React from 'react';

type IconWrapperProps = {
  children: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  size?: number;
  className?: string;
};

export default function IconWrapper({
  children,
  size = 20,
  className = '',
}: IconWrapperProps) {
  return (
    <span
      className={`inline-flex items-center justify-center transition-all duration-200 hover:scale-110 ${className}`}
    >
      {React.cloneElement(children, {
        width: size,
        height: size,
        stroke: 'currentColor',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      })}
    </span>
  );
}
