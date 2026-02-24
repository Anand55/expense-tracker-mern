import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSummary } from '../api/summary';
import { getExpenses } from '../api/expenses';
import { getCurrentMonth, monthOptions } from '../utils/month';
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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">Track your spending and analyze your expenses</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Period:</label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="input min-w-[180px]"
          >
            {monthOptions().map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="card group hover:border-primary-200 transition-all duration-300">
          <div className="card-body">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Total Spend</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  ₹{summary.totalSpend.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">{summary.count} transactions</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="card group hover:border-success-200 transition-all duration-300">
          <div className="card-body">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Categories</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {summary.byCategory.length}
                </p>
                <p className="text-sm text-gray-500">Active this month</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-success-400 to-success-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="card group hover:border-warning-200 transition-all duration-300">
          <div className="card-body">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Average</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  ₹{summary.count > 0 ? Math.round(summary.totalSpend / summary.count).toLocaleString() : '0'}
                </p>
                <p className="text-sm text-gray-500">Per transaction</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-warning-400 to-warning-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {pieData.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card">
            <div className="card-body">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Spending by Category
              </h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
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
          </div>

          <div className="card">
            <div className="card-body">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Category Breakdown
              </h2>
              <div className="space-y-3">
                {summary.byCategory.map((cat, idx) => {
                  const percentage = (cat.total / summary.totalSpend * 100).toFixed(1);
                  return (
                    <div key={cat.categoryId} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                          />
                          <span className="font-medium text-gray-700">{cat.categoryName}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500">{percentage}%</span>
                          <span className="font-semibold text-gray-900">₹{cat.total.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: COLORS[idx % COLORS.length]
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No expenses yet</h3>
            <p className="text-gray-600">Start adding expenses to see your spending breakdown</p>
          </div>
        </div>
      )}

      <div className="card">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        {recent.length === 0 ? (
          <div className="card-body text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-600">No transactions this month</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recent.map((e) => (
                  <tr key={e._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(e.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                        {typeof e.categoryId === 'object' ? e.categoryId.name : e.categoryId}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                      ₹{e.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
