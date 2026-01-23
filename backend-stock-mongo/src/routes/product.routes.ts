import { Router } from 'express';

import * as productController from '../controllers/product.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post(
  '/',
  authenticate,
  authorize(['admin']),
  productController.createProduct,
);
router.put(
  '/:id',
  authenticate,
  authorize(['admin']),
  productController.updateProduct,
);
router.delete(
  '/:id',
  authenticate,
  authorize(['admin']),
  productController.deleteProduct,
);

export default router;
