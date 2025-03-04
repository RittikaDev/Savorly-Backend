import { z } from 'zod';

// Validation Schema for Creating a Meal
const CreateMealValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Meal name is too short')
      .max(100, 'Meal name is too long'),
    description: z
      .string()
      .min(2, 'Description should be at least 2 characters long'),
    ingredients: z
      .array(z.string().min(2, 'Ingredient name too short'))
      .nonempty('At least one ingredient required'),
    portionSize: z
      .string()
      .min(2, 'Portion size should be at least 2 characters long'),
    price: z.number().positive('Price must be greater than 0'),
    dietaryPreferences: z.array(z.string().min(2)).optional(), // Optional dietary preferences like vegan, gluten-free, etc.
    cuisineType: z
      .string()
      .min(2, 'Cuisine type should be at least 2 characters long'),
    providerId: z
      .string()
      .min(24, 'Invalid provider ID')
      .max(24, 'Invalid provider ID')
      .optional(), // Should be a valid MongoDB ObjectId
    availability: z.boolean().optional(), // Availability defaults to true in the model
    rating: z.number().min(0).max(5).optional(), // Rating between 0 and 5
  }),
});

// Validation Schema for Updating a Meal
const UpdateMealValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().min(2).optional(),
    ingredients: z.array(z.string().min(2)).optional(),
    portionSize: z.string().min(2).optional(),
    price: z.number().positive().optional(),
    dietaryPreferences: z.array(z.string().min(2)).optional(),
    cuisineType: z.string().min(2).optional(),
    providerId: z.string().min(24).max(24).optional(),
    availability: z.boolean().optional(),
    rating: z.number().min(0).max(5).optional(),
  }),
});

// Export Validation Object
export const MealValidationSchema = {
  CreateMealValidationSchema,
  UpdateMealValidationSchema,
};
