import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory {
  userId: mongoose.Types.ObjectId;
  name: string;
  createdAt: Date;
}

export type CategoryDoc = ICategory & Document;

const categorySchema = new Schema<ICategory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

categorySchema.index({ userId: 1 });
categorySchema.index({ userId: 1, name: 1 }, { unique: true });

export const Category = mongoose.model<ICategory>('Category', categorySchema) as unknown as mongoose.Model<CategoryDoc>;
