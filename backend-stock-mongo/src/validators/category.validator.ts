import { body } from 'express-validator';
import { ValidationChain } from 'express-validator';

const description: ValidationChain[] = [
  body('description')
    .optional()
    .isString()
    .withMessage('La descripción debe ser una cadena de texto')
    .isLength({ max: 200 })
    .withMessage('La descripción no puede exceder los 200 caracteres'),
];

const name: ValidationChain[] = [
  body('name')
    .notEmpty()
    .withMessage('El nombre de la categoría es obligatorio')
    .isString()
    .withMessage('El nombre de la categoría debe ser una cadena de texto')
    .isLength({ max: 50, min: 3 })
    .withMessage(
      'El nombre de la categoría debe tener entre 3 y 50 caracteres',
    ),
];

export const createCategoryValidator: ValidationChain[] = [
  ...name,
  ...description,
];

export const updateCategoryValidator: ValidationChain[] = [
  ...name,
  ...description,
];
