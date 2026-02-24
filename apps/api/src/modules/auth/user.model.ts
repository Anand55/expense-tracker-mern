import mongoose, { Document, Schema } from 'mongoose';

export interface IUser {
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export type UserDoc = IUser & Document;

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export const User = mongoose.model<IUser>('User', userSchema) as unknown as mongoose.Model<UserDoc>;
