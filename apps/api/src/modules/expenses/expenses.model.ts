import mongoose, { Document, Schema } from 'mongoose';

export interface IExpense {
  userId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  amount: number;
  date: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ExpenseDoc = IExpense & Document;

const expenseSchema = new Schema<IExpense>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    note: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

expenseSchema.index({ userId: 1, date: -1 });

export const Expense = mongoose.model<IExpense>('Expense', expenseSchema) as unknown as mongoose.Model<ExpenseDoc>;
