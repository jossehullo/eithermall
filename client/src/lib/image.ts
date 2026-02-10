export function resolveImageUrl(image?: string) {
  if (!image) return '/placeholder.png';

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // If already absolute, return as-is
  if (image.startsWith('http')) return image;

  // Ensure no double slashes
  return `${API_BASE.replace(/\/$/, '')}/${image.replace(/^\//, '')}`;
}
