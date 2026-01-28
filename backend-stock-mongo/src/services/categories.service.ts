// Manage Logic for Categories
import { Category, ICategory } from '../models/categories.model';
import {
  CategoryResponseDTO,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from '../types/categories';

const mapToResponseDTO = (category: ICategory): CategoryResponseDTO => {
  // return {...category.toObject(), id: category._id as string}
  return {
    name: category.name,
    description: category.description,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    id: category._id as string,
  };
};

export const getAllCategory = async (): Promise<CategoryResponseDTO[]> => {
  const categories = await Category.find();
  return categories.map(mapToResponseDTO);
};

export const getCategoryById = async (
  id: string,
): Promise<CategoryResponseDTO | null> => {
  const category = await Category.findById(id);
  return category ? mapToResponseDTO(category) : null;
};

export const createCategory = async (
  data: CreateCategoryDTO,
): Promise<CategoryResponseDTO> => {
  const newCategory = new Category(data);
  const savedCategory = await newCategory.save();
  return mapToResponseDTO(savedCategory);
};

export const updateCategory = async (
  id: string,
  data: UpdateCategoryDTO,
): Promise<CategoryResponseDTO | null> => {
  const category = await Category.findByIdAndUpdate(id, data, {
    new: true,
  });

  return category ? mapToResponseDTO(category) : null;
};

export const removeCategory = async (
  id: string,
): Promise<CategoryResponseDTO | null> => {
  const category = await Category.findByIdAndDelete(id);
  return category ? mapToResponseDTO(category) : null;
};
