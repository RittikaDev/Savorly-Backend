import { model, Schema } from 'mongoose';
import { IMealProvider } from './meal_provider.interface';

const MealProviderSchema = new Schema<IMealProvider>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    restaurantName: {
      type: String,
      required: true,
    },
    cuisineSpecialties: {
      type: [String],
      required: true,
    },
    pricing: {
      type: Number,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    menu: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Meal',
      },
    ],
    availability: {
      type: Boolean,
      default: true,
    },
    ratings: {
      type: [Number],
      default: [],
    },
    reviews: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        comment: String,
        rating: Number,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const MealProvider = model<IMealProvider>('MealProvider', MealProviderSchema);
export default MealProvider;
