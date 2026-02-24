import type { Expense } from '../../api/expenses';

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export function ExpenseTable({ expenses, onEdit, onDelete }: ExpenseTableProps) {
  if (expenses.length === 0) {
    return (
      <p className="text-gray-500 py-4 text-center">No expenses match the filters.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Category
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Amount
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Note
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {expenses.map((e) => (
            <tr key={e._id}>
              <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                {new Date(e.date).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {typeof e.categoryId === 'object' ? e.categoryId.name : e.categoryId}
              </td>
              <td className="px-4 py-3 text-sm text-right font-medium whitespace-nowrap">
                ₹{e.amount.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px] truncate">
                {e.note || '—'}
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => onEdit(e)}
                  className="text-blue-600 hover:text-blue-800 text-sm mr-2"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(e._id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
