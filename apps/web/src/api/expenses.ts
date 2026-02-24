import { api } from './client';

export interface Expense {
  _id: string;
  userId: string;
  categoryId: string | { _id: string; name: string };
  amount: number;
  date: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListExpensesParams {
  month?: string;
  page?: number;
  limit?: number;
  categoryId?: string;
}

export interface ListExpensesResponse {
  expenses: Expense[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function getExpenses(params?: ListExpensesParams) {
  return api.get<ListExpensesResponse>('/expenses', { params });
}

export function createExpense(data: {
  amount: number;
  date: string;
  categoryId: string;
  note?: string;
}) {
  return api.post<Expense>('/expenses', data);
}

export function updateExpense(
  id: string,
  data: { amount?: number; date?: string; categoryId?: string; note?: string }
) {
  return api.put<Expense>(`/expenses/${id}`, data);
}

export function deleteExpense(id: string) {
  return api.delete(`/expenses/${id}`);
}
