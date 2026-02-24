import { Response, NextFunction } from 'express';
import * as expensesService from './expenses.service';
import { AuthRequest } from '../../middleware/auth';

export async function list(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) return;
    const result = await expensesService.listExpenses(req.user._id.toString(), req.query as never);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function create(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) return;
    const expense = await expensesService.createExpense(req.user._id.toString(), req.body);
    res.status(201).json(expense);
  } catch (err) {
    next(err);
  }
}

export async function update(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) return;
    const expense = await expensesService.updateExpense(
      req.user._id.toString(),
      req.params.id,
      req.body
    );
    res.status(200).json(expense);
  } catch (err) {
    next(err);
  }
}

export async function remove(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) return;
    await expensesService.deleteExpense(req.user._id.toString(), req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
