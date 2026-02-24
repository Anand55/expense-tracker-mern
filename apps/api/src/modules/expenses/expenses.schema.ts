import { z } from 'zod';

const monthRegex = /^\d{4}-\d{2}$/;

export const listExpensesQuerySchema = z.object({
  month: z.string().regex(monthRegex).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  categoryId: z.string().optional(),
});

const dateSchema = z.union([
  z.string().regex(/^\d{4}-\d{2}-\d{2}/).transform((s) => new Date(s)),
  z.date(),
]);

export const createExpenseSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  date: dateSchema,
  categoryId: z.string().min(1, 'Category is required'),
  note: z.string().max(500).optional().default(''),
});

export const updateExpenseSchema = z.object({
  amount: z.number().positive('Amount must be positive').optional(),
  date: dateSchema.optional(),
  categoryId: z.string().min(1).optional(),
  note: z.string().max(500).optional(),
});

export type ListExpensesQuery = z.infer<typeof listExpensesQuerySchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
