import { model, Schema } from 'mongoose';
import { IMeal } from './meal.interface';

// Meal Schema
const MealSchema = new Schema<IMeal>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: { type: [String], required: true },
    portionSize: { type: String, required: true },
    price: { type: Number, required: true },
    dietaryPreferences: { type: [String], default: [] }, // Vegan, gluten-free, etc.
    cuisineType: { type: String, required: true },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: 'MealProvider',
      required: true,
    },
    availability: { type: Boolean, default: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
  },
  { timestamps: true },
);

const MealModel = model<IMeal>('Meal', MealSchema);

export default MealModel;
