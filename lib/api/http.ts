// lib/api/http.ts
import axios, {
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from 'axios';

export const BASE_URL =
  process.env.NEXT_PUBLIC_NOTEHUB_API_URL ??
  'https://notehub-public.goit.study/api';

export const API = axios.create({
  baseURL: BASE_URL,
  headers: { Accept: 'application/json' },
});

API.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token =
    process.env.NEXT_PUBLIC_NOTEHUB_TOKEN ?? process.env.NOTEHUB_TOKEN;

  if (token) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set('Authorization', `Bearer ${token}`);
    config.headers = headers;
  }

  return config;
});
