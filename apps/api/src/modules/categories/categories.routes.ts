import { Router } from 'express';
import * as categoriesController from './categories.controller';
import { authMiddleware } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import { createCategorySchema, updateCategorySchema } from './categories.schema';

const router = Router();

router.use(authMiddleware);

router.get('/', categoriesController.list);
router.post('/', validateBody(createCategorySchema), categoriesController.create);
router.put('/:id', validateBody(updateCategorySchema), categoriesController.update);
router.delete('/:id', categoriesController.remove);

export default router;
