'use client';
import IconWrapper from './IconWrapper';

export default function WishlistIcon({ size = 22 }: { size?: number }) {
  return (
    <IconWrapper size={size}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.8 4.6a5 5 0 0 0-7.1 0L12 6.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21l8.8-9.3a5 5 0 0 0 0-7.1z"
        />
      </svg>
    </IconWrapper>
  );
}
