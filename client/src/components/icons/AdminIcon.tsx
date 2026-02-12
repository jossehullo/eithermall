'use client';

import IconWrapper from './IconWrapper';

export default function AdminIcon() {
  return (
    <IconWrapper>
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
        {/* Shield */}
        <path d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4z" />
        {/* Check mark */}
        <path d="M9 12l2 2 4-4" />
      </svg>
    </IconWrapper>
  );
}
