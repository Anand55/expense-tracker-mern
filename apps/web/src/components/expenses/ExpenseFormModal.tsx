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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {edit ? 'Edit Expense' : 'New Expense'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="amount" className="label">
                Amount (₹)
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                required
                defaultValue={edit?.amount}
                placeholder="0.00"
                className="input"
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="date" className="label">
                Date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                required
                defaultValue={defaultDate}
                className="input"
              />
            </div>
          </div>
          <div>
            <label htmlFor="categoryId" className="label">
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              required
              defaultValue={edit ? (typeof edit.categoryId === 'object' ? edit.categoryId._id : edit.categoryId) : ''}
              className="input"
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="note" className="label">
              Note (Optional)
            </label>
            <textarea
              id="note"
              name="note"
              rows={3}
              defaultValue={edit?.note}
              placeholder="Add a description or note..."
              className="input resize-none"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {edit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
