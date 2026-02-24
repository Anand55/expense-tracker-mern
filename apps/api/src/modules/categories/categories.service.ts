import mongoose from 'mongoose';
import { Category, CategoryDoc } from './categories.model';
import { badRequest, conflict, notFound } from '../../utils/httpError';
import { CreateCategoryInput, UpdateCategoryInput } from './categories.schema';
import { Expense } from '../expenses/expenses.model';

const DEFAULT_CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills'];

export async function createDefaultCategories(userId: string): Promise<void> {
  const existing = await Category.find({ userId: new mongoose.Types.ObjectId(userId) });
  const existingNames = new Set(existing.map((c) => c.name.toLowerCase()));

  for (const name of DEFAULT_CATEGORIES) {
    if (!existingNames.has(name.toLowerCase())) {
      await Category.create({ userId, name });
      existingNames.add(name.toLowerCase());
    }
  }
}

export async function listCategories(userId: string): Promise<CategoryDoc[]> {
  return Category.find({ userId }).sort({ createdAt: 1 });
}

export async function createCategory(
  userId: string,
  input: CreateCategoryInput
): Promise<CategoryDoc> {
  const normalized = input.name.trim();
  const existing = await Category.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    name: { $regex: new RegExp(`^${normalized}$`, 'i') },
  });
  if (existing) {
    throw badRequest('Category with this name already exists');
  }
  return Category.create({ userId, name: normalized });
}

export async function updateCategory(
  userId: string,
  categoryId: string,
  input: UpdateCategoryInput
): Promise<CategoryDoc> {
  const category = await Category.findOne({
    _id: categoryId,
    userId: new mongoose.Types.ObjectId(userId),
  });
  if (!category) throw notFound('Category not found');

  const normalized = input.name.trim();
  const duplicate = await Category.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    name: { $regex: new RegExp(`^${normalized}$`, 'i') },
    _id: { $ne: categoryId },
  });
  if (duplicate) throw badRequest('Category with this name already exists');

  category.name = normalized;
  await category.save();
  return category;
}

export async function deleteCategory(userId: string, categoryId: string): Promise<void> {
  const category = await Category.findOne({
    _id: categoryId,
    userId: new mongoose.Types.ObjectId(userId),
  });
  if (!category) throw notFound('Category not found');

  const expenseCount = await Expense.countDocuments({
    categoryId: new mongoose.Types.ObjectId(categoryId),
  });
  if (expenseCount > 0) {
    throw conflict(
      `Cannot delete category: it is used by ${expenseCount} expense(s). Remove or reassign them first.`
    );
  }

  await Category.deleteOne({ _id: categoryId });
}

export async function getCategoryById(
  userId: string,
  categoryId: string
): Promise<CategoryDoc | null> {
  return Category.findOne({
    _id: categoryId,
    userId: new mongoose.Types.ObjectId(userId),
  });
}
