'use client';

import IconWrapper from './IconWrapper';

export default function LoginIcon() {
  return (
    <IconWrapper>
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
        {/* Door */}
        <path d="M4 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4z" />
        {/* Arrow */}
        <path d="M14 12h7" />
        <path d="M18 8l4 4-4 4" />
      </svg>
    </IconWrapper>
  );
}
