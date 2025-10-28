'use client';
import IconWrapper from './IconWrapper';

export default function WishlistIcon() {
  return (
    <IconWrapper>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        viewBox="0 0 24 24"
        className="text-[var(--foreground)]"
      >
        <path d="M12 21s-6-4.35-9-9.17C-1.72 6.42 2.4 2 6.64 4.05 8.29 4.86 10 7.18 12 9.4c2-2.22 3.72-4.54 5.36-5.35C21.6 2 25.72 6.42 21 11.83 18 16.65 12 21 12 21z" />
      </svg>
    </IconWrapper>
  );
}
