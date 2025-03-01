import { model, Schema } from 'mongoose';
import { IMealPreference } from './meal_preference.interface';

const MealPreferenceSchema = new Schema<IMealPreference>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dietaryRestrictions: {
      type: [String],
      default: [],
    },
    preferredCuisines: {
      type: [String],
      default: [],
    },
    portionSize: {
      type: String,
      default: 'Medium',
    },
  },
  { timestamps: true },
);

export const MealPreference = model<IMealPreference>(
  'MealPreference',
  MealPreferenceSchema,
);
