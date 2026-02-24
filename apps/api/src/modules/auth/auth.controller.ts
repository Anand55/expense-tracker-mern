import { Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { AuthRequest } from '../../middleware/auth';
import { notFound } from '../../utils/httpError';

export async function register(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { user, token } = await authService.register(req.body);
    res.status(201).json({
      user: { id: user._id, email: user.email },
      token,
    });
  } catch (err) {
    next(err);
  }
}

export async function login(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { user, token } = await authService.login(req.body);
    res.status(200).json({
      user: { id: user._id, email: user.email },
      token,
    });
  } catch (err) {
    next(err);
  }
}

export async function me(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      next(notFound('User not found'));
      return;
    }
    res.status(200).json({
      user: { id: req.user._id, email: req.user.email },
    });
  } catch (err) {
    next(err);
  }
}
