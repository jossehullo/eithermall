export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL ?? '';

if (!API_BASE_URL) {
  console.error('❌ API base URL is missing');
}
