import { z } from 'zod';

const createCarValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Car name is required'),
    description: z.string().min(1, 'Description is required'),
    image: z.string().url('Invalid image URL').min(1, 'Image URL is required'),
    brand: z.string().min(1, 'Brand is required'),
    model: z.string().min(1, 'Model is required'),
    type: z.string().min(1, 'Type is required'),
    category: z.string().min(1, 'Category is required'),
    year: z
      .number()
      .int()
      .min(1900, 'Year must be a valid year')
      .max(new Date().getFullYear(), 'Year cannot be in the future'),
    color: z.string().min(1, 'Color is required'),
    seatCapacity: z.number().int().min(1, 'Seat capacity is required'),
    isElectric: z.boolean().default(false),
    moreImages: z
      .array(
        z.object({
          url: z
            .string()
            .url('Invalid gallery image URL')
            .min(1, 'Gallery image URL is required'),
        }),
      )
      .default([]),
    features: z.array(z.string()).default([]),
    transmission: z.enum(['automatic', 'manual']),
    status: z.enum(['available', 'unavailable']).default('available'),
    stock: z.number().int().min(0, 'Stock is required'),
    isDeleted: z.boolean().default(false),
  }),
});

const updateCarValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Car name is required').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    image: z
      .string()
      .url('Invalid image URL')
      .min(1, 'Image URL is required')
      .optional(),
    brand: z.string().min(1, 'Brand is required').optional(),
    model: z.string().min(1, 'Model is required').optional(),
    type: z.string().min(1, 'Type is required').optional(),
    category: z.string().min(1, 'Category is required').optional(),
    year: z
      .number()
      .int()
      .min(1900, 'Year must be a valid year')
      .max(new Date().getFullYear(), 'Year cannot be in the future')
      .optional(),
    color: z.string().min(1, 'Color is required').optional(),
    seatCapacity: z
      .number()
      .int()
      .min(1, 'Seat capacity is required')
      .optional(),
    isElectric: z.boolean().default(false).optional(),
    moreImages: z
      .array(
        z.object({
          url: z
            .string()
            .url('Invalid gallery image URL')
            .min(1, 'Gallery image URL is required'),
        }),
      )
      .default([])
      .optional(),
    features: z.array(z.string()).default([]).optional(),
    status: z
      .enum(['available', 'unavailable'])
      .default('available')
      .optional(),
    stock: z.number().int().min(0, 'Stock is required').optional(),
    isDeleted: z.boolean().default(false).optional(),
  }),
});

export const CarValidationSchema = {
  createCarValidationSchema,
  updateCarValidationSchema,
};
