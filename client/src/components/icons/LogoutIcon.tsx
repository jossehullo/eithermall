'use client';
import IconWrapper from './IconWrapper';

export default function LogoutIcon({ size = 22 }: { size?: number }) {
  return (
    <IconWrapper size={size}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 17l5-5-5-5M21 12H9" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 5v-2H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h9v-2"
        />
      </svg>
    </IconWrapper>
  );
}
