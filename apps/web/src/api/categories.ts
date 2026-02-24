import { api } from './client';

export interface Category {
  _id: string;
  userId: string;
  name: string;
  createdAt: string;
}

export function getCategories() {
  return api.get<Category[]>('/categories');
}

export function createCategory(name: string) {
  return api.post<Category>('/categories', { name });
}

export function updateCategory(id: string, name: string) {
  return api.put<Category>(`/categories/${id}`, { name });
}

export function deleteCategory(id: string) {
  return api.delete(`/categories/${id}`);
}
