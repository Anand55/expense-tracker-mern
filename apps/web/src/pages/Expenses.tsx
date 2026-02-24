import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../api/expenses';
import { getCategories } from '../api/categories';
import { getCurrentMonth, monthOptions } from '../utils/month';
import { ExpenseFormModal } from '../components/expenses/ExpenseFormModal';
import { ExpenseTable } from '../components/expenses/ExpenseTable';
import { Loading } from '../components/common/Loading';
import { ErrorState } from '../components/common/ErrorState';
import type { Expense } from '../api/expenses';

export function Expenses() {
  const [month, setMonth] = useState(getCurrentMonth());
  const [categoryId, setCategoryId] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories().then((r) => r.data),
  });
  const expensesQuery = useQuery({
    queryKey: ['expenses', month, 1, 20, categoryId || undefined],
    queryFn: () =>
      getExpenses({
        month,
        page: 1,
        limit: 20,
        ...(categoryId ? { categoryId } : {}),
      }).then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: { amount: number; date: string; categoryId: string; note?: string }) =>
      createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { amount?: number; date?: string; categoryId?: string; note?: string };
    }) => updateExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      setEditing(null);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
  });

  const categories = categoriesQuery.data ?? [];
  const expensesData = expensesQuery.data;

  const handleSubmit = (data: {
    amount: number;
    date: string;
    categoryId: string;
    note?: string;
  }) => {
    if (editing) {
      updateMutation.mutate({
        id: editing._id,
        data: {
          amount: data.amount,
          date: data.date,
          categoryId: data.categoryId,
          note: data.note,
        },
      });
    } else {
      createMutation.mutate(data);
    }
    setModalOpen(false);
    setEditing(null);
  };

  const openEdit = (expense: Expense) => {
    setEditing(expense);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  if (categoriesQuery.isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="mt-1 text-sm text-gray-600">Manage and track all your expenses</p>
        </div>
        <button
          type="button"
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Expense
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="label">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="input"
              >
                {monthOptions().map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="label">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="input"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            {(month !== getCurrentMonth() || categoryId) && (
              <button
                type="button"
                onClick={() => { setMonth(getCurrentMonth()); setCategoryId(''); }}
                className="btn btn-secondary text-sm"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {expensesQuery.isLoading && !expensesData && <Loading />}
      {expensesQuery.isError && (
        <ErrorState
          message={expensesQuery.error instanceof Error ? expensesQuery.error.message : 'Failed to load expenses'}
          onRetry={() => expensesQuery.refetch()}
        />
      )}
      {expensesData && (
        <ExpenseTable
          expenses={expensesData.expenses}
          onEdit={openEdit}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      )}

      <ExpenseFormModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        categories={categories}
        edit={editing}
      />
    </div>
  );
}
