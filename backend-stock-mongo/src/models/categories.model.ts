import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description?: string; // ? Campo opcional
  createdAt: Date;
  updatedAt: Date;
}

// Necesito definir el Schema
const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true, // el trim elimina espacios al inicio y al final
    },
    description: { type: String, trim: true },
  },
  { timestamps: true },
);

// Definir el modelo
export const Category = mongoose.model<ICategory>('Category', categorySchema);
