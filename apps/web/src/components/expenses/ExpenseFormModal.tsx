import { useEffect } from 'react';
import type { Expense } from '../../api/expenses';
import type { Category } from '../../api/categories';

interface ExpenseFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { amount: number; date: string; categoryId: string; note?: string }) => void;
  categories: Category[];
  edit?: Expense | null;
}

export function ExpenseFormModal({
  open,
  onClose,
  onSubmit,
  categories,
  edit,
}: ExpenseFormModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const amount = parseFloat((form.elements.namedItem('amount') as HTMLInputElement).value);
    const date = (form.elements.namedItem('date') as HTMLInputElement).value;
    const categoryId = (form.elements.namedItem('categoryId') as HTMLSelectElement).value;
    const note = (form.elements.namedItem('note') as HTMLInputElement).value.trim() || undefined;
    if (!date || !categoryId || Number.isNaN(amount) || amount <= 0) return;
    onSubmit({ amount, date, categoryId, note });
    form.reset();
    onClose();
  };

  const defaultDate = edit
    ? new Date(edit.date).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {edit ? 'Edit expense' : 'Add expense'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              required
              defaultValue={edit?.amount}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              required
              defaultValue={defaultDate}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              required
              defaultValue={edit ? (typeof edit.categoryId === 'object' ? edit.categoryId._id : edit.categoryId) : ''}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
              Note (optional)
            </label>
            <input
              id="note"
              name="note"
              type="text"
              defaultValue={edit?.note}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {edit ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
