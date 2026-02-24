import { api } from './client';

export interface ByCategoryItem {
  categoryId: string;
  categoryName: string;
  total: number;
}

export interface Summary {
  totalSpend: number;
  count: number;
  byCategory: ByCategoryItem[];
}

export function getSummary(month: string) {
  return api.get<Summary>('/summary', { params: { month } });
}
