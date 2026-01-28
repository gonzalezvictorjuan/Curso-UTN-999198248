import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description?: string; // ? Campo opcional
  price: number;
  stock: number;
  categoryId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: false, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  { timestamps: true },
);

productSchema.index({ name: 1 });
productSchema.index({ categoryId: 1 });

export const Product = mongoose.model<IProduct>('Product', productSchema);
