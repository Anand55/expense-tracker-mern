import { Response, NextFunction } from 'express';
import * as categoriesService from './categories.service';
import { AuthRequest } from '../../middleware/auth';

export async function list(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) return;
    const categories = await categoriesService.listCategories(req.user._id.toString());
    res.status(200).json(categories);
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
    const category = await categoriesService.createCategory(req.user._id.toString(), req.body);
    res.status(201).json(category);
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
    const category = await categoriesService.updateCategory(
      req.user._id.toString(),
      req.params.id,
      req.body
    );
    res.status(200).json(category);
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
    await categoriesService.deleteCategory(req.user._id.toString(), req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
