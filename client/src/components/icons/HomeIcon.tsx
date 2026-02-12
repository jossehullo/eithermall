'use client';
import IconWrapper from './IconWrapper';

export default function HomeIcon({ size = 22 }: { size?: number }) {
  return (
    <IconWrapper size={size}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 10.5L12 3l9 7.5v9a1 1 0 0 1-1 1h-6v-6H10v6H4a1 1 0 0 1-1-1v-9z"
        />
      </svg>
    </IconWrapper>
  );
}
