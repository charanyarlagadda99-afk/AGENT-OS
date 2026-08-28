import { supabase } from './supabase';

const getBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  }
  return '/api';
};

const API_BASE = getBaseUrl();

export const api = {
  async fetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const { data: { session } } = await supabase.auth.getSession();
    const headers = new Headers(options.headers);

    if (session?.access_token) {
      headers.set('Authorization', `Bearer ${session.access_token}`);
    }
    headers.set('Content-Type', 'application/json');

    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  get<T>(path: string) { return this.fetch<T>(path); },
  post<T>(path: string, body: any) { return this.fetch<T>(path, { method: 'POST', body: JSON.stringify(body) }); },
  patch<T>(path: string, body: any) { return this.fetch<T>(path, { method: 'PATCH', body: JSON.stringify(body) }); },
  delete<T>(path: string) { return this.fetch<T>(path, { method: 'DELETE' }); }
};
