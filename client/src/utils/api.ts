// helper wrapper for fetch to include token automatically
export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('eithermall_token') : null;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init.headers || {}),
  };
  if (token) (headers as any).Authorization = `Bearer ${token}`;

  const res = await fetch(input, { ...init, headers, credentials: 'omit' });
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : null;
  if (!res.ok) {
    throw { status: res.status, data };
  }
  return data;
}
