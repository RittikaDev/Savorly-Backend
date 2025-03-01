import { model, Schema, Document } from 'mongoose';

export interface IMealPreference extends Document {
  userId: Schema.Types.ObjectId;
  dietaryRestrictions: string[];
  preferredCuisines: string[];
  portionSize: string;
  createdAt: Date;
  updatedAt: Date;
}
