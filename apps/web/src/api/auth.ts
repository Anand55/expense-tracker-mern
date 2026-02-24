import { api } from './client';

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export function register(email: string, password: string) {
  return api.post<AuthResponse>('/auth/register', { email, password });
}

export function login(email: string, password: string) {
  return api.post<AuthResponse>('/auth/login', { email, password });
}

export function me() {
  return api.get<{ user: User }>('/auth/me');
}
