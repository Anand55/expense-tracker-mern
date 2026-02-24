import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSummary } from '../api/summary';
import { getExpenses } from '../api/expenses';
import { getCurrentMonth, formatMonth, monthOptions } from '../utils/month';
import { Loading } from '../components/common/Loading';
import { ErrorState } from '../components/common/ErrorState';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function Dashboard() {
  const [month, setMonth] = useState(getCurrentMonth());
  const summaryQuery = useQuery({
    queryKey: ['summary', month],
    queryFn: () => getSummary(month).then((r) => r.data),
  });
  const recentQuery = useQuery({
    queryKey: ['expenses', month, 'recent'],
    queryFn: () =>
      getExpenses({ month, page: 1, limit: 5 }).then((r) => r.data),
  });

  if (summaryQuery.isLoading || recentQuery.isLoading) return <Loading />;
  if (summaryQuery.isError)
    return (
      <ErrorState
        message={summaryQuery.error instanceof Error ? summaryQuery.error.message : 'Failed to load summary'}
        onRetry={() => summaryQuery.refetch()}
      />
    );

  const summary = summaryQuery.data!;
  const recent = recentQuery.data?.expenses ?? [];

  const pieData = summary.byCategory.map((c) => ({
    name: c.categoryName,
    value: c.total,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>

      <div className="flex flex-wrap items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Month</label>
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

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-2">Total spend</h2>
          <p className="text-2xl font-bold text-gray-900">
            ₹{summary.totalSpend.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">{summary.count} expenses</p>
        </div>
      </div>

      {pieData.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            By category ({formatMonth(month)})
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-2">By category</h2>
          <p className="text-gray-500">No expenses this month.</p>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <h2 className="text-lg font-medium text-gray-800 p-4 border-b">Recent expenses</h2>
        {recent.length === 0 ? (
          <p className="p-4 text-gray-500">No recent expenses.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recent.map((e) => (
                <tr key={e._id}>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {new Date(e.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {typeof e.categoryId === 'object' ? e.categoryId.name : e.categoryId}
                  </td>
                  <td className="px-4 py-2 text-sm text-right font-medium">
                    ₹{e.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
