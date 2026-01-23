// Manage Logic for Categories
import { Category } from '../models/categories.model';
import {
  CategoryResponseDTO,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from '../types/categories';

export const getAllCategory = async (): Promise<CategoryResponseDTO[]> => {
  return await Category.find(); // trae todas las categorías de la base de datos
};

export const getCategoryById = async (
  id: string,
): Promise<CategoryResponseDTO | null> => {
  return await Category.findById(id);
};

export const createCategory = async (
  data: CreateCategoryDTO,
): Promise<CategoryResponseDTO> => {
  const newCategory = new Category(data);
  return await newCategory.save();
};

export const updateCategory = async (
  id: string,
  data: UpdateCategoryDTO,
): Promise<CategoryResponseDTO | null> => {
  const category = Category.findByIdAndUpdate(id, data, {
    new: true, // para que me devuelva el objeto actualizado
  }); // si mongo no encuentra un doc con ese id, devuelve null

  return category;
};

export const removeCategory = async (
  id: string,
): Promise<CategoryResponseDTO | null> => {
  return await Category.findByIdAndDelete(id);
};
