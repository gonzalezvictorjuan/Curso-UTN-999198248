import { Request, Response } from 'express';
import * as categoriesService from '../services/categories.service';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../types/categories';
import { validationResult } from 'express-validator';

// getAll()
export const getAll = async (_req: Request, res: Response) => {
  try {
    const categories = await categoriesService.getAllCategory();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener las categorías' });
  }
};

// getById()
export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const category = await categoriesService.getCategoryById(id);
    if (!category) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }
    return res.status(200).json(category);
  } catch (error) {
    return res
      .status(500)
      .json({ mensaje: `Error al obtener la categoría ${id}` });
  }
};

// create()
export const create = async (req: Request, res: Response) => {
  try {
    const categoryData: CreateCategoryDTO = req.body;

    console.log('categoryData', categoryData);

    console.log('Datos recibidos para crear categoría:', categoryData);

    const newCategory = await categoriesService.createCategory(categoryData);
    return res.status(201).json(newCategory);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al crear la categoría' });
  }
};

// update()
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const categoryData: UpdateCategoryDTO = req.body;
    const updatedCategory = await categoriesService.updateCategory(
      id,
      categoryData,
    );

    if (!updatedCategory) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }
    return res.status(200).json(updatedCategory);
  } catch (error: any) {
    // Manejo específico para error de clave duplicada
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ mensaje: 'El nombre de la categoría ya existe' });
    }

    return res
      .status(500)
      .json({ mensaje: 'Error al actualizar la categoría' });
  }
};

// remove ()
export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCategory = await categoriesService.removeCategory(id);
    if (!deletedCategory) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }
    return res
      .status(200)
      .json({ mensaje: `Categoría con ID ${id} eliminada exitosamente` });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al eliminar la categoría' });
  }
};
