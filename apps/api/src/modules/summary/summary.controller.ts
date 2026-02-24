import { Response, NextFunction } from 'express';
import * as summaryService from './summary.service';
import { AuthRequest } from '../../middleware/auth';

export async function get(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) return;
    const month = req.query.month as string;
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      res.status(400).json({
        error: { message: 'Query month (YYYY-MM) is required', code: 'VALIDATION' },
      });
      return;
    }
    const summary = await summaryService.getSummary(req.user._id.toString(), month);
    res.status(200).json(summary);
  } catch (err) {
    next(err);
  }
}
