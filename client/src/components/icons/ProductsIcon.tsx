'use client';
import IconWrapper from './IconWrapper';

export default function ProductsIcon({ size = 22 }: { size?: number }) {
  return (
    <IconWrapper size={size}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 2l1.5 4h9L18 2M3 6h18l-1.5 14h-15L3 6z"
        />
      </svg>
    </IconWrapper>
  );
}
