'use client';
import IconWrapper from './IconWrapper';

export default function CartIcon() {
  return (
    <IconWrapper>
      <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l3.6 7.59c.2.41.61.68 1.06.68H19a1 1 0 0 0 .96-.74L23 6H6" />
      </svg>
    </IconWrapper>
  );
}
