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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">Expenses</h1>
        <button
          type="button"
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add expense
        </button>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            {monthOptions().map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 min-w-[140px]"
          >
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
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
