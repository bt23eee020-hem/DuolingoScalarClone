const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('duolingo_token') : null;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errMsg = 'API Request Failed';
    try {
      const errData = await response.json();
      if (typeof errData.detail === 'string') {
        errMsg = errData.detail;
      } else if (Array.isArray(errData.detail)) {
        errMsg = errData.detail.map((e: any) => e.msg || JSON.stringify(e)).join(', ');
      } else if (errData.detail) {
        errMsg = JSON.stringify(errData.detail);
      }
    } catch {
      // ignore
    }
    throw new Error(errMsg);
  }

  return response.json() as Promise<T>;
}
