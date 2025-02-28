import { z } from 'zod';

const CreateOrderValidationSchema = z.object({
  body: z.object({
    email: z.string().email(),
    car: z.string(),
    quantity: z.number().int().positive(),
    totalPrice: z.number().positive(),
  }),
});

const updateOrderValidationSchema = z.object({
  body: z.object({
    email: z.string().email().optional(), // Optional email
    car: z.string().optional(), // Optional car field
    quantity: z.number().int().positive().optional(), // Optional positive quantity
    totalPrice: z.number().positive().optional(), // Optional positive total price
  }),
});

export const OrderValidationSchema = {
  CreateOrderValidationSchema,
  updateOrderValidationSchema,
};
