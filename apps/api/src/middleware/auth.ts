import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { unauthorized } from '../utils/httpError';
import { User, UserDoc } from '../modules/auth/user.model';

export interface AuthRequest extends Request {
  user?: UserDoc;
}

export async function authMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(unauthorized('Missing or invalid token'));
    return;
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, env.jwtSecret) as { userId: string };
    const user = await User.findById(decoded.userId);
    if (!user) {
      next(unauthorized('User not found'));
      return;
    }
    req.user = user;
    next();
  } catch {
    next(unauthorized('Invalid token'));
  }
}
