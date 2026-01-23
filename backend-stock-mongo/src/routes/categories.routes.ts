import { Router } from 'express';
import * as categoriesController from '../controllers/categories.controller';
import {
  createCategoryValidator,
  updateCategoryValidator,
} from '../validators/category.validator';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router: Router = Router();

router.get('/', categoriesController.getAll);
router.get('/:id', categoriesController.getById);
router.post(
  '/',
  authenticate,
  authorize(['admin']),
  createCategoryValidator,
  categoriesController.create,
);
router.put(
  '/:id',
  authenticate,
  authorize(['admin']),
  updateCategoryValidator,
  categoriesController.update,
);
router.delete(
  '/:id',
  authenticate,
  authorize(['admin']),
  categoriesController.remove,
);

export default router;
