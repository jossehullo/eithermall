'use client';
import IconWrapper from './IconWrapper';

export default function CartIcon({ size = 22 }: { size?: number }) {
  return (
    <IconWrapper size={size}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="9" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l2.5 13h11l2-9H6" />
      </svg>
    </IconWrapper>
  );
}
