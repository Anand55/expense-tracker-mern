import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/categories';
import { CategoryFormModal } from '../components/categories/CategoryFormModal';
import { Loading } from '../components/common/Loading';
import { ErrorState } from '../components/common/ErrorState';
import type { ApiError } from '../api/client';
import type { Category } from '../api/categories';

export function Categories() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories().then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => createCategory(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    onError: (err: unknown) => {
      const ax = err as { response?: { data?: ApiError } };
      setError(ax.response?.data?.error?.message ?? 'Failed to create');
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateCategory(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditing(null);
    },
    onError: (err: unknown) => {
      const ax = err as { response?: { data?: ApiError } };
      setError(ax.response?.data?.error?.message ?? 'Failed to update');
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    onError: (err: unknown) => {
      const ax = err as { response?: { data?: ApiError } };
      setError(ax.response?.data?.error?.message ?? 'Failed to delete');
    },
  });

  const categories = categoriesQuery.data ?? [];

  const handleSubmit = (name: string) => {
    setError('');
    if (editing) {
      updateMutation.mutate({ id: editing._id, name });
    } else {
      createMutation.mutate(name);
    }
    setModalOpen(false);
    setEditing(null);
  };

  if (categoriesQuery.isLoading) return <Loading />;
  if (categoriesQuery.isError)
    return (
      <ErrorState
        message={categoriesQuery.error instanceof Error ? categoriesQuery.error.message : 'Failed to load categories'}
        onRetry={() => categoriesQuery.refetch()}
      />
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">Categories</h1>
        <button
          type="button"
          onClick={() => { setError(''); setEditing(null); setModalOpen(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add category
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {categories.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">No categories yet. Add one to get started.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {categories.map((c) => (
              <li
                key={c._id}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
              >
                <span className="font-medium text-gray-800">{c.name}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setEditing(c); setModalOpen(true); setError(''); }}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Rename
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(c._id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <CategoryFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); setError(''); }}
        onSubmit={handleSubmit}
        edit={editing}
      />
    </div>
  );
}
