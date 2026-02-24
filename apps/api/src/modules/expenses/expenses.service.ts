import mongoose from 'mongoose';
import { Expense, ExpenseDoc } from './expenses.model';
import { notFound } from '../../utils/httpError';
import {
  ListExpensesQuery,
  CreateExpenseInput,
  UpdateExpenseInput,
} from './expenses.schema';
import { Category } from '../categories/categories.model';

export interface ExpenseListItem {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  categoryId: { _id: mongoose.Types.ObjectId; name: string } | mongoose.Types.ObjectId;
  amount: number;
  date: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListExpensesResult {
  expenses: ExpenseListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function listExpenses(
  userId: string,
  query: ListExpensesQuery
): Promise<ListExpensesResult> {
  const filter: Record<string, unknown> = { userId: new mongoose.Types.ObjectId(userId) };

  if (query.month) {
    const [y, m] = query.month.split('-').map(Number);
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0, 23, 59, 59, 999);
    filter.date = { $gte: start, $lte: end };
  }

  if (query.categoryId) {
    filter.categoryId = new mongoose.Types.ObjectId(query.categoryId);
  }

  const [expenses, total] = await Promise.all([
    Expense.find(filter)
      .populate('categoryId', 'name')
      .sort({ date: -1 })
      .skip((query.page - 1) * query.limit)
      .limit(query.limit)
      .lean(),
    Expense.countDocuments(filter),
  ]);

  return {
    expenses: expenses as unknown as ExpenseListItem[],
    total,
    page: query.page,
    limit: query.limit,
    totalPages: Math.ceil(total / query.limit),
  };
}

export async function createExpense(
  userId: string,
  input: CreateExpenseInput
): Promise<ExpenseDoc> {
  const category = await Category.findOne({
    _id: input.categoryId,
    userId: new mongoose.Types.ObjectId(userId),
  });
  if (!category) throw notFound('Category not found');

  return Expense.create({
    userId: new mongoose.Types.ObjectId(userId),
    categoryId: new mongoose.Types.ObjectId(input.categoryId),
    amount: input.amount,
    date: input.date,
    note: input.note ?? '',
  });
}

export async function updateExpense(
  userId: string,
  expenseId: string,
  input: UpdateExpenseInput
): Promise<ExpenseDoc> {
  const expense = await Expense.findOne({
    _id: expenseId,
    userId: new mongoose.Types.ObjectId(userId),
  });
  if (!expense) throw notFound('Expense not found');

  if (input.categoryId) {
    const category = await Category.findOne({
      _id: input.categoryId,
      userId: new mongoose.Types.ObjectId(userId),
    });
    if (!category) throw notFound('Category not found');
    expense.categoryId = new mongoose.Types.ObjectId(input.categoryId);
  }
  if (input.amount !== undefined) expense.amount = input.amount;
  if (input.date !== undefined) expense.date = input.date;
  if (input.note !== undefined) expense.note = input.note;

  await expense.save();
  return expense;
}

export async function deleteExpense(userId: string, expenseId: string): Promise<void> {
  const result = await Expense.deleteOne({
    _id: expenseId,
    userId: new mongoose.Types.ObjectId(userId),
  });
  if (result.deletedCount === 0) throw notFound('Expense not found');
}

export async function getExpenseById(
  userId: string,
  expenseId: string
): Promise<ExpenseDoc | null> {
  return Expense.findOne({
    _id: expenseId,
    userId: new mongoose.Types.ObjectId(userId),
  })
    .populate('categoryId', 'name')
    .exec();
}
