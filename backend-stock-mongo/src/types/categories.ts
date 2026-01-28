// DTO: Data Transfer Objects

export interface CreateCategoryDTO {
  name: string;
  description?: string;
}

export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {}

export interface CategoryResponseDTO {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
