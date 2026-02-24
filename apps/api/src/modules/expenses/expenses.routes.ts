import { Router } from 'express';
import * as expensesController from './expenses.controller';
import { authMiddleware } from '../../middleware/auth';
import { validateBody, validateQuery } from '../../middleware/validate';
import {
  listExpensesQuerySchema,
  createExpenseSchema,
  updateExpenseSchema,
} from './expenses.schema';

const router = Router();

router.use(authMiddleware);

router.get('/', validateQuery(listExpensesQuerySchema), expensesController.list);
router.post('/', validateBody(createExpenseSchema), expensesController.create);
router.put('/:id', validateBody(updateExpenseSchema), expensesController.update);
router.delete('/:id', expensesController.remove);

export default router;
