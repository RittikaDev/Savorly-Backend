import { z } from 'zod';

const CreateMealProviderValidationSchema = z.object({
  body: z.object({
    userId: z.string().min(24).max(24, 'Invalid user ID'), // MongoDB ObjectId should be 24 characters
    restaurantName: z
      .string()
      .min(2, 'Restaurant name is too short')
      .max(100, 'Too long'),
    cuisineSpecialties: z
      .array(z.string().min(2, 'Cuisine name too short'))
      .nonempty('At least one cuisine required'),
    pricing: z.number().positive('Pricing must be greater than 0'),
    experience: z
      .number()
      .int()
      .nonnegative('Experience must be a non-negative integer'),
    menu: z.array(z.string().min(24).max(24)).optional(), // Array of Meal IDs (ObjectId)
    availability: z.boolean().optional(),
  }),
});

const UpdateMealProviderValidationSchema = z.object({
  body: z.object({
    restaurantName: z.string().min(2).max(100).optional(),
    cuisineSpecialties: z.array(z.string().min(2)).optional(),
    pricing: z.number().positive().optional(),
    experience: z.number().int().nonnegative().optional(),
    menu: z.array(z.string().min(24).max(24)).optional(),
    availability: z.boolean().optional(),
  }),
});

// Export Validation Object
export const MealProviderValidationSchema = {
  CreateMealProviderValidationSchema,
  UpdateMealProviderValidationSchema,
};
