import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { badRequest } from '../utils/httpError';

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body) as T;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        next(
          badRequest('Validation failed', {
            issues: err.issues.map((i) => ({
              path: i.path.join('.'),
              message: i.message,
            })),
          })
        );
        return;
      }
      next(err);
    }
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      Object.assign(req, { query: schema.parse(req.query) });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        next(
          badRequest('Validation failed', {
            issues: err.issues.map((i) => ({
              path: i.path.join('.'),
              message: i.message,
            })),
          })
        );
        return;
      }
      next(err);
    }
  };
}
